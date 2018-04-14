import {SpinnerItem} from '../spinnerItem';

export class Spinner {

  DEFAULTIMAGE = 'no-image.svg';

  private startDegrees = 270;
  private radius = 375;
  private center = {x: 375, y: 375};
  private textRadius = 320;
  private imageRadius = 270;
  public spinnerCenterColor = 'black';
  public textColor = 'black';
  public topPartFill = 'SteelBlue';
  public partColors = [
    '#71CC51',
    '#B3EAAF',
    '#CADFA1',
    '#40C575',
    '#CCD97A',
    '#B9D146',
    '#64BA92',
    '#B6EBA0',
    '#CBEC7D',
    '#78D77C'
  ];

  private wheel;
  private parts: Array<SpinnerItem> = [];
  private points: Array<{
    x: number,
    x1: number,
    y: number,
    y1: number
    a: number,
    a1: number,
    b: number,
    b1: number,
    q: number,
    q1: number,
    w: number,
    w1: number
  }> = [];
  private radians: number;
  private deltaFromStartPosition = 0;
  private topPosition;
  private topPositionColor: string;
  private topPositionValue: SpinnerItem;
  public timeout;

  constructor(id, spinnerCenterColor) {
    this.wheel = document.getElementById(id);
    this.spinnerCenterColor = spinnerCenterColor;
    this.initialize([]);
  }

  private static calcRad(degrees: number): number {
    return degrees * Math.PI / 180;
  }

  private  static calcCurvePointCoordinates(center: {x: number, y: number}, radius: number, rad: number): object {
    const x0 = Math.round(center.x + radius * Math.cos(rad));
    const y0 = Math.round(center.y + radius * Math.sin(rad));
    return {x: x0, y: y0};
  }

  private static substrWheelPartName(name: string, value: number) {
    return name.length > value ? `${name.substring(0, value)}...` : name;
  }

  public initialize(parts: Array<SpinnerItem>): void {
    this.parts = parts;
    this.wheel.innerHTML = `<g id="spinner-parts">${this.generateWheelParts()}</g><circle fill="${this.spinnerCenterColor}"
                                                cx="${this.center.x}" cy="${this.center.y}" r="8px"></circle>`;
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

  getTopPositionValue(): SpinnerItem {
    for (const key in this.parts) {
      if (this.parts[key]._id === this.topPosition.getElementsByTagName('textPath')[0].id) {
        return this.parts[key];
      }
    }
  }

  public stopWheel(): void {
    this.wheel.style.transition = '';
  }

  public getValue(): SpinnerItem {
    return this.topPositionValue;
  }

  public clearTimeOut(): void {
    clearTimeout(this.timeout);
  }

  private afterRotate(transformTime: number, cb: Function) {
    this.timeout = setTimeout(() => {
      this.setTopPositionStyle(this.topPartFill);
      cb();
    }, transformTime);
  }

  private generateWheelParts(): string {
    this.calcWheelParts();
    this.fontSize();
    if (this.parts.length === 0 || !this.parts) {
      return `<circle id="path" fill="#009688" cx="${this.center.x}" cy="${this.center.y}" r="${this.radius}"></circle>`;
    }
    if (this.parts.length === 1) {
        return this.generateOneWheelPart();
    }
    return this.generateMoreThenOnePart();
  }

  generateOneWheelPart(): string {
    let result = '';
   result += `<circle id="path" fill="${this.parts[0].color ? this.parts[0].color : this.partColors[0]}"
        cx="${this.center.x}" cy="${this.center.y}"
        r="${this.radius}"></circle>
        <text x="50%" y="50%" text-anchor="middle" dy="-${this.textRadius}px">
        ${Spinner.substrWheelPartName(this.parts[0].name, 14)}
        <title>${this.parts[0].name}</title>
        </text>`;
    if (this.checkOnDefaultImage(this.parts[0].image)) {
      result += this.generateImagePositionDependOnPartsAmount(0);
    }
    return result;
  }

  generateMoreThenOnePart(): string {
    let result = '';
    for (let i = 0; i < this.parts.length; i++) {
      result += `<g class="spinner-part" fill="${this.parts[i].color ? this.parts[i].color : this.setWheelPartColor(i)}">
        <path d="M${this.points[i].x} ${this.points[i].y}
        A${this.center.x} ${this.center.y} 0 0 1 ${this.points[i].x1} ${this.points[i].y1}
        L${this.center.x} ${this.center.y} Z"></path><path id="path${i}" stroke="none" fill="none" d="
        M${this.points[i].a} ${this.points[i].b}
        A${this.textRadius} ${this.textRadius} 0 0 1 ${this.points[i].a1} ${this.points[i].b1}
        "></path><text fill="${this.textColor}">
        <textPath id="${this.parts[i]._id}" style="font-size:${this.fontSize()}"
         startOffset="${this.setStartTextPosition()}%" xlink:href="#path${i}">
        ${Spinner.substrWheelPartName(this.parts[i].name, 7)}</textPath><title>${this.parts[i].name}</title></text>`;
      if (this.checkOnDefaultImage(this.parts[i].image)) {
        result += this.generateImagePositionDependOnPartsAmount(i);
      }
    }
    return result;
  }

  private checkOnDefaultImage(image: string) {
    return image !== this.DEFAULTIMAGE;
  }

  private generateImagePositionDependOnPartsAmount(index: number): string {
    if (this.parts.length === 2) {
      return `<image x="${(this.center.x * 1.5) - (index * this.center.x)}"
                        y="${((this.points[index].b + this.points[index].b1 - 50) / 2)}"
                        xlink:href="#path${index}" width="50px" href="/assets/${this.parts[index].image}"></g>`;
    } else {
     return `<image x="${((this.points[index].q + this.points[index].q1 - 50) / 2)}"
                       y="${((this.points[index].w + this.points[index].w1 - 50) / 2)}" xlink:href="#path${index}" width="50px"
                        href="/assets/${this.parts[index].image}"></g>`;
    }
  }

  private fontSize(): string {
    return this.parts.length > 7 ? '18px' : '20px';
  }

  private setStartTextPosition(): number {
    return this.parts.length > 10 && this.parts.length <= 15 ? 27 : 35;
  }

  public rotateWheel(rad: number): string {
    this.radians = rad;
    return this.wheel.style.transform = `rotate(${rad}rad)`;
  }

  private calcRadianDefferenceFromStart() {
    const delta: number = this.calcDeltaBetweenStartAndRotatePosition();
    const partCurveRadians: number = Spinner.calcRad(360 / this.parts.length);
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
      const startRad = Spinner.calcRad(this.startDegrees + 360 / this.parts.length * i);
      const endRad = Spinner.calcRad(this.startDegrees + 360 / this.parts.length * (i + 1));
      const startCoord = Spinner.calcCurvePointCoordinates(this.center, this.radius, startRad);
      const endCoord = Spinner.calcCurvePointCoordinates(this.center, this.radius, endRad);
      const startCoordText = Spinner.calcCurvePointCoordinates(this.center, this.textRadius, startRad);
      const endCoordText = Spinner.calcCurvePointCoordinates(this.center, this.textRadius, endRad);
      const startCoordImage = Spinner.calcCurvePointCoordinates(this.center, this.imageRadius, startRad);
      const endCoordImage = Spinner.calcCurvePointCoordinates(this.center, this.imageRadius, endRad);
      this.setCurvePoints(startCoord, endCoord, startCoordText, endCoordText, startCoordImage, endCoordImage);
    }
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

  private cleareCurvePoints(): void {
    this.points.length = 0;
  }

  private setTopPositionStyle(color: string): void {
    this.topPosition.style.fill =  color;
  }

  private setDefaultFillToTopPart(): void {
    this.topPosition.style.fill = this.topPositionColor;
  }

  private setWheelTransformTime(ms: number): void {
    this.wheel.style.transition = `transform ${ms}ms cubic-bezier(0.33, 0.66, 0.66, 1)`;
  }

  private getTopPositionFill(): void {
    this.topPositionColor = this.topPosition.getAttribute('fill');
  }

  private setWheelPartColor(i: number): string {
    let color;
    (i >= this.partColors.length) ? color = this.partColors[i % this.partColors.length] : color = this.partColors[i];
    if (i === this.parts.length - 1 && this.parts.length % this.partColors.length !== 0) {
      color = this.partColors[(this.partColors.length - 2)];
    }
    return color;
  }

  public checkWheelPartsAmount(): boolean {
    return this.parts.length > 1;
  }
}

