import { Cliente } from './Cliente';

export class Licenca {
  id: number;
  numero: string;
  assunto: string;
  dataVencimento = new Date();
  dataInicio= new Date();
  dataAlerta= new Date();
  alerta = 0;
  cliente = new  Cliente();
  obs: string;
  arquivoMorto = false;
}
