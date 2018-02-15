import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataService} from "../../data.service";
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit, OnDestroy {

  spinner;
  parts = [];
  isCheckAll: boolean = false;
  subscription: Subscription;

  constructor(private data: DataService) { }

  ngOnInit() {
    this.subscription = this.data.announce.subscribe(spinner => this.spinner = spinner);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getInput(event): void  {
    document.getElementById(`check${event}`).click();
  }

  dragStart(event): void  {
    if(!event.target.getElementsByTagName('input')[0].checked)
      event.dataTransfer.setData('value', event.target.getElementsByTagName('input')[0].id);
    event.target.style.backgroundColor ='white';
  }

  addChosenPartsToWheel(event): void  {
    if(event.target.checked)
      this.parts.push(event.target.defaultValue);
    else
      this.parts.splice(this.parts.indexOf(event.target.defaultValue),1);
    this.data.partAnnounced(this.parts);
    this.checkIsAllActive();
  }

  checkIsAllActive(): void {
    let list = document.getElementsByClassName('list');
    let target = document.getElementById('check-all').getElementsByTagName('i')[0];
    if(list.length == this.parts.length){
      this.isCheckAll = true;
      return target.setAttribute('class', 'fa fa-check-square-o');
    }
    this.isCheckAll = false;
    target.setAttribute('class', 'fa fa-square-o');
  }

  checkAll(): void  {
    this.isCheckAll = !this.isCheckAll;
    this.addAllParts();
    this.checkIsAllActive();
    this.data.partAnnounced(this.parts);
  }

  addAllParts(): void {
    this.parts = [];
    const list = document.getElementsByClassName('list');
    for(let key = 0; key < list.length; key++){
      let listInput = list[key].getElementsByTagName('input')[0];
      listInput.checked = this.isCheckAll;
      if(this.isCheckAll)
        this.parts.push(listInput.defaultValue);
    }
  }

}
