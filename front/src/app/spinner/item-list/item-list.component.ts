import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DataService} from '../../data.service';
import {Subscription} from 'rxjs/Subscription';
import {HttpService} from '../../http.service';
import {ActivatedRoute} from '@angular/router';

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

  @Input() disableItemsList: boolean;

  color = 'primary';
  colorWarn = 'warn';

  items = [];
  parts = [];
  isDelete = false;
  member;
  deletedItem;
  subscription: Subscription;

  constructor(
    private data: DataService,
    private http: HttpService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.data.setSpinnerId(this.route.snapshot.paramMap.get('id'));
    if (this.data.getSpinnerId()) {
      this.http.getItems(this.data.getSpinnerId()).subscribe((items: any) => {
        this.items = items;
      }, () => this.data.announceError(false));
    }
    this.subscription = this.data.wheelParts.subscribe(parts => this.parts = parts);
    this.subscribeSpinnerItems();
    this.subscribeSpinnerStatistics();
  }

  subscribeSpinnerItems(): void {
    this.subscription = this.data.spinnerItems.subscribe(items => {
      this.data.announceWheelParts([]);
      this.items = items;
      this.elCheckAllInp.checked = false;
    });
  }

  subscribeSpinnerStatistics(): void {
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

  checkAll(event): void {
    this.parts = [];
      if (event.checked) {
        this.elItemsList.selectAll();
        this.items.forEach(el => {
          this.parts.push(el);
        });
      } else {
        this.elItemsList.deselectAll();
      }
      this.data.announceWheelParts(this.parts);
  }


  getInput(event): void {
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

  dragStart(event, id): void  {
    if (event.target.getAttribute('data-checked') === 'false') {
      event.dataTransfer.setData('value', id);
    }
  }

  showModifyPopUp(member): void {
    this.member = member;
  }

  setModifyItem(event) {
    this.resetMember();
    const removedItem = this.items.find((item) => {
      return item._id === event._id;
    });
    this.items[this.items.indexOf(removedItem)].name = event.name;
    this.items[this.items.indexOf(removedItem)].image = event.image;
    this.items[this.items.indexOf(removedItem)].color = event.color;
    if ( this.parts[this.parts.indexOf(removedItem)]) {
      this.parts[this.parts.indexOf(removedItem)].name = event.name;
      this.parts[this.parts.indexOf(removedItem)].image = event.image;
      this.parts[this.parts.indexOf(removedItem)].color = event.color;
      this.data.announceWheelParts(this.parts);
    }
  }

  addItemToItems(event) {
    this.items.push(event);
    this.isAllChecked();
  }

  resetMember() {
    this.member = undefined;
  }

  showDeletePopUp(member): void {
    this.isDelete = true;
    this.deletedItem = member;
  }

  deleteItem() {
    this.http.postData('/deleteItem', this.deletedItem).subscribe(() => {
      this.items.splice(this.items.indexOf(this.deletedItem), 1);
      this.parts.splice(this.parts.indexOf(this.deletedItem), 1);
      this.data.announceWheelParts(this.parts);
      this.isDelete = false;
    });
  }

}
