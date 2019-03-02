import { Component, OnInit, SimpleChanges } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Skalaki';
  img: JQuery<HTMLElement>;

  ngOnInit(): void {
    $('#bgrnd').one('load', () => {
      this.img = $('#bgrnd');
      this.setAnimationLeft();
    });
  }

  setAnimationLeft() {
    const width = this.img.width() - $(window).width();
    this.img.animate({
      left: -width + 'px'
    }, 20000, 'linear', () => this.setAnimationRight());
  }

  setAnimationRight() {
    this.img.animate({
      left: '0px'
    }, 20000, 'linear', () => this.setAnimationLeft());
  }

}
