import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Config} from './config';


@Injectable()
export class HttpService {

  constructor(private http: HttpClient) {}

  postData(url: string, data: any): Observable<any>  {
    return this.http.post(`${Config.host}:${Config.port}${url}`, data);
  }

  getData(url: string): Observable<any>   {
    return this.http.get(`${Config.host}:${Config.port}${url}`);
  }

  getItems(id: string, auth?: string): Observable<object> {
    const sendData = {id: id, auth: auth};
    if (!auth) { sendData.auth = ' '; }
    return  this.postData('/getItems',  sendData);
  }

}
