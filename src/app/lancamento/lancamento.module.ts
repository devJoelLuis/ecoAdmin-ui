import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LancamentoRoutingModule } from './lancamento-routing.module';
import { LancamentoConsultaComponent } from './lancamento-consulta/lancamento-consulta.component';
import { LancamentoCadEditComponent } from './lancamento-cad-edit/lancamento-cad-edit.component';


import {ButtonModule} from 'primeng/button';
import {PaginatorModule} from 'primeng/paginator';
import {TableModule} from 'primeng/table';
import {RadioButtonModule} from 'primeng/radiobutton';
import {CalendarModule} from 'primeng/calendar';
import {TooltipModule} from 'primeng/tooltip';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {DropdownModule} from 'primeng/dropdown';

import { CurrencyMaskModule } from 'ng2-currency-mask';
import { LancamentoFiltroComponent } from './lancamento-filtro/lancamento-filtro.component';


@NgModule({
  declarations: [
    LancamentoConsultaComponent,
    LancamentoCadEditComponent,
    LancamentoFiltroComponent
  ],
  imports: [
    CommonModule,
    LancamentoRoutingModule,
    ButtonModule,
    PaginatorModule,
    FormsModule,
    TableModule,
    RouterModule,
    RadioButtonModule,
    CalendarModule,
    CurrencyMaskModule,
    TooltipModule,
    ConfirmDialogModule,
    DropdownModule

  ],
  exports: [
    LancamentoCadEditComponent,
  ]
})
export class LancamentoModule { }
