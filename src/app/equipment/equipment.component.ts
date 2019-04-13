import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.css']
})
export class EquipmentComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
    $('.active').removeClass('active');
    $('#equipment-nav').addClass('active');
  }

}
