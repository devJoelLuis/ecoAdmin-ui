import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GerenciaRoutingModule } from './gerencia-routing.module';
import { GerenciaComponent } from './gerencia/gerencia.component';


@NgModule({
  declarations: [
    GerenciaComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    GerenciaRoutingModule
  ]
})
export class GerenciaModule { }
