import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MeasurementResultDto } from 'src/app/generated/dcc/model/measurementResultDto';
import { InitializationService } from 'src/app/services/dcc/initialization.service';

@Component({
  selector: 'app-dcc-measuring-results',
  templateUrl: './dcc-measuring-results.component.html',
  styleUrls: ['./dcc-measuring-results.component.scss'],
})
export class DccMeasuringResultsComponent {
  @Input() measurementResults: Array<MeasurementResultDto> | any;
  @Input() isExpanded: { [key: string]: boolean } = {};
  @Input() headerMetaData: any;
  header_meta_data = 'Meta-Data';
  @Input() idPrefix!: string;
  @Output() addMeasurementResult = new EventEmitter<MeasurementResultDto>();
  @Output() removeMeasurementResult = new EventEmitter<number>();

  constructor(private initService: InitializationService) {}

  onAddMeasurementResult(): void {
    const newResult = this.initService.getEmptyMeasurementResultDto();
    this.addMeasurementResult.emit(newResult);
    console.log('this is a test in dcc-measuring-results')
  }

  onRemoveMeasurementResult(index: number): void {
    this.removeMeasurementResult.emit(index);
  }

  toggleCard(key: string): void {
    this.isExpanded[key] = !this.isExpanded[key];
  }
}
