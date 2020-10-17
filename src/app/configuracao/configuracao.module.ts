import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfiguracaoRoutingModule } from './configuracao-routing.module';
import { EmailAlertaComponent } from './email-alerta/email-alerta.component';

import {TableModule} from 'primeng/table';
import { EmailCadEditComponent } from './email-cad-edit/email-cad-edit.component';

import {TooltipModule} from 'primeng/tooltip';

@NgModule({
  declarations: [EmailAlertaComponent, EmailCadEditComponent],
  imports: [
    CommonModule,
    ConfiguracaoRoutingModule,
    TableModule,
    FormsModule,
    TooltipModule
  ]
})
export class ConfiguracaoModule { }
