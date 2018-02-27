import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpService} from '../../http.service';
import {DataService} from '../../data.service';

@Component({
  selector: 'app-add-form',
  templateUrl: './add-form.component.html',
  styleUrls: ['./add-form.component.scss']
})
export class AddFormComponent implements OnInit {

  @ViewChild('image')
  private elImage: ElementRef;

  @ViewChild('imageCont')
  private elImageCont: ElementRef;

  @Input() member;
  @Output() modifyItem: EventEmitter<any> = new EventEmitter();

  limitMaxItems = 15;
  exceedLimit = false;
  items;
  addForm: FormGroup;
  isShow = false;
  loadImage: any = {};
  subscription;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpService,
    private data: DataService) { }

  ngOnInit() {
    this.member ? this.loadImage.name = this.member.image : this.loadImage.name = '';
    this.subscription = this.data.spinnerItems.subscribe(items => this.items = items);
    this.initForm();
  }

  initForm() {
    this.addForm = this.formBuilder.group({
      title: [this.member ? this.member.name : '' , Validators.required],
      image: ['']
    });
  }

  submit() {
    if (this.addForm.invalid) {
      return this.addForm.get('title').markAsTouched({onlySelf: true});
    }
    this.sendFileToServer();
    if (this.member) {
      const form = this.setForm(this.member._id);
      this.modifySpinnerItem(form);
    } else {
      if (this.items.length >= this.limitMaxItems) {
        return this.exceedLimit = true;
      }
      const form = this.setForm(this.data.getSpinnerId());
      this.addSpinnerItems(form);
    }
  }

  modifySpinnerItem(spinnerItem) {
    this.http.postData('/modifyItem', spinnerItem).subscribe((res: any) => this.modifyItem.emit(res),
      () => this.data.announceError(false));
  }

  addSpinnerItems(spinnerItem): void {
    this.http.postData('/addItems', spinnerItem).subscribe((res: any) => {
      this.items.push(res);
      this.data.announceAddItem(this.items);
      this.addForm.reset();
      this.loadImage = {};
      this.setImage('image-cont', `../../assets/${this.data.DEFAULTIMAGE}`);
    }, () => this.data.announceError(false));
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

  toggleIsShow(event): void {
    this.isShow = !this.isShow;
    event.target.style.borderBottom = '2px solid #31bbb5';
    this.addForm.reset();
    this.loadImage = {};
    if (this.isShow) {
      event.target.style.borderBottom = 0;
    }
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
