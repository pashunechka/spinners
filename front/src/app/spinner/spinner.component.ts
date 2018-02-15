import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataService} from "../data.service";
import {Statistics} from "./statistics";
import {Subscription} from "rxjs/Subscription";
import {Spinner} from "./spinner";

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit, OnDestroy {

  MILLISECONDS: number = 4000;
  RANDOM: number = Math.random()*10 + 5;

  spinner: Spinner = new Spinner();
  statistics: Statistics = new Statistics();
  subscription: Subscription;

  isClick: boolean = false;
  isPopUp: boolean = false;
  stop: boolean = false;

  clickNumber: number = 0;
  parts = [];
  startClick = {x: 0, y: 0};
  endClick = {x: 0, y: 0};

  constructor(private data: DataService) {}

  ngOnInit() {
    this.spinner.spinnerCenterColor = '#31bbb5';
    this.subscription = this.data.announceParts.subscribe(parts => {
      this.parts = parts;
      this.spinner.initialize('wheel', this.parts);
      this.statistics.initStatistics(this.parts);
    });
    this.onmouseMove();
    this.onmouseUp();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onmouseMove(): void {
    window.addEventListener("mousemove", (event) =>{
      if(this.isClick)
        this.spinner.moveWheelOnMouseMove(event.pageX, event.pageY);
    });
  }

  clickDown(event: MouseEvent){
    this.spinner.clearTimeOut();
    if(this.stop) {
      this.setStop(false);
      return this.spinner.stopWheel();
    }
    this.setIsClick(true);
    this.catchMouseClick(event, this.startClick);
  }

  onmouseUp(): void {
    window.addEventListener("mouseup", (event) => {
      if(this.isClick) {
        this.setIsClick(false);
        this.catchMouseClick(event, this.endClick);
        this.setStop(true);
        if(this.endClick.x != this.startClick.x)
          this.spinner.initWheelRotation(this.MILLISECONDS, -(this.endClick.x - this.startClick.x)*0.33, this.afterWheelRotate);
      }
    });
  }

  clickToRotate(): void {
    this.spinner.clearTimeOut();
    this.clickNumber++;
    this.setStop(true);
    this.spinner.initWheelRotation(this.MILLISECONDS, this.clickNumber*this.RANDOM, this.afterWheelRotate);
  }

  afterWheelRotate = (): void => {
      this.setStop(false);
      this.setIsPopUp(true);
      this.statistics.collectStatistics(this.spinner.getValue());
  };

  dragExit(event): void {
    this.setDropElementBackground(event,"white");
  }

  dragOver(event): void {
    event.preventDefault();
  }

  dragEnter(event): void {
    this.setDropElementBackground(event,"lightgray");
  }

  drop(event): void {
    if(event.dataTransfer.getData('value'))
      document.getElementById(event.dataTransfer.getData('value')).click();
    this.setDropElementBackground(event,"white");
  }

  setIsClick(value: boolean): void {
    this.isClick = value;
  }

  setIsPopUp(value: boolean): void {
    this.isPopUp = value;
  }

  setStop(value: boolean): void {
    this.stop = value;
  }

  setDropElementBackground(event, color): void {
    event.target.parentElement.style.backgroundColor = color;
  }

  catchMouseClick(event: MouseEvent, coord): void  {
    coord.x = event.screenX;
    coord.y = event.screenY;
  }

  close(): void {
    this.isPopUp = false;
  }

  changeType(event){
    this.statistics.chartType = event.target.defaultValue;
  }

}
