import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SpinnerListComponent } from './spinner-list/spinner-list.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpService } from './http.service';
import { HttpClientModule } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts';
import { AddFormComponent } from './spinner/add-form/add-form.component';
import { DataService } from './data.service';
import { ItemListComponent } from './spinner/item-list/item-list.component';
import { StatisticsComponent } from './spinner/statistics/statistics.component';
import { AppMaterialModule } from './app-material.module';


@NgModule({
  declarations: [
    AppComponent,
    SpinnerListComponent,
    SpinnerComponent,
    AddFormComponent,
    ItemListComponent,
    StatisticsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ChartsModule,
    AppMaterialModule
  ],
  providers: [
    DataService,
    HttpService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
