

import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

import { StatusPesquisaComponent } from './status-pesquisa/status-pesquisa.component';
import { StatusRoutingModule } from './status-routing.module';


@NgModule({
  declarations: [StatusPesquisaComponent],
  imports: [
    CommonModule,
    StatusRoutingModule,
    RouterModule,
    FormsModule,
    PaginatorModule,
    TableModule,
    ButtonModule,
    TooltipModule
  ]
})
export class StatusModule { }
