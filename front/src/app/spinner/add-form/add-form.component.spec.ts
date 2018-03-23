import {async, ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';

import { AddFormComponent } from './add-form.component';
import {AppMaterialModule} from '../../app-material.module';
import {ReactiveFormsModule} from '@angular/forms';
import {DataService} from '../../data.service';
import {HttpClientModule} from '@angular/common/http';
import {HttpService} from '../../http.service';


describe('AddFormComponent', () => {
  let component: AddFormComponent;
  let fixture: ComponentFixture<AddFormComponent>;
  const items = [];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFormComponent ],
      imports: [
        AppMaterialModule,
        ReactiveFormsModule,
        HttpClientModule
      ],
      providers: [
        HttpService,
        DataService,
      ]
    })
    .compileComponents();

    for (let i = 0; i < 5; i++) {
      items.push({name: `${i}`, _id: '1', image: 'no-image.jpg', color: '#000000', statistics: 3});
    }
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init form after Angular calls ngOnInit', () => {
    expect(component.addForm).toBeTruthy();
  });

  it('#checkFormValidation should return boolean', () => {
    expect(component.checkFormValidation()).toBe(false);
    component.addForm.controls['title'].setValue('123245');
    expect(component.checkFormValidation()).toBe(true);
    component.addForm.reset();
    expect(component.checkFormValidation()).toBe(false);
  });

  it('#setForm should return object', () => {
    const color = '#000000';
    const id = 'string value';
    const form = { title: '', color: color, image: 'no-image.svg', id: id};
    component.addForm.get('color').setValue(color);
    expect(component.setForm(id)).toEqual(form);
  });

  it('#setImage should set image attribute src', () => {
    const image = fixture.nativeElement.querySelector('#imageCont');
    expect(image.getAttribute('src')).toBe('/assets/no-image.svg');
    component.setImage('/url');
    expect(image.getAttribute('src')).toBe('/url');
  });

  it('#resetAddForm should reset form and loadImage', () => {
        component.loadImage = {id: 'value'};
        component.addForm.get('title').setValue('name');
        expect(component.loadImage.id).toBe( 'value');
        expect(component.addForm.get('title').value).toBe('name');
        component.resetAddForm();
        expect(Object.keys(component.loadImage).length).toBe(0);
        expect(component.addForm.get('title').value).toBeNull();
  });

});
