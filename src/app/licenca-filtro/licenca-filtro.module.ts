import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import {CheckboxModule} from 'primeng/checkbox';
import {RadioButtonModule} from 'primeng/radiobutton';
import {TableModule} from 'primeng/table';
import {PaginatorModule} from 'primeng/paginator';
import {CalendarModule} from 'primeng/calendar';
import {TooltipModule} from 'primeng/tooltip';
import {ButtonModule} from 'primeng/button';


import { LicencaFiltroRoutingModule } from './licenca-filtro-routing.module';
import { LicencaFiltroComponent } from './licenca-filtro/licenca-filtro.component';
import { LicensaFiltroEditComponent } from './licensa-filtro-edit/licensa-filtro-edit.component';


@NgModule({
  declarations: [LicencaFiltroComponent, LicensaFiltroEditComponent],
  imports: [
    CommonModule,
    FormsModule,
    LicencaFiltroRoutingModule,
    RouterModule,
    CheckboxModule,
    RadioButtonModule,
    TableModule,
    PaginatorModule,
    CalendarModule,
    TooltipModule,
    ButtonModule
  ],
  exports: [
    RouterModule
  ]
})
export class LicencaFiltroModule { }
