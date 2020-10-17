import { Component, OnInit } from '@angular/core';

import { CalendarioBr } from 'src/app/model/calendarioBR';

import { ErrorHandlerService } from './../../shared/error-handler.service';
import { FluxocaixaService } from './../../servicos/fluxocaixa.service';

@Component({
  selector: 'app-fluxo-caixa',
  templateUrl: './fluxo-caixa.component.html',
  styleUrls: ['./fluxo-caixa.component.css']
})
export class FluxoCaixaComponent implements OnInit {

  load = false;
  br = new CalendarioBr();

  fluxo: any;

  dtnow = new Date();

  dtiniConsultado = new Date();
  dtfimConsultado = new Date(); 

  dtini = new Date(this.dtnow.getFullYear(), this.dtnow.getMonth(),  1, 0, 0, 0);
  dtfim = new Date();


 





  constructor(
    private service: FluxocaixaService,
    private error: ErrorHandlerService,
  ) {
    this.getFluxoCaixa();
   }

  ngOnInit() {
  }


  getFluxoCaixa() {
    this.load = true;
    this.dtiniConsultado = this.dtini;
    this.dtfimConsultado = this.dtfimConsultado;
    this.service.getFluxoCaixa(this.dtini, this.dtfim)
    .toPromise()
    .then( ret => {
      this.load = false;
      this.fluxo = ret['dados'];
     
      //transformar a data em dd/MM/yyyy manipulando a string
      this.fluxo.fluxosSub.map( f => {

        //calcular os totais e ajustar formato da data
         var totalTaxa = 0;
         var totalRecebimento = 0;
         var totalDespesas = 0;
         
         if (f.lancamentosTaxa)
         f.lancamentosTaxa.map( lt => {
           const result = lt.dataLancamento.toString().split("-");
           lt.dataLancamento = result[2]+ '/'+result[1]+'/'+result[0];
           totalTaxa += lt.total;
          
         });

         if (f.recebimentos)
         f.recebimentos.map( rec => {
           const result =  rec.data.toString().split("-");
           rec.data = result[2]+ '/'+result[1]+'/'+result[0];
           totalRecebimento += rec.valor;
         })

         if (f.despesas)
         f.despesas.map(d => {
          const result =  d.data.toString().split("-");
          d.data = result[2]+ '/'+result[1]+'/'+result[0];
          totalDespesas += d.valor;
         });
         

         //criar dinamicamente uma propriedade com os totais
        
          f.totalRecebimento = totalRecebimento;
          f.totalTaxa = totalTaxa;
          f.totalDespesa = totalDespesas;
 
      });

      var totalLancamento = 0; 
      this.fluxo.lancamentos.map( l => {
         
         totalLancamento += l.total;
      })
       
      this.fluxo.totalLancamento = totalLancamento;
       
    } )
    .catch( er => {
      this.load = false;
      this.error.handler(er);
    } );
  }

}// fecha classe
