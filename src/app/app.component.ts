import { Component, OnInit, AfterViewInit, HostListener, AfterViewChecked, TemplateRef } from '@angular/core';
import * as $ from 'jquery';
import { Router, NavigationEnd } from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { PictureService } from 'src/services/picture.service';
import { CategoryService } from '../services/category.service';
import { TextModel } from '../models/text.model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AuthService } from '../services/guard/auth.service';
import { TextService } from '../services/text.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [PictureService, CategoryService]
})
export class AppComponent implements OnInit, AfterViewInit, AfterViewChecked {
  
  isAdmin: boolean;
  textModel: TextModel;
  modalRef: BsModalRef;
  
  public entered: boolean;
  public skalaki1: TextModel;
  public currentLang: string;

  img: JQuery<HTMLElement>;

  constructor(
    private router: Router,
    private translate: TranslateService,
    protected authService: AuthService,
    private modalService: BsModalService,
    private textService: TextService
  ) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('fr');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('fr');
    translate.onLangChange.subscribe(event => {
      this.afterOnInit();
    });
  }

  ngOnInit(): void {
    $('#scroller').hide();
    this.skalaki1 = new TextModel();
    this.afterOnInit();
  }

  afterOnInit() {
    this.currentLang = this.translate.currentLang;
    this.textService.getText('skalaki1.txt', this.currentLang).subscribe(
      data => {
        this.skalaki1.textId = 'skalaki1.txt';
        this.skalaki1.lang = this.currentLang;
        this.skalaki1.text = data;
      }
    );
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (!this.entered) {
      this.img.stop();
      this.img.css('left', 0);
      this.setAnimationLeft();
    } else {
      $('#outlet').height($(window).height() - 64);
    }
  }

  ngAfterViewInit(): void {
    const outlet = $('#outlet');
    if (!this.entered) {
      $('#bgrnd').one('load', () => {
        this.img = $('#bgrnd');
        this.setAnimationLeft();
      });
    }
    outlet.on('scroll', this.setScroll);
  }

  ngAfterViewChecked() {
    const outlet = $('#outlet');
    if(this.entered) {
      outlet.height($(window).height() - 64);
    }
    this.setScroll(null);
  }

  setScroll(event) {
    const outlet = $('#outlet');
    if (outlet == null || outlet.get()[0] == null) {
      return;
    }
    const scrollHeight = outlet.get()[0].scrollHeight;
    if (outlet.scrollTop() + outlet.height() >= (scrollHeight - 8)) {
      $('#scroller').hide();
    } else {
      $('#scroller').show();
    }
  }

  setAnimationLeft() {
    const width = this.img.width() - $(window).width();
    this.img.animate({
      left: -width + 'px'
    }, 40000, 'linear', () => this.setAnimationRight());
  }

  setAnimationRight() {
    this.img.animate({
      left: '0px'
    }, 40000, 'linear', () => this.setAnimationLeft());
  }

  public onEnter() {
    this.entered = true;
    this.router.navigate(['/description']);
  }

  public scrollTo() {
    $('#outlet').animate({ scrollTop: $('#outlet').scrollTop() + 300 }, 600);
  }

  setLanguage(lg: string) {
    this.translate.use(lg);
  }

  isCurrentLanguage(lg: string): boolean{
    return this.translate.currentLang === lg;
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
