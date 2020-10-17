import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrincipalComponent } from './principal/principal.component';
import { PaginaNaoEncontradaComponent } from './shared/pagina-nao-encontrada/pagina-nao-encontrada.component';
import { ReciboComponent } from './recibo/recibo.component';
import { AuthGuard } from './seguranca/auth.guard';
import { NaoAutorizadoComponent } from './shared/nao-autorizado/nao-autorizado.component';
import { LoginComponent } from './login/login.component';


const routes: Routes = [
  { path: '', component: LoginComponent},
  { path: 'nao-autorizado', component: NaoAutorizadoComponent, canActivate: [AuthGuard]},
  { path: 'recibo', component: ReciboComponent, canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent },
  { path: 'dash', component: PrincipalComponent, canActivate: [AuthGuard] },
  { path: 'perfil', loadChildren: './perfil/perfil.module#PerfilModule' },
  { path: 'despesas', loadChildren: './despesa/despesa.module#DespesaModule'},
  { path: 'configuracao', loadChildren: './configuracao/configuracao.module#ConfiguracaoModule' },
  { path: 'categoriasRecebimento', loadChildren: './categoria-recebimento/categoria-recebimento.module#CategoriaRecebimentoModule' },
  { path: 'usuarios', loadChildren: './usuario/usuario.module#UsuarioModule'},
  { path: 'tecnico', loadChildren: './tecnico/tecnico.module#TecnicoModule'},
  { path: 'fornecedor', loadChildren: './fornecedor/fornecedor.module#FornecedorModule'},
  { path: 'cliente', loadChildren: './cliente-module/cliente.module#ClienteModule' },
  { path: 'status', loadChildren: './status/status.module#StatusModule' },
  { path: 'gerencia', loadChildren: './gerencia/gerencia.module#GerenciaModule' },
  { path: 'ordem-servico', loadChildren: './ordem-servico/ordem-servico.module#OrdemServicoModule' },
  { path: 'fluxocaixa', loadChildren: './fluxo-caixa/fluxo-caixa.module#FluxoCaixaModule' },
  { path: 'prazos', loadChildren: './prazo/prazo.module#PrazoModule'},
  { path: 'licenca-filtro', loadChildren: './licenca-filtro/licenca-filtro.module#LicencaFiltroModule' },
  { path: 'lancamento', loadChildren: './lancamento/lancamento.module#LancamentoModule' },
  { path: 'categorias', loadChildren: './categoria/categoria.module#CategoriaModule' },
  { path: 'statusOs', loadChildren: './status-os/status-os.module#StatusOsModule' },
  { path: 'not-found', component: PaginaNaoEncontradaComponent,canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'not-found' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
