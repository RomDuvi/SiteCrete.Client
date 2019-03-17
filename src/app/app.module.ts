import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SkalakiComponent } from './skalaki/skalaki.component';
import { NavComponent } from './nav/nav.component';
import { DescriptionComponent } from './description/description.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { UnderConstructionComponent } from './under-construction/under-construction.component';
import { EquipmentComponent } from './equipment/equipment.component';
import { PricesComponent } from './prices/prices.component';

const appRoutes: Routes = [
  {path: 'skalaki', component: SkalakiComponent},
  {path: '', redirectTo: '/description', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'description', component: DescriptionComponent},
  {path: 'equipment', component: EquipmentComponent},
  {path: 'pictures', component: UnderConstructionComponent},
  {path: 'book', component: UnderConstructionComponent},
  {path: 'disponibilities', component: UnderConstructionComponent},
  {path: 'news', component: UnderConstructionComponent},
  {path: 'links', component: UnderConstructionComponent},
  {path: 'contact', component: UnderConstructionComponent},
  {path: 'discover', component: UnderConstructionComponent},
  {path: 'prices', component: PricesComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SkalakiComponent,
    NavComponent,
    DescriptionComponent,
    UnderConstructionComponent,
    EquipmentComponent,
    PricesComponent
  ],
  imports: [
    BrowserModule,
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
