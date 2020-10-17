import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

import { Tarefa } from 'src/app/model/tarefa.class';
import { TecnicoDTO } from 'src/app/model/tecnicoDTO.class';
import { OrdemServico } from 'src/app/model/OrdemServico';
import { AuthService } from 'src/app/seguranca/auth.service';
import { MessageService } from 'primeng/api';
import { ErrorHandlerService } from '../../error-handler.service';
import { OrdemServicoService } from 'src/app/servicos/ordemServico.service';
import { TecnicoService } from 'src/app/servicos/tecnico.service';
import { DashboardService } from 'src/app/servicos/dashboard.service';

@Component({
  selector: 'app-tarefa-cadastro',
  templateUrl: './tarefa-cadastro.component.html',
  styleUrls: ['./tarefa-cadastro.component.css'],
  animations: [
    trigger(
      'comTransacao',
      [
        transition(
          ':enter',
          [
            style({  opacity: 0 }),
            animate('1s ease-out',
                    style({  opacity: 1 }))
          ]
        ),
        transition(
          ':leave',
          [
            style({  opacity: 1 }),
            animate('1s ease-in',
                    style({  opacity: 0 }))
          ]
        )
      ]
    )
  ]
})
export class TarefaCadastroComponent implements OnInit {

load = false;

  //variáveis para tarefa
 tarefa= new Tarefa();
 tecnicosDto: TecnicoDTO[] = [];
 osSelecionadaTarefa = new OrdemServico();
 idtecnicoTarefa = 0;
 erroNovaTarefa = '';
 headerTarefa = '';
 osSelecionada: OrdemServico;


 @Input() idos: number;
 @Output() dialogOff = new EventEmitter();

  constructor(
    public auth: AuthService,
    private message: MessageService,
    private errorHandle: ErrorHandlerService,
    private serviceOs: OrdemServicoService,
    private serviceTec: TecnicoService,
    private serviceDash: DashboardService,
  ) {
  }

  ngOnInit() {
    if (this.idos) {
      this.carregarOs();
    }

  }


  carregarOs() {
    this.load = true;
    this.serviceOs.getById(this.idos)
       .toPromise()
       .then(ret => {
         this.load = false;
         this.osSelecionadaTarefa = ret['dados'];
         this.headerTarefa = `Nova tarefa para a O.S.: ${this.osSelecionadaTarefa.numOs}/${this.osSelecionadaTarefa.anoOs} ${this.osSelecionadaTarefa.local}`;
         this.carregarTecnicosDto();
       })
       .catch( er => {
         this.load = false;
         this.errorHandle.handler(er);
       })
  }




  salvarNovaTareva() {

    if (!this.osSelecionadaTarefa) {
        this.messageTarefa('Erro, nenhuma O.S. selecionada.');
        return;
    }
    if (!this.idtecnicoTarefa) {
      this.messageTarefa('Selecione o técnico para a tarefa.');
      return;
    }
    if (this.idtecnicoTarefa == 0) {
      this.messageTarefa('Selecione o técnico para a tarefa.');
      return;
    }
    if (this.tarefa.descricao == undefined || this.tarefa.descricao == '') {
      this.messageTarefa('Digite a descrição da tarefa.');
      return;
    }

  //salvar nova tarefa
  this.tarefa.tecnico.id = this.idtecnicoTarefa;
  this.tarefa.os.id = this.osSelecionadaTarefa.id;
  this.load = true;
  this.serviceDash.cadastraTarefa(this.tarefa)
      .toPromise()
      .then( () => {
        this.load = false;
        this.message.add({severity: 'success', summary: 'Tarefa Salva', detail:'A tarefa foi salva com sucesso!'});
        this.cancelaNovaTarefa();

      })
      .catch( er => {
        this.load = false;
        this.errorHandle.handler(er);
        this.cancelaNovaTarefa();

      });

  }//fecha salvar tarefa




  async messageTarefa(message) {
    this.erroNovaTarefa = message;
    await setTimeout(() => {
      this.erroNovaTarefa = '';
    }, 4000);
  }



  alertaTarefaOff() {
    this.erroNovaTarefa = '';
  }






  cancelaNovaTarefa() {
    this.idtecnicoTarefa = 0;
    this.osSelecionada = new OrdemServico();
    this.tarefa = new Tarefa();
    this.dialogOff.emit({ value: false });
  }

  carregarTecnicosDto() {
    this.load = true;
    this.serviceTec.getAllDto()
       .toPromise()
       .then( ret => {
         this.load = false;
         this.tecnicosDto = <any>ret;
       })
       .catch( er => {
        this.load = false;
         this.errorHandle.handler(er);
       });
  }





}//fecha classe
