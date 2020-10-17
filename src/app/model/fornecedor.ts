import { StatusFornecedor } from './statusFornecedor';

export class Fornecedor {
  id: number;
  nome: string;
  telefone: string;
  email: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  cep: string;
  obs: string;
  statusFornecedor: StatusFornecedor[] = [];
}
