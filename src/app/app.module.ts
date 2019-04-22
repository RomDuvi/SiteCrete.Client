import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxGalleryModule } from 'ngx-gallery';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

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

const appRoutes: Routes = [
  {path: '', redirectTo: '/description', pathMatch: 'full'},
  {path: 'description', component: DescriptionComponent},
  {path: 'equipment', component: EquipmentComponent},
  {path: 'pictures', component: PictureCategoriesComponent},
  {path: 'pictures/:id', component: PicturesComponent},
  {path: 'book', component: UnderConstructionComponent},
  {path: 'disponibilities', component: UnderConstructionComponent},
  {path: 'news', component: UnderConstructionComponent},
  {path: 'links', component: UnderConstructionComponent},
  {path: 'contact', component: ContactComponent},
  {path: 'discover', component: DiscoverComponent},
  {path: 'prices', component: PricesComponent},
  {path: 'addresses', component: UnderConstructionComponent}
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
    DiscoverComponent
  ],
  imports: [
    BrowserModule,
    NgxGalleryModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    }),
    RouterModule.forRoot(
      appRoutes
    ),
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}