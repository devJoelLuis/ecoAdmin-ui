import { OrdemServico } from './OrdemServico';
import { Tecnico } from './tecnico';



export class Tarefa {

  id: number;
	descricao: string;
	tecnico = new Tecnico();
  os = new OrdemServico();
  prioridade = 10;

}
