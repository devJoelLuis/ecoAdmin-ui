import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { StatusOsPesquisaComponent } from './status-os-pesquisa/status-os-pesquisa.component';
import { AuthGuard } from '../seguranca/auth.guard';

const routes: Routes = [
  { path: '', component: StatusOsPesquisaComponent, canActivate: [AuthGuard],
  data: { roles: ['ROLE_ADMIN', 'ROLE_STATUS_OS'] } },
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class StatusOsRoutingModule { }
