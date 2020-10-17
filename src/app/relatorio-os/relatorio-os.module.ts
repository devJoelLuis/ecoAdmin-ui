
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { RelatorioOsRoutingModule } from './relatorio-os-routing.module';
import { RelatorioOsComponent } from './relatorio-os/relatorio-os.component';

@NgModule({
  declarations: [
    RelatorioOsComponent
  ],
  imports: [
    CommonModule,
    RelatorioOsRoutingModule,
    RouterModule
  ],
  exports: [
    RelatorioOsRoutingModule
  ]
})
export class RelatorioOsModule { }
