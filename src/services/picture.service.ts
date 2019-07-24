import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpRequest, HttpEvent, HttpEventType } from '@angular/common/http';
import { ConfigService } from './config/config.service';
import { map, tap, last } from 'rxjs/operators';
import { Picture } from 'src/models/picture.model';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class PictureService extends ConfigService {
    apiUrl: string;

    private _pictures = new BehaviorSubject<Picture[]>([]);
    _picturesCast = this._pictures.asObservable();

    private _currentPicture = new BehaviorSubject<Picture>(null);
    _pictureCast = this._currentPicture.asObservable();

    private dataStore: {
        pictures: Picture[],
        picturesByCategory: Picture[]
    };

    constructor(
        protected http: HttpClient,
        private sanitizer: DomSanitizer,
        private toast: ToastrService
    ) {
        super();
        this.apiUrl = this.config.baseUrl + this.config.pictureUrl;
        this.dataStore = { pictures: [], picturesByCategory: [] };
    }

    private assign() {
      this._pictures.next(Object.assign({}, this.dataStore).pictures);
    }

    addPicture(picture: Picture, progressCallback: any, endCallBack: any) {
      const formData = new FormData();
      formData.append('file', picture.file);
      delete picture.file;
      formData.append('picture', JSON.stringify(picture));

      const req = new HttpRequest('POST', this.apiUrl, formData, { reportProgress: true});
      this.http.request(req).pipe(
          map(event => this.getEventMessage(event, picture)),
          tap(message => progressCallback(message)),
          last(progressCallback('Picture saved')),
        ).subscribe(
          (data: Picture) => {
            this.dataStore.pictures.push(data);
          },
          err => console.log(err),
          () => {
            this.assign();
            this.toast.success('Picture saved!');
            endCallBack();
          }
        );
    }

    getPictures() {
      this.http.get<Picture[]>(this.apiUrl, this.httpOptions).subscribe(
        pictures => this.dataStore.pictures = pictures,
        err => console.log(err),
        () => this.assign()
      );
    }

    getPictureFile(pictureId: string) {
      const picture = this.dataStore.pictures.find(x => x.id === pictureId);
      if (!picture) {
        return;
      }

      if (picture.pictureSrc != null) {
        return;
      }

      this.http.get<any>(this.apiUrl + '/file/' + pictureId, this.httpOptions).subscribe(
        data => {
          const src = this.sanitizer.bypassSecurityTrustResourceUrl(`data:${picture.type};base64,${data}`);
          picture.loaded = true;
          picture.pictureSrc = src;
        }
      );
    }

    getThumbFile(pictureId: string) {
      const picture = this.dataStore.pictures.find(x => x.id === pictureId);
      if (picture.thumbSrc != null) {
        return;
      }

      this.http.get<any>(this.apiUrl + '/thumb/' + pictureId, this.httpOptions).subscribe(
        data => {
          const src = this.sanitizer.bypassSecurityTrustResourceUrl(`data:${picture.type};base64,${data}`);
          picture.thumbSrc = src;
        }
      );
    }

    getPicturesByCategory(categoryId: string) {
      this.http.get<Picture[]>(this.apiUrl + '/category/' + categoryId, this.httpOptions).subscribe(
        pictures => this.dataStore.pictures = pictures.sort((a, b) => a.order - b.order),
        err => console.log(err),
        () => this.assign()
      );
    }

    deletePicture(picture: Picture, endCallback: any) {
      this.http.post<Picture>(this.apiUrl + '/delete', picture, this.httpOptions).subscribe(
        () => {
          const index = this.dataStore.pictures.indexOf(picture);
          this.dataStore.pictures.splice(index, 1);
        },
        err => console.log(err),
        () => {
          this.assign();
          this.toast.success('Picture Deleted!');
          endCallback();
        }
      );
    }

    updatePicture(picture: Picture, endCallback: any) {
      let pictureToUpdate = this.dataStore.pictures.find(x => x.id === picture.id);

      this.http.put<Picture>(this.apiUrl, picture, this.httpOptions).subscribe(
        (p: Picture) => pictureToUpdate = p,
        err => console.log(err),
        () => {
          this.toast.success('Picture updated!');
          this.assign();
          endCallback();
        }
      );
    }

    getPicturesForDiscover(discoverId: string) {
      this.http.get<Picture[]>(this.apiUrl + '/discover/' + discoverId, this.httpOptions).subscribe(
        pictures => this.dataStore.pictures = pictures,
        err => console.log(err),
        () => this.assign()
      );
    }

    getCurrentPicture(pictureId: string) {
      const picture = this.dataStore.pictures.find(x => x.id === pictureId);
      this._currentPicture.next(picture);
    }

    getNextPicture() {
      const index = this.dataStore.pictures.indexOf(this._currentPicture.getValue()) + 1;
      if (index >= this.dataStore.pictures.length) {
        return;
      }
      this._currentPicture.next(this.dataStore.pictures[index]);
    }

    getPreviousPicture() {
      const index = this.dataStore.pictures.indexOf(this._currentPicture.getValue()) - 1;
      if (index < 0) {
        return;
      }
      this._currentPicture.next(this.dataStore.pictures[index]);
    }

    isLastPicture() {
      return this._currentPicture.getValue().id === this.dataStore.pictures[this.dataStore.pictures.length - 1].id;
    }

    isFirstPicture() {
      return this._currentPicture.getValue().id === this.dataStore.pictures[0].id;
    }

    getNumberOfPictures() {
      return this.dataStore.pictures.length;
    }

    private getEventMessage(event: HttpEvent<any>, picture: Picture): any {
        switch (event.type) {
          case HttpEventType.Sent:
            return 0;

          case HttpEventType.UploadProgress:
            // Compute and show the % done:
            const percentDone = Math.round(100 * event.loaded / event.total);
            return percentDone;

          case HttpEventType.Response:
            return event.body;

          default:
            return 0;
        }
      }
}
