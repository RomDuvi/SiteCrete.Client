import { Component, OnInit, TemplateRef } from '@angular/core';
import * as $ from 'jquery';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { AuthService } from '../../services/guard/auth.service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { TextService } from '../../services/text.service';
import { TextModel } from '../../models/text.model';

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.css']
})
export class DescriptionComponent implements OnInit {

  isAdmin: boolean;
  textModel: TextModel;
  modalRef: BsModalRef;

  public previewUrl: string;
  public isPreview: boolean;
  public description1: TextModel;
  public description2: TextModel;
  public description3: TextModel;

  public currentLang: string;

  constructor(
    private translate: TranslateService,
    protected authService: AuthService,
    private modalService: BsModalService,
    private textService: TextService
  ) {
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.afterInit();
    });
  }

  ngOnInit() {
    $('.active').removeClass('active');
    $('#description-nav').addClass('active');
    this.isAdmin = this.authService.isAdminLogged();
    this.description1 = new TextModel();
    this.description2 = new TextModel();
    this.description3 = new TextModel();
    this.afterInit();
  }

  afterInit() {
    this.currentLang = this.translate.currentLang;
    this.textService.getText('description1.txt', this.currentLang).subscribe(
      data => {
        this.description1.textId = 'description1.txt';
        this.description1.lang = this.currentLang;
        this.description1.text = data;
      }
    );

    this.textService.getText('description2.txt', this.currentLang).subscribe(
      data => {
        this.description2.textId = 'description2.txt';
        this.description2.lang = this.currentLang;
        this.description2.text = data;
      }
    );

    this.textService.getText('description3.txt', this.currentLang).subscribe(
      data => {
        this.description3.textId = 'description3.txt';
        this.description3.lang = this.currentLang;
        this.description3.text = data;
      }
    );
  }

  preview(url: string) {
    this.previewUrl = url;
    this.isPreview = true;
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
}
