import { EmailCadEditComponent } from './email-cad-edit/email-cad-edit.component';
import { AuthGuard } from './../seguranca/auth.guard';
import { EmailAlertaComponent } from './email-alerta/email-alerta.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {path: '', component: EmailAlertaComponent, canActivate: [AuthGuard],
   data: { roles: ['ROLE_ADMIN'] } },
  {path: 'novo', component: EmailCadEditComponent, canActivate: [AuthGuard],
   data: { roles: ['ROLE_ADMIN']} },
   {path: ':id', component: EmailCadEditComponent, canActivate: [AuthGuard],
   data: { roles: ['ROLE_ADMIN']} },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfiguracaoRoutingModule { }
