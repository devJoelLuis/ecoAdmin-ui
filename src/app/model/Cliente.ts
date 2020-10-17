
import { StatusCli } from 'src/app/model/statusCli';
export class Cliente {

  id: number;
  nome = '';
  nomeFantasia = '';
  cnpj = '';
  rg = '';
  telefone = '';
  celular = '';
  email = '';
  rua = '';
  numero = '';
  bairro = '';
  cep = '';
  cidade = '';
  obs = '';
  dataCadastro = '';
  statusCli: StatusCli;



 constructor() {
   this.id = 0;
 }

}// fecha classe


export class ClienteDTO {
  id: number;
  nome = '';
	nomeFantasia = '';
}
