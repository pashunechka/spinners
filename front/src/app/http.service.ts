import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Config} from './config';
import {SpinnerItem} from './spinnerItem';
import {Spinner} from './spinner';


@Injectable()
export class HttpService {

  constructor(private http: HttpClient) {}

  postData(url: string, data: any): Observable<any>  {
    return this.http.post(`${Config.host}:${Config.port}${url}`, data);
  }

  getData(url: string): Observable<any>   {
    return this.http.get(`${Config.host}:${Config.port}${url}`);
  }

  getSpinners() {
    return this.getData('/getSpinners');
  }

  getItems(id: string, auth?: string): Observable<object> {
    const sendData = {id: id, auth: auth};
    if (!auth) { sendData.auth = ' '; }
    return  this.postData('/getItems',  sendData);
  }

  uploadImage(image): Observable<any> {
    return this.postData('/uploads', image);
  }

  addItems(item: SpinnerItem): Observable<SpinnerItem> {
    return this.postData('/addItems', item);
  }

  modifyItem(item: SpinnerItem): Observable<SpinnerItem> {
    return this.postData('/modifyItem', item);
  }

  deleteItem(item: SpinnerItem): Observable<any> {
    return this.postData('/deleteItem', item);
  }

  checkAuth(id: string, auth: string): Observable<boolean | null> {
    return this.postData('/checkAuth', {id: id, auth: auth});
  }

  addSpinner(spinner: Spinner): Observable<Spinner> {
    return this.postData('/addSpinner', spinner);
  }

  deleteSpinner(spinner): Observable<{id: string, authPassword: string}> {
    return this.postData('/deleteSpinner', spinner);
  }

  increaseItemStatistics(item: SpinnerItem): Observable<SpinnerItem> {
    return this.postData('/increaseItemStatistics', item);
  }

}
