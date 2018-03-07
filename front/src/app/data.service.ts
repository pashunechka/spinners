import { Injectable } from '@angular/core';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class DataService {

  DEFAULTIMAGE = 'no-image.svg';
  private spinnerId: string;

  private items = new Subject<any>();
  private parts = new Subject<any>();
  private errorAuth = new Subject<any>();
  private statistics = new Subject<any>();

  constructor() { }

  spinnerItems = this.items.asObservable();
  wheelParts = this.parts.asObservable();
  authorizationError = this.errorAuth.asObservable();
  spinnerStatistics = this.statistics.asObservable();

  announceSpinnerStatistics(statistics) {
    this.statistics.next(statistics);
  }

  announceSpinnerItems(items) {
    this.items.next(items);
  }

  announceWheelParts(parts) {
    this.parts.next(parts);
  }

  announceError(errorAuth) {
    this.errorAuth.next(errorAuth);
  }

  getSpinnerId(): string {
    return this.spinnerId;
  }

  setSpinnerId(id) {
    this.spinnerId = id;
  }

}
