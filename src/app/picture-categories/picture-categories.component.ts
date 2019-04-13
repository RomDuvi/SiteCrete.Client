import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';

@Component({
  selector: 'app-picture-categories',
  templateUrl: './picture-categories.component.html',
  styleUrls: ['./picture-categories.component.css']
})
export class PictureCategoriesComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {
    $('.active').removeClass('active');
    $('#pictures-nav').addClass('active');
  }


  navigate(url: string): void {
    this.router.navigate([`/pictures/${url}`]);
  }
}
