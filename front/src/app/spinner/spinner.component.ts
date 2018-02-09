import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpService} from "../http.service";
import {ActivatedRoute} from "@angular/router";
import {DataService} from "../data.service";

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {

  MILLISECONDS = 4000;

  spinnerId;
  spinner: any = {};
  addForm: FormGroup;
  isShow = false;
  isClick = false;
  clickNumber = 0;
  points =[];
  wheel;
  parts;
  topPosition;
  topPositionColor;
  startClick = {x: 0, y: 0};
  endClick = {x: 0, y: 0};
  image: any = {};

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpService,
    private data: DataService,
    private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(p => this.spinnerId = p.id);
    this.http.postData('/getSpinner', {id: this.spinnerId}).subscribe((res: any) => {
      this.spinner = res;
      this.innerWheelParts();
    });
    this.addForm = this.formBuilder.group({
      title: ['', Validators.required],
      image: ['']
    });
    this.wheel = document.getElementById('wheel');
    this.wheel.style.transition = `transform ${this.MILLISECONDS}ms cubic-bezier(0.33, 0.66, 0.66, 1)`;
  }

  submit() {
    if(this.addForm.valid){
      const form = this.addForm.value;
      form.image = this.image.name;
      form.id = this.spinnerId;
      this.sendFile();
      this.http.postData('/addSpinnerItems', form).subscribe(() =>{
        this.spinner.spinnerMembers.push({name: form.name, image: form.image});
      });

    }
  }

  clicked(event){
    this.parts = document.getElementsByClassName('part');
    this.isClick = !this.isClick;
    this.catchClick(event, this.startClick);
    if(this.topPosition){
      this.topPosition.style.fill = this.topPositionColor;
      this.topPosition.style.stroke = 'none';
    }
  }

  move(event){
    if(this.isClick){
      this.catchClick(event, this.endClick);
      this.rotate((this.startClick.x - this.endClick.x)*0.33);
      this.afterSkip();
      this.isClick = !this.isClick;
    }
  }

  rotateWheel(){
    this.parts = document.getElementsByClassName('part');
    if(this.topPosition){
      this.topPosition.style.fill = this.topPositionColor;
      this.topPosition.style.stroke = 'none';
    }
    this.clickNumber++;
    this.rotate(this.clickNumber*10);
    this.afterSkip();
  }

  afterSkip() {
    setTimeout(() => {
      let partPos =[];
      for(let key = 0; key < this.parts.length; key++)
        partPos.push(this.parts[key]);
      partPos = partPos.sort(this.sortWheelPartsByTopLength);
      this.topPosition = partPos[0];
      this.topPositionColor = partPos[0].getAttribute('fill');
      this.topPosition.style.fill = 'rgba(255, 250, 71, 0.67)';
      this.topPosition.style.stroke = 'black';
    }, this.MILLISECONDS);
  }

  sortWheelPartsByTopLength(firstEl, secondEl){
    if (firstEl.getBoundingClientRect().top > secondEl.getBoundingClientRect().top) return 1;
    return -1;
  }

  rotate(rad){
    this.wheel.style.transform = `rotate(${rad}rad)`;
  }

  catchClick(event: MouseEvent, coord) {
    coord.x = event.screenX;
    coord.y = event.screenY;
  }

  showForm() {
    this.isShow = !this.isShow;
  }

  chooseImg() {
    document.getElementById('image').click();
  }

  upload(event) {
    this.image = event.target.files[0];
    this.readURL(event);
  }

  sendFile(){
    const formData: any = new FormData();
    const file = this.image;
    formData.append("file", file);
    this.http.postData('/uploads', formData).subscribe();
  }

  readURL(event) {
      const files = event.target.files[0];
      if (!files.type.match('image.*'))
        return;
      const reader = new FileReader();
      reader.onload = (theFile => {
        return e =>  document.getElementById('image-cont').setAttribute('src', e.target.result);
      })(files);
      reader.readAsDataURL(files);
  }

  createWheelParts(){
    this.points.length = 0;
    let center = {x: 144, y: 144};
    let radius = 144;
    for(let i=0; i <this.spinner.spinnerMembers.length; i++){
      let StartRad = this.calcRad(i);
      let endRad = this.calcRad(i+1);
      let x0 = Math.round(center.x + radius*Math.cos(StartRad));
      let y0 = Math.round(center.y + radius*Math.sin(StartRad));
      let x1 = Math.round(center.x + radius*Math.cos(endRad));
      let y1 = Math.round(center.y + radius*Math.sin(endRad));
      this.points.push({x: x0, y: y0, x1: x1, y1: y1});
    }
  }

  calcRad(partNumber){
    return (270 + 360/this.spinner.spinnerMembers.length*partNumber)*Math.PI/180;
  }

  innerWheelParts(){
    this.createWheelParts();
    let result = "";
    let color;
    for(let i=0; i < this.points.length; i++) {
      if(i%2 == 0) color = 'rgb(24, 100, 94)';
      else if(i%2 != 0) color = 'rgba(49, 187, 181, 0.45)';
      if(this.points.length == i+1 && this.points.length%2 !=0) color = 'rgb(31, 107, 169)';
      result += '<g class="part" fill="' + color +'"><path d="M' + this.points[i].x + ' ' + this.points[i].y +
                ' A144 144 0 0 1' + this.points[i].x1 + ' ' + this.points[i].y1 +
                ' L144 144 Z"></path></g>';
    }
    document.getElementById('wheel-parts').innerHTML = result;
  }

}
