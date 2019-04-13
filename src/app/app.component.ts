import { Component, OnInit, AfterViewInit, HostListener, AfterViewChecked } from '@angular/core';
import * as $ from 'jquery';
import { Router, NavigationEnd } from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit, AfterViewChecked {
  public entered: boolean;

  img: JQuery<HTMLElement>;

  constructor(
    private router: Router,
    translate: TranslateService
  ) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('fr');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('fr');
  }

  ngOnInit(): void {
    $('#scroller').hide();
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
    console.log('afterInit');
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
    if (outlet.scrollTop() + outlet.height() === scrollHeight) {
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
}
