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

const appRoutes: Routes = [
  {path: 'skalaki', component: SkalakiComponent},
  {path: '', redirectTo: '/skalaki', pathMatch: 'full'},
  {path: 'home', component: UnderConstructionComponent},
  {path: 'description', component: UnderConstructionComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SkalakiComponent,
    NavComponent,
    DescriptionComponent,
    UnderConstructionComponent
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
