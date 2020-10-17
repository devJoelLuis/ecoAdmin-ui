export class Usuario {
  id: number;
  nome: string;
  email: string;
  senha: string;
  obs: string;
  permissoes: Permissao[] = [];
}

export class Permissao {
  id: number;
  role: string;
}
