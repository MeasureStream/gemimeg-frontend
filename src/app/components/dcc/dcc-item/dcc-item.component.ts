import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  WritableSignal,
} from '@angular/core';
import { ItemDto } from 'src/app/generated/dcc/model/itemDto';
import { InitializationService } from 'src/app/services/dcc/initialization.service';

@Component({
  selector: 'app-dcc-item',
  templateUrl: './dcc-item.component.html',
  styleUrls: ['./dcc-item.component.scss'],
})
export class DccItemComponent implements OnInit, OnChanges {
  @Input() item!: ItemDto;
  @Input() manufacturerAvailable!: WritableSignal<{ [key: number]: boolean }>;
  @Input() index!: number;
  @Input() canRemove!: boolean;
  @Input() isInitiallyExpanded!: boolean;
  @Output() removeItem = new EventEmitter<number>();

  isCardExpanded: boolean = false;
  constructor(private initializationService: InitializationService) {}

  ngOnInit(): void {
    this.isCardExpanded = this.isInitiallyExpanded === true ? this.isInitiallyExpanded : false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('item' in changes) {
      if (!this.item) {
        this.item = this.initializationService.getEmptyItemDto();
      }
    }
  }

  addManufacturer(index: number) {
    if (this.item) {
      this.item.manufacturer = this.initializationService.getEmptyContactDto();
    }
    this.manufacturerAvailable.update((state) => ({ ...state, [index]: true }));
  }

  deleteManufacturer() {
    if (this.item) {
      this.item.manufacturer = this.initializationService.getEmptyContactDto();
      this.item.manufacturer!.location = this.initializationService.getEmptyLocationDto();
      this.manufacturerAvailable.update((state) => ({
        ...state,
        [this.index]: false,
      }));
    }
  }

  toggleCard() {
    this.isCardExpanded = !this.isCardExpanded;
  }
  onRemoveItem() {
    this.removeItem.emit();
  }
}
