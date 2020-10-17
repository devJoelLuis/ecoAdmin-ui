
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatusOsPesquisaComponent } from './status-os-pesquisa/status-os-pesquisa.component';
import { StatusOsRoutingModule } from './status-os-routing.module';

import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  declarations: [
    StatusOsPesquisaComponent
  ],
  imports: [
    CommonModule,
    StatusOsRoutingModule,
    TableModule,
    PaginatorModule,
    ButtonModule,
    TooltipModule

  ]
})
export class StatusOsModule { }
