import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataService} from '../../data.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit, OnDestroy {

  spinner = [];
  parts = [];
  isCheckAll = false;
  subscription: Subscription;
  clickedCheckbox;

  constructor(private data: DataService) { }

  ngOnInit() {
    this.subscription = this.data.spinnerItems.subscribe(spinner => {
      this.spinner = spinner;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getInput(event) {
    this.clickedCheckbox = event;
    document.getElementById(event._id).click();
  }

  dragStart(event): void  {
    if (!event.target.getElementsByTagName('input')[0].checked) {
      event.dataTransfer.setData('value', event.target.id);
    }
    event.target.style.backgroundColor = 'white';
  }

  clickAllInput() {
    if (this.spinner.length > 0) {
      document.getElementById('check-all').getElementsByTagName('input')[0].click();
    }
  }

  checkAll(): void  {
    this.isCheckAll = !this.isCheckAll;
    this.addAllParts();
    this.checkIsAllActive();
    this.data.wheelPartsAnnounce(this.parts);
  }

  addChosenPartsToWheel(event): void {
    if (event.target.checked) {
      this.parts.push(this.clickedCheckbox);
    } else {
      this.parts.splice(this.parts.indexOf(this.clickedCheckbox), 1);
    }
    this.data.wheelPartsAnnounce(this.parts);
    this.checkIsAllActive();
    this.checkFake(event.target.parentElement);
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
        this.parts.push(this.spinner[key]);
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
