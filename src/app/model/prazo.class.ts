import { OrdemServico } from './OrdemServico';


export class Prazo {
  id: number;
  descricao: string;
  dataAlerta: Date;
  dataVencimento = new Date();
  alerta = false;
  edit= false;
  cumprido=false;
  os: OrdemServico
}
