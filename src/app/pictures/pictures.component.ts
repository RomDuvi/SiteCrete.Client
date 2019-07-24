import { Component, OnInit, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import * as $ from 'jquery';
import { Picture } from '../../models/picture.model';
import { CategoryService } from '../../services/category.service';
import { PictureService } from 'src/services/picture.service';
import { Category } from 'src/models/category.model';
import { AuthService } from '../../services/guard/auth.service';
import { ConfirmationDialogService } from '../utils/confirmation/ConfirmationDialog.service';
import { Observable } from 'rxjs';

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
  pictures: Observable<Picture[]>;
  currentPicture: Picture;
  currentIndex: number;

  dropdownCategories: Category[];
  dropdownSettings: any;

  thumbs: string[] = [];
  isPreview: boolean;

  cols = [
    { field: 'order', header: 'Order' },
    { field: 'displayName', header: 'Display Name' },
    { field: 'description', header: 'Description' }
  ];

  constructor(
    private route: ActivatedRoute,
    protected pictureService: PictureService,
    private categoryService: CategoryService,
    private modalService: BsModalService,
    private authService: AuthService,
    private cd: ChangeDetectorRef,
    private confirmationService: ConfirmationDialogService,
    private router: Router
  ) {
    this.pictures = this.pictureService._picturesCast;
    this.pictures.subscribe(
      pictures => {
        this.updateGallery(pictures);
        if (this.editModalRef) {
          this.editModalRef.hide();
        }
      },
      err => console.log(err)
    );

    this.pictureService._pictureCast.subscribe(
      picture => {
        if (picture != null) {
          this.currentPicture = picture;
          this.pictureService.getPictureFile(picture.id);
        }
      }
    );

    document.addEventListener('keyup', (event) => {
      if (!this.isPreview) {
        return;
      }

      if (event.keyCode === 37) {
        this.previousPreview();
        return;
      }

      if (event.keyCode === 39) {
        this.nextPreview();
        return;
      }

    });
  }

  ngOnInit() {
    $('.active').removeClass('active');
    $('#pictures-nav').addClass('active');

    this.currentCategory = '';
    this.isAdmin = this.authService.isAdminLogged();
    const cat = this.route.snapshot.params.id;
    this.currentCategory = cat;

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

    this.pictureService.getPicturesByCategory(this.currentCategory);
  }

  updateGallery(pictures: Picture[]) {
    pictures.forEach(picture => {
      this.pictureService.getThumbFile(picture.id);
    });
  }

  switchCategory(id: string) {
    this.router.navigate([`/pictures/${id}`], { replaceUrl: true }).then(
      () => this.ngOnInit()
    );
  }

  addPictureModal(modal: TemplateRef<any>) {
    this.pictureModel = new Picture();
    this.pictureModel.categoryId = this.currentCategory;
    this.editModalRef = this.modalService.show(modal);
  }

  addPicture() {
    if (!this.pictureModel.id) {
      this.pictureService.addPicture(this.pictureModel, progress => {
        this.loading = progress;
      }, () => this.ngOnInit());
    } else {
      this.pictureService.updatePicture(this.pictureModel, () => this.ngOnInit());
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

  deletePicture(picture: Picture) {
    this.confirmationService.confirm('Are you sure?').subscribe(
      result => {
        if (result) {
          this.pictureService.deletePicture(picture, () => this.ngOnInit());
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

  //#endregion PICTURE MANAGEMENT


  //#region PREVIEW
  displayPreview(picture: Picture, i: number) {
    this.currentIndex = i + 1 ;
    this.isPreview = true;
    this.pictureService.getCurrentPicture(picture.id);
  }

  nextPreview() {
    this.currentIndex++;
    this.pictureService.getNextPicture();
  }

  previousPreview() {
    this.currentIndex--;
    this.pictureService.getPreviousPicture();
  }

  isLastPreview() {
    return this.pictureService.isLastPicture();
  }

  isFirstPreview() {
    return this.pictureService.isFirstPicture();
  }

  getIndexLegend() {
    return `${this.currentIndex} / ${this.pictureService.getNumberOfPictures()}`;
  }
  //#endregion PREVIEW
  
}
