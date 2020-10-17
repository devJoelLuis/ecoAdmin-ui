import { CategoriaCadEditComponent } from './categoria-cad-edit/categoria-cad-edit.component';
import { AuthGuard } from './../seguranca/auth.guard';
import { CategoriaConsultaComponent } from './categoria-consulta/categoria-consulta.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {path: '', component:  CategoriaConsultaComponent, canActivate: [AuthGuard],
  data: { roles: ['ROLE_CATEGORIA', 'ROLE_ADMIN'] }
  },
  {path: 'nova', component:  CategoriaCadEditComponent, canActivate: [AuthGuard],
  data: { roles: ['ROLE_CATEGORIA', 'ROLE_ADMIN'] }
},
  {path: ':id', component:  CategoriaCadEditComponent, canActivate: [AuthGuard],
  data: { roles: ['ROLE_CATEGORIA', 'ROLE_ADMIN'] }
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriaRoutingModule { }
