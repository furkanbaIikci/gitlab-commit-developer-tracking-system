import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

import { CommittersServices } from 'src/Services/CommittersServices';
import { GroupProject } from './GroupsProjects';


import {AccordionModule} from 'primeng/accordion';     //accordion and accordion tab
import {MenuItem} from 'primeng/api';                  //api
import {ChartModule} from 'primeng/chart';
import {RadioButtonModule} from 'primeng/radiobutton';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import { Animations } from 'chart.js';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { GroupProjectServices } from 'src/Services/GroupProjectServices';
import {BreadcrumbModule} from 'primeng/breadcrumb';
import {PaginatorModule} from 'primeng/paginator';




@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AccordionModule,
    ChartModule,
    RadioButtonModule,
    CommittersServices,
    ScrollPanelModule,
    MessageModule,
    MessagesModule,
    BrowserAnimationsModule,
    GroupProjectServices,
    BreadcrumbModule,
    PaginatorModule
    
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
