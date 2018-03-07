import {Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpService} from '../../http.service';
import {DataService} from '../../data.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-add-form',
  templateUrl: './add-form.component.html',
  styleUrls: ['./add-form.component.scss']
})
export class AddFormComponent implements OnInit, OnChanges {

  @ViewChild('image')
  private elImage: ElementRef;

  @ViewChild('imageCont')
  private elImageCont: ElementRef;

  @Input() member;
  @Output() modifyItem: EventEmitter<any> = new EventEmitter();
  @Output() addItem: EventEmitter<any> = new EventEmitter();

  limitMaxItems = 15;
  exceedLimit = false;
  items = [];
  addForm: FormGroup;
  loadImage: any = {};
  subscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpService,
    private data: DataService) { }

  ngOnInit() {
    this.subscription = this.data.spinnerItems.subscribe(items => this.items = items);
    this.initForm();
  }

  ngOnChanges() {
    if (this.member) {
      this.loadImage.name = this.member.image;
      this.setImage('image-cont', `../../assets/${this.member.image}`);
      this.addForm.get('title').setValue(this.member.name);
      this.addForm.get('color').setValue(this.member.color);
    }
  }

  initForm(): void {
    this.addForm = this.formBuilder.group({
      title: ['', {
        validators: [Validators.required, this.validateForm()]
      }],
      color: [''],
      image: ['']
    });
  }

  validateForm() {
    return(): {[key: string]: any} => {
      if (!this.member && this.items) {
        if (this.items.length >= this.limitMaxItems) {
          return {invalid: true};
        }
      }
      return null;
    };
  }

  submit(): void {
    console.log(this.addForm);
    if (this.addForm.invalid) {
      return this.addForm.get('title').markAsTouched({onlySelf: true});
    }
    this.sendFileToServer();
    if (this.member) {
      const form = this.setForm(this.member._id);
      this.modifySpinnerItem(form);
    } else {
        const form = this.setForm(this.data.getSpinnerId());
        this.addSpinnerItems(form);
    }
  }

  modifySpinnerItem(spinnerItem: FormGroup): void {
    this.http.postData('/modifyItem', spinnerItem).subscribe((res: any) => {
      this.modifyItem.emit(res);
      this.resetAddForm();
      }, () => this.data.announceError(false));
  }

  addSpinnerItems(spinnerItem: FormGroup): void {
    this.http.postData('/addItems', spinnerItem).subscribe((res: any) => {
      this.addItem.emit(res);
      this.resetAddForm();
    }, () => this.data.announceError(false));
  }

  resetAddForm() {
    this.addForm.reset('');
    this.loadImage = {};
    this.setImage('image-cont', `../../assets/${this.data.DEFAULTIMAGE}`);
  }

  setForm(id): FormGroup {
    const form = this.addForm.value;
    form.image = this.loadImage.name;
    if (!this.loadImage.name) {
      form.image = this.data.DEFAULTIMAGE;
    }
    form.id = id;
    return form;
  }

  chooseImg(): void {
    this.elImage.nativeElement.click();
  }

  getImage(event): void {
    this.loadImage = event.target.files[0];
    this.previewImage(event);
  }

  setImage(id, srcURL): void {
    this.elImageCont.nativeElement.setAttribute('src', srcURL);
  }

  sendFileToServer(): void {
    const formData: any = new FormData();
    const file = this.loadImage;
    formData.append('file', file);
    this.http.postData('/uploads', formData).subscribe();
  }

  previewImage(event) {
    const files = event.target.files[0];
    if (!files.type.match('image.*')) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (File => {
      return e =>  this.setImage('image-cont', e.target.result);
    })(files);
    reader.readAsDataURL(files);
  }
}
