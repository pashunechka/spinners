import 'hammerjs';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatButtonModule, MatCardModule, MatCheckboxModule, MatGridListModule, MatIconModule, MatInputModule, MatListModule,
  MatMenuModule,
  MatSelectModule,
  MatSidenavModule,
  MatSlideToggleModule, MatToolbarModule
} from '@angular/material';
import {NgModule} from '@angular/core';

@NgModule({
  imports: [
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
  exports: [
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
    MatGridListModule]
})
export class AppMaterialModule { }
