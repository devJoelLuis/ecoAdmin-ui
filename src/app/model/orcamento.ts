import { Cliente } from 'src/app/model/Cliente';

export class Orcamento {
  id: number;
  numero: number = 0;
  ano: number = new Date().getFullYear();
  assunto: string;
  valor: number;
  dataEntrega: Date = new Date();
  dataAlerta: Date = new Date();
  obs: string;
  cliente: Cliente;
  alerta = 0;
}
