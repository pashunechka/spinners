import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataService} from '../../data.service';
import {Subscription} from 'rxjs/Subscription';
import {SpinnerItem} from '../../spinnerItem';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit, OnDestroy {

  types: Array<string> = ['line', 'bar' ];
  select = 'line';

  public chartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    legend: {
      display: false
    },
    scales: {
      yAxes: [{
        ticks: {
          stepSize: 1,
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

  collectStat: Array<number> = [];
  parts: Array<any> = [];
  subscription: Subscription;

  constructor(private data: DataService) {}

  ngOnInit() {
    this.subscription = this.data.wheelParts.subscribe(parts => {
      this.parts = parts;
      this.initStatistics(parts);
    });
    this.data.spinnerStatistics
      .subscribe(statistics => this.collectStatistics(statistics));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  initStatistics(parts: Array<SpinnerItem>): void {
      this.setInitialValues();
      for (let key = 0; key < parts.length; key++) {
        this.chartLabels.push(parts[key].name.substring(0, 14));
        this.collectStat.push(parts[key].statistics);
        this.showStatistics(this.collectStat);
      }
  }

  setInitialValues(): void {
    this.chartData[0].data = [];
    this.collectStat = [];
    this.chartLabels = [];
  }

  collectStatistics(spinnerValue: SpinnerItem): void {
    if (spinnerValue) {
      this.collectStat[this.chartLabels.indexOf(spinnerValue.name)] = spinnerValue.statistics;
    }
    this.showStatistics(this.collectStat);
  }

  showStatistics(data: Array<number>): void {
    setTimeout(() => {
      const clone = JSON.parse(JSON.stringify(this.chartData));
      clone[0].data = data;
      this.chartData = clone;
    }, 1);
  }

  toggleStatistics(event, type: string): void {
    if (event.isUserInput) {
      this.chartType = type;
      this.showStatistics(this.collectStat);
    }
  }

}
