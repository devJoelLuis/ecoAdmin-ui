import { Gerenciamento } from './gerenciamento';

export class Parcela {
   id: number = 0;
   dataVencimento: Date;
   dataPagamento: Date = new Date('1970-1-1 00:00:00 GMT-0300');
   valor: number = 0;
   numeroParcela: number;
	 pago: number = 0;
	 gerenciamento = new Gerenciamento();
}
