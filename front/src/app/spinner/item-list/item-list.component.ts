import {Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {DataService} from '../../data.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit, OnDestroy {

  @ViewChild('fakeCheckAll')
  private elFakeCheckAll: ElementRef;

  @ViewChild('checkAllInp')
  private elCheckAllInp: ElementRef;

  @ViewChildren('listInp')
  private elListInp: QueryList<any>;

  @ViewChildren('fakeCheck')
  private elFakeCheck: QueryList<any>;

  items = [];
  parts = [];
  isCheckAll = false;
  subscription: Subscription;
  clickedCheckbox;

  constructor(private data: DataService) { }

  ngOnInit() {
    this.subscription = this.data.wheelParts.subscribe(parts => this.parts = parts);
    this.subscribeSpinnerItems();
    this.subscription = this.data.spinnerAddItem.subscribe(item => this.items = item);
    this.subscribeSpinnerAddItem();
  }

  subscribeSpinnerItems() {
    this.subscription = this.data.spinnerItems.subscribe(items => {
      this.data.announceWheelParts([]);
      this.items = items;
      this.setStartCondition();
    });
  }

  subscribeSpinnerAddItem() {
    this.data.spinnerStatistics.subscribe(item => {
      for (const key in this.items) {
        if (this.items[key]._id === item._id) {
          this.items[key].statistics = item.statistics;
        }
      }
    });
  }

  setStartCondition() {
    this.elFakeCheckAll.nativeElement.setAttribute('class', 'fa fa-square-o');
    this.elCheckAllInp.nativeElement.checked = false;
    this.isCheckAll = false;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getInput(event) {
    const target = event.target.getElementsByTagName('input')[0];
    if (target.disabled) {
      return;
    }
    this.clickedCheckbox = this.getItemById(target.id);
    target.checked = !target.checked;
    this.addChosenPartsToWheel(target);
  }

  addChosenPartsToWheel(event): void {
    if (event.checked) {
      this.parts.push(this.clickedCheckbox);
    } else {
      this.parts.splice(this.parts.indexOf(this.clickedCheckbox), 1);
    }
    this.data.announceWheelParts(this.parts);
    this.checkIsAllActive();
    this.checkFake(event.parentElement);
  }

  getItemById(id) {
    for (const key in this.items) {
      if (this.items[key]._id === id) {
        return this.items[key];
      }
    }
  }

  dragStart(event): void  {
    if (!event.target.getElementsByTagName('input')[0].checked) {
      event.dataTransfer.setData('value', event.target.id);
    }
    event.target.style.backgroundColor = 'white';
  }

  clickAllInput() {
    if (this.items.length > 0) {
      this.elCheckAllInp.nativeElement.click();
    }
  }

  checkAll(): void  {
    this.isCheckAll = !this.isCheckAll;
    this.addAllParts();
    this.checkIsAllActive();
    this.data.announceWheelParts(this.parts);
  }

  checkIsAllActive(): void {
    if (this.elListInp.length === this.parts.length) {
      this.isCheckAll = true;
      return this.elFakeCheckAll.nativeElement.setAttribute('class', 'fa fa-check-square-o');
    }
    this.isCheckAll = false;
    this.elFakeCheckAll.nativeElement.setAttribute('class', 'fa fa-square-o');
  }

  addAllParts(): void {
    this.parts = [];
    this.elListInp.forEach((el, key) => {
      el.nativeElement.checked = this.isCheckAll;
      this.checkFake(el.nativeElement.parentElement);
      if (el.nativeElement.checked) {
        this.parts.push(this.items[key]);
      }
    });
  }

  checkFake(list) {
    const fake = list.getElementsByClassName('fake-check')[0];
    if (list.getElementsByTagName('input')[0].checked) {
      return fake.setAttribute('class', 'fake-check fa fa-check-square-o');
    }
    fake.setAttribute('class', 'fake-check fa fa-square-o');
  }

}
