import { DespesaCadEditComponent } from './despesa-cad-edit/despesa-cad-edit.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DespesaConsultaComponent } from './despesa-consulta/despesa-consulta.component';
import { AuthGuard } from '../seguranca/auth.guard';

const routes: Routes = [
  { path: '', component: DespesaConsultaComponent, canActivate: [AuthGuard] ,
  data: { roles: ['ROLE_ADMIN'] } },
  { path: 'nova', component: DespesaCadEditComponent, canActivate: [AuthGuard] ,
  data: { roles: ['ROLE_ADMIN'] } },
  { path: ':id', component: DespesaCadEditComponent, canActivate: [AuthGuard] ,
  data: { roles: ['ROLE_ADMIN'] } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DespesaRoutingModule { }
