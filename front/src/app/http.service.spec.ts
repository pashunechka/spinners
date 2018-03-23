import {TestBed, inject} from '@angular/core/testing';

import { HttpService } from './http.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('HttpService', () => {

  let httpService: HttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        HttpService
      ]
    });

    httpService = TestBed.get(HttpService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', inject([HttpService], (service: HttpService) => {
    expect(service).toBeTruthy();
  }));

  it('#getData should return result', () => {
    httpService.getData('/getResult').subscribe((res: any) => {
      expect(res).toEqual({test: 'test'});
    });

    const req = httpMock.expectOne('http://localhost:3000/getResult');
    expect(req.request.method).toBe('GET');
    req.flush({test: 'test'});
    httpMock.verify();
  });

  it('#postData should return result', () => {
    httpService.postData('/getResult', {test: 'test'}).subscribe((res: any) => {
      expect(res).toEqual({id: 1});
    });

    const req = httpMock.expectOne('http://localhost:3000/getResult');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({test: 'test'});
    req.flush({id: 1});
    httpMock.verify();
  });

  it('#getItems should return result', () => {
    httpService.getItems('123', '12345').subscribe((res: any) => {
      expect(res).toEqual([{id: 1}, {id: 2}, {id: 3}]);
    });

    const req = httpMock.expectOne('http://localhost:3000/getItems');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({id: '123', auth: '12345'});
    req.flush([{id: 1}, {id: 2}, {id: 3}]);
    httpMock.verify();
  });

});
