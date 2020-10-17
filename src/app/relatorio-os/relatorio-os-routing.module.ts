import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RelatorioOsComponent } from './relatorio-os/relatorio-os.component';
import { AuthGuard } from '../seguranca/auth.guard';

const routes: Routes = [
  {path: ':id', component: RelatorioOsComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RelatorioOsRoutingModule { }
