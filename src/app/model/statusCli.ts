

export class StatusCli {
  id: number;
  statusCli = '';

  constructor(id: number, status: string) {
    this.statusCli = status;
    this.id = id;
  }

  converterStatus(ste: StatusEdicao) {
    this.id = ste.id;
    this.statusCli = ste.statusCli;
  }

}

export class StatusEdicao {
  id: number;
  statusCli = '';
  edit = false;

}
