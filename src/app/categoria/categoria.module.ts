import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriaRoutingModule } from './categoria-routing.module';
import { CategoriaConsultaComponent } from './categoria-consulta/categoria-consulta.component';
import { CategoriaCadEditComponent } from './categoria-cad-edit/categoria-cad-edit.component';

import {ButtonModule} from 'primeng/button';
import {TableModule} from 'primeng/table';
import {RadioButtonModule} from 'primeng/radiobutton';
import {TooltipModule} from 'primeng/tooltip';


@NgModule({
  declarations: [
    CategoriaConsultaComponent,
    CategoriaCadEditComponent
  ],
  imports: [
    CommonModule,
    CategoriaRoutingModule,
    FormsModule,
    RouterModule,
    ButtonModule,
    TableModule,
    RadioButtonModule,
    TooltipModule

  ]
})
export class CategoriaModule { }
