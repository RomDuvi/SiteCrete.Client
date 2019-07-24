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
import { INgxGalleryImage, NgxGalleryOrder } from 'ngx-gallery';

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
  currentGallery: INgxGalleryImage[];

  galleryOptions = [
    {
        width: '100%',
        height: '120px',
        thumbnailsColumns: 6,
        thumbnailsRows:  1,
        thumbnailsPercent: 100,
        image: false,
        lazyLoading: true,
        thumbnailsOrder: NgxGalleryOrder.Row,
        previewKeyboardNavigation: true
    }
  ];


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
  }

  ngOnInit() {
    $('.active').removeClass('active');
    $('#discover-nav').addClass('active');
    this.discover1 = new TextModel();
    this.isAdmin = this.authService.isAdminLogged();
    this.afterInit();
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
            this.pictureService.addPicture(picture, progress => console.log(progress)).subscribe(
              data => {},
              err => {
                this.discoverService.deleteDiscover(newDiscover).subscribe();
                this.toast.error('An error occured the place is deleted');
              },
              () => {
                this.discoverModalRef.hide();
                this.toast.success('Place created');
                this.ngOnInit();
              }
            );
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

  selectDiscover(discover: Discover, scroll: boolean = true) {
    this.currentDiscover = discover;
    this.currentDiscover.safeUrl = this.getSafeUrl(this.currentDiscover, 'umapUrl');
    this.cd.markForCheck();
    this.initGallery();
    if (scroll) {
      $('#outlet').animate({ scrollTop: $('#outlet').scrollTop() + document.body.scrollHeight }, 600);
    }
  }

  initGallery() {
    this.currentGallery = [];
    this.pictureService.getPicturesForDiscover(this.currentDiscover.id).subscribe(
      data => {
        this.galleryLoading = true;
        data.forEach((picture, i) => {
          let img: INgxGalleryImage = {};
          img.description = picture.displayName + '<br/>' + (i + 1) + '/' + data.length;
          img.label = picture.displayName;
          this.currentGallery.push(img);

          this.pictureService.getThumbFile(picture.id).subscribe((bytes:any) => {
            const thumbPath = `data:${picture.type};base64,${bytes}`;
            picture.thumbSrc = thumbPath;
            img.small = thumbPath;
            const newThumbs = this.currentGallery.slice(0, this.currentGallery.length);
            this.currentGallery.push(img);
            this.currentGallery = newThumbs;
            this.pictureService.getPictureFile(picture.id).subscribe((bytes: any) => {
              const path = `data:${picture.type};base64,${bytes}`;
              img.big = path;
              img.medium = path;
              const newImages = this.currentGallery.slice(0, this.currentGallery.length);
              this.currentGallery = newImages;
            },
            err => console.log(err),
            () => this.galleryLoading = false
            );
          });
        });
      }
    );
  }
}
