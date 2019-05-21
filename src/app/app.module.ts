import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxGalleryModule } from 'ngx-gallery';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FullCalendarModule } from 'primeng/fullcalendar';
import { CalendarModule } from 'primeng/calendar';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { DescriptionComponent } from './description/description.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { UnderConstructionComponent } from './under-construction/under-construction.component';
import { EquipmentComponent } from './equipment/equipment.component';
import { PricesComponent } from './prices/prices.component';
import { ContactComponent } from './contact/contact.component';
import { PictureCategoriesComponent } from './picture-categories/picture-categories.component';
import { PicturesComponent } from './pictures/pictures.component';
import { DiscoverComponent } from './discover/discover.component';
import { ToastrModule } from 'ngx-toastr';
import { AuthGuard } from 'src/services/guard/authGuard';
import { AuthService } from 'src/services/guard/auth.service';
import { ToastGeneratorService } from 'src/services/toastGenerator.service';
import { CustomHttpInterceptor } from 'src/services/error/http.interceptor';
import { LoginComponent } from './login/login.component';
import { ReservationsComponent } from './reservations/reservations.component';
import { ConfigService } from '../services/config/config.service';
import { ConfirmationDialogComponent } from '../utils/confirmation/confirmation-dialog.component';
import { ConfirmationDialogService } from '../utils/confirmation/ConfirmationDialog.service';
import { TextService } from '../services/text.service';

const appRoutes: Routes = [
  {path: '', redirectTo: '/description', pathMatch: 'full'},
  {path: 'description', component: DescriptionComponent},
  {path: 'equipment', component: EquipmentComponent},
  {path: 'pictures', component: PictureCategoriesComponent},
  {path: 'pictures/:id', component: PicturesComponent},
  {path: 'book', component: UnderConstructionComponent},
  {path: 'disponibilities', component: ReservationsComponent},
  {path: 'news', component: UnderConstructionComponent},
  {path: 'links', component: UnderConstructionComponent},
  {path: 'contact', component: ContactComponent},
  {path: 'discover', component: DiscoverComponent},
  {path: 'prices', component: PricesComponent},
  {path: 'addresses', component: UnderConstructionComponent},
  {path: 'login', component: LoginComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    DescriptionComponent,
    UnderConstructionComponent,
    EquipmentComponent,
    PricesComponent,
    ContactComponent,
    PictureCategoriesComponent,
    PicturesComponent,
    DiscoverComponent,
    LoginComponent,
    ReservationsComponent,
    ConfirmationDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgxGalleryModule,
    HttpClientModule,
    FormsModule,
    FullCalendarModule,
    CalendarModule,
    NgMultiSelectDropDownModule.forRoot(),
    ToastrModule.forRoot(),
    ModalModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    }),
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-right',
      preventDuplicates: true
    }),
    RouterModule.forRoot(
      appRoutes
    )
  ],
  providers: [
    AuthGuard,
    AuthService,
    ConfigService,
    ToastGeneratorService,
    ConfirmationDialogService,
    TextService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CustomHttpInterceptor,
      multi: true
    },
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ConfirmationDialogComponent
  ]
})
export class AppModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}