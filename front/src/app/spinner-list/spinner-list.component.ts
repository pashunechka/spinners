import { Component, OnInit } from '@angular/core';
import {HttpService} from "../http.service";

@Component({
  selector: 'app-spinner-list',
  templateUrl: './spinner-list.component.html',
  styleUrls: ['./spinner-list.component.scss']
})
export class SpinnerListComponent implements OnInit {

  spinnerName: string = '';
  error: boolean = false;

  spinners = [];

  constructor(
    private http: HttpService) { }

  ngOnInit() {
    this.http.getData('/getSpinners').subscribe((res: any) => this.spinners = res);
  }

  createSpinner(): void {
    if(this.spinnerName != '')
      this.http.postData('/addSpinner', {name: this.spinnerName}).subscribe((res: any) => {
          this.spinners.push(res);
          this.spinnerName = '';
        });
    else
      this.error = true;
  }

  toggleError(): void {
    this.error = false;
  }

}
