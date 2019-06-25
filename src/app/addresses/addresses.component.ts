import { Component, OnInit, TemplateRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TextModel } from '../../models/text.model';
import { AuthService } from '../../services/guard/auth.service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { TextService } from '../../services/text.service';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.css']
})
export class AddressesComponent implements OnInit {

  isAdmin: boolean;
  currentLang: string;
  textModel: TextModel;
  modalRef: BsModalRef;
  addresses1: TextModel;

  constructor(
    private translate: TranslateService,
    protected authService: AuthService,
    private modalService: BsModalService,
    private textService: TextService
  ) {
    this.isAdmin = this.authService.isAdminLogged();
    translate.onLangChange.subscribe(event => {
      this.afterInit();
    });
  }

  ngOnInit() {
    $('.active').removeClass('active');
    $('#addresses-nav').addClass('active');
    this.afterInit();
    this.addresses1 = new TextModel();
  }

  afterInit() {
    this.currentLang = this.translate.currentLang;
    this.textService.getText('addresses1.txt', this.currentLang).subscribe(
      data => {
        this.addresses1.textId = 'addresses1.txt';
        this.addresses1.lang = this.currentLang;
        this.addresses1.text = data;
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
