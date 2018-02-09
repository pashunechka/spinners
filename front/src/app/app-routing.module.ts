import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SpinnerListComponent} from './spinner-list/spinner-list.component';
import {SpinnerComponent} from './spinner/spinner.component';

const routes: Routes = [
  { path: '', component: SpinnerListComponent },
  { path: 'spinner/:id', component: SpinnerComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
