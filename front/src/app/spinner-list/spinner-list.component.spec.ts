import {async, ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';

import { SpinnerListComponent } from './spinner-list.component';
import {AppMaterialModule} from '../app-material.module';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpService} from '../http.service';
import {HttpClientModule} from '@angular/common/http';
import {DataService} from '../data.service';
import {RouterTestingModule} from '@angular/router/testing';
import {Router} from '@angular/router';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

describe('SpinnerListComponent', () => {

  let component: SpinnerListComponent;
  let fixture: ComponentFixture<SpinnerListComponent>;
  let router;
  let httpService;
  let dataService;
  let httpMock: HttpTestingController;
  const item = {name: '1', _id: '1', image: 'no-image.jpg', color: '#000000', statistics: 3};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SpinnerListComponent
      ],
      imports: [
        AppMaterialModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        HttpService,
        DataService
      ]
    })
    .compileComponents();
    router = TestBed.get(Router);
    dataService = TestBed.get(DataService);
    httpService = TestBed.get(HttpService);
    httpMock = TestBed.get(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpinnerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#hideAuthForm should change isAuthForm to true', () => {
    expect(component.isAuthForm).toBeTruthy();
    component.showAuthForm();
    expect(component.isAuthForm).toBeFalsy();
    component.hideAuthForm();
    expect(component.isAuthForm).toBeTruthy();
  });

  it('#showAuthForm should change isAuthForm to false', () => {
    expect(component.isAuthForm).toBeTruthy();
    component.showAuthForm();
    expect(component.isAuthForm).toBeFalsy();
  });

  it('#closeAuth should reset authForm', () => {
    component.authForm.get('authPassword').setValue('12345');
    expect(component.authForm.get('authPassword').value).toBe('12345');
    component.closeAuth();
    expect(component.authForm.get('authPassword').value).toBe(null);
  });

  it('#checkDeleteSpinnerIsCurrentSpinner should navigate to / if deleteItem id equals current url', () => {
    dataService.setSpinnerId('1');
    const spy = spyOn(router, 'navigateByUrl');
    component.checkDeleteSpinnerIsCurrentSpinner(item);

    const url = spy.calls.first().args[0];
    expect(url).toEqual('/');
  });

  it('#resetForm should reset addSpinnerForm', () => {
    component.addSpinnerForm.get('spinnerName').setValue('first');
    component.addSpinnerForm.get('password').get('spinnerPassword').setValue('12345');
    expect(component.addSpinnerForm.get('spinnerName').value).toBe('first');
    expect(component.addSpinnerForm.get('password').get('spinnerPassword').value).toBe('12345');
    component.resetForm();
    expect(component.addSpinnerForm.get('spinnerName').value).toBe('');
    expect(component.addSpinnerForm.get('password').get('spinnerPassword').value).toBe('');
  });

  it('#markAsTouch should mark addSpinnerForm', () => {
    component.addSpinnerForm.get('spinnerName').setValue('123');
    component.markAsTouch();
    expect(component.addSpinnerForm.invalid).toBeFalsy();
    component.addSpinnerForm.get('spinnerName').setValue('');
    component.markAsTouch();
    expect(component.addSpinnerForm.invalid).toBeTruthy();
  });

  it('#clickShowPassword should change isSpinnerPassword', () => {
    expect(component.isSpinnerPassword).toEqual(true);
    component.clickShowPassword();
    expect(component.isSpinnerPassword).toEqual(false);
    expect(component.elCheckboxPass.nativeElement.checked).toEqual(true);
    expect(component.addSpinnerForm.get('password').get('spinnerPassword').value).toEqual('');

    component.clickShowPassword();
    expect(component.isSpinnerPassword).toEqual(true);
    expect(component.elCheckboxPass.nativeElement.checked).toEqual(false);
    expect(component.addSpinnerForm.get('password').get('spinnerPassword').value).toEqual('');
  });


  it('initialize addSpinnerForm on ngOnInit', () => {
      expect(component.addSpinnerForm).not.toBeUndefined();
  });

  it('addSpinnerForm validation', () => {
      expect(component.addSpinnerForm.valid).toBeFalsy();
      component.addSpinnerForm.get('spinnerName').setValue('123');
      expect(component.addSpinnerForm.valid).toBeTruthy();
      component.addSpinnerForm.get('password').get('isShowPass').setValue(true);
      expect(component.addSpinnerForm.valid).toBeFalsy();
      component.addSpinnerForm.get('password').get('spinnerPassword').setValue('1234');
      expect(component.addSpinnerForm.valid).toBeFalsy();
      component.addSpinnerForm.get('password').get('spinnerPassword').setValue('12345');
      expect(component.addSpinnerForm.valid).toBeTruthy();
  });

  it('submit addSpinnerForm', async(() => {
    let spinnersLength = component.spinners.length;
    component.addSpinnerForm.get('spinnerName').setValue('123');

    component.submit();
    const req = httpMock.expectOne('http://localhost:3000/addSpinner');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({spinnerName: '123', password: {isShowPass: false, spinnerPassword: ''}});

    req.flush({_id: '1', name: '123', password: {isShowPass: false}});
    expect(component.spinners.length).toBeGreaterThan(spinnersLength);
    async(() => expect(component.spinnerID).not.toBeUndefined());
    expect(component.addSpinnerForm.controls['spinnerName'].value).toBe('');

    spinnersLength = component.spinners.length;
    component.addSpinnerForm.get('spinnerName').setValue('123');
    component.addSpinnerForm.get('password').get('isShowPass').setValue(true);
    component.addSpinnerForm.get('password').get('spinnerPassword').setValue('12345');

    component.submit();
    const req1 = httpMock.expectOne('http://localhost:3000/addSpinner');
    expect(req1.request.method).toBe('POST');
    expect(req1.request.body).toEqual({spinnerName: '123', password: {isShowPass: true, spinnerPassword: '12345'}});

    req1.flush({_id: '1', name: '123', password: {isShowPass: true}});
    expect(component.spinners.length).toBeGreaterThan(spinnersLength);
    async(() => expect(component.spinnerID).not.toBeUndefined());
    expect(component.addSpinnerForm.controls['spinnerName'].value).toBe('');
  }));

});
