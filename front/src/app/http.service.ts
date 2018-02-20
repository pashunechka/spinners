import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class HttpService {

  host = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  postData(url: string, data?: any) {
    return this.http.post(`${this.host}${url}`, data);
  }

  getData(url: string) {
    return this.http.get(`${this.host}${url}`);
  }

}
