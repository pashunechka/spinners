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
  STARTPOSITIONDEGREES = 270;
  CENTER = {x: 144, y: 144};
  RADIUS = 144;
  RADIUSTEXT = 82;
  PARTSCOLORS = [
    'rgb(24, 100, 94)',
    'rgba(49, 187, 181, 0.45)',
    'rgb(31, 107, 169)'
  ];
  FILLSTYLE = 'rgba(255, 250, 71, 0.67)';
  RANDOM = Math.random()*10 + 5;

  spinnerId;
  spinner: any = {};
  addForm: FormGroup;
  isShow = false;
  isClick = false;
  clickNumber = 0;
  points =[];
  wheel;
  wheelArray =[];
  topPosition;
  topPositionColor;
  startClick = {x: 0, y: 0};
  endClick = {x: 0, y: 0};
  image: any = {};
  timeout;
  stop;
  radians;
  delta = 0;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpService,
    private data: DataService,
    private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(p => this.spinnerId = p.id);
    this.getSpinner();
    this.initForm();
    this.wheel = document.getElementById('wheel');
    window.addEventListener("mousemove", (event) =>{
      if(this.isClick){
        this.move (event.pageX, event.pageY);
        this.wheel.style.transition = `transform 0ms cubic-bezier(0.33, 0.66, 0.66, 1)`;
      }
    });
    window.addEventListener("mouseup", (event) =>{
        if(this.isClick) {
          this.isClick = false;
          this.catchClick(event, this.endClick);
          if(this.topPosition)
            this.setStyleToTopPart();
          this.wheel.style.transition = `transform ${this.MILLISECONDS}ms cubic-bezier(0.33, 0.66, 0.66, 1)`;
          this.radians = (this.startClick.x - this.endClick.x)*0.33;
          this.rotate(this.radians);
          this.showRad();
          this.topPositionColor = this.topPosition.getAttribute('fill');
          this.afterSkip();
        }
    });
  }

  showRad(){
    let  delta = (this.radians >= 0)? (this.radians/(2*Math.PI)- Math.trunc(this.radians/(2*Math.PI)))*2*Math.PI: ((2*Math.PI + this.radians)/(2*Math.PI)- Math.trunc(this.radians/(2*Math.PI)))*2*Math.PI;
    let partRadians = this.calcRad(0,1);
    let radTotal = partRadians;
    for(let i = 0; i < this.wheelArray.length; i++){
      if(delta <= radTotal - this.delta)
        return this.topPosition = document.getElementsByClassName("part")[this.wheelArray.length - 1 - i];
      radTotal += partRadians;
    }
    this.delta = delta;
  }

  move (x, y) {
    let wh = window.innerHeight / 2,
        ww = window.innerWidth / 2;
    if(this.wheelArray.length > 1)
     this.wheel.style.transform = `rotate(${(360/Math.PI * Math.atan2(y-wh, x-ww))}deg)`;
    this.stop = true;
  }

  getSpinner(){
    this.http.postData('/getSpinner', {id: this.spinnerId}).subscribe((res: any) => {
      this.spinner = res;
    });
  }

  initForm(){
    this.addForm = this.formBuilder.group({
      title: ['', Validators.required],
      image: ['']
    });
  }

  submit() {
    if(this.addForm.valid){
      const form = this.addForm.value;
      form.image = this.image.name;
      if(!this.image.name)
        form.image = 'no-image.svg';
      form.id = this.spinnerId;
      this.sendFile();
      this.http.postData('/addSpinnerItems', form).subscribe(() =>{
        this.spinner.spinnerMembers.push({name: form.name, image: form.image});
      });
    }
  }

  clickDown(event){
    clearTimeout(this.timeout);
    if(this.stop){
      this.stop = false;
      return this.wheel.style.transition = "";
    }
    this.isClick = true;
    this.catchClick(event, this.startClick);
  }

  rotateWheel(){
    clearTimeout(this.timeout);
    if(this.topPositionColor)
      this.setStyleToTopPart();
    this.clickNumber++;
    this.stop = true;
    this.wheel.style.transition = `transform ${this.MILLISECONDS}ms cubic-bezier(0.33, 0.66, 0.66, 1)`;
    this.radians = this.clickNumber*this.RANDOM
    this.rotate(this.radians);
    this.showRad();
    this.topPositionColor = this.topPosition.getAttribute('fill');
    this.afterSkip();
  }

  afterSkip() {
    if(this.wheelArray.length > 1)
      this.timeout = setTimeout(() => {
        this.topPosition.style.fill = this.FILLSTYLE;
        this.stop = false;
      }, this.MILLISECONDS);
  }

  rotate(rad){
    if(this.wheelArray.length > 1)
     return this.wheel.style.transform = `rotate(${rad}rad)`;
  }

  catchClick(event: MouseEvent, coord) {
    coord.x = event.screenX;
    coord.y = event.screenY;
  }

  addToWheel(event) {
    if(event.target.checked)
       this.wheelArray.push(event.target.defaultValue);
    else{
      this.wheelArray.splice(this.wheelArray.indexOf(event.target.defaultValue),1);
      document.getElementById('wheel-parts').innerHTML = '';
    }
    if(this.wheelArray.length > 0)
      this.innerWheelParts();
  }

  innerWheelParts(){
    this.createWheelParts();
    document.getElementById('wheel-parts').innerHTML = this.generateWheelParts();
  }

  setStyleToTopPart(){
    this.topPosition.style.fill = this.topPositionColor;
    this.topPosition.style.stroke = 'none';
  }

  createWheelParts() {
    this.clearePoints();
    for(let i = 0; i < this.wheelArray.length; i++){
      const startRad = this.calcRad(this.STARTPOSITIONDEGREES, i);
      const endRad = this.calcRad(this.STARTPOSITIONDEGREES, i+1);
      const startCoord = this.calcPointCoordinates(this.CENTER, this.RADIUS, startRad);
      const endCoord = this.calcPointCoordinates(this.CENTER, this.RADIUS, endRad);
      const startCoordText = this.calcPointCoordinates(this.CENTER, this.RADIUSTEXT, startRad);
      const endCoordText = this.calcPointCoordinates(this.CENTER, this.RADIUSTEXT, endRad);
      this.setPoints(startCoord, endCoord, startCoordText, endCoordText);
    }
  }

  setPoints(startCoord, endCoord, startCoordText, endCoordText){
    this.points.push({
      x: startCoord.x, y: startCoord.y,
      x1: endCoord.x, y1: endCoord.y,
      a: startCoordText.x, b: startCoordText.y,
      a1: endCoordText.x, b1: endCoordText.y
    });
  }


  calcPointCoordinates(center, radius, rad){
    const x0 = Math.round(center.x + radius*Math.cos(rad));
    const y0 = Math.round(center.y + radius*Math.sin(rad));
    return {x: x0, y: y0};
  }

  calcRad(startDegrees,partNumber){
    return (startDegrees + 360/this.wheelArray.length*partNumber)*Math.PI/180;
  }

  generateWheelParts(){
    let result = "";
    for (let i = 0; i < this.points.length; i++)
      result += '<g class="part" fill="' + this.setPartColor(i) +'"><path d="M' + this.points[i].x + ' ' + this.points[i].y +
        ' A144 144 0 0 1' + this.points[i].x1 + ' ' + this.points[i].y1 +
        ' L144 144 Z"></path><path id="path'+ i +'" stroke="none" fill="none" d="' +
        ' M' + this.points[i].a + ' ' + this.points[i].b +
        ' A72 72 0 0 1' + this.points[i].a1 + " " + this.points[i].b1 +
        '"></path><text fill="black">' +
        '<textPath startOffset="30%" xlink:href="#path'+ i +'">'+ this.wheelArray[i] + '</textPath></text></g>';
    return result;
  }

  clearePoints() {
    this.points.length = 0;
  }

  setPartColor(i){
    let color;
    if (i % 2 == 0) color = this.PARTSCOLORS[0];
    else if (i % 2 != 0) color = this.PARTSCOLORS[1];
    if (this.points.length == i + 1 && this.points.length % 2 != 0) color = this.PARTSCOLORS[2];
    return color;
  }

  toggleIsShow() {
    this.isShow = !this.isShow;
  }

  toggleIsClick(){
    this.isClick = !this.isClick;
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
}
