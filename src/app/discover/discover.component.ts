import { Component, OnInit, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TextModel } from '../../models/text.model';
import { TextService } from '../../services/text.service';
import { AuthService } from '../../services/guard/auth.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import * as $ from 'jquery';
import { Discover } from '../../models/discover.model';
import { DiscoverService } from '../../services/discover.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogService } from '../utils/confirmation/ConfirmationDialog.service';
import { PictureService } from '../../services/picture.service';
import { Picture } from 'src/models/picture.model';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.css']
})
export class DiscoverComponent implements OnInit {
  isAdmin: boolean;

  discover1: TextModel;
  textModel: TextModel;
  currentLang: string;

  modalRef: BsModalRef;

  discovers: Discover[];
  currentDiscover: Discover;
  discoverModalRef: BsModalRef;
  discoverModel: Discover;

  galleryLoading: boolean;
  currentGallery: Observable<Picture[]>;
  isPreview: boolean;

  currentPicture: Picture;


  constructor(
    private translate: TranslateService,
    private textService: TextService,
    private modalService: BsModalService,
    protected authService: AuthService,
    private discoverService: DiscoverService,
    private toast: ToastrService,
    private confirmation: ConfirmationDialogService,
    private pictureService: PictureService,
    private cd: ChangeDetectorRef,
    private sanatizer: DomSanitizer
  ) {
    translate.onLangChange.subscribe(event => {
      this.afterInit();
    });

    this.currentGallery = this.pictureService._picturesCast;

    this.pictureService._pictureCast.subscribe(
      picture => {
        if (picture != null) {
          this.currentPicture = picture;
          this.pictureService.getPictureFile(picture.id);
        }
      }
    );
  }

  ngOnInit() {
    $('.active').removeClass('active');
    $('#discover-nav').addClass('active');
    this.discover1 = new TextModel();
    this.isAdmin = this.authService.isAdminLogged();
    this.afterInit();
    this.currentGallery.subscribe(
      pictures => {
        this.initGallery(pictures);
      }
    );
  }

  afterInit() {
    this.currentLang = this.translate.currentLang;
    this.textService.getText('discover1.txt', this.currentLang).subscribe(
      data => {
        this.discover1.textId = 'discover1.txt';
        this.discover1.lang = this.currentLang;
        this.discover1.text = data;
      }
    );

    this.discoverService.getDiscovers().subscribe(
      data => {
        this.discovers = data;
        this.selectDiscover(this.discovers[0], false);
      }
    );
  }

  updateText(text: TextModel, modalRef: TemplateRef<any>) {
    if (!this.isAdmin) {
      return;
    }
    this.textModel = new TextModel();
    Object.assign(this.textModel, text);
    this.modalRef = this.modalService.show(modalRef, {class: 'modal-lg'});
  }

  saveText() {
    this.textService.saveText(this.textModel).subscribe(
      data => {

      },
      err => console.log(err),
      () => {
        this.modalRef.hide();
        this.ngOnInit();
      }
    );
  }

  getDiscoverProperty(discover: Discover, property: string) {
    const lang = this.currentLang.charAt(0).toUpperCase() + this.currentLang.slice(1);
    return discover[property + lang];
  }

  getSafeUrl(discover: Discover, property: string) {
    const url = this.getDiscoverProperty(discover, property);
    return this.sanatizer.bypassSecurityTrustResourceUrl(url);
  }

  discoverModal(modalRef: TemplateRef<any>, discover: Discover = null) {
    this.discoverModel = new Discover();
    if (discover) {
      Object.assign(this.discoverModel, discover);
    }
    console.log(this.discoverModel);

    this.discoverModalRef = this.modalService.show(modalRef, {class: 'modal-lg'});
  }

  saveDiscover() {
    if (this.discoverModel.id) {
      this.discoverService.updateDiscover(this.discoverModel).subscribe(
        data => {},
        err => console.log(err),
        () => {
          this.discoverModalRef.hide();
          this.toast.success('Place updated!');
          Object.assign(this.currentDiscover, this.discoverModel);
        }
      );
    } else {
      this.discoverService.addDiscover(this.discoverModel).subscribe(
        newDiscover => {
          this.discoverModel.pictures.forEach(picture => {
            picture.discoverId = newDiscover.id;
            picture.order = -1;
            this.pictureService.addPicture(picture, progress => console.log(progress), () => this.ngOnInit());
          });
        },
        err => {
          this.toast.error('An error occured the place is deleted');
        }
      );
    }
  }

  deleteDiscover(discover: Discover) {
    this.confirmation.confirm('Are you sure').subscribe(
      result => {
        if (result) {
          this.discoverService.deleteDiscover(discover).subscribe(
            data => {},
            err => console.log(err),
            () => {
              this.toast.success('Place deleted!');
              this.ngOnInit();
            }
          );
        }
      }
    );
  }

  getPictureName(path: string) {
    const last = path.substr(path.lastIndexOf('\\'));
    return last.substr(last.indexOf('_') + 1);
  }

  onGalleryUpload(event) {
    this.discoverModel.pictures = [];
    for (const file of event.files) {
      const reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = () => {
        this.galleryLoading = true;
        const picture: Picture = new Picture();
        picture.displayName = 'Discover';
        picture.file = <File>file;
        this.discoverModel.pictures.push(picture);
        // need to run CD since file load runs outside of zone
        this.cd.markForCheck();
        this.galleryLoading = false;
        console.log(this.discoverModel);
      };
    }
  }

  removePictureFromDiscover(name: string) {
    const p = this.discoverModel.pictures.find(x => x.file.name === name);
    const idx = this.discoverModel.pictures.indexOf(p);
    this.discoverModel.pictures.splice(idx, 1);
  }

  deletePictureFromDiscover(picture: Picture) {
    this.pictureService.deletePicture(picture, () => this.selectDiscover(this.currentDiscover, false));
  }

  selectDiscover(discover: Discover, scroll: boolean = true) {
    this.currentDiscover = discover;
    this.currentDiscover.safeUrl = this.getSafeUrl(this.currentDiscover, 'umapUrl');
    this.cd.markForCheck();
    this.pictureService.getPicturesForDiscover(this.currentDiscover.id);
    if (scroll) {
      $('#outlet').animate({ scrollTop: $('#outlet').scrollTop() + document.body.scrollHeight }, 600);
    }
  }

  initGallery(pictures: Picture[]) {
    pictures.forEach(picture => {
      this.pictureService.getThumbFile(picture.id);
    });
  }

  //#region PREVIEW
  displayPreview(picture: Picture) {
    this.isPreview = true;
    this.pictureService.getCurrentPicture(picture.id);
  }

  nextPreview() {
    this.pictureService.getNextPicture();
  }

  previousPreview() {
    this.pictureService.getPreviousPicture();
  }

  isLastPreview() {
    return this.pictureService.isLastPicture();
  }

  isFirstPreview() {
    return this.pictureService.isFirstPicture();
  }
  //#endregion PREVIEW

}
