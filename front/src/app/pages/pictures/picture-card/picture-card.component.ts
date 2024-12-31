import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Thermo } from '../../../interfaces/thermo';
import { HelperService } from '../../../services/helper.service';

@Component({
  selector: 'app-picture-card',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule
  ],
  providers: [DatePipe],
  templateUrl: './picture-card.component.html',
  styleUrl: './picture-card.component.scss'
})
export class PictureCardComponent implements OnInit {


  @Input() thermo?: Thermo;
  @Input() isManualAdd = false; // Will the thermo measure be added manually?

  @Output() delete = new EventEmitter<Thermo>();
  @Output() edit = new EventEmitter<Thermo>();

  editedThermo?: Thermo;
  toDate: any;
  formattedMeasureDate = '';

  editing = false;
  editLoading = false;

  helperService = inject(HelperService);
  datePipe = inject(DatePipe);
  translateService = inject(TranslateModule);

  ngOnInit(): void {
    this.toDate = this.helperService.toDate;

    // Deep copy of the thermo object
    if (this.thermo) {
      this.editedThermo = JSON.parse(JSON.stringify(this.thermo));
      this.editedThermo!.measureDate = new Date(this.thermo.measureDate);
      this.formattedMeasureDate = this.datePipe.transform(this.editedThermo?.measureDate, 'dd/MM/yyyy, HH:mm') ?? '';
    }

    if (this.isManualAdd) {
      this.editing = true;
    }
  }


  /**
   * Emit the delete event
   */
  onDelete() {
    this.delete.emit(this.thermo);
  }


  /**
   * On measure date changes
   * @param event 
   * @returns 
   */
  onMeasureDateChange(event: any) {
    const newMeasureDate = new Date(event);
    if (isNaN(newMeasureDate.getTime())) {
      return;
    }
    this.editedThermo!.measureDate = new Date(event);
    if (this.isManualAdd) {
      this.edit.emit(this.editedThermo!);
    }
  }

  onEditClicked() {
    this.editing = true;
  }

  /**
   * On reset button clicked (return to initial state)
   */
  onResetClicked() {
    this.editedThermo = JSON.parse(JSON.stringify(this.thermo));
    this.formattedMeasureDate = this.datePipe.transform(this.editedThermo?.measureDate, 'yyyy-MM-dd HH:mm') || '';
    this.editing = false;
  }


  /**
   * On measure value changes
   * @param event 
   */
  onMeasureValueChange(event: any) {
    if (this.isManualAdd) {
      this.edit.emit(this.editedThermo!);
    }
  }


  /**
   * The user confirm to edit the thermo measure
   * @returns 
   */
  doEditThermo() {
    if (this.editLoading) {
      return;
    }
    let isDetected = true;
    if (this.editedThermo?.temperature == null) {
      isDetected = false;
    }
    this.editedThermo!.isDetected = isDetected;

    // Todo: Update the thermo measure in localstorage
  }


}
