import { Component, OnInit } from '@angular/core';
import {HttpService} from '../http.service';
import {FormBuilder, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {DataService} from '../data.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-spinner-list',
  templateUrl: './spinner-list.component.html',
  styleUrls: ['./spinner-list.component.scss']
})

export class SpinnerListComponent implements OnInit {

  addSpinnerForm: FormGroup;
  authForm: FormGroup;
  isSpinnersFormShow = false;
  isSpinnerPassword = true;
  isAuthForm = true;
  invalidPassword = false;
  smallPassword = false;

  spinners = [];
  checkedSpinner;

  constructor(
    private http: HttpService,
    private formBuilder: FormBuilder,
    private data: DataService,
    private router: Router) { }

  ngOnInit() {
    this.initForm();
    this.initAuthForm();
    this.http.getData('/getSpinners').subscribe((res: any) => this.spinners = res);
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
    this.checkedSpinner = spinner;
    this.closeAuth();
    document.getElementById('authForm').style.top = document.getElementById('cont').offsetHeight + 60 + 'px';
    if (!spinner.password.private) {
      return  this.getSpinner().subscribe((res: any) => {
        sessionStorage.setItem('key', '');
        this.router.navigateByUrl(`/${this.checkedSpinner._id}`);
        console.log(res);
        this.data.SpinnerItems(res);
      });
    }
    this.isAuthForm = false;
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

  sendAuth() {
    this.smallPassword = true;
    if (this.authForm.valid) {
      sessionStorage.setItem('key', this.authForm.value.authPassword);
      this.getSpinner().subscribe((res: any) => {
        this.router.navigateByUrl(`/${this.checkedSpinner._id}`);
        this.data.SpinnerItems(res);
        this.isAuthForm = true;
      }, () => this.invalidPassword = true);
    }
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

  getSpinner() {
    return  this.http.postData('/getSpinner', {auth: sessionStorage.getItem('key'), spinner: this.checkedSpinner});
  }

  hideErr() {
    this.smallPassword = false;
    this.invalidPassword = false;
  }

}
