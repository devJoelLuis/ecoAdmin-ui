import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { CategoriaRecebimento } from './../../model/categoriaRecebimento.class';
import { DespesaFiltro } from './despesaFiltro.class';
import { DespesaService } from './../../servicos/despesa.service';
import { Despesa } from './../../model/despesa.class';
import { ErrorHandlerService } from './../../shared/error-handler.service';
import { CalendarioBr } from 'src/app/model/calendarioBR';

import { ConfirmationService, MessageService } from 'primeng/api';

import * as moment from 'moment';
import { CategoriaRecebimentoService } from 'src/app/servicos/categoriaRecebimento.service';


@Component({
  selector: 'app-despesa-consulta',
  templateUrl: './despesa-consulta.component.html',
  styleUrls: ['./despesa-consulta.component.css']
})
export class DespesaConsultaComponent implements OnInit {


despesas: Despesa[] = [];
filtro = new DespesaFiltro();
categorias: CategoriaRecebimento[] = [];

diaMili = 1000 * 60 * 60 * 24;

//subtrai 30 dias da data atual
dtini = new Date(new Date().getTime() - this.diaMili * 30);
dtfim = new Date();
br = new CalendarioBr();

categoriaSelecionada: any;


load = false;

totalRegistro = 0;




  constructor(
    private location: Location,
    private error: ErrorHandlerService,
    private router: Router,
    private service: DespesaService,
    private confirm: ConfirmationService,
    private message: MessageService,
    private serviceCat: CategoriaRecebimentoService
  ) {
    this.consultar();
  }

  ngOnInit() {
  }



consultar() {

  console.log(this.filtro.consultaTipo)

  if (this.filtro.consultaTipo === 'tudo') {
    this.load = true;
    this.service.getAll(this.filtro.page, this.filtro.size)
        .toPromise()
        .then(ret => {
          this.load = false;
          this.despesas = ret['dados']['content'];
          this.totalRegistro = ret['dados']['totalElements'];
          this.despesas.map( d => {
            d.data = new Date(`${d.data} 00:00:00`);
          })
        })
        .catch(er => {
          this.load = false;
          this.error.handler(er);
        });    
  }//fecha if consulta tudo

//consulta por descrição
if (this.filtro.consultaTipo == 'porDescricao') {
  console.log(this.filtro.descricao)
  this.consultarPorFiltro();
} 

//consulta por data
  if (this.filtro.consultaTipo == 'porData') {
    // se não for tudo faz consulta com filtro
    this.filtro.dataInicio = moment(this.dtini).format('YYYY-MM-DD');
    this.filtro.dataFinal = moment(this.dtfim).format('YYYY-MM-DD');
    this.consultarPorFiltro();
  }

  if (this.filtro.consultaTipo == 'porCategoria') {
    console.log(this.categoriaSelecionada);
    if (!this.categoriaSelecionada) {
      this.message.add({ severity: 'warn', summary: 'Erro de validação', detail:'Selecione uma categoria.' });
      return;
    }
    this.filtro.idcategoriaRecebimento = this.categoriaSelecionada.id;
    this.consultarPorFiltro();
  }//fim consulta por categoria

}//fecha consulta


filtroPorCategoria() {
  this.filtro.page = 0;
  this.carregarCategorias();
}


consultarPorFiltro() {
  this.load = true;
  this.service.getFiltro(this.filtro)
      .toPromise()
      .then(ret => {
        this.load = false;
        this.despesas = ret['dados']['content'];
        this.totalRegistro = ret['dados']['totalElements'];
        this.despesas.map( d => {
          d.data = new Date(`${d.data} 00:00:00`);
        })
        if (this.filtro.consultaTipo == 'porCategoria' && 
            this.categoriaSelecionada &&
            this.despesas.length == 0 ) {
          this.message.add({ severity: 'warn', summary:'Despesa não encontrada', 
          detail: `Não foi encontrado nenhum despesa lançada na categoria ${this.categoriaSelecionada.descricao}` });
        }
      })
      .catch(er => {
        this.load = false;
        this.error.handler(er);
      });    
}


carregarCategorias() {
  this.load = true;
  this.serviceCat.getAll()
      .toPromise()
      .then(ret => {
        this.load = false;
        this.categorias = ret['dados'];
        if (this.categorias.length == 0) {
          this.message.add({ severity: 'warn', summary: 'Erro', detail: 'Nenhuma categoria encontrada.' });
        }
      })
      .catch( er => {
        this.load = false;
        this.error.handler(er);
      });
}


excluirDespesa(d: Despesa) {
  this.confirm.confirm({
    message: `Tem certeza que deseja remover a despesa ${d.descricao}?`,
    accept: () => {
      this.load = true;
      this.service.excluir(d.id)
        .toPromise()
        .then(() => {
          this.load = false;
          this.message.add({ severity: 'info', summary: 'Depesa excluída.', 
               detail: 'A despesa foi excluída com sucesso!!!' });
          this.consultar();     
        })
        .catch();
    }
  });
}


novaDespesa() {
  this.router.navigate(['/despesas/nova']);
}

editarDespesa(id: number) {
  this.router.navigate(['/despesas', id]);
}



filtroClick() {
  this.filtro.page = 0
  this.consultar();
}



  paginate(event) {
    this.filtro.size = event.rows;
    this.filtro.page = event.page;
    this.consultar();
  }


keyPress(e) {
  if (e.key == 'Enter') {
    this.filtro.page = 0; 
    this.consultar();
  }
}



voltar() {
  this.location.back();
}



}//fecha classe
