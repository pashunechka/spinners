import { Injectable } from '@angular/core';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class DataService {

  private items = new Subject<any>();
  private parts = new Subject<any>();
  private addItem = new Subject<any>();
  private spinnerId: string;

  constructor() { }

  spinnerItems = this.items.asObservable();
  spinnerAddItem = this.items.asObservable();
  wheelParts = this.parts.asObservable();

  announceSpinnerItems(items) {
    this.items.next(items);
  }

  announceAddItem(addItem) {
    this.addItem.next(addItem);
  }

  announceWheelParts(parts) {
    this.parts.next(parts);
  }

  getSpinnerId(): string {
    return this.spinnerId;
  }

  setSpinnerId(id) {
    this.spinnerId = id;
  }

}
