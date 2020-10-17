import { Cliente } from './Cliente';

export class Senha {
  id: number;
  descricao: string;
  senha: string;
  obs: string;
  cliente: Cliente;

  convertToSenha(s: SenhaEdicao) {
    this.id = s.id;
    this.descricao = s.descricao;
    this.senha = s.senha;
    this.obs = s.obs;
  }


}

export class SenhaEdicao {
  id: number;
  descricao: string;
  senha: string;
  obs: string;
  edit = false;

 converterToSenhaEdicao(s: Senha) {
   this.id = s.id;
   this.descricao = s.descricao;
   this.senha = s.senha;
   this.obs = s.obs;
 }

}
