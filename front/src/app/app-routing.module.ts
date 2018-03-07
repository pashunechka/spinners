import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SpinnerComponent} from './spinner/spinner.component';

const routes: Routes = [
  { path: ':id', component: SpinnerComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
