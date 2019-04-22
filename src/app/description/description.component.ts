import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.css']
})
export class DescriptionComponent implements OnInit {

  public previewUrl: string;
  public isPreview: boolean;
  public description1: string;
  public description2: string;
  public description3: string;

  public currentLang: string;

  constructor(
    private translate: TranslateService,
    private http: HttpClient
  ) {
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.afterInit();
    });
  }

  ngOnInit() {
    $('.active').removeClass('active');
    $('#description-nav').addClass('active');
    this.afterInit();
  }

  afterInit() {
    this.currentLang = this.translate.currentLang;
    this.http.get('../../assets/translation/' + this.currentLang + '/description1.txt', { responseType: 'text' as 'json'}).subscribe((data: string) => {
      this.description1 = data;
    });
    this.http.get('../../assets/translation/' + this.currentLang + '/description2.txt', { responseType: 'text' as 'json'}).subscribe((data: string) => {
      this.description2 = data;
    });
    this.http.get('../../assets/translation/' + this.currentLang + '/description3.txt', { responseType: 'text' as 'json'}).subscribe((data: string) => {
      this.description3 = data;
    });
  }

  preview(url: string) {
    this.previewUrl = url;
    this.isPreview = true;
  }

}
