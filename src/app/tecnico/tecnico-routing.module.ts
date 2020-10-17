import { TecnicoCadEditComponent } from './tecnico-cad-edit/tecnico-cad-edit.component';
import { TecnicoPesquisaComponent } from './tecnico-pesquisa/tecnico-pesquisa.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../seguranca/auth.guard';


const routes: Routes = [
  { path: '', component: TecnicoPesquisaComponent, canActivate: [AuthGuard] ,
  data: { roles: ['ROLE_ADMIN', 'ROLE_TECNICO'] } },
  { path: 'novo', component: TecnicoCadEditComponent, canActivate: [AuthGuard] ,
  data: { roles: ['ROLE_ADMIN', 'ROLE_TECNICO'] } },
  { path: ':id', component: TecnicoCadEditComponent, canActivate: [AuthGuard] ,
  data: { roles: ['ROLE_ADMIN', 'ROLE_TECNICO'] } },
];

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
export class TecnicoRoutingModule { }
