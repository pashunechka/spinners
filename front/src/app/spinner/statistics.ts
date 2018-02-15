export class Statistics {
  public chartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true,
    legend: {
      display: false
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero:true,
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
  public chartColors:Array<any> = [{
    backgroundColor: 'rgba(89, 187, 181, 0.5)',
  }];
  public chartLabels:string[] = [];
  public chartType:string = 'line';
  public chartLegend:boolean = true;

  public chartData:any[] = [
    {
      data: [],
      label: 'Statistics'
    },
  ];

  collectStat = [];

  constructor(){}

  initStatistics(parts): void {
    this.chartData[0].data = [];
    this.collectStat = [];
    this.chartLabels = [];
    for (let key = 0; key < parts.length; key++) {
      this.chartLabels.push(parts[key]);
      this.collectStat.push(0);
    }
  }

  collectStatistics(topPositionValue): void {
    if(topPositionValue)
      this.collectStat[this.chartLabels.indexOf(topPositionValue)]+=1;
    this.showStatistics();
  }

  private showStatistics(): void {
    let clone = JSON.parse(JSON.stringify(this.chartData));
    clone[0].data = this.collectStat;
    this.chartData = clone;
  }

}
