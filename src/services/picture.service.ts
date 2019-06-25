import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpRequest, HttpEvent, HttpEventType } from '@angular/common/http';
import { ConfigService } from './config/config.service';
import { map, tap, last } from 'rxjs/operators';
import { Picture } from 'src/models/picture.model';

@Injectable()
export class PictureService extends ConfigService {
    apiUrl: string;
    constructor(
        protected http: HttpClient
    ) {
        super();
        this.apiUrl = this.config.baseUrl + this.config.pictureUrl;
    }

    addPicture(picture: Picture, progressCallback: any): Observable<Picture> {
        const formData = new FormData();
        formData.append('file', picture.file);
        delete picture.file;
        formData.append('picture', JSON.stringify(picture));

        const req = new HttpRequest('POST', this.apiUrl, formData, { reportProgress: true});
        return this.http.request(req).pipe(
            map(event => this.getEventMessage(event, picture)),
            tap(message => progressCallback(message)),
            last(progressCallback('Picture saved')),
          );
    }

    getPictures(): Observable<Picture[]> {
        return this.http.get<Picture[]>(this.apiUrl, this.httpOptions);
    }

    getPictureFile(pictureId: string): Observable<any> {
        return this.http.get<any>(this.apiUrl + '/file/' + pictureId, this.httpOptions);
    }

    getThumbFile(pictureId: string): Observable<any> {
      return this.http.get<any>(this.apiUrl + '/thumb/' + pictureId, this.httpOptions);
    }

    getPicturesByCategory(categoryId: string): Observable<Picture[]> {
        return this.http.get<Picture[]>(this.apiUrl + '/category/' + categoryId, this.httpOptions);
    }

    deletePicture(picture: Picture): Observable<Picture> {
        return this.http.post<Picture>(this.apiUrl + '/delete', picture, this.httpOptions);
    }

    updatePicture(picture: Picture): Observable<Picture> {
        return this.http.put<Picture>(this.apiUrl, picture, this.httpOptions);
    }

    getPicturesForDiscover(discoverId: string): Observable<Picture[]> {
      return this.http.get<Picture[]>(this.apiUrl + '/discover/' + discoverId, this.httpOptions);
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
