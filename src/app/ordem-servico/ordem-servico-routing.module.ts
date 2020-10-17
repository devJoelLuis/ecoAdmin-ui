import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { OsLancamentosComponent } from './os-lancamentos/os-lancamentos.component';
import { OsFindComponent } from './os-find/os-find.component';
import { OsCadEditComponent } from './os-cad-edit/os-cad-edit.component';
import { OrdemServicoListagemComponent } from './ordem-servico-listagem/ordem-servico-listagem.component';
import { OrdemServicoComponent } from './ordem-servico/ordem-servico.component';
import { AuthGuard } from '../seguranca/auth.guard';


const routes: Routes = [
  { path: 'novo', component: OsCadEditComponent, canActivate: [AuthGuard],
  data: { roles: ['ROLE_ADMIN', 'ROLE_OS'] } },
  { path: 'osfind/:tipo', component: OsFindComponent, canActivate: [AuthGuard],
  data: { roles: ['ROLE_ADMIN', 'ROLE_FINANCAS'] } },
  { path: 'lancamentos/:idos', component: OsLancamentosComponent, canActivate: [AuthGuard],
  data: { roles: ['ROLE_ADMIN', 'ROLE_FINANCAS'] } },
  { path: 'edit/:idos', component: OsCadEditComponent, canActivate: [AuthGuard],
  data: { roles: ['ROLE_ADMIN', 'ROLE_OS'] } },
  { path: 'oslist', component: OrdemServicoListagemComponent , canActivate: [AuthGuard],
  data: { roles: ['ROLE_ADMIN', 'ROLE_OS'] } },
  { path: ':id', component: OrdemServicoComponent , canActivate: [AuthGuard],
  data: { roles: ['ROLE_ADMIN', 'ROLE_OS'] } },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule
  ]
})
export class OrdemServicoRoutingModule { }
