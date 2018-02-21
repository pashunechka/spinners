import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SpinnerListComponent} from './spinner-list/spinner-list.component';
import {SpinnerComponent} from './spinner/spinner.component';

const routes: Routes = [
  { path: '', redirectTo: '/5a8d1aa75f473b244893fbc2', pathMatch: 'full' },
  { path: ':id', component: SpinnerComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
