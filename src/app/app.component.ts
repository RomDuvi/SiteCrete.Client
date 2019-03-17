import { Component, OnInit, SimpleChanges, AfterViewInit, HostListener } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit{
  public entered: boolean = true;

  img: JQuery<HTMLElement>;

  ngOnInit(): void {

  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (!this.entered) {
      this.img.stop();
      this.img.css('left', 0);
      this.setAnimationLeft();
    }
  }

  ngAfterViewInit(): void {
    if (!this.entered) {
      $('#bgrnd').one('load', () => {
        this.img = $('#bgrnd');
        this.setAnimationLeft();
      });
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
  }
}
