import { LicensaFiltroEditComponent } from './licensa-filtro-edit/licensa-filtro-edit.component';
import { AuthGuard } from './../seguranca/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LicencaFiltroComponent } from './licenca-filtro/licenca-filtro.component';

const routes: Routes = [
  {path: '', component: LicencaFiltroComponent, canActivate: [AuthGuard] ,
  data: { roles: ['ROLE_ADMIN', 'ROLE_LICENCA'] } },

  {path: ':id', component: LicensaFiltroEditComponent, canActivate: [AuthGuard] ,
  data: { roles: ['ROLE_ADMIN', 'ROLE_LICENCA'] } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LicencaFiltroRoutingModule { }
