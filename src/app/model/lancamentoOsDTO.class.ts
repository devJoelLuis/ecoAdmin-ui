import { Recebimento } from './recebimento.class';

export class LancamentoOsDTO {

    idlancamento: number;
    descricao: string;
    data: Date;
	total: number;
	totalPago: number;
	totalReceber: number;
	recebimentos: Recebimento[] = [];

}
