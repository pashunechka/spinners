import { Component, OnInit } from '@angular/core';
import {HttpService} from '../http.service';
import {FormBuilder, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {DataService} from '../data.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-spinner-list',
  templateUrl: './spinner-list.component.html',
  styleUrls: ['./spinner-list.component.scss']
})

export class SpinnerListComponent implements OnInit {

  addSpinnerForm: FormGroup;
  authForm: FormGroup;

  spinnerID: string;
  isSpinnersFormShow = false;
  isSpinnerPassword = true;
  isAuthForm = true;
  invalidPassword = false;
  smallPassword = false;

  spinners = [];

  constructor(
    private http: HttpService,
    private formBuilder: FormBuilder,
    private data: DataService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(param => {
      this.data.setSpinnerId(param.id);
      if (this.data.getSpinnerId()) {
        this.getItems(this.data.getSpinnerId()).subscribe((result) => this.data.announceSpinnerItems(result));
      }
    });
    this.http.getData('/getSpinners').subscribe((res: any) => this.spinners = res);
    this.initForm();
    this.initAuthForm();
  }

  initForm() {
    this.addSpinnerForm = this.formBuilder.group({
      spinnerName: ['', Validators.required],
      password: this.formBuilder.group({
        isShowPass: false,
        spinnerPassword: ['']
      }, {validator: this.validatePassword()})
    });
  }

  initAuthForm() {
    this.authForm = this.formBuilder.group({
      authPassword: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  validatePassword(): ValidatorFn {
    return(control: FormGroup): {[key: string]: any} => {
      if (control.get('isShowPass').value && control.get('spinnerPassword').value.length < 5) {
        return {invalidPassword: 'The password must be longer than 5 characters'};
      }
      return null;
    };
  }

  submit(): void {
    this.markAsTouch();
    if (this.addSpinnerForm.valid) {
      this.http.postData('/addSpinner', this.addSpinnerForm.value).subscribe((res: any) => {
        this.spinners.push(res);
        this.resetForm();
      });
    }
  }

  showSpinner(spinner) {
    this.spinnerID = spinner._id;
    this.closeAuth();
    if (!spinner.password.private) {
      this.data.setSpinnerId(this.spinnerID);
      return  this.getItems(this.data.getSpinnerId()).subscribe((res: any) => this.showSpinnerItems(res));
    }
    this.setAuthFormPosition();
    this.isAuthForm = false;
  }

  sendAuth() {
   this.smallPassword = true;
    if (this.authForm.valid) {
      this.getItems(this.spinnerID, this.authForm.get('authPassword').value).subscribe((res: any) => {
        this.data.setSpinnerId(this.spinnerID);
        this.showSpinnerItems(res);
        this.isAuthForm = true;
      }, () => this.invalidPassword = true);
    }
  }

  showSpinnerItems(data) {
    this.data.announceSpinnerItems(data);
    this.router.navigateByUrl(`/${this.data.getSpinnerId()}`);
  }

  getItems(id, auth?) {
    const sendData = {id: id, auth: auth};
    return  this.http.postData('/getItems',  sendData);
  }

  setAuthFormPosition() {
    document.getElementById('authForm').style.top = document.getElementById('cont').offsetHeight + 60 + 'px';
  }

  clickShowPassword(event) {
    if (this.isSpinnerPassword) {
      event.target.setAttribute('class', 'fa fa fa-check-square-o');
    } else {
      event.target.setAttribute('class', 'fa fa fa-square-o');
    }
    this.addSpinnerForm.get('password').get('spinnerPassword').reset('');
    document.getElementById('checkbox-pass').click();
    this.isSpinnerPassword = !this.isSpinnerPassword;
  }

  showSpinnersForm() {
    this.isSpinnersFormShow = !this.isSpinnersFormShow;
    if (this.isSpinnersFormShow) {
      document.getElementById('show-spinners').innerText = 'Hide';
      return document.getElementById('spinners-form-dissable').setAttribute('id', 'spinners-form-active');
    }
    document.getElementById('show-spinners').innerText = 'Show';
    document.getElementById('spinners-form-active').setAttribute('id', 'spinners-form-dissable');
    this.resetForm();
  }

  markAsTouch() {
    if (this.addSpinnerForm.invalid) {
      this.addSpinnerForm.get('spinnerName').markAsTouched({onlySelf: true});
      this.addSpinnerForm.controls['password'].get('spinnerPassword').markAsTouched({onlySelf: true});
    }
  }

  resetForm() {
    document.getElementById('fake-clickShow').setAttribute('class', 'fa fa fa-square-o');
    this.isSpinnerPassword = true;
    this.addSpinnerForm.reset();
    this.addSpinnerForm.get('password').get('isShowPass').reset(false);
    this.addSpinnerForm.get('password').get('spinnerPassword').reset('');
  }

  closeAuth() {
    this.isAuthForm = true;
    this.authForm.reset();
    this.hideErr();
  }

  hideErr() {
    this.smallPassword = false;
    this.invalidPassword = false;
  }

}
