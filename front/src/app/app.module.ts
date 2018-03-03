import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import 'hammerjs';
import { AppComponent } from './app.component';
import { SpinnerListComponent } from './spinner-list/spinner-list.component';
import { SpinnerComponent } from './spinner/spinner.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpService} from './http.service';
import {HttpClientModule} from '@angular/common/http';
import {ChartsModule} from 'ng2-charts';
import { AddFormComponent } from './spinner/add-form/add-form.component';
import {DataService} from './data.service';
import { ItemListComponent } from './spinner/item-list/item-list.component';
import { StatisticsComponent } from './spinner/statistics/statistics.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatButtonModule, MatCardModule, MatCheckboxModule, MatGridListModule, MatIconModule, MatInputModule, MatListModule,
  MatMenuModule,
  MatSelectModule,
  MatSidenavModule,
  MatSlideToggleModule, MatToolbarModule
} from '@angular/material';


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
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatSlideToggleModule,
    MatSidenavModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatListModule,
    MatCardModule,
    MatMenuModule,
    MatGridListModule
  ],
  providers: [
    DataService,
    HttpService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
