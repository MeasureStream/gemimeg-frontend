import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-info-dialog',
  templateUrl: './info-dialog.component.html',
  styleUrls: ['./info-dialog.component.scss']
})
export class InfoDialogComponent {
  @Output() close = new EventEmitter<void>();

  ngOnInit(): void {
  }

  closeDialog(): void {
    this.close.emit();
  }
}
