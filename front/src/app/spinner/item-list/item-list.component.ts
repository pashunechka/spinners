import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataService} from "../../data.service";

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit, OnDestroy {

  spinner;
  parts = [];
  isCheckAll = false;
  subscription;

  constructor(private data: DataService) { }

  ngOnInit() {
    this.subscription = this.data.announce.subscribe(spinner => this.spinner = spinner);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getInput(event) {
    document.getElementById(`check${event}`).click();
  }

  dragStart(event) {
    if(!event.target.getElementsByTagName('input')[0].checked)
      event.dataTransfer.setData('value', event.target.getElementsByTagName('input')[0].id);
    event.target.style.backgroundColor ='white';
  }

  addChosenPartsToWheel(event) {
    if(event.target.checked) {
      this.parts.push(event.target.defaultValue);
      this.data.partAnnounced(this.parts);
    }
    else {
      this.parts.splice(this.parts.indexOf(event.target.defaultValue),1);
      this.data.partAnnounced(this.parts);
      this.data.innerHtml('wheel-parts', '');
    }
  }

  checkAll(event) {
    this.isCheckAll = !this.isCheckAll;
    if(this.isCheckAll)
      event.target.setAttribute('class', 'fa fa-check-square-o');
    else
      event.target.setAttribute('class', 'fa fa-square-o');
    this.addAllParts();
    this.data.partAnnounced(this.parts);
  }

  addAllParts() {
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
