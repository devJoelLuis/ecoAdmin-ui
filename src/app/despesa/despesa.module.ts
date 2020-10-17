import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DespesaRoutingModule } from './despesa-routing.module';
import { DespesaConsultaComponent } from './despesa-consulta/despesa-consulta.component';
import { DespesaCadEditComponent } from './despesa-cad-edit/despesa-cad-edit.component';

import {PaginatorModule} from 'primeng/paginator';
import {TableModule} from 'primeng/table';
import {CalendarModule} from 'primeng/calendar';
import {DropdownModule} from 'primeng/dropdown';
import {TooltipModule} from 'primeng/tooltip';
import {CheckboxModule} from 'primeng/checkbox';
import {DialogModule} from 'primeng/dialog';
import {RadioButtonModule} from 'primeng/radiobutton';


import { CurrencyMaskModule } from 'ng2-currency-mask';

@NgModule({
  declarations: [DespesaConsultaComponent, DespesaCadEditComponent],
  imports: [
    CommonModule,
    DespesaRoutingModule,
    PaginatorModule,
    TableModule,
    CalendarModule,
    DropdownModule,
    ReactiveFormsModule,
    CurrencyMaskModule,
    TooltipModule,
    CheckboxModule,
    DialogModule,
    FormsModule,
    RadioButtonModule

  ]
})
export class DespesaModule { }
