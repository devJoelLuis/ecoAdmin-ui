import { PrazoFiltroComponent } from './prazo-filtro/prazo-filtro.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './../seguranca/auth.guard';
import { PrazoOsListComponent } from './prazo-os-list/prazo-os-list.component';

const routes: Routes = [

  { path: 'filtro', component: PrazoFiltroComponent, canActivate: [AuthGuard] },
  { path: ':idos', component: PrazoOsListComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrazoRoutingModule { }
