import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-picture-categories',
  templateUrl: './picture-categories.component.html',
  styleUrls: ['./picture-categories.component.css']
})
export class PictureCategoriesComponent implements OnInit {

  constructor(
    private router: Router,
    private categoryService: CategoryService  
  ) {}
  categories: Category[] = [];

  ngOnInit() {
    $('.active').removeClass('active');
    $('#pictures-nav').addClass('active');
    this.categoryService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }


  navigate(url: string): void {
    this.router.navigate([`/pictures/${url}`]);
  }
}
