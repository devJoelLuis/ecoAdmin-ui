import { ClienteGerenciaComponent } from './cliente-gerencia/cliente-gerencia.component';
import { ClienteCadEditComponent } from './cliente-cad-edit/cliente-cad-edit.component';
import { ClientePesquisaComponent } from './cliente-pesquisa/cliente-pesquisa.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../seguranca/auth.guard';

const routes: Routes = [
  { path: '', component: ClientePesquisaComponent , canActivate: [AuthGuard],
  data: { roles: ['ROLE_ADMIN', 'ROLE_CLIENTE'] } },
  { path: 'novo', component: ClienteCadEditComponent, canActivate: [AuthGuard],
  data: { roles: ['ROLE_ADMIN', 'ROLE_CLIENTE'] } },
  { path: 'gerencia/:id', component: ClienteGerenciaComponent, canActivate: [AuthGuard],
  data: { roles: ['ROLE_ADMIN', 'ROLE_CLIENTE_GERENCIAR'] } },
  { path: ':id', component: ClienteCadEditComponent , canActivate: [AuthGuard],
  data: { roles: ['ROLE_ADMIN', 'ROLE_CLIENTE'] } },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports:[RouterModule]
})
export class ClienteRoutingModule { }
