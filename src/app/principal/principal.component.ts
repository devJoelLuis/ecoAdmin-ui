import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { LembreteService } from './../servicos/lembrete.service';
import { Tarefa } from './../model/tarefa.class';
import { OrdemServicoService } from './../servicos/ordemServico.service';
import { OrdemServico } from './../model/OrdemServico';
import { TecnicoTarefasDTO } from './../model/tecnicoTarefasDTO.class';


import { ErrorHandlerService } from 'src/app/shared/error-handler.service';
import { DashboardService } from './../servicos/dashboard.service';
import { Dashboard } from './../model/dashboard';
import { AuthService } from './../seguranca/auth.service';

import { MessageService, ConfirmationService } from 'primeng/api';
import { Tecnico } from '../model/tecnico';
import { Lembrete } from '../model/lembrete.class';


@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit, OnDestroy {


  mostrarLembrete = true;
  mostrarTarefa = true;
  load = false;
  dash = new Dashboard();
  //diasvencer = 4;
  totalVencidos = 0;
  umDiaMili =  1000 * 60 * 60 * 24;
  dtnow = new Date();
  //pega primeiro dia do mes
  //dtinicioSr = new Date(this.dtnow.getFullYear(), this.dtnow.getMonth(), 1);
  //pega ultimo dia do mes
  //dtfimSr = new Date(this.dtnow.getFullYear(), this.dtnow.getMonth() + 1, 0);
  // pega o dia atual menos 15 dias
  //dtinicioSr = new Date(this.dtnow.getTime() - this.umDiaMili * 15);
  //dtfimSr = new Date(this.dtnow.getTime() + this.umDiaMili * 15);

  tarefa = new Tarefa();
  tarefasDTO: TecnicoTarefasDTO[] = [];
  modoAddOs = false;
  modoEditTarefa = false;
  modoEditLembrete = false;
  dialogOn = false;
  dialogLembrete = false;
  tecnicoSelecionado = new Tecnico();
  param = '';
  oss: OrdemServico[] = [];
  osSelecinada: OrdemServico;
  lembrete = new Lembrete();

  interval: any;

  dialogTitulo = 'Nova Tarefa';
  dialogTituloLembrete = 'Novo Lembrete';


  constructor(
    public auth: AuthService,
    private service: DashboardService,
    private erroHandler: ErrorHandlerService,
    private message: MessageService,
    private router: Router,
    private serviceOs: OrdemServicoService,
    private confirm: ConfirmationService,
    private serviceLembrete: LembreteService
  ) { }


  ngOnDestroy() {
    clearInterval(this.interval);
  }


  ngOnInit() {
    this.getDash();
    if (this.auth.estaLogado()) {
    this.carregarTarefas();
    this.interval = setInterval(() => {
        this.carregarTarefas();
    }, 10000); // dez segundos
   }
  }

getDash() {
  this.load = true;
   this.service.getDahs()
       .toPromise()
       .then( ret => {
         this.load = false;
         this.dash = ret['dados'];
       })
       .catch( er => {
         this.load = false;
         this.erroHandler.handler(er);
       });
}


novoCliente() {
 this.router.navigate(['/cliente/novo']);
}

novaOs() {
  this.router.navigate(['/ordem-servico/novo']);
}

novoLancamento() {
  this.router.navigate(['/ordem-servico/osfind', 'lancamento']);
}

recebimento() {
  this.router.navigate(['/ordem-servico/osfind', 'recebimento']);
}

despesa() {
  this.router.navigate(['/despesas']);
}

carregarTarefas() {
  if (!this.auth.estaLogado()) {
    clearInterval(this.interval);
    return;
  }
  this.service.getTecnicosTarefas()
     .toPromise()
     .then( ret => {

       var trfs: TecnicoTarefasDTO[] = [];
       trfs =  ret['dados'];
       var diferente = false;

       if (trfs.length != this.tarefasDTO.length) {
         this.tarefasDTO = trfs;
         return;
       }

      for (var i = 0; i < trfs.length; i++) {
         if (trfs[i]['tarefas'].length != this.tarefasDTO[i]['tarefas'].length ||
             trfs[i]['lembretes'].length != this.tarefasDTO[i]['lembretes'].length || 
             trfs[i]['prioridade'] != this.tarefasDTO[i]['prioridade']) {
           diferente = true;
           break;
         }
      }

      if (diferente) {
        this.tarefasDTO = trfs;
        return;
      }

      for (var i = 0; i < trfs.length; i++) {
        for( var i2 = 0; i2 < trfs[i]['tarefas'].length; i2++) {
            const tar1 = trfs[i]['tarefas'][i2];
            const tar2 = this.tarefasDTO[i]['tarefas'][i2];
            if (tar1['descricao'] !== tar2['descricao'] || tar1['prioridade'] !== tar2['prioridade']) {
              diferente = true;
              break;
            }
        }
        for( var i2 = 0; i2 < trfs[i]['lembretes'].length; i2++) {
          const tar1 = trfs[i]['lembretes'][i2];
          const tar2 = this.tarefasDTO[i]['lembretes'][i2];
          if (tar1['descricao'] !== tar2['descricao']) {
            diferente = true;
            break;
          }
      }
     }

     if (diferente) {
       this.tarefasDTO = trfs;
      return;
     }


     })
     .catch( er => {
       this.load = false;
       this.erroHandler.handler(er);
     })
}

modoEditarTarefa(t: Tarefa) {
  this.modoEditTarefa = true;
  this.osSelecinada = t.os;
  this.tecnicoSelecionado = t.tecnico;
  this.tarefa = t;
  this.dialogOn = true;
  this.dialogTitulo = 'Editar Tarefa';
}




modoAdicionarTarefa(tecnico: Tecnico) {
  this.tecnicoSelecionado = tecnico;
  this.modoAddOs = true;
  this.dialogOn = true;
  this.dialogTitulo = 'Nova Tarefa';
}


cancelarAddOs() {
  this.modoAddOs = false;
  this.modoEditTarefa = false;
  this.tecnicoSelecionado = new Tecnico();
  this.osSelecinada = undefined;
  this.param = '';
  this.tarefa = new Tarefa();
  this.carregarTarefas();
  this.dialogOn = false;
}





salvarTarefa() {
  if (this.tarefa == undefined) {
    this.message.add({severity: 'warn', summary: 'Erro de validação', detail: 'A tarefa está undefined!!!'});
    return;
  }
  if (this.tarefa.descricao == undefined ) {
    this.message.add({severity: 'warn', summary: 'Erro de validação', detail: 'Informe a descrição da tarefa'});
    return;
  }
  if (this.tarefa.descricao == '') {
    this.message.add({severity: 'warn', summary: 'Erro de validação', detail: 'A tarefa está undefined!!!'});
    return;
  }
  if (this.tecnicoSelecionado == undefined) {
    this.message.add({severity: 'warn', summary: 'Erro de validação', detail: 'O técnico está undefined!'});
    return;
  }
  if (this.tecnicoSelecionado.nome == undefined) {
    this.message.add({severity: 'warn', summary: 'Erro de validação', detail: 'Selecione um técnico!'});
    return;
  }
  if (this.tecnicoSelecionado.nome == '') {
    this.message.add({severity: 'warn', summary: 'Erro de validação', detail: 'Selecione um técnico!'});
    return;
  }
  if (this.osSelecinada == undefined) {
    this.message.add({severity: 'warn', summary: 'Erro de validação', detail: 'A O.S. está undefined!'});
    return;
  }
  if (this.osSelecinada.local == undefined) {
    this.message.add({severity: 'warn', summary: 'Erro de validação', detail: 'Selecione a O.S.!'});
    return;
  }



  // se passou pela validação basta adicionar a O.S. selecionada e técnico na tarefa e salvar

  let tsalvar = new Tarefa()
  tsalvar.tecnico = new Tecnico();
  tsalvar.os = new OrdemServico();

  tsalvar.descricao = this.tarefa.descricao;
  tsalvar.id = this.tarefa.id;
  tsalvar.prioridade = this.tarefa.prioridade;

  tsalvar.tecnico.id = this.tecnicoSelecionado.id;
  tsalvar.os.id = this.osSelecinada.id;




  if (this.modoEditTarefa) {
   //salvar nova tarefa
  this.load = true;
  this.service.alteraTarefa(tsalvar)
      .toPromise()
      .then( () => {
        this.load = false;
        this.message.add({severity: 'success', summary: 'Tarefa Salva', detail:'A alteração na tarefa foi salva com sucesso!'});
        this.carregarTarefas();
        //resetar variáveis
       this.cancelarAddOs();

      })
      .catch( er => {
        this.load = false;
        this.erroHandler.handler(er);
        this.cancelarAddOs();
      });

  } else {
    //salvar nova tarefa
  this.load = true;
  this.service.cadastraTarefa(tsalvar)
      .toPromise()
      .then( () => {
        this.load = false;
        this.message.add({severity: 'success', summary: 'Tarefa Salva', detail:'A tarefa foi salva com sucesso!'});
        this.carregarTarefas();
        //resetar variáveis
        this.osSelecinada = undefined;
        this.param = '';
        this.tarefa = new Tarefa();
      })
      .catch( er => {
        this.load = false;
        this.erroHandler.handler(er);
        this.cancelarAddOs();
      });

  }

}//fecha salvar tarefa




removerTarefa(t: Tarefa) {
  this.confirm.confirm({
    message: 'Tem certeza que deseja remover a tarefa '+ t.descricao+'?',
    accept: () => {
      this.load = true;
      this.service.excluiTarefa(t.id)
          .toPromise()
          .then(()=> {
            this.load = false
            this.message.add({ severity: 'info', summary: 'Tarefa removida', detail:'A tarefa foi removida com sucesso!'});
            this.carregarTarefas();
          })
          .catch(er => {
            this.load = false;
            this.erroHandler.handler(er);
          });
    }
  });
}




selecionarOs(o: OrdemServico) {
  this.osSelecinada = o;
}



keyup(event) {
  if (event.key == 'Enter') {
    this.consultarOs();
  }
}


consultarOs() {
  if (this.param.length < 4) {
    this.message.add({severity: 'warn', summary: 'Erro de validação', detail: 'Digite no mínimo quatro caracteres!'});
    return;
  }
  this.load = true;
  this.serviceOs.getAllNumDescricao(this.param)
     .toPromise()
     .then( ret => {
       this.load = false;
       this.oss = ret['dados'];
       if (this.oss.length == 0) {
        this.message.add({severity: 'warn', summary: 'O.S. não encontrada', detail: 'Nenhum O.S. foi encontrada com os dados informados.'});
       }
     })
     .catch( er => {
       this.load = false;
       this.erroHandler.handler(er);
     });
}




// *******************************  LEMBRETE ******************************************







salvarLembrete() {
  if (this.lembrete.descricao === undefined || this.lembrete.descricao == '') {
    this.message.add( { severity: 'warn', summary: 'Informe a descrição do lembrete.' });
    return;
  }

 if (this.modoEditLembrete) {
  this.load = true;
  this.serviceLembrete.editar(this.lembrete)
       .toPromise()
       .then( ret => {
         this.load = false;
         this.carregarTarefas();
         this.cancelarAdicionarLembrete();

       })
       .catch( er => {
         this.load = false;
         this.erroHandler.handler(er);
       });
 } else {
  this.lembrete.tecnico = new Tecnico();
  this.lembrete.tecnico.id = this.tecnicoSelecionado.id;
  this.load = true;
  this.serviceLembrete.cadastar(this.lembrete)
       .toPromise()
       .then( ret => {
         this.load = false;
         this.carregarTarefas();
         this.cancelarAdicionarLembrete();

       })
       .catch( er => {
         this.load = false;
         this.erroHandler.handler(er);
       });
 }

}//fecha salvar lembrete




modoAdicionarLembrete(tecnico: Tecnico) {
  this.tecnicoSelecionado = tecnico;
  this.dialogTituloLembrete = 'Novo Lembrete';
  this.dialogLembrete = true;
}

modoEditarLembrete(l: Lembrete) {
  if (!this.modoEditLembrete) {
     this.dialogTituloLembrete = 'Editar Lembrete';
     this.modoEditLembrete = true;
     this.dialogLembrete = true;
     this.lembrete = l;
  }
}

cancelarAdicionarLembrete() {
  this.modoEditLembrete = false;
  this.tecnicoSelecionado = new Tecnico();
  this.lembrete = new Lembrete();
  this.dialogLembrete = false;
}

excluirLembrete(l: Lembrete) {
  this.confirm.confirm({
    message: 'Tem certeza que deseja excluir o lembrete '+ l.descricao +'?',
    accept: () => {
      this.load = true;
      this.serviceLembrete.excluir(l.id)
         .toPromise()
         .then( ret => {
           this.load = false;
           this.carregarTarefas();
         } )
         .catch( er => {
           this.load = false;
           this.erroHandler.handler(er);
         });
    }
  });
}

}// fecha classe
