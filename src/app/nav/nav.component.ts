import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TagContentType } from '@angular/compiler';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  goToHome() {
    this.router.navigateByUrl('/home');
  }

  setActive(target: HTMLElement) {
    $('.nav-item').removeClass('active');
    target.classList.add('active');
  }

}
