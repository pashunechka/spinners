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

  spinner: Spinner = new Spinner();
  statistics: Statistics = new Statistics();
  subscription: Subscription;

  isClick: boolean = false;
  isPopUp: boolean = false;
  stop: boolean = false;

  clickNumber: number = 0;
  rotateRad: number = 0;
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
    //this.onmouseMove();
    //this.onmouseUp();
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

  onmouseUp(): void {
    window.addEventListener("mouseup", (event) => {
      if(this.isClick) {
        this.setIsClick(false);
        this.catchMouseClick(event, this.endClick);
        this.setStop(true);
        this.dissableItems(true);
        if(this.endClick.x != this.startClick.x)
          this.spinner.initWheelRotation(this.MILLISECONDS, -(this.endClick.x - this.startClick.x)*0.33, this.afterWheelRotate);
      }
    });
  }

  clickDown(event: MouseEvent){
    this.spinner.clearTimeOut();
    if(this.stop) {
      this.setStop(false);
      this.clickNumber = 0;
      this.rotateRad = 0;
      if(this.spinner.checkWheelPartsAmount())
        this.spinner.stopWheel();
      return this.dissableItems(false);
    }
    this.setIsClick(true);
    this.catchMouseClick(event, this.startClick);
  }

  clickToRotate(): void {
    this.spinner.clearTimeOut();
    this.clickNumber++;
    this.setStop(true);
    if(this.spinner.checkWheelPartsAmount())
      this.dissableItems(true);
    this.rotateRad += this.clickNumber*Math.random()*20;
    console.log(this.rotateRad)
    this.spinner.initWheelRotation(this.MILLISECONDS, this.rotateRad, this.afterWheelRotate);
  }

  afterWheelRotate = (): void => {
      this.setStop(false);
      this.setIsPopUp(true);
      this.clickNumber = 0;
      this.rotateRad = 0;
      this.dissableItems(false);
      this.statistics.collectStatistics(this.spinner.getValue());
  };

  dissableItems(value: boolean): void{
    const list = document.getElementsByClassName('list-js');
    for(let key = 0; key < list.length; key++)
      list[key].getElementsByTagName('input')[0].disabled = value;
  }

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

  clickChangeType(value){
    this.statistics.chartType = value[0];
    document.getElementById(value[0]).setAttribute('class', 'fa fa-check-circle-o');
    document.getElementById(value[1]).setAttribute('class', 'fa fa-circle-o');
  }

  resetStatistics(){
    this.statistics.showStatistics([]);
  }

}
