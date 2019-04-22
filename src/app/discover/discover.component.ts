import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.css']
})
export class DiscoverComponent implements OnInit {

  public discover1: string;
  public currentLang: string;

  constructor(
    private translate: TranslateService,
    private http: HttpClient) {
      translate.onLangChange.subscribe(event => {
        this.afterInit();
      });
    }

  ngOnInit() {
    $('.active').removeClass('active');
    $('#discover-nav').addClass('active');
    this.afterInit();
  }

  afterInit() {
    this.currentLang = this.translate.currentLang;
    this.http.get('../../assets/translation/' + this.currentLang + '/discover1.txt', { responseType: 'text' as 'json'}).subscribe((data: string) => {
      this.discover1 = data;
    });
  }

}
