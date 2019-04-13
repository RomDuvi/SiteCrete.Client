import { Component, OnInit, HostListener, AfterContentInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  public expanded: boolean;

  constructor(
    private router: Router,
    private translate: TranslateService
  ) {

  }

  ngOnInit() {
    this.expanded = $('.navbar-toggler').is(':visible');
    $('.nav-item').on('click', event => {
      if ( this.expanded ) {
        $('.navbar-collapse').removeClass('show');
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.expanded = $('.navbar-toggler').is(':visible');
  }

  goToHome() {
    this.router.navigate(['/description']);
  }

  setLanguage(lg: string) {
    this.translate.use(lg);
  }

  isCurrentLanguage(lg: string): boolean{
    return this.translate.currentLang === lg;
  }
}
