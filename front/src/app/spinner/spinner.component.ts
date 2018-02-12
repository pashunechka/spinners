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

  chartType = 'bar';
  chartData = {
    labels: [65, 59, 80, 81, 56, 55, 45],
    datasets: [
      {
        label: "Statistics",
        data: [65, 59, 80, 81, 56, 55, 45],
        backgroundColor: [
          'rgba(255,99,132,1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 159, 64, 1)'
        ],
      }
    ]
  };
  chartOptions = {
    responsive: true,
    maintainAspectRatio: false
  };

  DEFAULTIMAGE = 'no-image.svg';
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
  isPopUp = false;
  clickNumber = 0;
  points =[];
  wheel;
  parts =[];
  topPosition;
  topPositionColor;
  topPositionValue;
  startClick = {x: 0, y: 0};
  endClick = {x: 0, y: 0};
  image: any = {};
  timeout;
  stop;
  radians;
  deltaFromStartPosition = 0;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpService,
    private data: DataService,
    private route: ActivatedRoute) {}

  ngOnInit() {
    this.wheel = document.getElementById('wheel');
    this.route.params.subscribe(p => this.spinnerId = p.id);
    this.getSpinner();
    this.initForm();
    this.onmouseMove();
    this.onmouseUp();
  }

  getSpinner(){
    this.http.postData('/getSpinner', {id: this.spinnerId})
      .subscribe((res: any) => this.spinner = res);
  }

  initForm(){
    this.addForm = this.formBuilder.group({
      title: ['', Validators.required],
      image: ['']
    });
  }

  submit() {
    if(this.addForm.valid){
      const form = this.setForm();
      this.sendFileToServer();
      this.http.postData('/addSpinnerItems', form).subscribe((res: any) =>{
        this.spinner = res;
        this.addForm.reset();
      });
    }
  }

  setForm(){
    const form = this.addForm.value;
    form.image = this.image.name;
    if(!this.image.name)
      form.image = this.DEFAULTIMAGE;
    form.id = this.spinnerId;
    return form;
  }

  getInput(event){
      document.getElementById(`check${event}`).click();
  }

  addChosenPartsToWheel(event) {
    if(event.target.checked){
      this.parts.push(event.target.defaultValue);
      this.chartData.labels.push(event.target.defaultValue);
    }
    else{
      this.parts.splice(this.parts.indexOf(event.target.defaultValue),1);
      this.innerHtml('wheel-parts', '');
    }
    if(this.checkWheelPartsAmount())
      this.innerWheelParts();
  }

  innerWheelParts(){
    this.calcWheelParts();
    this.innerHtml('wheel-parts', this.generateWheelParts());
  }

  innerHtml(id, value){
    document.getElementById(id).innerHTML = value;
  }


  onmouseMove(){
    window.addEventListener("mousemove", (event) =>{
      if(this.isClick){
        this.moveWheelOnMouseMove (event.pageX, event.pageY);
        this.setWheelTransformTime(0);
      }
    });
  }

  onmouseUp(){
    window.addEventListener("mouseup", (event) =>{
      if(this.isClick) {
        this.isClick = false;
        this.catchMouseClick(event, this.endClick);
        this.initWheelRotation(this.MILLISECONDS, (this.startClick.x - this.endClick.x)*0.33);
      }
    });
  }

  clickToRotate(){
    clearTimeout(this.timeout);
    this.clickNumber++;
    this.stop = true;
    this.initWheelRotation(this.MILLISECONDS, this.clickNumber*this.RANDOM);
  }

  moveWheelOnMouseMove (x, y) {
    let wh = window.innerHeight / 2, ww = window.innerWidth / 2;
    if(this.checkWheelPartsAmount())
      this.wheel.style.transform = this.rotateWheel(this.calcRad((360/Math.PI * Math.atan2(y-wh, x-ww))))
    this.stop = true;
  }

  clickDown(event){
    clearTimeout(this.timeout);
    if(this.stop){
      this.stop = false;
      return this.wheel.style.transition = "";
    }
    this.isClick = true;
    this.catchMouseClick(event, this.startClick);
  }

  catchMouseClick(event: MouseEvent, coord) {
    coord.x = event.screenX;
    coord.y = event.screenY;
  }

  initWheelRotation(transformTime, rotateRad){
    if(this.checkWheelPartsAmount()){
      if(this.topPositionColor)
        this.setDefaultStyleToTopPart();
      this.setWheelTransformTime(transformTime);
      this.rotateWheel(rotateRad);
      this.calcRadianDefferenceFromStart();
      this.topPositionValue = this.topPosition.getElementsByTagName('textPath')[0].innerHTML;
      this.setTopPositionFill();
      this.afterWheelRotate();
    }
  }

  setDefaultStyleToTopPart(){
    this.topPosition.style.fill = this.topPositionColor;
  }

  setWheelTransformTime(ms){
    this.wheel.style.transition = `transform ${ms}ms cubic-bezier(0.33, 0.66, 0.66, 1)`;
  }

  rotateWheel(rad){
    this.radians = rad;
    return this.wheel.style.transform = `rotate(${rad}rad)`;
  }

  calcRadianDefferenceFromStart(){
    let delta = this.calcDeltaBetweenStartandRotatePosition();
    let partCurveRadians = this.calcRad(360/this.parts.length);
    let rotateRad = partCurveRadians;
    for(let i = 0; i < this.parts.length; i++){
      if(delta <= rotateRad - this.deltaFromStartPosition)
        return this.topPosition = document.getElementsByClassName("part")[this.parts.length - 1 - i];
      rotateRad += partCurveRadians;
    }
    this.deltaFromStartPosition = delta;
  }

  calcDeltaBetweenStartandRotatePosition(){
    const totalRad = 2*Math.PI;
    const rounds = this.radians/(totalRad);
    return (this.radians >= 0)? (rounds - Math.trunc(rounds))*totalRad: ((totalRad + this.radians)/(totalRad) - Math.trunc(rounds))*totalRad;
  }

  setTopPositionFill(){
      this.topPositionColor = this.topPosition.getAttribute('fill');
  }

  afterWheelRotate() {
      this.timeout = setTimeout(() => {
        this.topPosition.style.fill =  this.FILLSTYLE;
        this.stop = false;
        this.isPopUp = true;
      }, this.MILLISECONDS);
  }

  checkWheelPartsAmount(){
    if(this.parts.length > 1)
      return true;
    return false;
  }

  calcWheelParts() {
    this.cleareCurvePoints();
    for(let i = 0; i < this.parts.length; i++){
      const startRad = this.calcRad(this.STARTPOSITIONDEGREES + 360/this.parts.length*i);
      const endRad = this.calcRad(this.STARTPOSITIONDEGREES + 360/this.parts.length*(i+1));
      const startCoord = this.calcCurvePointCoordinates(this.CENTER, this.RADIUS, startRad);
      const endCoord = this.calcCurvePointCoordinates(this.CENTER, this.RADIUS, endRad);
      const startCoordText = this.calcCurvePointCoordinates(this.CENTER, this.RADIUSTEXT, startRad);
      const endCoordText = this.calcCurvePointCoordinates(this.CENTER, this.RADIUSTEXT, endRad);
      this.setCurvePoints(startCoord, endCoord, startCoordText, endCoordText);
    }
  }

  cleareCurvePoints() {
    this.points.length = 0;
  }

  calcRad(degrees){
    return degrees*Math.PI/180;
  }

  calcCurvePointCoordinates(center, radius, rad){
    const x0 = Math.round(center.x + radius*Math.cos(rad));
    const y0 = Math.round(center.y + radius*Math.sin(rad));
    return {x: x0, y: y0};
  }

  setCurvePoints(startCoord, endCoord, startCoordText, endCoordText){
    this.points.push({
      x: startCoord.x, y: startCoord.y,
      x1: endCoord.x, y1: endCoord.y,
      a: startCoordText.x, b: startCoordText.y,
      a1: endCoordText.x, b1: endCoordText.y
    });
  }

  generateWheelParts(){
    let result = "";
    for (let i = 0; i < this.parts.length; i++)
      result += '<g class="part" fill="' + this.setWheelPartColor(i) +'"><path d="M' + this.points[i].x + ' ' + this.points[i].y +
        ' A144 144 0 0 1' + this.points[i].x1 + ' ' + this.points[i].y1 +
        ' L144 144 Z"></path><path id="path'+ i +'" stroke="none" fill="none" d="' +
        ' M' + this.points[i].a + ' ' + this.points[i].b +
        ' A72 72 0 0 1' + this.points[i].a1 + " " + this.points[i].b1 +
        '"></path><text fill="black">' +
        '<textPath startOffset="30%" xlink:href="#path'+ i +'">'+ this.parts[i] + '</textPath></text></g>';
    return result;
  }

  setWheelPartColor(i){
    let color;
    if (i % 2 == 0) color = this.PARTSCOLORS[0];
    else if (i % 2 != 0) color = this.PARTSCOLORS[1];
    if (this.points.length == i + 1 && this.points.length % 2 != 0) color = this.PARTSCOLORS[2];
    return color;
  }


  toggleIsShow(event) {
    this.isShow = !this.isShow;
    event.target.style.borderBottom = '2px solid #31bbb5';
    if(this.isShow)
      event.target.style.borderBottom = 0;
  }

  chooseImg() {
    document.getElementById('image').click();
  }

  getImage(event) {
    this.image = event.target.files[0];
    this.previewImage(event);
  }

  sendFileToServer(){
    const formData: any = new FormData();
    const file = this.image;
    formData.append("file", file);
    this.http.postData('/uploads', formData).subscribe();
  }

  previewImage(event) {
    const files = event.target.files[0];
    if (!files.type.match('image.*'))
      return;
    const reader = new FileReader();
    reader.onload = (theFile => {
      return e =>  document.getElementById('image-cont').setAttribute('src', e.target.result);
    })(files);
    reader.readAsDataURL(files);
  }

  close(){
    this.isPopUp = false;
  }
}
