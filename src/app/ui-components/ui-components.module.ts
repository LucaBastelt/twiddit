import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { DragDropModule } from 'primeng/dragdrop';
import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CalendarModule } from 'primeng/calendar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ButtonModule,
    DataViewModule,
    DragDropModule,
    PanelModule,
    CardModule,
    DialogModule,
    InputTextareaModule,
    CheckboxModule,
    InputTextModule,
    SelectButtonModule,
    CalendarModule,
    NgbModule,
  ],
  exports: [
    ButtonModule,
    DataViewModule,
    DragDropModule,
    PanelModule,
    CardModule,
    DialogModule,
    InputTextareaModule,
    CheckboxModule,
    InputTextModule,
    SelectButtonModule,
    CalendarModule,
    NgbModule,
  ]
})
export class UiComponentsModule {}
