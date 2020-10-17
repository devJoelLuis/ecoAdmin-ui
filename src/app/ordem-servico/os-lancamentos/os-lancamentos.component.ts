import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy, ViewChildren, QueryList, AfterViewInit } from '@angular/core';

import { Recebimento } from './../../model/recebimento.class';
import { LancamentoOsDTO } from './../../model/lancamentoOsDTO.class';
import { ErrorHandlerService } from './../../shared/error-handler.service';
import { LancamentoService } from './../../servicos/lancamento.service';
import { OrdemServicoService } from './../../servicos/ordemServico.service';
import { OrdemServico } from './../../model/OrdemServico';
import { Lancamento } from 'src/app/model/lancamento.class';
import { CalendarioBr } from 'src/app/model/calendarioBR';

import { ConfirmationService, MessageService } from 'primeng/api';
import { Paginator } from 'primeng/paginator';

import * as moment from 'moment';

@Component({
  selector: 'app-os-lancamentos',
  templateUrl: './os-lancamentos.component.html',
  styleUrls: ['./os-lancamentos.component.css']
})
export class OsLancamentosComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChildren("pag") paginador: QueryList<Paginator>;

  load = false;
  os = new OrdemServico;
  lancamentosDto: LancamentoOsDTO[] = [];
  idos = 0;


  dialogLancamento = false;

  filtro = 'aberto';

  modoReceber = false;
  idlancamentoSelecionado = 0;
  idrecebimento = 0;
  br = new CalendarioBr();

  totalRegistro = 0;
  size = 20;
  page = 0;

  init = true;


  // variaveis para consulta filtro
  dtnow = new Date();
  dataInicio = new Date(2016,0,1);
  dataFinal = new Date(this.dtnow.getFullYear() + 2, 0, 1);



  constructor(
    private route: ActivatedRoute,
    private serviceOs: OrdemServicoService,
    private serviceLanc: LancamentoService,
    private error: ErrorHandlerService,
    private confirm: ConfirmationService,
    private message: MessageService,
    private location: Location
  ) {
     this.idos = this.route.snapshot.params['idos'];
     if (this.idos && this.idos > 0) {
       this.buscarOrdemServico();
     }
  }

  ngOnInit() {

  }



  ngAfterViewInit(): void {

    if (sessionStorage.getItem('status-page-oslancamentos')) {
      const { page1, size1, filtro1, idos1,dataInicio1, dataFinal1  } = JSON.parse(sessionStorage.getItem('status-page-oslancamentos'));
      if (this.idos == idos1) {
        this.idos = idos1;
        this.page = page1;
        this.size = size1;
        this.filtro = filtro1;
        this.dataInicio = new Date(`${dataInicio1} 00:00:00`);
        this.dataFinal = new Date(`${dataFinal1} 00:00:00`);

      var pag: Paginator;
      this.paginador.changes.subscribe( (p: QueryList<Paginator>) => {
          pag = p.first;
          if (this.init) { //a variável init faz com que o componente seja modifica somente a primera vez no carregamento
            this.init = false;
            if (pag) {
              pag.paginatorState['page'] = this.page;
              pag.paginatorState['rows'] = this.size;
              pag.changePage(this.page);
            }
          }
       });

      } else {
        sessionStorage.removeItem('status-page-oslancamentos');
      }
    }




  //this.paginador.changePage(this.size);

}

  ngOnDestroy() {
    var statusAtual = {
      page1: this.page,
      size1: this.size,
      filtro1: this.filtro,
      idos1: this.idos,
      dataInicio1: moment(this.dataInicio).format('YYYY-MM-DD'),
      dataFinal1: moment(this.dataFinal).format('YYYY-MM-DD'),
    }

    sessionStorage.setItem('status-page-oslancamentos', JSON.stringify(statusAtual));

  }


  buscarOrdemServico() {
    this.load = true;
    this.serviceOs.getById(this.idos)
         .toPromise()
         .then( ret => {
            this.load = false;
            this.os = ret['dados'];
            this.buscarLancamentosDaOs();
         })
         .catch( er => {
          this.load = false;
          this.error.handler(er);
         });
  }


  buscarLancamentosDaOs() {
    this.load = true;
    this.serviceLanc.getAllLancamentosOsIdDTO(this.page, this.size, this.filtro, this.idos, this.dataInicio, this.dataFinal)
         .toPromise()
         .then(ret => {
          this.load = false;
           this.totalRegistro = ret['dados']['totalElements'];
           this.lancamentosDto = ret['dados']['content'];
           this.lancamentosDto.map( l => {
             if (l.data) {
               l.data = new Date(`${l.data} 00:00:00`);
             }
           })
         })
         .catch( er => {
          this.load = false;
          this.error.handler(er);
         });
  }

  excluir(id: number) {
    this.confirm.confirm({
      message: 'Tem certeza que deseja excluir o lançamento?',
      accept: () => {
        this.load = true;
        this.serviceLanc.excluir(id)
           .toPromise()
           .then( () => {
             this.load = false;
             this.message.add({ severity: 'info', detail: 'Lançamento excluído com sucesso!' });
             this.buscarLancamentosDaOs();
           })
           .catch( er => {
             this.load = false;
             this.error.handler(er);
           });
      }
    });
  }

  salvarLancamento(l: Lancamento) {
    this.load = true;
    this.serviceLanc.alterar(l)
        .toPromise()
        .then( () => {
          this.load = false;
          this.message.add({ severity: 'success', summary: 'Lançamento alterado', detail: 'O lançamento foi alterado com sucesso!!!' });
          this.buscarLancamentosDaOs();
        })
        .catch( er => {
          this.load = false;
          this.error.handler(er);
        });
  }

  receber(idlancamento: number) {
    this.idlancamentoSelecionado = idlancamento;
    this.modoReceber = true;
  }

  editarRecebimentoS(r: Recebimento) {
    this.idrecebimento = r.id;
    this.modoReceber = true;
    document.getElementById('btn-editar-recebimento').click();
  }

  fecharReceber() {
    this.idlancamentoSelecionado = 0;
    this.idrecebimento = 0;
    this.modoReceber = false;
    document.getElementById('btn-fecha-modal-recebimento').click();
    this.buscarLancamentosDaOs();
  }


  voltar() {
    this.location.back();
  }


  paginate(event) {
    this.page = event.page;
    this.size = event.rows;
    this.buscarLancamentosDaOs();
  }

  novoLancamento() {
    this.dialogLancamento = true;
  }


  cancelarNovoLancamento() {
    this.dialogLancamento = false;
    this.buscarLancamentosDaOs();
  }



}//fecha classe
