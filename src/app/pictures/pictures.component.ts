import { Component, OnInit, TemplateRef, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryOrder, INgxGalleryImage } from 'ngx-gallery';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import * as $ from 'jquery';
import { Picture } from '../../models/picture.model';
import { CategoryService } from '../../services/category.service';
import { PictureService } from 'src/services/picture.service';
import { Category } from 'src/models/category.model';
import { ToastrService, Toast } from 'ngx-toastr';
import { AuthService } from '../../services/guard/auth.service';
import { PicturesCategories } from 'src/models/picturesCategories.model';
import { ConfirmationDialogService } from '../utils/confirmation/ConfirmationDialog.service';

@Component({
  selector: 'app-pictures',
  templateUrl: './pictures.component.html',
  styleUrls: ['./pictures.component.css']
})
export class PicturesComponent implements OnInit {
  isAdmin: boolean;

  public editModalRef: BsModalRef;
  public pictureModel: Picture;
  public loading: number;

  currentCategory: string;
  categories: Category[];
  pictures: Picture[];

  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[] = [];

  dropdownCategories: Category[];
  dropdownSettings: any;

  thumbs: string[] = [];

  cols = [
    { field: 'order', header: 'Order' },
    { field: 'displayName', header: 'Display Name' },
    { field: 'description', header: 'Description' }
  ];

  constructor(
    private route: ActivatedRoute,
    protected pictureService: PictureService,
    private categoryService: CategoryService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private authService: AuthService,
    private cd: ChangeDetectorRef,
    private confirmationService: ConfirmationDialogService,
    private router: Router
  ) {

  }

  ngOnInit() {
    $('.active').removeClass('active');
    $('#pictures-nav').addClass('active');

    this.currentCategory = '';
    this.isAdmin = this.authService.isAdminLogged();
    const cat = this.route.snapshot.params.id;
    this.currentCategory = cat;
    this.pictures = [];
    this.galleryImages = [];

    this.categoryService.getCategories().subscribe(data => {
      this.categories = data;
      this.dropdownCategories = data;
      this.dropdownSettings = {
        singleSelection: false,
        idField: 'id',
        textField: 'name',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 5,
        allowSearchFilter: true
      };
    });

    this.pictureService.getPicturesByCategory(cat).subscribe(data => {
      this.pictures = data.sort((a, b) => {
        return a.order - b.order;
      });

      this.galleryOptions = [
        {
            width: '100%',
            height: Math.ceil(this.pictures.length / 6) * 15 + '%',
            thumbnailsColumns: 6,
            thumbnailsRows:  Math.ceil(this.pictures.length / 6),
            thumbnailsPercent: 100,
            image: false,
            lazyLoading: true,
            thumbnailsOrder: NgxGalleryOrder.Row,
            previewKeyboardNavigation: true
        },
        // max-width 800
        {
            breakpoint: 800,
            height: Math.ceil(this.pictures.length / 4) * 15 + '%',
            thumbnailsColumns: 4,
            thumbnailsRows:  Math.ceil(this.pictures.length / 4),
        },
        // max-width 400
        {
            breakpoint: 400,
            height: Math.ceil(this.pictures.length / 2) * 15 + '%',
            thumbnailsColumns: 2,
            thumbnailsPercent: 10,
            thumbnailsRows:  Math.ceil(this.pictures.length / 2),
        }
      ];
      this.pictures.forEach((picture, i) => {
        let img: INgxGalleryImage = {};
        img.description = picture.displayName + '<br/>' + (i + 1) + '/' + this.pictures.length;
        img.label = picture.displayName;
        img.small = '../../assets/spinner.svg';
        img.big = '../../assets/spinner.svg';
        this.galleryImages.push(img);

        this.pictureService.getThumbFile(picture.id).subscribe((bytes:any) => {
          const thumbPath = `data:${picture.type};base64,${bytes}`;
          picture.thumbSrc = thumbPath;
          img.small = thumbPath;
          const newThumbs = this.galleryImages.slice(0, this.galleryImages.length);
          this.galleryImages.push(img);
          this.galleryImages = newThumbs;
          this.pictureService.getPictureFile(picture.id).subscribe((bytes: any) => {
            const path = `data:${picture.type};base64,${bytes}`;
            img.big = path;
            img.medium = path;
            const newImages = this.galleryImages.slice(0, this.galleryImages.length);
            this.galleryImages = newImages;
          });
        });
      });
    });
  }

  onRowReorder(event): void {
    const oldOrder = event.dragIndex;
    const newOrder = event.dropIndex !== 0 ? event.dropIndex - 1 : 0;
    const movedPic = this.pictures.find(p => p.order === oldOrder);
    let updatePics: Picture[];

    if (oldOrder > newOrder) {
      updatePics = this.pictures.filter(p => p.order >= newOrder + 1 && p.order <= oldOrder);
      updatePics.forEach(pic => {
        if (pic.id === movedPic.id) {
          return;
        }
        if (pic.order !== this.pictures.length - 1) {
          pic.order++;
        }
        this.pictureService.updatePicture(pic).subscribe(
          data => console.log(data),
          err => console.log(err),
          () => console.log('picture updated')
        );
      });
      movedPic.order = newOrder + 1;
    } else if (oldOrder < newOrder) {
      updatePics = this.pictures.filter(p => p.order <= newOrder && p.order >= oldOrder);
      updatePics.forEach(pic => {
        if (pic.id === movedPic.id) {
          return;
        }
        if (pic.order !== 0) {
          pic.order--;
        }

        this.pictureService.updatePicture(pic).subscribe(
          data => console.log(data),
          err => console.log(err),
          () => console.log('picture updated')
        );
      });
      movedPic.order = newOrder;
    }
    this.pictureService.updatePicture(movedPic).subscribe(
      data => console.log(data),
      err => console.log(err),
      () => console.log('picture updated')
    );
  }

  addPictureModal(modal: TemplateRef<any>) {
    this.pictureModel = new Picture();
    this.pictureModel.pictureCategories = [];
    this.editModalRef = this.modalService.show(modal);
  }

  addPicture() {
    if (!this.pictureModel.id) {
      this.pictureService.addPicture(this.pictureModel, progress => {
        this.loading = progress;
      }).subscribe(data => {
        this.toastr.success(`Picture ${this.pictureModel.displayName} created!`);
        this.ngOnInit();
      }, err => this.toastr.error(err),
      () => {
        this.editModalRef.hide();
        this.loading = 0;
      });
    } else {
      this.pictureService.updatePicture(this.pictureModel).subscribe(
      data => {
        this.toastr.success(`Picture ${this.pictureModel.displayName} updated!`);
        this.ngOnInit();
      }, err => this.toastr.error(err), () => this.editModalRef.hide());
    }
  }

  onFileChange(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsBinaryString(file);
      reader.onload = () => {
        this.pictureModel.file = <File>file;
        // need to run CD since file load runs outside of zone
        this.cd.markForCheck();
      };
    }
  }

  onCategorySelect(item: Category) {
    const pCat = new PicturesCategories();
    pCat.categoryId = item.id;
    pCat.pictureId = '00000000-0000-0000-0000-000000000000';
    this.pictureModel.pictureCategories.push(pCat);
  }

  onCategoryDeselect(item: Category) {
    const pCat = new PicturesCategories();
    pCat.categoryId = item.id;
    pCat.pictureId = '00000000-0000-0000-0000-000000000000';
    const index = this.pictureModel.pictureCategories.indexOf(pCat);
    this.pictureModel.pictureCategories.splice(index, 1);
  }

  onSelectAll(items: Category[]) {
    items.forEach(cat => {
      this.onCategorySelect(cat);
    });
  }

  onDeSelectAll(items: Category[]) {
    this.pictureModel.pictureCategories = [];
  }

  deletePicture(picture: Picture) {
    this.confirmationService.confirm('Are you sure?').subscribe(
      result => {
        if (result) {
          this.pictureService.deletePicture(picture).subscribe(
            data => {
              console.log(data);
            },
            err => this.toastr.error(err),
            () => this.ngOnInit());
        }
      }
    );
  }

  editPicture(modal: TemplateRef<any>, picture: Picture) {
    this.pictureModel = new Picture();
    Object.assign(this.pictureModel, picture);
    this.pictureModel.file = null;
    this.editModalRef = this.modalService.show(modal);
  }

  getThumb(order: number) {
    return this.pictures.find(p => p.order === order).thumbSrc;
  }

  switchCategory(id: string) {
    this.router.navigate([`/pictures/${id}`], { replaceUrl: true }).then(
      () => this.ngOnInit()
    );
  }
}
