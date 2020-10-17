import { CategoriaRecebimento } from './categoriaRecebimento.class';
import { Lancamento } from 'src/app/model/lancamento.class';


export class Recebimento {
   id: number;
   formaPagamento: String;
   data = new Date();
   valor: number;
   obs: string;
   lancamento = new  Lancamento();
   categoriaRecebimento = new CategoriaRecebimento();
}
