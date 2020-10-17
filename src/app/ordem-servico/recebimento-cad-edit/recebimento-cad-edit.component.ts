import { Router } from '@angular/router';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { CategoriaRecebimentoService } from './../../servicos/categoriaRecebimento.service';
import { CategoriaRecebimento } from './../../model/categoriaRecebimento.class';
import { Recibo } from './../../model/recibo.class';
import { RecebimentoService } from './../../servicos/recebimento.service';
import { Recebimento } from './../../model/recebimento.class';
import { Lancamento } from './../../model/lancamento.class';
import { LancamentoService } from './../../servicos/lancamento.service';
import { ErrorHandlerService } from './../../shared/error-handler.service';

import { MessageService } from 'primeng/api';
import { CalendarioBr } from 'src/app/model/calendarioBR';

@Component({
  selector: 'app-recebimento-cad-edit',
  templateUrl: './recebimento-cad-edit.component.html',
  styleUrls: ['./recebimento-cad-edit.component.css']
})
export class RecebimentoCadEditComponent implements OnInit {

  @Input() idrecebimento: number;
  @Input() idlancamento: number;
  @Output() fimCadEdit = new EventEmitter();


  lancamento = new Lancamento();
  recebimento = new Recebimento();
  categariasRec: CategoriaRecebimento[] = [];
  idCategoriaRec = 0;

  load = false;
  modoEdicao = false;
  confirmaExclusao = false;

  br = new CalendarioBr();

  totalRecebido = 0;


  constructor(
    private message: MessageService,
    private service: RecebimentoService,
    private serviceLanc: LancamentoService,
    private error: ErrorHandlerService,
    private router: Router,
    private serviceCatRec: CategoriaRecebimentoService
  ) { }



  ngOnInit() {
    if (this.idrecebimento && this.idrecebimento > 0) {
       this.modoEdicao = true;
       this.carregarRecebimento();
    } else {
      if (this.idlancamento) {

        this.load = true;
        this.serviceLanc.getId(this.idlancamento)
            .toPromise()
            .then( ret => {
              this.load = false;
              this.lancamento = ret['dados'];
              this.carregarTotalRecebido();
              this.carregarCategoriasRecebimento();
            })
            .catch( er => {
              this.load = false;
              this.error.handler(er);
            });

      } else {
        this.message.add({ severity: 'warn',summary: 'Erro',  detail: 'Não foi possível encontrar o id do lançamento' });
        this.fimCadEdit.emit();
      }
    }

  }


  carregarCategoriasRecebimento() {
    this.load = true;
    this.serviceCatRec.getAll()
      .toPromise()
      .then( ret => {
        this.load = false;
        this.categariasRec = ret['dados'];
      })
      .catch( er => {
        this.load = false;
        this.error.handler(er);
      });
  }


  carregarTotalRecebido() {
    this.load = true;
    this.service.getTotalRecebido(this.lancamento.id)
       .toPromise()
       .then( ret => {
        this.load = false;
        this.totalRecebido = ret['dados'];
       })
       .catch( er => {
         this.load = false;
         this.error.handler(er);
       });
  }


  carregarRecebimento() {
    this.load = true;
    this.service.getById(this.idrecebimento)
        .toPromise()
        .then( ret => {
          this.load = false;
          this.carregarCategoriasRecebimento();
          const rec = ret['dados'];
          rec.data = new Date(`${rec.data} 00:00:00`);
          this.recebimento = rec;
          this.lancamento = rec.lancamento;
          this.idCategoriaRec = this.recebimento.categoriaRecebimento.id;
        })
        .catch( er => {
            this.load = false;
            this.error.handler(er);
            this.fimCadEdit.emit();
        });
  }


  fecharModal() {
    this.fimCadEdit.emit();
  }


  salvarRecebimento() {

    if (this.recebimento.data == undefined) {
        this.message.add({ severity: 'warn', summary: 'Erro de validação',
        detail: 'Selecione a data do recebimento.' });
        return;
    }
    if (this.recebimento.data == null) {
      this.message.add({ severity: 'warn', summary: 'Erro de validação',
      detail: 'Selecione a data do recebimento.' });
      return;
    }
    if (this.recebimento.valor == undefined || this.recebimento.valor == 0) {
      this.message.add({ severity: 'warn', summary: 'Erro de validação',
      detail: 'Informe o valor do recebimento.' });
      return;
    }
    if (this.recebimento.formaPagamento == undefined || this.recebimento.formaPagamento == '') {
      this.message.add({ severity: 'warn', summary: 'Erro de validação',
      detail: 'Informe a forma de pagamento' });
      return;
    }
    if (this.idCategoriaRec == undefined || this.idCategoriaRec == null || this.idCategoriaRec == 0) {
      this.message.add({ severity: 'warn', summary: 'Erro de validação',
      detail: 'Selecione a categoria de recebimento.' });
      return;
    }

    this.recebimento.categoriaRecebimento.id = this.idCategoriaRec;

    if (this.modoEdicao) {
      this.load = true;
      this.service.alterar(this.recebimento)
          .toPromise()
          .then( () => {
            this.load = false;
            this.message.add({ severity: 'success', detail: 'Recebimento alterado com sucesso!!!' });
            this.fimCadEdit.emit();
          } )
          .catch( er => {
            this.load = false;
            this.error.handler(er);
            this.fimCadEdit.emit();
          });
    } else {
      // verificar se o valor pago não é maior que o devido

        if ((this.totalRecebido + this.recebimento.valor) > this.lancamento.total ) {
          this.message.add({ severity: 'warn', summary: 'Erro de validação', detail: 'O valor recebido está ultrapassando o devido.', life: 6000 });
          return;
        }

      this.recebimento.lancamento.id = this.lancamento.id;
      this.load = true;
      this.service.cadastrar(this.recebimento)
          .toPromise()
          .then( ret => {
            this.load = false;
            this.message.add({ severity: 'success', detail: 'Recebimento salvo com sucesso!!!' });
            this.gerarRecibo(ret['dados']);
          } )
          .catch( er => {
            this.load = false;
            this.error.handler(er);
            this.fimCadEdit.emit();
          });
    }


  }//fecha salvar recebimento



  gerarRecibo(r: Recebimento) {
    var recibo = new Recibo();

    let formatter = new Intl.NumberFormat([], {
      style: 'currency',
      currency: 'BRL'
    })


      r.data = new Date(`${r.data} 00:00:00 GMT-0300`);
    recibo.ano = r.data.getFullYear().toString();
    recibo.mes = (r.data.getMonth() + 1).toString();
    recibo.dia = r.data.getDate().toString();




    recibo.total = formatter.format(r.valor);
    recibo.recebemosde = r.lancamento.ordemServico.cliente.nome;
    recibo.referente = r.lancamento.descricao;
    this.fimCadEdit.emit();
    this.router.navigateByUrl('/recibo',{
      state: { recibo: recibo }
    });

  }






  confirmarExclusao() {
     this.confirmaExclusao = true;
  }
  cancelarExclusao() {
    this.confirmaExclusao = false;
  }

  excluir() {
    this.load = true;
    this.service.excluir(this.recebimento.id)
        .toPromise()
        .then(() => {
          this.load = false;
          this.message.add({ severity: 'info', detail:'Recebimento excluído com sucesso!!' });
          this.fimCadEdit.emit();
        })
        .catch( er => {
          this.load = false;
          this.error.handler(er);
        });
  }


}//fecha classe
