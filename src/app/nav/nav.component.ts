import { Component, OnInit, HostListener, AfterContentInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/guard/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  public expanded: boolean;
  isAdmin: boolean;

  constructor(
    private router: Router,
    private translate: TranslateService,
    private authService: AuthService
  ) {

  }

  ngOnInit() {
    this.expanded = $('.navbar-toggler').is(':visible');
    this.isAdmin = this.authService.isAdminLogged();
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
    this.router.navigate(['/']);
  }

  setLanguage(lg: string) {
    this.translate.use(lg);
  }

  isCurrentLanguage(lg: string): boolean{
    return this.translate.currentLang === lg;
  }

  logout(){
    this.authService.logout();
    this.ngOnInit();
  }
}
