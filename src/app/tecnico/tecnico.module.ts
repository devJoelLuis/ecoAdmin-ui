import { TecnicoRoutingModule } from './tecnico-routing.module';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TecnicoCadEditComponent } from './tecnico-cad-edit/tecnico-cad-edit.component';
import { TecnicoPesquisaComponent } from './tecnico-pesquisa/tecnico-pesquisa.component';

import {ButtonModule} from 'primeng/button';
import {TableModule} from 'primeng/table';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {TooltipModule} from 'primeng/tooltip';
import {ConfirmDialogModule} from 'primeng/confirmdialog';


@NgModule({
  declarations: [
    TecnicoCadEditComponent,
    TecnicoPesquisaComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    InputTextareaModule,
    TooltipModule,
    TecnicoRoutingModule,
    ConfirmDialogModule
  ],
  exports: [
    TecnicoCadEditComponent
  ]
})
export class TecnicoModule { }
