import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FluxoCaixaRoutingModule } from './fluxo-caixa-routing.module';
import { FluxoCaixaComponent } from './fluxo-caixa/fluxo-caixa.component';

import {CalendarModule} from 'primeng/calendar';
import {TableModule} from 'primeng/table';
import {TabViewModule} from 'primeng/tabview';


@NgModule({
  declarations: [FluxoCaixaComponent],
  imports: [
    CommonModule,
    FluxoCaixaRoutingModule,
    FormsModule,
    CalendarModule,
    TableModule,
    TabViewModule
  ]
})
export class FluxoCaixaModule { }
