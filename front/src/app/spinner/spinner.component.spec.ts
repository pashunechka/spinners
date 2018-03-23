import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import { SpinnerComponent } from './spinner.component';
import {AppMaterialModule} from '../app-material.module';
import {ControlContainer, FormsModule, NgControl, ReactiveFormsModule} from '@angular/forms';
import {ItemListComponent} from './item-list/item-list.component';
import {StatisticsComponent} from './statistics/statistics.component';
import {AddFormComponent} from './add-form/add-form.component';
import {ChartsModule} from 'ng2-charts';
import {DataService} from '../data.service';
import {HttpService} from '../http.service';
import {HttpClientModule} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';

describe('SpinnerComponent', () => {
  let component: SpinnerComponent;
  let fixture: ComponentFixture<SpinnerComponent>;
  const item = {name: '1', _id: '1', image: 'no-image.jpg', color: '#000000', statistics: 3};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SpinnerComponent,
        ItemListComponent,
        StatisticsComponent,
        AddFormComponent
      ],
      imports: [
        AppMaterialModule,
        FormsModule,
        ReactiveFormsModule,
        ChartsModule,
        RouterTestingModule,
        HttpClientModule
      ],
      providers: [
        NgControl,
        ControlContainer,
        DataService,
        HttpService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#setStop should be change stop variable', () => {
    expect(component.stop).toBeFalsy();
    component.setStop(true);
    expect(component.stop).toBeTruthy();
    component.setStop(false);
    expect(component.stop).toBeFalsy();
  });

  it('#setIsPopUp should be change isPopUp variable', () => {
    expect(component.isPopUp).toBeFalsy();
    component.setIsPopUp(true);
    expect(component.isPopUp).toBeTruthy();
    component.setIsPopUp(false);
    expect(component.isPopUp).toBeFalsy();
  });

  it('#disableItems should set disableItemsList', () => {
      expect(component.disableItemsList).toBeUndefined();
      component.spinner.initialize('wheel', []);
      component.disableItems(true);
      expect(component.disableItemsList).toBeUndefined();
      component.spinner.initialize('wheel', [item, item]);
      component.disableItems(true);
      expect(component.disableItemsList).toBe(true);
  });

  it('#afterWheelRotate should show pop-up', async(() => {
        component.afterWheelRotate();
        expect(component.stop).toEqual(false);
        expect(component.isPopUp).toEqual(true);
        expect(component.clickNumber).toEqual(0);
  }));

  it('#resetWheelRotation should stop wheel rotation', () => {
    component.spinner.initialize('wheel', [item, item]);
    component.clickToRotate();

    expect(component.stop).toEqual(true);
    expect(component.clickNumber).toBeGreaterThan(0);
    expect(component.disableItemsList).toEqual(true);

    component.resetWheelRotation();

    expect(component.stop).toEqual(false);
    expect(component.clickNumber).toEqual(0);
    expect(component.disableItemsList).toEqual(false);
  });

  it('#clickToRotate should start wheel rotation', () => {
    component.spinner.initialize('wheel', [item, item]);
    expect(component.disableItemsList).toBeUndefined();
    expect(component.stop).toEqual(false);
    expect(component.clickNumber).toEqual(0);

    component.clickToRotate();

    expect(component.disableItemsList).toEqual(true);
    expect(component.stop).toEqual(true);
    expect(component.clickNumber).toBeGreaterThan(0);
  });
});
