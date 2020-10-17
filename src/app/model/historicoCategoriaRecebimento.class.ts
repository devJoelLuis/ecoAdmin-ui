import { CategoriaRecebimento } from './categoriaRecebimento.class';

export class HistoricoCategoriaRecebimento {

    id: number;
	descricao: string;
	valorModificado: number;
	valorAnterior: number;
	dataHora: Date;
	userNome: string;
    categoriaRecebimento: CategoriaRecebimento;

}