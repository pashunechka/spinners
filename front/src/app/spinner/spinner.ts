export class Spinner {

  private startDegrees = 270;
  private center = {x: 144, y: 144};
  private radius = 144;
  private textRadius = 120;
  private imageRadius = 95;
  public spinnerCenterColor = 'black';
  public textColor = 'black';
  public topPartFill = 'SteelBlue';
  public partColors = [
    'NavajoWhite',
    'BurlyWood',
    'RosyBrown'
  ];

  private wheel;
  private parts = [];
  private points = [];
  private radians: number;
  private deltaFromStartPosition = 0;
  private topPosition;
  private topPositionColor;
  private topPositionValue;
  public timeout;

  constructor() {}

  public initialize(id, parts): void {
    this.wheel = document.getElementById(id);
    this.parts = parts;
    document.getElementById(id).innerHTML = `<g id="spinner-parts"></g>
                                <circle fill="${this.spinnerCenterColor}" cx="${this.center.x}" cy="${this.center.y}" r="6px"></circle>`;
    document.getElementById('spinner-parts').innerHTML = this.generateWheelParts();
  }

  public moveWheelOnMouseMove (x, y): void {
    const wh = window.innerHeight / 2, ww = window.innerWidth / 2;
    if (this.checkWheelPartsAmount()) {
      this.wheel.style.transform = this.rotateWheel(this.calcRad((360 / Math.PI * Math.atan2(y - wh, x - ww))));
    }
    this.setWheelTransformTime(0);
  }

  public initWheelRotation(transformTime, rotateRad, cb): void {

    if (this.checkWheelPartsAmount()) {
      if (this.topPositionColor) {
        this.setDefaultFillToTopPart();
      }
      this.setWheelTransformTime(transformTime);
      this.rotateWheel(rotateRad);
      this.calcRadianDefferenceFromStart();
      this.topPositionValue = this.getTopPositionValue();
      this.getTopPositionFill();
      this.afterRotate(transformTime, cb);
    }
  }

  getTopPositionValue() {
    for (const key in this.parts) {
      if (this.parts[key]._id === this.topPosition.getElementsByTagName('textPath')[0].id) {
        return this.parts[key];
    }
      }
  }

  public stopWheel(): void {
    this.wheel.style.transition = '';
  }

  public getValue(): any {
    return this.topPositionValue;
  }

  public clearTimeOut(): void {
    clearTimeout(this.timeout);
  }

  private afterRotate(transformTime, cb) {
    this.timeout = setTimeout(() => {
      this.setTopPositionStyle(this.topPartFill);
      cb();
    }, transformTime);
  }

  private generateWheelParts(): string {
    this.calcWheelParts();
    this.fontSize();
    let result = '';
    if (this.parts.length === 1) {
     return result += `<circle id="path" fill="${this.partColors[0]}" cx="${this.center.x}" cy="${this.center.y}"
                        r="${this.radius}"></circle>
                        <text x="50%" y="50%" text-anchor="middle" dy="-120px">${this.parts[0].name}</text>
     <image x="${(this.points[0].a + this.points[0].a1 - 20) / 2}" y="${(this.points[0].b + this.points[0].b1 + 20) / 2}"
      xlink:href="#path" width="20" href="/assets/${this.parts[0].image}">`;
    }
    for (let i = 0; i < this.parts.length; i++) {
      result += `<g class="spinner-part" fill="${this.setWheelPartColor(i)}"><path d="M${this.points[i].x} ${this.points[i].y}
        A${this.center.x} ${this.center.y} 0 0 1 ${this.points[i].x1} ${this.points[i].y1}
        L${this.center.x} ${this.center.y} Z"></path><path id="path${i}" stroke="none" fill="none" d="
        M${this.points[i].a} ${this.points[i].b}
        A${this.textRadius} ${this.textRadius} 0 0 1 ${this.points[i].a1} ${this.points[i].b1}
        "></path><text fill="${this.textColor}"><textPath id="${this.parts[i]._id}" style="font-size:${this.fontSize()}px"
         startOffset="${this.setStartTextPosition()}%" xlink:href="#path${i}">${this.parts[i].name}</textPath></text>`;
      if (this.parts.length === 2) {
        result += `<image x="${(this.center.x * 1.5) - (i * this.center.x)}" y="${((this.points[i].b + this.points[i].b1) / 2) - 10}"
                    xlink:href="#path${i}" width="20px" height="20px" href="/assets/${this.parts[i].image}"></g>`;
      } else {
        result += `<image x="${((this.points[i].q + this.points[i].q1) / 2) - 10}" y="${((this.points[i].w + this.points[i].w1) / 2) - 10}"
                    xlink:href="#path${i}" width="20px" height="20px" href="/assets/${this.parts[i].image}"></g>`;
      }
    }
    return result;
  }

  private fontSize() {
    if (this.parts.length > 5) {
      return 12;
    }
    return 16;
  }

  private setStartTextPosition() {
    if (this.parts.length > 10) {
      return  25;
    }
    return 40;
  }

  public rotateWheel(rad): string {
    this.radians = rad;
    return this.wheel.style.transform = `rotate(${rad}rad)`;
  }

  private calcRadianDefferenceFromStart() {
    const delta: number = this.calcDeltaBetweenStartAndRotatePosition();
    const partCurveRadians: number = this.calcRad(360 / this.parts.length);
    let rotateRad: number = partCurveRadians;
    for (let i = 0; i < this.parts.length; i++) {
      if (delta <= rotateRad - this.deltaFromStartPosition) {
        return this.topPosition = document.getElementsByClassName('spinner-part')[this.parts.length - 1 - i];
      }
      rotateRad += partCurveRadians;
    }
    this.deltaFromStartPosition = delta;
  }

  private calcDeltaBetweenStartAndRotatePosition(): number {
    const totalRad: number = 2 * Math.PI;
    const rounds: number = this.radians / (totalRad);
    return (this.radians >= 0) ? (rounds - Math.trunc(rounds)) * totalRad : ((totalRad + this.radians) / (totalRad) -
      Math.trunc(rounds)) * totalRad;
  }

  private calcWheelParts(): void {
    this.cleareCurvePoints();
    for (let i = 0; i < this.parts.length; i++) {
      const startRad = this.calcRad(this.startDegrees + 360 / this.parts.length * i);
      const endRad = this.calcRad(this.startDegrees + 360 / this.parts.length * (i + 1));
      const startCoord = this.calcCurvePointCoordinates(this.center, this.radius, startRad);
      const endCoord = this.calcCurvePointCoordinates(this.center, this.radius, endRad);
      const startCoordText = this.calcCurvePointCoordinates(this.center, this.textRadius, startRad);
      const endCoordText = this.calcCurvePointCoordinates(this.center, this.textRadius, endRad);
      const startCoordImage = this.calcCurvePointCoordinates(this.center, this.imageRadius, startRad);
      const endCoordImage = this.calcCurvePointCoordinates(this.center, this.imageRadius, endRad);
      this.setCurvePoints(startCoord, endCoord, startCoordText, endCoordText, startCoordImage, endCoordImage);
    }
  }

  private cleareCurvePoints(): void {
    this.points.length = 0;
  }

  private calcRad(degrees): number {
    return degrees * Math.PI / 180;
  }

  private calcCurvePointCoordinates(center, radius, rad): object {
    const x0 = Math.round(center.x + radius * Math.cos(rad));
    const y0 = Math.round(center.y + radius * Math.sin(rad));
    return {x: x0, y: y0};
  }


  private setCurvePoints(startCoord, endCoord, startCoordText, endCoordText, startCoordImage, endCoordImage): void {
    this.points.push({
      x: startCoord.x, y: startCoord.y,
      x1: endCoord.x, y1: endCoord.y,
      a: startCoordText.x, b: startCoordText.y,
      a1: endCoordText.x, b1: endCoordText.y,
      q: startCoordImage.x, w: startCoordImage.y,
      q1: endCoordImage.x, w1: endCoordImage.y
    });
  }

  private setTopPositionStyle(color): void {
    this.topPosition.style.fill =  color;
  }

  private setDefaultFillToTopPart(): void {
    this.topPosition.style.fill = this.topPositionColor;
  }

  private setWheelTransformTime(ms): void {
    this.wheel.style.transition = `transform ${ms}ms cubic-bezier(0.33, 0.66, 0.66, 1)`;
  }

  private getTopPositionFill(): void {
    this.topPositionColor = this.topPosition.getAttribute('fill');
  }

  private setWheelPartColor(i): string {
    let color;
    if (i >= this.partColors.length) {
      color = this.partColors[i % this.partColors.length];
    } else {
      color = this.partColors[i];
    }
    if (i === this.parts.length - 1 && this.parts.length % this.partColors.length !== 0) {
      color = this.partColors[(this.partColors.length - 2)];
    }
    return color;
  }

  public checkWheelPartsAmount(): boolean {
    if (this.parts.length > 1) {
      return true;
    }
    return false;
  }
}
