

export class StatusOs {
  id: number;
  nome: string;
  cor: any;

  convertStatusEditoToStatus(ste: StatusOsEdicao) {
    this.id = ste.id;
    this.nome = ste.nome;
    this.cor = ste.cor;
  }

}

export class StatusOsEdicao {
  id: number;
  nome = '';
  cor: any;
  edit = false;
}

