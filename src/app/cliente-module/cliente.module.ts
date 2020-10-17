import { OrdemServicoModule } from './../ordem-servico/ordem-servico.module';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ClientePesquisaComponent } from './cliente-pesquisa/cliente-pesquisa.component';
import { ClienteRoutingModule } from './cliente-routing.module';
import { ClienteCadEditComponent } from './cliente-cad-edit/cliente-cad-edit.component';
import { ClienteGerenciaComponent } from './cliente-gerencia/cliente-gerencia.component';
import { GerenciamentoComponent } from './gerenciamento/gerenciamento.component';

import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {TooltipModule} from 'primeng/tooltip';
import {PaginatorModule} from 'primeng/paginator';
import {TabViewModule} from 'primeng/tabview';
import { SenhaComponent } from './senha/senha.component';
import {CalendarModule} from 'primeng/calendar';
import {CheckboxModule} from 'primeng/checkbox';



import { CurrencyMaskModule } from 'ng2-currency-mask';
import { OrcamentoComponent } from './orcamento/orcamento/orcamento.component';
import { OrcamentoConsultaComponent } from './orcamento/orcamento-consulta/orcamento-consulta.component';
import { OrcamentoCadEditComponent } from './orcamento/orcamento-cad-edit/orcamento-cad-edit.component';
import { LicencaComponent } from './licenca/licenca.component';
import { LicencaConsultaComponent } from './licenca/licenca-consulta/licenca-consulta.component';
import { LicencaCadEditComponent } from './licenca/licenca-cad-edit/licenca-cad-edit.component';



@NgModule({
  declarations: [
    ClientePesquisaComponent,
    ClienteCadEditComponent,
    ClienteGerenciaComponent,
    SenhaComponent,
    GerenciamentoComponent,
    OrcamentoComponent,
    OrcamentoConsultaComponent,
    OrcamentoCadEditComponent,
    LicencaComponent,
    LicencaConsultaComponent,
    LicencaCadEditComponent
  ],
  imports: [
    CommonModule,
    ClienteRoutingModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DropdownModule,
    InputTextareaModule,
    TooltipModule,
    PaginatorModule,
    TabViewModule,
    OrdemServicoModule,
    CurrencyMaskModule,
    CalendarModule,
    CheckboxModule
  ]
})
export class ClienteModule { }
