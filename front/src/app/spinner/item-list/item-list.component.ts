import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DataService} from '../../data.service';
import {Subscription} from 'rxjs/Subscription';
import {HttpService} from '../../http.service';
import {ActivatedRoute} from '@angular/router';
import {SpinnerItem} from '../../spinnerItem';

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

  items: Array<SpinnerItem> = [];
  parts: Array<SpinnerItem> = [];
  isDelete = false;
  member: SpinnerItem;
  deletedItem: SpinnerItem;
  subscription: Subscription;

  constructor(
    private data: DataService,
    private http: HttpService,
    private route: ActivatedRoute) { }

  static getArrayItem(array: Array<SpinnerItem>, item: SpinnerItem): any {
    return array[ItemListComponent.getItemIndexInArray(array, item)];
  }

  static getItemIndexInArray(array: Array<SpinnerItem>, item: SpinnerItem): number {
    return array.indexOf(item);
  }

  static modifyItem(modArray: Array<SpinnerItem>, modItem: SpinnerItem, newItem: SpinnerItem): void {
    const mItem = ItemListComponent.getArrayItem(modArray, modItem);
    mItem.name = newItem.name;
    mItem.image = newItem.image;
    mItem.color = newItem.color;
  }

  ngOnInit() {
    this.data.setSpinnerId(this.route.snapshot.paramMap.get('id'));
    if (this.data.getSpinnerId()) {
      this.http.getItems(this.data.getSpinnerId()).subscribe((items: Array<SpinnerItem>) => {
        this.items = items;
      }, () => this.data.announceError(false));
    }
    this.subscription = this.data.wheelParts.subscribe((parts: Array<SpinnerItem>) => this.parts = parts);
    this.subscribeSpinnerItems();
    this.subscribeSpinnerStatistics();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  subscribeSpinnerItems(): void {
    this.subscription = this.data.spinnerItems.subscribe((items: Array<SpinnerItem>) => {
      this.data.announceWheelParts([]);
      this.items = items;
      this.elCheckAllInp.checked = false;
    });
  }

  subscribeSpinnerStatistics(): void {
    this.data.spinnerStatistics.subscribe((item: SpinnerItem) => {
      for (const key in this.items) {
        if (this.items[key]._id === item._id) {
          this.items[key].statistics = item.statistics;
        }
      }
    });
  }

  checkAll(event): void {
    this.parts = [];
    if (event.checked) {
      this.elItemsList.selectAll();
      this.items.forEach((el: SpinnerItem) => this.parts.push(el));
    } else {
      this.elItemsList.deselectAll();
    }
    this.data.announceWheelParts(this.parts);
  }


  getInput(event): void {
      this.items.forEach((el: SpinnerItem) => {
        if (el._id === event.source._element.nativeElement.id) {
          event.selected ? this.parts.push(el) : this.parts.splice(ItemListComponent.getItemIndexInArray(this.parts, el), 1);
        }
      });
      this.data.announceWheelParts(this.parts);
      this.isAllChecked();
  }

  isAllChecked(): void | boolean {
    if (this.elItemsList.selectedOptions.selected.length === this.items.length) {
      this.elItemsList.selectAll();
      return this.elCheckAllInp.checked = true;
    }
    this.elCheckAllInp.checked = false;
  }

  dragStart(event, id: string): void  {
    if (event.target.getAttribute('data-checked') === 'false') {
      event.dataTransfer.setData('value', id);
    }
  }

  setModifyItem(newItem): void {
    this.resetMember();
    const modItem = this.items.find((item: SpinnerItem) => {
      return item._id === newItem._id;
    });
    ItemListComponent.modifyItem(this.items, modItem, newItem);
    if (ItemListComponent.getArrayItem(this.parts, modItem)) {
      ItemListComponent.modifyItem(this.parts, modItem, newItem);
      this.data.announceWheelParts(this.parts);
    }
  }



  deleteItem(): void {
    this.http.postData('/deleteItem', this.deletedItem).subscribe(() => {
      this.deleteItemFromItems();
      this.deleteItemFromWheelParts();
      this.setIsDelete(false);
    });
  }

  deleteItemFromItems(): void {
    this.items.splice(ItemListComponent.getItemIndexInArray(this.items, this.deletedItem), 1);
  }

  deleteItemFromWheelParts(): void {
    const delItem = ItemListComponent.getArrayItem(this.parts, this.deletedItem);
    if (delItem) {
      this.parts.splice(ItemListComponent.getItemIndexInArray(this.parts, this.deletedItem), 1);
      this.data.announceWheelParts(this.parts);
    }
  }

  addItemToItems(event: SpinnerItem): void {
    this.items.push(event);
    this.isAllChecked();
  }

  resetMember(): void {
    this.member = undefined;
  }

  showDeletePopUp(member: SpinnerItem): void {
    this.setIsDelete(true);
    this.deletedItem = member;
  }

  showModifyPopUp(member: SpinnerItem): void {
    this.member = member;
  }

  setIsDelete(value: boolean): void {
    this.isDelete = value;
  }

}
