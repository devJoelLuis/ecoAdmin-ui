import { FluxoCaixaComponent } from './fluxo-caixa/fluxo-caixa.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../seguranca/auth.guard';

const routes: Routes = [
  { path: '', component: FluxoCaixaComponent , canActivate: [AuthGuard],
  data: { roles: ['ROLE_ADMIN'] } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FluxoCaixaRoutingModule { }
