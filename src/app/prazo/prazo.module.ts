import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrazoRoutingModule } from './prazo-routing.module';
import { PrazoOsListComponent } from './prazo-os-list/prazo-os-list.component';
import { PrazoFiltroComponent } from './prazo-filtro/prazo-filtro.component';

import {TableModule} from 'primeng/table';
import {TooltipModule} from 'primeng/tooltip';
import {CalendarModule} from 'primeng/calendar';
import {DialogModule} from 'primeng/dialog';
import {CheckboxModule} from 'primeng/checkbox';
import {RadioButtonModule} from 'primeng/radiobutton';
import {PaginatorModule} from 'primeng/paginator';


@NgModule({
  declarations: [
    PrazoOsListComponent,
    PrazoFiltroComponent
  ],
  imports: [
    CommonModule,
    PrazoRoutingModule,
    TableModule,
    TooltipModule,
    CalendarModule,
    DialogModule,
    FormsModule,
    CheckboxModule,
    RadioButtonModule,
    PaginatorModule

  ]
})
export class PrazoModule { }
