import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  public expanded: boolean;

  constructor(private router: Router) { }

  ngOnInit() {
    this.expanded = $('.navbar-toggler').is(":visible");
    $('.nav-item').on('click', event => {
      $('.active').removeClass('active');
      $(event.target).addClass('active');
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(){
    this.expanded = $('.navbar-toggler').is(":visible");
  }

  goToHome() {
    this.router.navigateByUrl('/home');
  }

  setActive(target: HTMLElement) {
    // $('.active').removeClass('active');
    // target.classList.add('active');
  }

}
