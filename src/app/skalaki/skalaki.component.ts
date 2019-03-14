import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-skalaki',
  templateUrl: './skalaki.component.html',
  styleUrls: ['./skalaki.component.css']
})
export class SkalakiComponent implements OnInit {

  img: JQuery<HTMLElement>;

  ngOnInit(): void {
    $('#bgrnd').one('load', () => {
      this.img = $('#bgrnd');
      this.setAnimationLeft();
    });

    $('#footer').css('display', 'none');
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


}
