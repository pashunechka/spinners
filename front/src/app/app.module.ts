import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { SpinnerListComponent } from './spinner-list/spinner-list.component';
import { SpinnerComponent } from './spinner/spinner.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpService} from "./http.service";
import {HttpClientModule} from "@angular/common/http";
import {ChartsModule} from "ng2-charts";
import { AddFormComponent } from './spinner/add-form/add-form.component';
import {DataService} from "./data.service";
import { ItemListComponent } from './spinner/item-list/item-list.component';


@NgModule({
  declarations: [
    AppComponent,
    SpinnerListComponent,
    SpinnerComponent,
    AddFormComponent,
    ItemListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ChartsModule
  ],
  providers: [
    DataService,
    HttpService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
