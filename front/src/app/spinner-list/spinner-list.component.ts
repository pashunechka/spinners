import { Component, OnInit } from '@angular/core';
import {HttpService} from "../http.service";
import {DataService} from "../data.service";

@Component({
  selector: 'app-spinner-list',
  templateUrl: './spinner-list.component.html',
  styleUrls: ['./spinner-list.component.scss']
})
export class SpinnerListComponent implements OnInit {

  spinnerName = '';
  error = false;

  spinners = [];

  constructor(private http: HttpService, private data: DataService) { }

  ngOnInit() {
    this.http.getData('/getSpinners').subscribe((res: any) => {
      this.data.spinners = res;
      this.spinners = this.data.spinners;
    });
  }

  createSpinner(){
    if(this.spinnerName != '')
      this.http.postData('/addSpinner', {name: this.spinnerName}).subscribe((res: any) =>{
        this.data.spinners.push(res);
        this.spinners = this.data.spinners;
      });
    else
      this.error = true;
  }

  toggleError(){
    this.error = false;
  }

}
