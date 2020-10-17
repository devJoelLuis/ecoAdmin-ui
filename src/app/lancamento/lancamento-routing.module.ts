import { LancamentoFiltroComponent } from './lancamento-filtro/lancamento-filtro.component';
import { AuthGuard } from './../seguranca/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LancamentoConsultaComponent } from './lancamento-consulta/lancamento-consulta.component';
import { LancamentoCadEditComponent } from './lancamento-cad-edit/lancamento-cad-edit.component';

const routes: Routes = [
  { path: '', component: LancamentoConsultaComponent, canActivate: [AuthGuard] ,
  data: { roles: ['ROLE_ADMIN', 'ROLE_LANCAMENTO'] } },
  { path: 'novo', component: LancamentoCadEditComponent, canActivate: [AuthGuard] ,
  data: { roles: ['ROLE_ADMIN', 'ROLE_LANCAMENTO'] } },
  { path: 'filtro', component: LancamentoFiltroComponent, canActivate: [AuthGuard] ,
  data: { roles: ['ROLE_ADMIN', 'ROLE_LANCAMENTO'] } },
  { path: ':id', component: LancamentoCadEditComponent, canActivate: [AuthGuard]  ,
  data: { roles: ['ROLE_ADMIN', 'ROLE_LANCAMENTO'] } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LancamentoRoutingModule { }
