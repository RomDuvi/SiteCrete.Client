import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.css']
})
export class DescriptionComponent implements OnInit {

  constructor() {  }

  ngOnInit() {
    $('.active').removeClass('active');
    $('#description-nav').addClass('active');
  }

}
