import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataService} from '../data.service';
import {Statistics} from './statistics';
import {Subscription} from 'rxjs/Subscription';
import {Spinner} from './spinner';
import {HttpService} from '../http.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit, OnDestroy {

  MILLISECONDS = 4000;
  STARTRADIANS: number = Math.round((1 + Math.random()) * ((360 * Math.PI) / 180));

  spinner: Spinner = new Spinner();
  statistics: Statistics = new Statistics();
  subscription: Subscription;

  isClick = false;
  isPopUp = false;
  isLineStat = true;
  stop = false;

  clickNumber = 0;
  rotateRad: number = this.STARTRADIANS;
  parts = [];
  startClick = {x: 0, y: 0};
  endClick = {x: 0, y: 0};

  public chartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    legend: {
      display: false
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          fontFamily: 'Ubuntu, sans-serif',
          fontSize: '16'
        }
      }],
      xAxes: [{
        ticks: {
          fontFamily: 'Ubuntu, sans-serif',
          fontSize: '16'
        }
      }]
    }
  };
  public chartColors: Array<any> = [{
    backgroundColor: 'rgba(89, 187, 181, 0.5)',
  }];
  public chartLabels: string[] = [];
  public chartType = 'line';
  public chartLegend = false;

  public chartData: any[] = [
    {
      data: [],
      label: 'Statistics'
    },
  ];
  collectStat;

  constructor(private data: DataService) {}

  ngOnInit() {
    this.spinner.spinnerCenterColor = '#31bbb5';
    this.subscription = this.data.wheelParts.subscribe(parts => {
      this.parts = parts;
      this.spinner.initialize('wheel', this.parts);
      this.initStatistics();
      //this.statistics.initStatistics(parts);
    });
    //this.onmouseMove();
    //this.onmouseUp();
  }

/** удалить как исправлю статистику**/
  initStatistics() {
    this.chartData[0].data = [];
    this.collectStat = [];
    this.chartLabels = [];
    for (let key = 0; key < this.parts.length; key++) {
      this.chartLabels.push(this.parts[key].name);
      this.collectStat.push(0);
    }
  }

  collectStatistics() {
    if (this.spinner.getValue()) {
      this.collectStat[this.chartLabels.indexOf(this.spinner.getValue().name)] += 1;
    }
    this.showStatistics();
  }

  showStatistics() {
    const clone = JSON.parse(JSON.stringify(this.chartData));
    clone[0].data = this.collectStat;
    this.chartData = clone;
  }
/** до сюда**/

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onmouseMove(): void {
    window.addEventListener('mousemove', (event) => {
      if (this.isClick) {
        this.spinner.moveWheelOnMouseMove(event.pageX, event.pageY);
      }
    });
  }

  onmouseUp(): void {
    window.addEventListener('mouseup', (event) => {
      if (this.isClick) {
        this.setIsClick(false);
        this.catchMouseClick(event, this.endClick);
        this.setStop(true);
        this.dissableItems(true);
        if (this.endClick.x !== this.startClick.x) {
          this.spinner.initWheelRotation(this.MILLISECONDS, -(this.endClick.x - this.startClick.x) * 0.33, this.afterWheelRotate);
        }
      }
    });
  }

  clickDown(event: MouseEvent) {
    this.spinner.clearTimeOut();
    if (this.stop) {
      this.setStop(false);
      this.clickNumber = 0;
      this.rotateRad = 0;
      if (this.spinner.checkWheelPartsAmount()) {
        this.spinner.stopWheel();
      }
      return this.dissableItems(false);
    }
    this.setIsClick(true);
    this.catchMouseClick(event, this.startClick);
  }

  clickToRotate(): void {
    this.spinner.clearTimeOut();
    this.clickNumber++;
    this.setStop(true);
    if (this.spinner.checkWheelPartsAmount()) {
      this.dissableItems(true);
    }
    this.rotateRad += Math.round((2 + Math.random()) * ((360 * Math.PI) / 180));
    this.spinner.initWheelRotation(this.MILLISECONDS, this.rotateRad, this.afterWheelRotate);
  }

  afterWheelRotate = (): void => {
      this.setStop(false);
      this.setIsPopUp(true);
      this.clickNumber = 0;
      this.dissableItems(false);
      this.collectStatistics();
      //this.statistics.collectStatistics(this.spinner.getValue().name);
  }

  dissableItems(value: boolean): void {
    const list = document.getElementsByClassName('list-js');
    for (let key = 0; key < list.length; key++) {
      list[key].getElementsByTagName('input')[0].disabled = value;
    }
  }

  dragExit(event): void {
    this.setDropElementBackground(event, 'white');
  }

  dragOver(event): void {
    event.preventDefault();
  }

  dragEnter(event): void {
    this.setDropElementBackground(event, 'lightgray');
  }

  drop(event): void {
    if (event.dataTransfer.getData('value')) {
      document.getElementById(event.dataTransfer.getData('value')).click();
    }
    this.setDropElementBackground(event, 'white');
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

  toggleStatistics(event) {
    this.isLineStat = !this.isLineStat;
    if (this.isLineStat) {
      this.chartType = 'line';
      return event.target.setAttribute('src', '/assets/switch-line.svg');
    }
    this.chartType = 'bar';
    event.target.setAttribute('src', '/assets/switch-bar.svg');
  }

  resetStatistics() {
    this.statistics.showStatistics([]);
  }
}
