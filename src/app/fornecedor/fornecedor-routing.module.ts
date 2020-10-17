import { FornecedorCadEditComponent } from './fornecedor-cad-edit/fornecedor-cad-edit.component';
import { FornecedorConsultaComponent } from './fornecedor-consulta/fornecedor-consulta.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../seguranca/auth.guard';


const routes: Routes = [
  { path: '', component: FornecedorConsultaComponent , canActivate: [AuthGuard],
  data: { roles: ['ROLE_ADMIN', 'ROLE_FORNECEDOR'] } },
  { path: 'novo', component: FornecedorCadEditComponent , canActivate: [AuthGuard],
  data: { roles: ['ROLE_ADMIN', 'ROLE_FORNECEDOR'] } },
  { path: ':id', component: FornecedorCadEditComponent , canActivate: [AuthGuard],
  data: { roles: ['ROLE_ADMIN', 'ROLE_FORNECEDOR'] } },
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
export class FornecedorRoutingModule { }
