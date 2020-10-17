import { OrdemServico } from 'src/app/model/OrdemServico';
import { CategoriaRecebimento } from './categoriaRecebimento.class';

export class Despesa {

   id: number;
   descricao: string;
   data = new Date();
   valor: number;
   obs: string;
   os = new OrdemServico();
   edit = false;
   categoriaRecebimento = new CategoriaRecebimento();

}
