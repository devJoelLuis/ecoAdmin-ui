import { OrdemServico } from './OrdemServico';
import { Lembrete } from './lembrete.class';

export class Tecnico {
  id: number;
  nome: string;
  telefone: string;
  email: string;
  obs: string;
  lembretes: Lembrete[] = [];


 alterarTecnico(t: Tecnico) {
   this.id = t.id;
   this.nome = t.nome;
   this.telefone = t.telefone;
   this.email = t.email;
   this.obs = t.obs;
   this.lembretes = t.lembretes;
 }

}// fecha classe
