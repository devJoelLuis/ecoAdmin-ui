import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FornecedorRoutingModule } from './fornecedor-routing.module';
import { FornecedorConsultaComponent } from './fornecedor-consulta/fornecedor-consulta.component';
import { FornecedorCadEditComponent } from './fornecedor-cad-edit/fornecedor-cad-edit.component';

import {ButtonModule} from 'primeng/button';
import {TableModule} from 'primeng/table';
import {PaginatorModule} from 'primeng/paginator';
import {TooltipModule} from 'primeng/tooltip';


@NgModule({
  declarations: [
    FornecedorConsultaComponent,
    FornecedorCadEditComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    FornecedorRoutingModule,
    RouterModule,
    ButtonModule,
    TableModule,
    PaginatorModule,
    TooltipModule
  ],
  exports: [
    FornecedorRoutingModule
  ]
})
export class FornecedorModule { }
