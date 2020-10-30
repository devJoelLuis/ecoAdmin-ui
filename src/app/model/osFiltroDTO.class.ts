import { Lancamento } from './lancamento.class';



export class OsFiltroDTO {
    idos: number;
    nomeCliente: string;
    descricaoOs: string;
    pendente = false;
    pendenciaFinanceira: number;
    total: number;
    totalLancado: number;
    totalPago: number;
    status: string;
    numOs: number;
    anoOs: number;
    statusCor: string;
}
