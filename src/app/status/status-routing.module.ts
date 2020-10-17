import { StatusPesquisaComponent } from './status-pesquisa/status-pesquisa.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../seguranca/auth.guard';

const routes: Routes = [
  { path: '', component: StatusPesquisaComponent, canActivate: [AuthGuard],
  data: { roles: ['ROLE_ADMIN', 'ROLE_STATUS_CLIENTE'] } },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class StatusRoutingModule { }
