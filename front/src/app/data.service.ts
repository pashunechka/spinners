import { Injectable } from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {SpinnerItem} from './spinnerItem';
import {Spinner} from "./spinner";

@Injectable()
export class DataService {

  DEFAULTIMAGE = 'no-image.svg';

  private spinnerId: string;

  private items = new Subject<any>();
  private parts = new Subject<any>();
  private errorAuth = new Subject<any>();
  private statistics = new Subject<any>();
  private changeUrl = new Subject<any>();

  constructor() { }

  spinnerItems = this.items.asObservable();
  wheelParts = this.parts.asObservable();
  authorizationError = this.errorAuth.asObservable();
  changeURL = this.changeUrl.asObservable();
  spinnerStatistics = this.statistics.asObservable();

  announceSpinnerStatistics(statistics: SpinnerItem): void {
    this.statistics.next(statistics);
  }

  announceSpinnerItems(items: Array<SpinnerItem>): void {
    this.items.next(items);
  }

  announceWheelParts(parts: Array<SpinnerItem>): void {
    this.parts.next(parts);
  }

  announceError(errorAuth: boolean): void {
    this.errorAuth.next(errorAuth);
  }

  announceChangeURL(url: string): void {
    this.changeUrl.next(url);
  }

  getSpinnerId(): string {
    return this.spinnerId;
  }

  setSpinnerId(id: string): void {
    this.spinnerId = id;
  }

}
