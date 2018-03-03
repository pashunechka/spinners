import {Component, Input, OnChanges, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DataService} from '../../data.service';
import {Subscription} from 'rxjs/Subscription';
import {HttpService} from '../../http.service';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit, OnDestroy {

  @ViewChild('checkAllInp')
  private elCheckAllInp;

  @ViewChild('itemsList')
  private elItemsList;

  color = 'primary';
  colorWarn = 'warn';

  @Input() disableItemsList: boolean;

  items = [];
  parts = [];
  isDelete = false;
  isModify = false;
  member;
  subscription: Subscription;

  constructor(private data: DataService, private http: HttpService) { }

  ngOnInit() {
    this.subscription = this.data.wheelParts.subscribe(parts => this.parts = parts);
    this.subscribeSpinnerItems();
    this.subscription = this.data.spinnerAddItem.subscribe(item => this.items = item);
    this.subscribeSpinnerStatistics();
  }

  subscribeSpinnerItems() {
    this.subscription = this.data.spinnerItems.subscribe(items => {
      this.data.announceWheelParts([]);
      this.items = items;
      this.elCheckAllInp.checked = false;
    });
  }

  subscribeSpinnerStatistics() {
    this.data.spinnerStatistics.subscribe(item => {
      for (const key in this.items) {
        if (this.items[key]._id === item._id) {
          this.items[key].statistics = item.statistics;
        }
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  checkAll(event) {
      if (event.checked) {
        this.elItemsList.selectAll();
        this.items.forEach(el => {
          this.parts.push(el);
        });
      } else {
        this.elItemsList.deselectAll();
        this.parts = [];
      }
      this.data.announceWheelParts(this.parts);
  }


  getInput(event) {
      this.items.forEach(el => {
        if (el._id === event.source._element.nativeElement.id) {
          event.selected ? this.parts.push(el) : this.parts.splice(this.parts.indexOf(el), 1);
        }
      });
      this.data.announceWheelParts(this.parts);
      this.isAllChecked();
  }

  isAllChecked() {
    if (this.elItemsList.selectedOptions.selected.length === this.items.length) {
      this.elItemsList.selectAll();
      return this.elCheckAllInp.checked = true;
    }
    this.elCheckAllInp.checked = false;
  }

  dragStart(event): void  {
    if (event.target.getAttribute('aria-selected').toString() === 'false') {
      event.dataTransfer.setData('value', event.target.id);
    }
  }


  showModifyPopUp(member) {
    this.isModify = true;
    this.member = member;
  }

  setModifyItem(event) {
    this.isModify = false;
    const removedItem = this.items.find((item) => {
      return item._id === event._id;
    });
    this.items[this.items.indexOf(removedItem)].name = event.name;
    this.items[this.items.indexOf(removedItem)].image = event.image;
    if ( this.parts[this.parts.indexOf(removedItem)]) {
      this.parts[this.parts.indexOf(removedItem)].name = event.name;
      this.parts[this.parts.indexOf(removedItem)].image = event.image;
      this.data.announceWheelParts(this.parts);
    }
  }

  showDeletePopUp(member) {
    this.isDelete = true;
    this.member = member;
  }

  deleteItem(member) {
    this.http.postData('/deleteItem', member).subscribe((res: any) => {
      const removedItem = this.items.find((item) => {
        return item._id === member._id;
      });
      this.items.splice(this.items.indexOf(removedItem), 1);
      this.parts.splice(this.items.indexOf(removedItem), 1);
      this.data.announceWheelParts(this.parts);
      this.isDelete = false;
    });
  }

}
