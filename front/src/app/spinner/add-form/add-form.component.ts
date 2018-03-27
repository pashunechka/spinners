import {Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpService} from '../../http.service';
import {DataService} from '../../data.service';
import {Subscription} from 'rxjs/Subscription';
import {SpinnerItem} from '../../spinnerItem';

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
  @Output() modifyItem: EventEmitter<SpinnerItem> = new EventEmitter();
  @Output() addItem: EventEmitter<SpinnerItem> = new EventEmitter();

  limitMaxItems = 15;
  items: Array<SpinnerItem> = [];
  addForm: FormGroup;
  loadImage: any = {};
  subscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpService,
    private data: DataService) { }

  ngOnInit() {
    this.subscription = this.data.spinnerItems
      .subscribe(items => this.items = items);
    this.initForm();
  }

  ngOnChanges() {
    if (this.member) {
      this.loadImage.name = this.member.image;
      this.setImage(`/assets/${this.member.image}`);
      this.addForm.get('title').setValue(this.member.name);
      this.addForm.get('color').setValue(this.member.color);
    }
  }

  initForm(): void {
    this.addForm = this.formBuilder.group({
      title: ['', {validators: [Validators.required, this.validateForm()]}],
      color: ['#ffffff'],
      image: ['']
    });
  }

  validateForm(): null | object {
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
    if (this.checkFormValidation()) {
      this.sendFileToServer();
      this.member ? this.modifySpinnerItem(this.setForm(this.member._id)) :
        this.addSpinnerItems(this.setForm(this.data.getSpinnerId()));
    }
  }

  checkFormValidation(): boolean {
    if (this.addForm.invalid) {
      this.addForm.get('title').markAsTouched({onlySelf: true});
      return false;
    }
    return true;
  }

  modifySpinnerItem(spinnerItem: SpinnerItem): void {
    this.http.modifyItem(spinnerItem).subscribe((res: SpinnerItem) => {
      this.modifyItem.emit(res);
      this.resetAddForm();
      }, () => this.data.announceError(false));
  }

  addSpinnerItems(spinnerItem: SpinnerItem): void {
    this.http.addItems(spinnerItem).subscribe((res: SpinnerItem) => {
      this.addItem.emit(res);
      this.resetAddForm();
    }, () => this.data.announceError(false));
  }

  resetAddForm(): void {
    this.addForm.reset();
    this.loadImage = {};
    this.setImage(`/assets/${this.data.DEFAULTIMAGE}`);
  }

  setForm(id: string) {
    const form = this.addForm.value;
    this.loadImage.name ?  form.image = this.loadImage.name : form.image = this.data.DEFAULTIMAGE;
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

  setImage(srcURL: string): void {
    this.elImageCont.nativeElement.setAttribute('src', srcURL);
  }

  sendFileToServer(): void {
    const formData: any = new FormData();
    const file = this.loadImage;
    formData.append('file', file);
    this.http.uploadImage(formData).subscribe();
  }

  previewImage(event): void {
    const files = event.target.files[0];
    const reader = new FileReader();
    if (!files.type.match('image.*')) { return; }
    reader.onload = (File => {
      return e =>  this.setImage(e.target.result);
    })(files);
    reader.readAsDataURL(files);
  }
}
