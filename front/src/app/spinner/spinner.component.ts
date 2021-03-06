import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataService} from '../data.service';
import {Subscription} from 'rxjs/Subscription';
import {Spinner} from './spinner';
import {HttpService} from '../http.service';
import {SpinnerItem} from '../spinnerItem';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit, OnDestroy {

  color = 'primary';
  warn = 'warn';
  spinnerCenterColor = '#266096';
  dragExitColor = '#009688';
  dragEnterColor = 'lightgray';

  MILLISECONDS = 4000;
  startRadians: number = (1 + Math.random()) * ((360 * Math.PI) / 180);
  rotateRad: number = this.startRadians;

  spinner: Spinner;
  subscription: Subscription;

  isPopUp = false;
  stop = false;
  isWheel: boolean;
  disableItemsList: boolean;
  disableBut = false;
  disableButTimer;

  clickNumber = 0;
  parts: Array<SpinnerItem> = [];

  constructor(
    private data: DataService,
    private http: HttpService) {}

  static setDropElementBackground(event, color: string): void {
    event.target.parentElement.style.backgroundColor = color;
  }

  ngOnInit(): void {
    this.spinner = new Spinner('wheel', this.spinnerCenterColor);
    this.subscription = this.data.wheelParts.subscribe(parts => {
      this.parts = parts;
      this.spinner.initialize(this.parts);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  clickDown(): void {
    this.spinner.clearTimeOut();
    if (this.stop) {
      this.resetWheelRotation();
    }
  }

  resetWheelRotation(): void {
    this.setStop(false);
    this.clickNumber = 0;
    this.spinner.stopWheel();
    this.disableItems(false);
    clearInterval(this.disableButTimer);
    this.disableBut = false;
  }

  clickToRotate(): void {
    clearInterval(this.disableButTimer);
    this.spinner.clearTimeOut();
    this.clickNumber++;
    this.setStop(true);
    this.disableItems(true);
    this.rotateWheel();
    this.disableButTimer = setInterval( () => this.disableBut = true, 1000);
  }

  rotateWheel(): void {
    this.rotateRad += (2 + Math.random()) * ((360 * Math.PI) / 180);
    this.spinner.initWheelRotation(this.MILLISECONDS, this.rotateRad, this.afterWheelRotate);
  }

  afterWheelRotate = (): void => {
      this.setStop(false);
      this.setIsPopUp(true);
      this.disableBut = false;
      clearInterval(this.disableButTimer);
      this.clickNumber = 0;
      this.disableItems(false);
  }

  statisticsChange(): void {
    this.http.increaseItemStatistics(this.spinner.getValue()).subscribe(result => {
      this.data.announceSpinnerStatistics(result);
      const parts = JSON.parse(localStorage.getItem('items'));
      parts.find(el => el._id === result._id).statistics = result.statistics;
      localStorage.setItem('items', JSON.stringify(parts));
      this.setIsPopUp(false);
    });
  }

  disableItems(value: boolean): void {
    if (this.spinner.checkWheelPartsAmount()) {
      this.disableItemsList = value;
    }
  }

  dragExit(event: DragEvent): void {
    SpinnerComponent.setDropElementBackground(event, this.dragExitColor);
  }

  dragOver(event: DragEvent): void {
    event.preventDefault();
  }

  dragEnter(event: DragEvent): void {
    SpinnerComponent.setDropElementBackground(event, this.dragEnterColor);
  }

  drop(event: DragEvent): void {
    if (event.dataTransfer.getData('value')) {
      document.getElementById(event.dataTransfer.getData('value')).click();
    }
    SpinnerComponent.setDropElementBackground(event, this.dragExitColor);
  }

  setIsPopUp(value: boolean): void {
    this.isPopUp = value;
  }

  setStop(value: boolean): void {
    this.stop = value;
  }
}
