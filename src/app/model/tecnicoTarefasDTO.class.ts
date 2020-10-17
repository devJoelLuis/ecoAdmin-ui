import { Lembrete } from './lembrete.class';
import { Tarefa } from './tarefa.class';
import { Tecnico } from './tecnico';




export class TecnicoTarefasDTO {

  tecnico: Tecnico;
  tarefas: Tarefa[] = [];
  lembretes: Lembrete[] = [];

}
