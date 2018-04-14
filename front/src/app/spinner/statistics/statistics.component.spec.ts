import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticsComponent } from './statistics.component';
import {DataService} from '../../data.service';
import {HttpClientModule} from '@angular/common/http';
import {HttpService} from '../../http.service';
import {AppMaterialModule} from '../../app-material.module';
import {ChartsModule} from 'ng2-charts';

describe('StatisticsComponent', () => {
  let component: StatisticsComponent;
  let fixture: ComponentFixture<StatisticsComponent>;
  const item = {name: '1', _id: '1', image: 'no-image.jpg', color: '#000000', statistics: 3, spinnerId: '1'};
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatisticsComponent ],
      imports: [
        AppMaterialModule,
        ChartsModule,
        HttpClientModule
      ],
      providers: [
        HttpService,
        DataService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#toggleStatistics should toggle chart type', () => {
    expect(component.chartType).toBe('bar');
    component.toggleStatistics({isUserInput: true}, 'bar');
    expect(component.chartType).toBe('bar');
    component.toggleStatistics({isUserInput: true}, 'line');
    expect(component.chartType).toBe('line');
    component.toggleStatistics({isUserInput: false}, 'line');
    expect(component.chartType).toBe('line');
    component.toggleStatistics({isUserInput: false}, 'bar');
    expect(component.chartType).toBe('line');
  });

  it('#setInitialValues should set chartData, collectStat, chartLabels to []', () => {
      component.chartData[0].data = [1, 2, 3];
      component.chartLabels = ['1', '2', '3'];
      component.collectStat = [1, 2, 3];
      component.setInitialValues();
      expect(component.chartLabels.length).toBe(0);
      expect(component.collectStat.length).toBe(0);
      expect(component.chartData[0].data.length).toBe(0);
  });

  it('#collectStatistics should return collectStat', () => {
      expect(component.collectStatistics(item)).toBe(component.collectStat);
  });

  it('#initStatistics should init chartLabels', () => {
    const items = [item, item, item];
    expect(component.chartLabels.length).toBe(0);
    expect(component.collectStat.length).toBe(0);
    component.initStatistics(items);
    expect(component.chartLabels.length).toBe(items.length);
    expect(component.collectStat.length).toBe(items.length);
  });
});
