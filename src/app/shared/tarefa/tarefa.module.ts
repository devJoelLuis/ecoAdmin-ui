import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TarefaCadastroComponent } from './tarefa-cadastro/tarefa-cadastro.component';

@NgModule({
  declarations: [
    TarefaCadastroComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    TarefaCadastroComponent
  ]
})
export class TarefaModule { }
