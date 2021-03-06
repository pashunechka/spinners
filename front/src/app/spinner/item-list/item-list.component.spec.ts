import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemListComponent } from './item-list.component';
import {AppMaterialModule} from '../../app-material.module';
import {DataService} from '../../data.service';
import {HttpService} from '../../http.service';
import {HttpClientModule} from '@angular/common/http';
import {AddFormComponent} from '../add-form/add-form.component';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';

describe('ItemListComponent', () => {
  let component: ItemListComponent;
  let fixture: ComponentFixture<ItemListComponent>;
  const items = [];
  const member = {name: '1', _id: '1', image: 'no-image.jpg', color: '#000000', statistics: 3, spinnerId: '1'};
  let dataService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ItemListComponent,
        AddFormComponent
      ],
      imports: [
        AppMaterialModule,
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientModule
      ],
      providers: [
        DataService,
        HttpService
      ]
    })
    .compileComponents();
    dataService = TestBed.get(DataService);
    for (let i = 0; i < 5; i++) {
      items.push({name: `${i}`, _id: '1', image: 'no-image.jpg', color: '#000000', statistics: 3});
    }
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#setIsDelete should set isDelete', () => {
    expect(component.isDelete).toBeFalsy();
    component.setIsDelete(true);
    expect(component.isDelete).toBeTruthy();
    component.setIsDelete(false);
    expect(component.isDelete).toBeFalsy();
  });

  it('#showDeletePopUp should set deletedItem: SpinnerItem', () => {
    expect(component.deletedItem).toBeUndefined();
    component.showDeletePopUp(member);
    expect(component.deletedItem).toEqual(member);
  });

  it('#resetMember should set member to undefined', () => {
    component.member = member;
    expect(component.member).toEqual(member);
    component.resetMember();
    expect(component.member).toBeUndefined();
  });

  it('#addItemToItems should push item to items', () => {
    expect(component.items.length).toEqual(0);
    component.addItemToItems(member);
    expect(component.items.length).toEqual(1);
  });

  it('#deleteItem should remove item from DB', () => {
    component.deleteItem();
    expect(component.isDelete).toEqual(false);
  });

  it('#isAllChecked should toggle checkAll', () => {
    component.isAllChecked();
    expect(component.elCheckAllInp.checked).toBeTruthy();

    component.items = items;
    component.elItemsList.selectAll();
    component.isAllChecked();
    expect(component.elCheckAllInp.checked).toBeFalsy();
  });

});
