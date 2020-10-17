
import { Cliente } from './Cliente';
import { StatusOs } from './statusOs';
import { Tecnico } from './tecnico';
import { Prazo } from './prazo.class';



export class OrdemServico {
   id: number;
   dataInicio = new Date();
   obs = '';
   local = '';
   cliente: Cliente;
   dataAlerta = new Date(new Date().getTime() - (1000 * 60 * 60 * 24)); // dia atual menos um dia
   anoOs = new Date().getFullYear();
   numOs = 0;
   tecnico: Tecnico;
   statusOs: StatusOs;
   alerta: number;
   prazos: Prazo[] = [];



   alterarOs(os: OrdemServico) {
     this.id= os.id;
     this.dataInicio = os.dataInicio;
     this.obs = os.obs;
     this.local = os.local;
     this.cliente = os.cliente;
     this.dataAlerta = os.dataAlerta;
     this.anoOs = os.anoOs;
     this.numOs = os.numOs;
     this.tecnico = os.tecnico;
     this.statusOs = os.statusOs;
     this.prazos = os.prazos;




   }



   convertOsEditParaOs(os: OrdemServicoEdit) {
    this.id = os.id;
    this.dataInicio = os.dataInicio;
    this.obs = os.obs;
    this.local = os.local;
    this.cliente = os.cliente;
    this.dataAlerta = os.dataAlerta;
    this.anoOs = os.anoOs;
    this.numOs = os.numOs;
    this.tecnico = os.tecnico;
    this.statusOs = os.statusOs;
    this.alerta = os.alerta;
    this.prazos = os.prazos;
  }




} // fecha classe normal











export class OrdemServicoEdit {
  id: number;
  dataInicio = new Date();
  obs = '';
  local = '';
  cliente: Cliente;
  dataAlerta = new Date(new Date().getTime() - (1000 * 60 * 60 * 24)); // dia atual menos um dia
  anoOs = new Date().getFullYear();
  numOs = 0;
  tecnico: Tecnico;
  statusOs: StatusOs;
  alerta: number;
  prazos: Prazo[] = [];
  edit = false;
  pedencia = false;
  pendenciasValor = 0.00;



  convertOsParaOsEdit(os: OrdemServico) {
    this.id = os.id;
    this.dataInicio = os.dataInicio;
    this.obs = os.obs;
    this.local = os.local;
    this.cliente = os.cliente;
    this.dataAlerta = os.dataAlerta;
    this.anoOs = os.anoOs;
    this.numOs = os.numOs;
    this.tecnico = os.tecnico;
    this.statusOs = os.statusOs;
    this.alerta = os.alerta;
    this.prazos = os.prazos;


  }


} //fecha classe edit
