import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpService} from '../http.service';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, ValidatorFn, Validators} from '@angular/forms';
import {DataService} from '../data.service';
import {Router} from '@angular/router';
import { map } from 'rxjs/operators';
import {ErrorStateMatcher} from '@angular/material';
import {Observable} from 'rxjs/Observable';
import Timer = NodeJS.Timer;
import {Spinner} from '../spinner';
import {SpinnerItem} from '../spinnerItem';

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
  warnColor = 'warn';

  @ViewChild('elAuthForm')
  private elAuthForm: ElementRef;

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
  interval: Timer;
  hidePass = true;
  hideAuth = true;
  spinnerID: string;
  isDelete = false;
  isSpinnerPassword = true;
  isAuthForm = true;

  confirmValidParentMatcher = new ConfirmValidParentMatcher();
  spinners: Array<Spinner> = [];

  constructor(
    private http: HttpService,
    private formBuilder: FormBuilder,
    private data: DataService,
    private router: Router) { }

  ngOnInit() {
    this.http.getData('/getSpinners').subscribe((res: Array<Spinner>) => {
      this.spinners = res;
      this.router.navigateByUrl(`/${res[0]._id}`).then();
    });
    this.data.authorizationError.subscribe(() => this.initAuthorizationError());
    this.initForm();
    this.initAuthForm();
  }

  initAuthorizationError(): void {
    this.spinnerID = this.data.getSpinnerId();
    this.isAuthForm = false;
  }

  initForm(): void {
    this.addSpinnerForm = this.formBuilder.group({
      spinnerName: ['', Validators.required],
      password: this.formBuilder.group({
        isShowPass: false,
        spinnerPassword: ['']
      }, {validator:  this.validatePassword()})
    });
  }

  initAuthForm(): void {
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

  validateAuth(): Observable<object | null> {
    return this.http.postData('/checkAuth', {id: this.spinnerID, auth: this.authForm.get('authPassword').value})
      .pipe(map((res: null | boolean) => {
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
      });
    }
  }

  showSpinner(spinner: Spinner): void  {
    this.spinnerID = spinner._id;
    this.closeAuth();
    if (!spinner.password.private) {
      this.data.setSpinnerId(this.spinnerID);
      this.http.getItems(this.data.getSpinnerId())
        .subscribe((res: Array<SpinnerItem>) => this.showSpinnerItems(res, this.data.getSpinnerId()));
    } else {
      this.showAuthForm();
    }
  }

  sendAuth(): void {
    this.interval = setInterval(() => {
      if (this.authForm.valid) {
        this.isDelete ?
          this.deleteSpinnerById({_id: this.spinnerID, authPassword: this.authForm.get('authPassword').value}) :
          this.getPrivateSpinnerItems();
        clearInterval(this.interval);
      }
    }, 200);
  }

  deleteSpinnerById(deletedSpinner: {_id: string, authPassword: string}): void {
    this.http.postData('/deleteSpinner', deletedSpinner).subscribe(() => {
      this.spinners.forEach(spinner => {
        if (spinner._id === deletedSpinner._id) {
          this.spinners.splice(this.spinners.indexOf(spinner), 1);
          if (this.data.getSpinnerId() === deletedSpinner._id) {
            this.http.getItems(this.spinners[0]._id)
              .subscribe((res: Array<SpinnerItem>) => this.showSpinnerItems(res, this.spinners[0]._id));
          }
        }
      });
      this.isDelete = false;
      this.closeAuth();
    });
  }

  deleteSpinner(deletedSpinner): void {
    if (!deletedSpinner.password.private) {
      this.deleteSpinnerById(deletedSpinner);
    } else {
      this.isDelete = true;
      this.showAuthForm();
    }
  }

  getPrivateSpinnerItems(): void {
    this.http.getItems(this.spinnerID, this.authForm.get('authPassword').value).subscribe((res: Array<SpinnerItem>) => {
      this.data.setSpinnerId(this.spinnerID);
      this.showSpinnerItems(res, this.data.getSpinnerId());
      this.closeAuth();
    });
  }

  showSpinnerItems(data: Array<SpinnerItem>, navURL: string): void {
    this.data.announceSpinnerItems(data);
    this.router.navigateByUrl(`/${navURL}`).then();
  }

  clickShowPassword(): void {
    this.elCheckboxPass.nativeElement.click();
    this.isSpinnerPassword = !this.isSpinnerPassword;
    this.addSpinnerForm.get('password').get('spinnerPassword').reset('');
  }

  markAsTouch(): void {
    if (this.addSpinnerForm.invalid) {
      this.addSpinnerForm.get('spinnerName').markAsTouched({onlySelf: true});
      this.addSpinnerForm.controls['password'].get('spinnerPassword').markAsTouched({onlySelf: true});
    }
  }

  resetForm(): void {
    this.isSpinnerPassword = true;
    this.addSpinnerForm.reset();
    this.addSpinnerForm.get('spinnerName').reset('');
    this.addSpinnerForm.get('password').get('isShowPass').reset(false);
    this.addSpinnerForm.get('password').get('spinnerPassword').reset('');
    this.elcheckBox.checked = false;
  }

  closeAuth(): void {
    this.hideAuthForm();
    this.authForm.reset('');
  }

  showAuthForm() {
    this.isAuthForm = false;
  }

  hideAuthForm() {
    this.isAuthForm = true;
  }

}
