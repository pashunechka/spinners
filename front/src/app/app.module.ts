import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import {DataService} from './data.service';
import { SpinnerListComponent } from './spinner-list/spinner-list.component';
import { SpinnerComponent } from './spinner/spinner.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpService} from "./http.service";
import {HttpClientModule} from "@angular/common/http";


@NgModule({
  declarations: [
    AppComponent,
    SpinnerListComponent,
    SpinnerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    DataService,
    HttpService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
