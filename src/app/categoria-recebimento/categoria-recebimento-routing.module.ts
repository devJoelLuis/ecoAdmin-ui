import { TranferenciaComponent } from './tranferencia/tranferencia.component';
import { HistoricoCatRecebimentoComponent } from './historico-cat-recebimento/historico-cat-recebimento.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoriaRecebimentoComponent } from './categoria-recebimento/categoria-recebimento.component';
import { AuthGuard } from '../seguranca/auth.guard';

const routes: Routes = [
  { path: '', component: CategoriaRecebimentoComponent, canActivate: [AuthGuard] ,
  data: { roles: ['ROLE_ADMIN'] } },
  { path: 'transferencia', component: TranferenciaComponent, canActivate: [AuthGuard] ,
  data: { roles: ['ROLE_ADMIN'] } },
  { path: 'historico/:id', component: HistoricoCatRecebimentoComponent, canActivate: [AuthGuard] ,
  data: { roles: ['ROLE_ADMIN'] } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriaRecebimentoRoutingModule { }
