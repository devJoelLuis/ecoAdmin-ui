import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { Lancamento } from 'src/app/model/lancamento.class';
import { LancamentoService } from 'src/app/servicos/lancamento.service';
import { ErrorHandlerService } from 'src/app/shared/error-handler.service';
import { CalendarioBr } from 'src/app/model/calendarioBR';
import { AuthService } from './../../seguranca/auth.service';

import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-lancamento-consulta',
  templateUrl: './lancamento-consulta.component.html',
  styleUrls: ['./lancamento-consulta.component.css']
})
export class LancamentoConsultaComponent implements OnInit {


  lancamentos: Lancamento[]=[];
  umDiaMili = 1000 * 60 * 60 * 24;
  inicio = new Date(new Date().getTime() - (this.umDiaMili * 60)); //data atual menos 60 dias
  fim = new Date(new Date().getTime() + (this.umDiaMili * 60)); //data atual mais 30 dias
  br = new CalendarioBr();

  page = 0;
  size = 20;
  totalRegistro = 0;
  consultaString = '';

  load = false;



  constructor(
    public auth: AuthService,
    private location: Location,
    private service: LancamentoService,
    private errorHandler: ErrorHandlerService,
    private router: Router,
    private confirm: ConfirmationService,
    private message: MessageService
  ) { }

  ngOnInit() {
    this.consultar();
  }


  consultar() {
    //buscar no backend a consulta
    if (this.consultaString == undefined || this.consultaString == '') {
     //busca todos
    this.load = true;
    this.service.getAllPageable(this.page, this.size, this.inicio, this.fim)
        .toPromise()
        .then( ret => {
          this.load = false;
          this.lancamentos = ret['dados']['content'];
          this.totalRegistro = ret['dados']['totalElements'];

        })
        .catch( er => {
          this.load = false;
          this.errorHandler.handler(er);
        });
    } else {
      //busca por parametro
      this.load = true;
      this.service.getAllPageableParam(this.page, this.size, this.inicio, this.fim, this.consultaString)
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
  }//fecha metodo consulta


  novolancamento() {
     this.router.navigate(['/lancamento/novo']);
  }



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



}//fecha classe
