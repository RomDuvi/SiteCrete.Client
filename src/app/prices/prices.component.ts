import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-prices',
  templateUrl: './prices.component.html',
  styleUrls: ['./prices.component.css']
})
export class PricesComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
    $('.active').removeClass('active');
    $('#prices-nav').addClass('active');
  }

}
