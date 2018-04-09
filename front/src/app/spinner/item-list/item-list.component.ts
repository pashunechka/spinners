import {
  Component, Input, OnDestroy, OnInit, QueryList, ViewChild,
  ViewChildren
} from '@angular/core';
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

  @ViewChild('checkAllInp') elCheckAllInp;

  @ViewChild('itemsList') elItemsList;

  @ViewChildren('option') elItems: QueryList<any>;

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

  static getArrayItem(array: Array<SpinnerItem>, item: SpinnerItem): SpinnerItem {
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
    this.data.announceChangeURL(this.data.getSpinnerId());
    if (this.data.getSpinnerId()) {
      this.http.getItems(this.data.getSpinnerId()).subscribe((items: Array<SpinnerItem>) => {
        this.items = items;
        this.setInitialParts();
      }, () => this.data.announceError(false));
    }
    this.subscription = this.data.wheelParts.subscribe((parts: Array<SpinnerItem>) => this.parts = parts);
    this.subscribeSpinnerItems();
    this.subscribeSpinnerStatistics();
  }

  setInitialParts() {
    if (localStorage.getItem('items')) {
      if (JSON.parse(localStorage.getItem('items'))[0].spinnerId === this.data.getSpinnerId()) {
        this.parts = JSON.parse(localStorage.getItem('items'));
      }
      this.elItems.changes.subscribe(elItems =>
        elItems.forEach(elItem => {
          this.parts.forEach(locItem => {
            if (elItem._element.nativeElement.id === locItem._id && locItem.spinnerId === this.data.getSpinnerId()) {
              elItem.selected = true;
              this.isAllChecked();
            }
          });
        }));
      this.data.announceWheelParts(this.parts);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  subscribeSpinnerItems(): void {
    this.subscription = this.data.spinnerItems.subscribe((items: Array<SpinnerItem>) => {
      this.data.announceWheelParts([]);
      this.items = items;
      localStorage.clear();
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
      localStorage.setItem('items', JSON.stringify(this.parts));
    } else {
      this.elItemsList.deselectAll();
      localStorage.clear();
    }
    this.data.announceWheelParts(this.parts);
  }

  getInput(event): void {
      this.items.forEach((el: SpinnerItem) => {
        if (el._id === event.source._element.nativeElement.id) {
          if (event.selected) {
            this.parts.push(el);
          } else {
            const position = this.parts.find(elem => elem._id === el._id);
            this.parts.splice(ItemListComponent.getItemIndexInArray(this.parts, position), 1);
          }
        }
      });
      this.parts.length ? localStorage.setItem('items', JSON.stringify(this.parts)) : localStorage.clear();
      this.data.announceWheelParts(this.parts);
      this.isAllChecked();
  }

  isAllChecked(): boolean {
    if (this.elItemsList.selectedOptions.selected.length === this.items.length) {
      this.elItemsList.selectAll();
      return this.elCheckAllInp.checked = true;
    }
    return this.elCheckAllInp.checked = false;
  }

  dragStart(event, id: string): void  {
    if (event.target.getAttribute('data-checked') === 'false') {
      event.dataTransfer.setData('value', id);
    }
  }

  setModifyItem(newItem: SpinnerItem): void {
    this.resetMember();
    ItemListComponent.modifyItem(this.items, this.findItemInArray(this.items, newItem), newItem);
    if (ItemListComponent.getArrayItem(this.parts, this.findItemInArray(this.parts, newItem))) {
      ItemListComponent.modifyItem(this.parts, this.findItemInArray(this.parts, newItem), newItem);
      localStorage.setItem('items', JSON.stringify(this.parts));
      this.data.announceWheelParts(this.parts);
    }
  }

  findItemInArray(array: SpinnerItem[], searchItem: SpinnerItem): SpinnerItem {
    return array.find((item: SpinnerItem) => {
      return item._id === searchItem._id;
    });
  }

  deleteItem(): void {
    this.http.deleteItem(this.deletedItem).subscribe(() => {
      this.deleteItemFromItems();
      this.deleteItemFromWheelParts();
      this.setIsDelete(false);
      this.isAllChecked();
    });
  }

  deleteItemFromItems(): void {
    this.items.splice(ItemListComponent.getItemIndexInArray(this.items, this.deletedItem), 1);
  }

  deleteItemFromWheelParts(): void {
    const delItem = this.findItemInArray(this.parts, this.deletedItem);
    if (delItem) {
      this.parts.splice(ItemListComponent.getItemIndexInArray(this.parts, this.deletedItem), 1);
      this.data.announceWheelParts(this.parts);
      this.parts.length ? localStorage.setItem('items', JSON.stringify(this.parts)) : localStorage.clear();
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

  checkedModifyItem(member: SpinnerItem): void {
    this.member = member;
  }

  setIsDelete(value: boolean): void {
    this.isDelete = value;
  }

}
