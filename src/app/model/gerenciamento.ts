import { Cliente } from './Cliente';
import { Parcela } from './parcela';

export class Gerenciamento {
   id: number;
   descricao: string;
   totalParcela: number;
   obs: string;
   parcelas: Parcela[] = [];
   cliente = new Cliente();
}
