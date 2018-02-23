import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataService} from '../../data.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit, OnDestroy {

  items = [];
  parts = [];
  isCheckAll = false;
  subscription: Subscription;
  clickedCheckbox;

  constructor(private data: DataService) { }

  ngOnInit() {
    this.subscription = this.data.wheelParts.subscribe(parts => this.parts = parts);
    this.subscription = this.data.spinnerItems.subscribe(items => {
      this.data.announceWheelParts([]);
      this.items = items;
      this.setStartCondition();
    });
    this.subscription = this.data.spinnerAddItem.subscribe(item => this.items = item);
    this.data.spinnerStatistics.subscribe(item => {
      for (const key in this.items) {
        if (this.items[key]._id === item._id) {
          this.items[key].statistics = item.statistics;
        }
      }
    });
  }

  setStartCondition() {
    document.getElementById('check-all').getElementsByTagName('i')[0].setAttribute('class', 'fa fa-square-o');
    document.getElementById('check-all').getElementsByTagName('input')[0].checked = false;
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
      document.getElementById('check-all').getElementsByTagName('input')[0].click();
    }
  }

  checkAll(): void  {
    this.isCheckAll = !this.isCheckAll;
    this.addAllParts();
    this.checkIsAllActive();
    this.data.announceWheelParts(this.parts);
  }

  checkIsAllActive(): void {
    const list = document.getElementsByClassName('list');
    const target = document.getElementById('check-all').getElementsByTagName('i')[0];
    if (list.length === this.parts.length) {
      this.isCheckAll = true;
      return target.setAttribute('class', 'fa fa-check-square-o');
    }
    this.isCheckAll = false;
    target.setAttribute('class', 'fa fa-square-o');
  }

  addAllParts(): void {
    this.parts = [];
    const list = document.getElementsByClassName('list');
    for (let key = 0; key < list.length; key++) {
      const listInput = list[key].getElementsByTagName('input')[0];
      listInput.checked = this.isCheckAll;
      this.checkFake(list[key]);
      if (listInput.checked) {
        this.parts.push(this.items[key]);
      }
    }
  }

  checkFake(list) {
    const fake = list.getElementsByClassName('fake-check')[0];
    if (list.getElementsByTagName('input')[0].checked) {
      return fake.setAttribute('class', 'fake-check fa fa-check-square-o');
    }
    fake.setAttribute('class', 'fake-check fa fa-square-o');
  }

}
