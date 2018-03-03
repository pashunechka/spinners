import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpService} from '../http.service';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, ValidatorFn, Validators} from '@angular/forms';
import {DataService} from '../data.service';
import {ActivatedRoute, Router} from '@angular/router';
import { map } from 'rxjs/operators';
import {ErrorStateMatcher} from '@angular/material';

export class ConfirmValidParentMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return control.parent.invalid && control.touched;
  }
}


@Component({
  selector: 'app-spinner-list',
  templateUrl: './spinner-list.component.html',
  styleUrls: ['./spinner-list.component.scss']
})

export class SpinnerListComponent implements OnInit {

  color = 'primary';

  @ViewChild('elAuthForm')
  private elAuthForm: ElementRef;
  @ViewChild('drawer')
  private elDrawer;

  @ViewChild('cont')
  private elCont: ElementRef;

  @ViewChild('checkboxPass')
  private elCheckboxPass: ElementRef;

  @ViewChild('checkBox')
  private elcheckBox;

  @ViewChild('spinnersForm')
  private elSpinnersForm: ElementRef;

  addSpinnerForm: FormGroup;
  authForm: FormGroup;
  interval;
  hidepass = true;
  hideauth = true;
  spinnerID: string;
  isSpinnerPassword = true;
  isAuthForm = true;
  invalidPassword = false;

  confirmValidParentMatcher = new ConfirmValidParentMatcher();

  spinners = [];

  constructor(
    private http: HttpService,
    private formBuilder: FormBuilder,
    private data: DataService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.data.setSpinnerId(this.route.snapshot.paramMap.get('id'));
    this.http.getData('/getSpinners').subscribe((res: any) => {
      this.spinners = res;
      if (this.data.getSpinnerId()) {
        this.getItems(this.data.getSpinnerId())
          .subscribe((result) => this.data.announceSpinnerItems(result), () => this.initAuthorizationError());
      }
    });
    this.data.authorizationError.subscribe(() => this.initAuthorizationError());
    this.initForm();
    this.initAuthForm();
  }

  initAuthorizationError() {
    this.spinnerID = this.data.getSpinnerId();
    this.isAuthForm = false;
    this.invalidPassword = true;
  }

  initForm() {
    this.addSpinnerForm = this.formBuilder.group({
      spinnerName: ['', Validators.required],
      password: this.formBuilder.group({
        isShowPass: false,
        spinnerPassword: ['']
      }, {validator:  this.validatePassword()})
    });
  }

  initAuthForm() {
    this.authForm = this.formBuilder.group({
      authPassword: ['', {
        updateOn: 'submit',
        validators: [Validators.required, Validators.minLength(5)]
      }]
    });
    this.authForm.controls['authPassword'].setAsyncValidators(this.validateAuth.bind(this));
  }

  validatePassword(): ValidatorFn {
    return(control: FormGroup): {[key: string]: any} => {
      if (control.get('isShowPass').value && control.get('spinnerPassword').value.length < 5 ) {
        return {invalid: true};
      }
      return null;
    };
  }

  validateAuth() {
    return this.http.postData('/checkAuth', {id: this.spinnerID, auth: this.authForm.get('authPassword').value})
      .pipe(map(res => {
      return  res ? null : {invalid: true};
    }));
  }

  submit(): void {
    this.markAsTouch();
    if (this.addSpinnerForm.valid) {
      this.http.postData('/addSpinner', this.addSpinnerForm.value).subscribe((res: any) => {
        this.spinners.push(res);
        this.showSpinner(res);
        this.resetForm();
        this.elDrawer.close();
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
    this.isAuthForm = false;
  }

  sendAuth() {
    this.interval = setInterval(() => {
      if (this.authForm.valid) {
        this.getItems(this.spinnerID, this.authForm.get('authPassword').value).subscribe((res: any) => {
          this.data.setSpinnerId(this.spinnerID);
          this.showSpinnerItems(res);
          this.isAuthForm = true;
          clearInterval(this.interval);
        });
      }
    }, 200);
  }

  showSpinnerItems(data) {
    this.data.announceSpinnerItems(data);
    this.router.navigateByUrl(`/${this.data.getSpinnerId()}`);
  }

  getItems(id, auth?) {
    const sendData = {id: id, auth: auth};
    if (!auth) { sendData.auth = ' '; }
    return  this.http.postData('/getItems',  sendData);
  }

  clickShowPassword() {
    this.elCheckboxPass.nativeElement.click();
    this.isSpinnerPassword = !this.isSpinnerPassword;
    this.addSpinnerForm.get('password').get('spinnerPassword').reset('');
  }

  markAsTouch() {
    if (this.addSpinnerForm.invalid) {
      this.addSpinnerForm.get('spinnerName').markAsTouched({onlySelf: true});
      this.addSpinnerForm.controls['password'].get('spinnerPassword').markAsTouched({onlySelf: true});
    }
  }

  resetForm() {
    this.isSpinnerPassword = true;
    this.addSpinnerForm.reset();
    this.addSpinnerForm.get('spinnerName').reset('');
    this.addSpinnerForm.get('password').get('isShowPass').reset(false);
    this.elcheckBox.checked = false;
    this.addSpinnerForm.get('password').get('spinnerPassword').reset('');
  }

  closeAuth() {
    this.isAuthForm = true;
    this.authForm.reset();
    this.hideErr();
  }

  hideErr() {
    this.invalidPassword = false;
  }

}
