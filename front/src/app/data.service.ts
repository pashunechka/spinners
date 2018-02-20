import { Injectable } from '@angular/core';
import {Subject} from "rxjs/Subject";

@Injectable()
export class DataService {

  private spinner = new Subject<any>();
  private parts = new Subject<any>();

  constructor() { }

  spinnerItems = this.spinner.asObservable();
  wheelParts = this.parts.asObservable();

  SpinnerItems(spinner) {
    this.spinner.next(spinner);
  }

  wheelPartsAnnounce(parts) {
    this.parts.next(parts);
  }

}
