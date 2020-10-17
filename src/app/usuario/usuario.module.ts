import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuarioRoutingModule } from './usuario-routing.module';
import { UsuarioConsultaComponent } from './usuario-consulta/usuario-consulta.component';
import { UsuarioCadEditComponent } from './usuario-cad-edit/usuario-cad-edit.component';

import {TableModule} from 'primeng/table';
import {TooltipModule} from 'primeng/tooltip';
import {CheckboxModule} from 'primeng/checkbox';

@NgModule({
  declarations: [UsuarioConsultaComponent, UsuarioCadEditComponent],
  imports: [
    CommonModule,
    UsuarioRoutingModule,
    FormsModule,
    TableModule,
    TooltipModule,
    CheckboxModule
  ]
})
export class UsuarioModule { }
