import { TarefaModule } from './../shared/tarefa/tarefa.module';
import { CoreModule } from './../core.module';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  RouterModule } from '@angular/router';

import { OrdemServicoRoutingModule } from './ordem-servico-routing.module';
import { TecnicoModule } from './../tecnico/tecnico.module';
import { OrdemServicoComponent } from './ordem-servico/ordem-servico.component';
import { OsFindComponent } from './os-find/os-find.component';
import { LancamentoModule } from './../lancamento/lancamento.module';

import {ButtonModule} from 'primeng/button';
import {CalendarModule} from 'primeng/calendar';
import {CheckboxModule} from 'primeng/checkbox';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {TooltipModule} from 'primeng/tooltip';
import {AccordionModule} from 'primeng/accordion';
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import {RadioButtonModule} from 'primeng/radiobutton';
import {PaginatorModule} from 'primeng/paginator';
import {DialogModule} from 'primeng/dialog';

import { CurrencyMaskModule } from 'ng2-currency-mask';
import { OrdemServicoListagemComponent } from './ordem-servico-listagem/ordem-servico-listagem.component';
import { OsCadEditComponent } from './os-cad-edit/os-cad-edit.component';
import { OsLancamentosComponent } from './os-lancamentos/os-lancamentos.component';
import { RecebimentoCadEditComponent } from './recebimento-cad-edit/recebimento-cad-edit.component';






@NgModule({
  declarations: [
    OrdemServicoComponent,
    OrdemServicoListagemComponent,
    OsCadEditComponent,
    OsFindComponent,
    OsLancamentosComponent,
    RecebimentoCadEditComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    TarefaModule,
    OrdemServicoRoutingModule,
    FormsModule,
    ButtonModule,
    CalendarModule,
    CheckboxModule,
    FormsModule,
    InputTextareaModule,
    TooltipModule,
    AccordionModule,
    TableModule,
    CurrencyMaskModule,
    DropdownModule,
    TecnicoModule,
    RadioButtonModule,
    PaginatorModule,
    DialogModule,
    LancamentoModule
  ],
  exports: [
    OrdemServicoComponent
  ]
})
export class OrdemServicoModule { }
