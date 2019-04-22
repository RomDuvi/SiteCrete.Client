import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.css']
})
export class EquipmentComponent implements OnInit {

  public equipment1: string;
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
    $('#equipment-nav').addClass('active');
    this.afterInit();
  }

  afterInit() {
    this.currentLang = this.translate.currentLang;
    this.http.get('../../assets/translation/' + this.currentLang + '/equipment1.txt', { responseType: 'text' as 'json'}).subscribe((data: string) => {
      this.equipment1 = data;
    });
  }

}
