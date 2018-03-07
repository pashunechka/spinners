import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataService} from '../../data.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit, OnDestroy {

  types = ['line', 'bar' ];
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

  collectStat = [];
  subscription: Subscription;
  parts = [];

  constructor(private data: DataService) {}

  ngOnInit() {
    this.subscription = this.data.wheelParts.subscribe(parts => {
      this.parts = parts;
      this.initStatistics(parts);
    });
    this.data.spinnerStatistics.subscribe(statistics => this.collectStatistics(statistics));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  initStatistics(parts): void {
      this.chartData[0].data = [];
      this.collectStat = [];
      this.chartLabels = [];
      for (let key = 0; key < parts.length; key++) {
        this.chartLabels.push(parts[key].name.substring(0, 14));
        this.collectStat.push(parts[key].statistics);
        this.showStatistics(this.collectStat);
      }
  }

  collectStatistics(spinnerValue): void {
    if (spinnerValue) {
      this.collectStat[this.chartLabels.indexOf(spinnerValue.name)] = spinnerValue.statistics;
    }
    this.showStatistics(this.collectStat);
  }

  showStatistics(data): void {
    setTimeout(() => {
      const clone = JSON.parse(JSON.stringify(this.chartData));
      clone[0].data = data;
      this.chartData = clone;
    }, 1);
  }

  toggleStatistics(event, type): void {
    if (event.isUserInput) {
      this.chartType = type;
      this.showStatistics(this.collectStat);
    }
  }

}
