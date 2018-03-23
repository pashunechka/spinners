import { TestBed, inject } from '@angular/core/testing';
import { DataService } from './data.service';

describe('DataService', () => {
  let dataService: DataService;
  let item;
  const items = [];

  beforeEach(() => {
    dataService = new DataService();
    for (let i = 0; i < 5; i++) {
      items.push({name: `${i}`, _id: '1', image: 'no-image.jpg', color: '#000000', statistics: 3});
    }
    item = {name: '1', _id: '1', image: 'no-image.jpg', color: '#000000', statistics: 3};
    TestBed.configureTestingModule({
      providers: [DataService]
    });
  });

  it('should be created', inject([DataService], (service: DataService) => {
    expect(service).toBeTruthy();
  }));

  it('#getSpinnerId should return string value', () => {
    dataService.setSpinnerId('value');
    expect(dataService.getSpinnerId()).toBe('value');
  });

  it('#setSpinnerId should set string value to spinnerId', () => {
    expect(dataService.setSpinnerId('value')).toBeUndefined();
  });

  it('#announceError should return boolean from Observable', () => {
    dataService.announceError(true);
    dataService.authorizationError.subscribe(val => expect(val).toEqual(true));
  });

  it('#announceSpinnerStatistics should return SpinnerItem from Observable', () => {
    dataService.announceSpinnerStatistics(item);
    dataService.authorizationError.subscribe(val => expect(val).toEqual(item));
  });

  it('#announceSpinnerItems should return SpinnerItem[] from Observable', () => {
    dataService.announceSpinnerItems(items);
    dataService.authorizationError.subscribe(val => expect(val).toEqual(items));
  });

  it('#announceWheelParts should return SpinnerItem[] from Observable', () => {
    dataService.announceWheelParts(items);
    dataService.authorizationError.subscribe(val => expect(val).toEqual(items));
  });

});
