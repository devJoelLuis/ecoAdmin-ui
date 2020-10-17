import { CategoriaRecebimentoService } from 'src/app/servicos/categoriaRecebimento.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { HistoricoCatRecebimentoService } from 'src/app/servicos/historico-cat-recebimento.service';
import { ErrorHandlerService } from 'src/app/shared/error-handler.service';

import { MessageService } from 'primeng/api';
import { HistoricoCategoriaRecebimento } from 'src/app/model/historicoCategoriaRecebimento.class';
import { CategoriaRecebimento } from 'src/app/model/categoriaRecebimento.class';

@Component({
  selector: 'app-historico-cat-recebimento',
  templateUrl: './historico-cat-recebimento.component.html',
  styleUrls: ['./historico-cat-recebimento.component.css']
})
export class HistoricoCatRecebimentoComponent implements OnInit {

  load = false;

  catRecebimento = new CategoriaRecebimento();

  page = 0;
  size = 40;
  totalRegistro = 0;

  historicos: HistoricoCategoriaRecebimento[] = [];

  idcategoriaRec: number;

  constructor(
    private error:ErrorHandlerService,
    private location: Location,
    private service: HistoricoCatRecebimentoService,
    private route: ActivatedRoute,
    private message: MessageService,
    private serviceCatRec: CategoriaRecebimentoService
  ) {
     this.idcategoriaRec = this.route.snapshot.params['id'];
     if (this.idcategoriaRec) {
       this.carregarAllHistorico();
     } else {
       this.message.add({ severity: 'warn', summary: 'ID da categoria de recebimento não encontrada', 
      detail: 'Não foi possível encontrar o ID da categoria de recebimento.' });
      this.voltar();
     }
   }

  ngOnInit() {
    this.carregarCategoriaRecebimento();
  }


  carregarAllHistorico() {
    this.load = true;
    this.service.getAllHistorico(this.page, this.size, this.idcategoriaRec)
       .toPromise()
       .then( ret => {
         this.load = false;
         this.totalRegistro = ret['dados']['totalElements'];
         this.historicos = ret['dados']['content'];
         const tresHorasMili = 1000 * 60 * 60 * 3;
         this.historicos.map( h => {
           // acertar para horário do Brasil
           h.dataHora = new Date(new Date(`${h.dataHora}`).getTime() - tresHorasMili);
         });

         console.log(this.historicos);

       } )
       .catch(er => {
         this.load = false;
         this.error.handler(er);
       });
  }


  carregarCategoriaRecebimento() {
    this.load = true;
    this.serviceCatRec.getById(this.idcategoriaRec)
        .toPromise()
        .then(ret => {
          this.load = false;
          this.catRecebimento = ret['dados'];
        } )
        .catch( er => {
          this.load = false;
          this.error.handler(er);
        });
  }


  paginate(event) {
    this.page = event.page;
    this.carregarAllHistorico();
  }


  verificarDebito(descricao: string) {
     if (!descricao) {
       return false
     }
     if (descricao.includes('DEBITADO')) {
        return true;
     }
     return false;
  }

  voltar() {
    this.location.back();
  }

}//fecha classe
