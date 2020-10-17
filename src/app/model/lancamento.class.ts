import { OrdemServico } from './OrdemServico';
import { Categoria } from './categoria.class';
import * as moment from 'moment';

export class Lancamento {
   id: number;
   descricao: string;
   dataLancamento = new Date();
   pago = false;
   obs: string;
   total: number;
   dataPagTotal: Date;
   categoria: Categoria;
   ordemServico: OrdemServico;
   idCategoriaRecebimentoTaxa = 0;

   convert(temp) {
     if (temp.id)
     this.id = temp.id;
     if (temp.descricao)
     this.descricao = temp.descricao;
     if (temp.dataLancamento)
     this.dataLancamento = new Date(`${moment(temp.dataLancamento).format("YYYY-MM-DD")} 00:00:00`);

     if (temp.pago)
     this.pago = temp.pago;
     if (temp.obs)
     this.obs = temp.obs;
     if (temp.total)
     this.total = temp.total;
     if (temp.dataPagTotal)
     this.dataPagTotal = new Date(`${moment(temp.dataPagTotal).format("YYYY-MM-DD")} 00:00:00`);
     if(temp.categoria)
     this.categoria = temp.categoria;
     if(temp.ordemServico)
     this.ordemServico = temp.ordemServico;
     if (temp.idCategoriaRecebimentoTaxa) 
     this.idCategoriaRecebimentoTaxa = temp.idCategoriaRecebimentoTaxa;
   }
}
