import { Lancamento } from './lancamento.class';
export class OsFiltroDTO {
    idos: number;
    nomeCliente: string;
    descricaoOs: string;
    pendente = false;
    pendenciaFinanceira: number;
    lancamentos: Lancamento[] = [];
    status: string;
    numOs: number;
    anoOs: number;
    statusCor: string;
}
