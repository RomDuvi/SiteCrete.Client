import { Component, OnInit, TemplateRef } from '@angular/core';
import * as $ from 'jquery';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { AuthService } from '../../services/guard/auth.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { TextService } from '../../services/text.service';
import { TextModel } from '../../models/text.model';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.css']
})
export class EquipmentComponent implements OnInit {

  isAdmin: boolean;
  textModel: TextModel;
  modalRef: BsModalRef;

  public equipment1: TextModel;
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
    this.isAdmin = this.authService.isAdminLogged();
    $('.active').removeClass('active');
    $('#equipment-nav').addClass('active');
    this.equipment1 = new TextModel();
    this.afterInit();
  }

  afterInit() {
    this.currentLang = this.translate.currentLang;
    this.textService.getText('equipment1.txt', this.currentLang).subscribe(
      data => {
        this.equipment1.textId = 'equipment1.txt';
        this.equipment1.lang = this.currentLang;
        this.equipment1.text = data;
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

}
