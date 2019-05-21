import { Component, OnInit, TemplateRef, ChangeDetectionStrategy, ChangeDetectorRef  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

@Component({
  selector: 'app-pictures',
  templateUrl: './pictures.component.html',
  styleUrls: ['./pictures.component.css']
})
export class PicturesComponent implements OnInit {
  isAdmin: boolean;

  public editModalRef: BsModalRef;
  public pictureModel: Picture;
  public loading: string;

  categories: Category[];
  pictures: Picture[];

  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[] = [];

  dropdownCategories: Category[];
  dropdownSettings: any;

  constructor(
    private route: ActivatedRoute,
    protected pictureService: PictureService,
    private categoryService: CategoryService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private authService: AuthService,
    private cd: ChangeDetectorRef,
  ) {

  }

  ngOnInit() {
    $('.active').removeClass('active');
    $('#pictures-nav').addClass('active');
    this.isAdmin = this.authService.isAdminLogged();
    const cat = this.route.snapshot.params.id;

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
      this.pictures = data;
      console.log(this.pictures.length);
      this.galleryOptions = [
        {
            width: '100%',
            height: Math.ceil(this.pictures.length / 6) * 15 + '%',
            thumbnailsColumns: 6,
            thumbnailsRows:  Math.ceil(this.pictures.length / 6),
            thumbnailsPercent: 100,
            image: false,
            // lazyLoading: true,
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
      console.log(this.galleryOptions);
      this.pictures.forEach(picture => {
        this.pictureService.getPictureFile(picture.id).subscribe((bytes: any) => {
          const path = `data:${picture.type};base64,${bytes}`;
          let img: INgxGalleryImage = {};
          img.big = path;
          img.description = picture.description;
          img.label = picture.displayName;
          img.medium = path;
          img.small = path;
          this.galleryImages.push(img);
        });
      });
    });
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
      }, err => this.toastr.error(err), () => this.editModalRef.hide());
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
    this.pictureService.deletePicture(picture).subscribe(
      data => {
        console.log(data);
      },
      err => this.toastr.error(err),
      () => this.ngOnInit());
  }

  editPicture(modal: TemplateRef<any>, picture: Picture) {
    this.pictureModel = new Picture();
    Object.assign(this.pictureModel, picture);
    this.pictureModel.file = null;
    this.editModalRef = this.modalService.show(modal);
  }
}
