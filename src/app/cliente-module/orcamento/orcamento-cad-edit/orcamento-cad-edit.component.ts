

import { Component, OnInit, Input, Output, EventEmitter, NgZone, Renderer } from '@angular/core';

import { MessageService } from 'primeng/api';

import { ErrorHandlerService } from 'src/app/shared/error-handler.service';
import { OrcamentoService } from 'src/app/servicos/orcamento.service';
import { Orcamento } from 'src/app/model/orcamento';
import { CalendarioBr } from 'src/app/model/calendarioBR';
import { Cliente } from 'src/app/model/Cliente';

@Component({
  selector: 'app-orcamento-cad-edit',
  templateUrl: './orcamento-cad-edit.component.html',
  styleUrls: ['./orcamento-cad-edit.component.css']
})
export class OrcamentoCadEditComponent implements OnInit {

  orcamento = new Orcamento();
  titulo = 'Novo orçamento';
  cssContainer = 'orcamento-container cad-color alturaMinima';
  load = false;
  br = new CalendarioBr();
  dataAlertaOn = false;


  modoEdicao = false;

  @Input() idOrcamento: number;
  @Input() idcliente: number;
  @Output() fimCadEdit = new EventEmitter();

  constructor(
    private message: MessageService,
    private errorHandler: ErrorHandlerService,
    private service: OrcamentoService,
    private render: Renderer,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
    this.carregarOrcamentoId();
  }



  carregarOrcamentoId() {

      // se for para cadastrar novo orçamento o id será zero
      if (this.idOrcamento == 0) {
        this.orcamento = new Orcamento();
        return;
      }
      this.titulo = 'Alteração de Orçamento';
      this.cssContainer = 'orcamento-container edit-color alturaMinima';
      this.modoEdicao = true;
      this.load = true;
      this.service.getById(this.idOrcamento)
          .toPromise()
          .then( ret => {
            this.load = false;
            this.orcamento = ret['dados'];
            this.orcamento.dataEntrega = new Date(`${this.orcamento.dataEntrega} 00:00:00 GMT-0300`);
            this.orcamento.dataAlerta = new Date(`${this.orcamento.dataAlerta} 00:00:00 GMT-0300`);
            if (this.orcamento.alerta > 0) {
              this.dataAlertaOn = true;
            }
          })
          .catch( er => {
            this.load = false;
            this.errorHandler.handler(er);
          });

  }





  salvar() {
   if(this.orcamento == null || this.orcamento == undefined) {
     this.message.add( { severity: 'error', summary: 'Erro',
           detail: 'Ocorreu um erro no front-end, o orçamento está nulo'});
     return;
   }
   if(this.orcamento.assunto == undefined || this.orcamento.assunto == '') {
      this.message.add( { severity: 'warn', summary: 'Erro de validação',
      detail: 'Informe o assunto!!!'});
      this.setFocus('#assuntod');
    return;
   }
   if(this.orcamento.dataEntrega == undefined) {
    this.message.add( { severity: 'warn', summary: 'Erro de validação',
    detail: 'Informe a data de entrega do orçamento!!!'});
    this.setFocus('#dtentrega');
   return;
  }
  if(this.orcamento.numero ==  undefined || this.orcamento.numero < 0 ) {
    this.orcamento.numero = 0;
  }
  if(this.orcamento.ano ==  undefined || this.orcamento.ano < 1970) {
     this.orcamento.ano = new Date().getFullYear();
  }
  if(this.orcamento.valor == undefined) {
    this.message.add( { severity: 'warn', summary: 'Erro de validação',
    detail: 'Informe o valor do orçamento!!!'});
    this.setFocus('#input-valor');
    return;
  }
  if(this.orcamento.valor == 0) {
    this.message.add( { severity: 'warn', summary: 'Erro de validação',
    detail: 'Informe o valor do orçamento!!!'});
    this.setFocus('#input-valor');
    return;
  }

  //fixar cliente do orçamento
  this.orcamento.cliente = new Cliente();
  this.orcamento.cliente.id = this.idcliente;
  if(this.dataAlertaOn) {
    this.orcamento.alerta = 1;
  } else {
    this.orcamento.alerta = 0;
  }

  if (this.modoEdicao) {
    this.load = true;
    this.service.alterar(this.orcamento)
        .toPromise()
        .then(() => {
          this.load = false;
          this.message.add( { severity: 'success', summary: 'Orçamento salvo',
          detail: 'Orçamento salvo com sucesso!!!'});
          this.fim();
        })
        .catch( er => {
          this.load = false;
          this.errorHandler.handler(er);
        });
  } else {
    this.load = true;
    this.service.cadastrar(this.orcamento)
        .toPromise()
        .then(() => {
          this.load = false;
          this.message.add( { severity: 'success', summary: 'Orçamento salvo',
          detail: 'Orçamento salvo com sucesso!!!'});
          this.orcamento = new Orcamento();
          this.dataAlertaOn = false;
        })
        .catch( er => {
          this.load = false;
          this.errorHandler.handler(er);
        });
  }

  }// fecha metodo salvar




 // set focus input do dom
  setFocus(selector: string) {
    this.ngZone.runOutsideAngular( () => {
      setTimeout( () => {
       this.render.selectRootElement(selector).focus();
      }, 0);
    });
 }






  cancelar() {
    this.fim();
  }


  fim() {
   // após as operações emite ao controle pai um sinal para fechar este componente
   this.fimCadEdit.emit({cadEdit: false});
  }

  dataAlerta() {
    this.orcamento.dataAlerta = new Date();
  }

}// fecha classe
