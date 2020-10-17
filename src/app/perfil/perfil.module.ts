import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PerfilRoutingModule } from './perfil-routing.module';
import { PerfilEditComponent } from './perfil-edit/perfil-edit.component';

@NgModule({
  declarations: [PerfilEditComponent],
  imports: [
    CommonModule,
    PerfilRoutingModule,
    FormsModule
  ]
})
export class PerfilModule { }
