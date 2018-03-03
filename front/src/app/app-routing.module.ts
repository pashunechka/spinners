import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SpinnerListComponent} from './spinner-list/spinner-list.component';
import {SpinnerComponent} from './spinner/spinner.component';

const routes: Routes = [
  { path: '', redirectTo: '/5a969f1ace4dd913ff189a34', pathMatch: 'full' },
  { path: ':id', component: SpinnerComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
