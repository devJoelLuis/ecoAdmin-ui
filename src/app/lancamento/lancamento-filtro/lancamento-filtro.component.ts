import { AuthService } from './../../seguranca/auth.service';
import { CategoriaService } from './../../servicos/categoria.service';
import { LancamentoFiltro } from './../../model/filtro.class';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Lancamento } from 'src/app/model/lancamento.class';
import { CalendarioBr } from 'src/app/model/calendarioBR';
import { LancamentoService } from 'src/app/servicos/lancamento.service';
import { ErrorHandlerService } from 'src/app/shared/error-handler.service';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';

import * as moment from 'moment';
import { Categoria } from 'src/app/model/categoria.class';

@Component({
  selector: 'app-lancamento-filtro',
  templateUrl: './lancamento-filtro.component.html',
  styleUrls: ['./lancamento-filtro.component.css']
})
export class LancamentoFiltroComponent implements OnInit {

  lancamentos: Lancamento[]=[];
  umDiaMili = 1000 * 60 * 60 * 24;
  inicio = new Date(new Date().getTime() - (this.umDiaMili * 60)); //data atual menos 60 dias
  fim = new Date(new Date().getTime() + (this.umDiaMili * 60)); //data atual mais 30 dias
  br = new CalendarioBr();
  filtro = new LancamentoFiltro();

  //variavel utilizada para o filtro
  tipo = 'RECEITA'; // RECEITA OU DESPESA
  pago = 0; // 0 aberto 1 pago
  categoria = new Categoria();
  categorias: Categoria[] = [];

  page = 0;
  size = 20;
  totalRegistro = 0;
  consultaString = '';

  load = false;



  constructor(
    public auth: AuthService,
    private location: Location,
    private service: LancamentoService,
    private serviceCat: CategoriaService,
    private errorHandler: ErrorHandlerService,
    private router: Router,
    private confirm: ConfirmationService,
    private message: MessageService
  ) { }

  ngOnInit() {

  }







  consultar() {
    this.filtro.page = this.page
    this.filtro.size = this.size
    this.filtro.inicio = moment(this.inicio).format('YYYY-MM-DD');
    this.filtro.fim = moment(this.fim).format('YYYY-MM-DD');

    if (this.consultaString === undefined) {
      this.filtro.param = '';
    } else {
      this.filtro.param = this.consultaString;
    }

    if (this.tipo === undefined || this.tipo === null) {
      this.filtro.tipo = '';
    } else {
      this.filtro.tipo = this.tipo;
    }

    this.filtro.pago = this.pago;

    if (!this.categoria || !this.categoria.id) {
        this.filtro.idcategoria = 0;
    } else {
      this.filtro.idcategoria = this.categoria.id;
    }


    this.load = true;
    this.service.getAllFiltro(this.filtro)
        .toPromise()
        .then( ret => {
          this.load = false;
          this.lancamentos = ret['dados']['content'];
          this.totalRegistro = ret['dados']['totalElements'];
          this.lancamentos.map( l => {
            l.dataLancamento = new Date(`${l.dataLancamento}`);

          });
        })
        .catch( er => {
          this.load = false;
          this.errorHandler.handler(er);
        });

  }



  consultarOld() {
    if (this.consultaString === undefined) {
      this.consultaString = '';
    }
    //buscar no backend a consulta
    this.load = true;
    this.service.getPeriodoParam(this.page, this.size, this.inicio, this.fim, this.tipo, this.pago, this.consultaString )
        .toPromise()
        .then( ret => {
          this.load = false;
          this.lancamentos = ret['dados']['content'];
          this.totalRegistro = ret['dados']['totalElements'];
          this.lancamentos.map( l => {
            l.dataLancamento = new Date(`${l.dataLancamento}`);

          });
        })
        .catch( er => {
          this.load = false;
          this.errorHandler.handler(er);
        });
  }//fecha metodo consulta




  excluirLancamento(l: Lancamento) {
     this.confirm.confirm({
       message: 'Tem certeza que deseja excluir o lançamento '+ l.descricao+'?',
       header: 'Exclusão de Lançamento',
       accept: () => {
         this.load = true;
         this.service.excluir(l.id)
             .toPromise()
             .then( ret => {
               this.load = false;
               this.message.add({ severity: 'info', summary: 'Lançamento Excluído', detail: 'O lançamento foi excluído com sucesso!!!' });
               this.consultar();
             })
             .catch( er => {
               this.load = false;
               this.errorHandler.handler(er);
             });
       }
     })
  }


  editar(id: number) {
    this.router.navigate([`/lancamento/${id}`]);
  }


  voltarPagina() {
    this.location.back();
  }

  onKey(event) {
    if (event.key == 'Enter') {
      this.page = 0
      this.consultar();
    }
  }


  paginate(event) {
    this.size = event.rows;
    this.page = event.page;
    this.consultar();
  }

}
