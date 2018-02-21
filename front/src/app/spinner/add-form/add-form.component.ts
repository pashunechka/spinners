import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {HttpService} from '../../http.service';
import {DataService} from '../../data.service';

@Component({
  selector: 'app-add-form',
  templateUrl: './add-form.component.html',
  styleUrls: ['./add-form.component.scss']
})
export class AddFormComponent implements OnInit {

  DEFAULTIMAGE = 'no-image.svg';
  items;
  addForm: FormGroup;
  isShow = false;
  image: any = {};
  subscription;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpService,
    private data: DataService) { }

  ngOnInit() {
    this.subscription = this.data.spinnerItems.subscribe(items => this.items = items);
    this.initForm();
  }

  initForm() {
    this.addForm = this.formBuilder.group({
      title: ['', Validators.required],
      image: ['']
    });
  }

  submit(): void {
    if (this.addForm.invalid) {
      return this.addForm.get('title').markAsTouched({onlySelf: true});
    }
    const form = this.setForm();
    this.sendFileToServer();
    this.addSpinnerItems(form);
  }

  addSpinnerItems(spinnerItem): void {
    this.http.postData('/addItems', spinnerItem).subscribe((res: any) => {
      this.items.push(res);
      this.data.announceAddItem(this.items);
      this.addForm.reset();
      this.image = {};
      this.setImage('image-cont', `../../assets/${this.DEFAULTIMAGE}`);
    });
  }

  setForm(): FormGroup {
    const form = this.addForm.value;
    form.image = this.image.name;
    if (!this.image.name) {
      form.image = this.DEFAULTIMAGE;
    }
    form.id = this.data.getSpinnerId();
    return form;
  }

  toggleIsShow(event): void {
    this.isShow = !this.isShow;
    event.target.style.borderBottom = '2px solid #31bbb5';
    this.addForm.reset();
    this.image = {};
    if (this.isShow) {
      event.target.style.borderBottom = 0;
    }
  }

  chooseImg(): void {
    document.getElementById('image').click();
  }

  getImage(event): void {
    this.image = event.target.files[0];
    this.previewImage(event);
  }

  setImage(id, srcURL): void {
    document.getElementById(id).setAttribute('src', srcURL);
  }

  sendFileToServer(): void {
    const formData: any = new FormData();
    const file = this.image;
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
