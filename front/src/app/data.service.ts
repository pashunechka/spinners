import { Injectable } from '@angular/core';
import {Subject} from "rxjs/Subject";

@Injectable()
export class DataService {

  private spinner = new Subject<any>();
  private parts = new Subject<any>();

  constructor() { }

  announce = this.spinner.asObservable();
  announceParts = this.parts.asObservable();

  announced(spinner) {
    this.spinner.next(spinner);
  }

  partAnnounced(parts) {
    this.parts.next(parts);
  }

  innerHtml(id, value){
    document.getElementById(id).innerHTML = value;
  }

}
