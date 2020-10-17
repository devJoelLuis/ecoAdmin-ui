import { AuthGuard } from './../seguranca/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsuarioConsultaComponent } from './usuario-consulta/usuario-consulta.component';
import { UsuarioCadEditComponent } from './usuario-cad-edit/usuario-cad-edit.component';

const routes: Routes = [
  { path: '', component: UsuarioConsultaComponent, canActivate: [AuthGuard] ,
  data: { roles: ['ROLE_ADMIN'] } },
  { path: 'novo', component: UsuarioCadEditComponent, canActivate: [AuthGuard] ,
  data: { roles: ['ROLE_ADMIN'] } },
  { path: ':id', component: UsuarioCadEditComponent, canActivate: [AuthGuard] ,
  data: { roles: ['ROLE_ADMIN'] } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuarioRoutingModule { }
