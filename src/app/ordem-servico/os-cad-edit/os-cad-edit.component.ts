import { FiltroOs } from './../../model/osfiltro.class';
import { Location } from '@angular/common';
import { ClienteDTO, Cliente } from '../../model/Cliente';
import { ErrorHandlerService } from 'src/app/shared/error-handler.service';
import { ClienteService } from 'src/app/servicos/cliente.service';
import { MessageService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { OrdemServico } from 'src/app/model/OrdemServico';
import { CalendarioBr } from 'src/app/model/calendarioBR';
import { Tecnico } from 'src/app/model/tecnico';
import { StatusOs } from 'src/app/model/statusOs';
import { TecnicoService } from 'src/app/servicos/tecnico.service';
import { StatusOsService } from 'src/app/servicos/statusOs.service';
import { OrdemServicoService } from 'src/app/servicos/ordemServico.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-os-cad-edit',
  templateUrl: './os-cad-edit.component.html',
  styleUrls: ['./os-cad-edit.component.css']
})
export class OsCadEditComponent implements OnInit {

  br = new CalendarioBr();
  alertaOs = false;
  load = false;
  param = '';
  clientes: ClienteDTO[] = [];
  clienteDtoSelecionado = new ClienteDTO();
  dataNow = new Date();
  os = new OrdemServico();
  ultimoNumOs = '';


   //manipulação do técnico
 tecnico: Tecnico;
 listTecnico: Tecnico[] = [];


  //manipulacao do statusOs
  statusOs: StatusOs;
  listStatusOs: StatusOs[] = [];


  titulo = 'NOVA O.S. PARA O CLIENTE:';
  modoEdicao = false;
  css = 'container alturaMinima bk-novo';
  idos = 0;

  constructor(
    private service: OrdemServicoService,
    private message: MessageService,
    private serviceCli: ClienteService,
    private error: ErrorHandlerService,
    private serviceTec: TecnicoService,
    private serviceStatusOs: StatusOsService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {


    const idos = this.route.snapshot.params['idos'];
    if (idos) {
       this.idos = idos;
       this.titulo = 'EDIÇÃO DA O.S. DO CLIENTE:';
       this.modoEdicao = true;
       this.css = 'container alturaMinima bk-edit';
       this.carregarOs();
    } else {
      //nova O.S.
      this.titulo = 'NOVA O.S. PARA O CLIENTE:';
      this.modoEdicao = false;
      this.css = 'container alturaMinima bk-novo';
      this.carregarTecnicos();
    }
   }

  ngOnInit() {
  }



  //carregar Os para edição
  carregarOs() {
    this.load = true;
    this.service.getById(this.idos)
       .toPromise()
       .then( ret => {
         this.load = false;
         this.os = ret['dados'];
         if (this.os.dataInicio) {
           this.os.dataInicio = new Date(`${this.os.dataInicio} 00:00:00 GMT-0300`);
         }
         if (this.os.alerta == 1) {
           this.alertaOs = true;
           this.os.dataAlerta = new Date(`${this.os.dataAlerta} 00:00:00 GMT-0300`);
         } else {
           this.alertaOs = false;
           this.os.dataAlerta = new Date(`${this.os.dataAlerta} 00:00:00 GMT-0300`);
         }
         this.ultimoNumOs = this.os.numOs+'/'+this.os.anoOs;
         this.carregarTecnicos();
       })
       .catch(er => {
         this.load = false;
         this.error.handler(er);
       })
  }


  consultarCliente() {
    if (this.param === undefined) {
      this.message.add({severity: 'warn', summary:'Erro de preenchimento', detail: 'Informe parte do nome do cliente!!!'});
      return;
    }
    if (this.param.length < 2) {
      this.message.add({severity: 'warn', summary:'Erro de preenchimento',
         detail: 'Informe pelo menos dois caracteres do nome do cliente!!!', life: 6000});
      return;
    }

    this.load = true;
    this.serviceCli.getClienteDtoParam(this.param)
        .toPromise()
        .then( ret => {
          this.load = false;
          this.clientes = ret['dados'];
        })
        .catch( er => {
          this.load = false;
          this.error.handler(er);
        } );

  }


  carregarTecnicos() {
    this.load = true;
    this.serviceTec.getAll(0, 1000)
       .toPromise()
       .then(ret => {
          this.load=false;
          this.listTecnico = ret['dados']['content'];
          this.carregarStatusOs();
       })
       .catch( er =>{
         this.load = false;
         this.error.handler(er);
       });
      }

  carregarStatusOs() {
    this.load = true;
    this.serviceStatusOs.getAll()
        .toPromise()
        .then( ret => {
         this.load = false;
         this.listStatusOs = ret['dados'];
         if (this.modoEdicao) {
          this.tecnico = this.os.tecnico;
          this.statusOs = this.os.statusOs;
          this.clienteDtoSelecionado.id = this.os.cliente.id;
          this.clienteDtoSelecionado.nome = this.os.cliente.nome;
          this.clienteDtoSelecionado.nomeFantasia = this.os.cliente.nomeFantasia;
         }
        })
        .catch( er => {
         this.load = false;
         this.error.handler(er);
        });
  }


  getUltimoNumOs() {
    this.service.getUltimoNumeroOs()
        .toPromise()
        .then( ret => {
          this.ultimoNumOs = ret['dados'];
        })
        .catch( er => {
          this.error.handler(er);
        });
  }




  ativaAlertaOs() {
    if(this.alertaOs) {
      this.os.dataAlerta = new Date();
      this.os.alerta = 1;
    } else {
      this.os.dataAlerta = new Date('1970-1-1 00:00:00 GMT-0300');
      this.os.alerta = 0;
    }
  }


  selecionarCliente(c: ClienteDTO) {
    this.clienteDtoSelecionado = c;
    this.getUltimoNumOs();
  }


  keyup(event) {
     if (event.key == 'Enter') {
       this.consultarCliente();
     }
  }

  cancelar() {
    this.clienteDtoSelecionado = new ClienteDTO();
  }




  salvarOs() {

    if (this.os.local === undefined || this.os.local === '') {
      this.message.add( { severity: 'warn', summary: 'Erro de validação',
      detail: 'O campo descrição deve ser preenchido', life: 6000 } );
      return false;
    }


    // se nenhum tecnico foi selecionado
    if(this.tecnico === undefined) {
      this.message.add( { severity: 'warn', summary: 'Erro de validação',
           detail: 'Selecione o técnico da O.S.', life: 6000 } );
           return;
    }

    if(this.statusOs === undefined) {
      this.message.add( { severity: 'warn', summary: 'Erro de validação',
           detail: 'Selecione o status da O.S.', life: 6000 } );
           return;
    }
    if(this.os.anoOs < 1970 || this.os.anoOs > new Date().getFullYear()) {
      this.message.add( { severity: 'warn', summary: 'Erro de validação',
           detail: 'O ano informado é inválido', life: 6000 } );
           return;
    }

    this.os.statusOs = this.statusOs;
    this.os.tecnico = this.tecnico;
    if (this.alertaOs) {
      this.os.alerta = 1;
    } else {
      this.os.alerta = 0;
    }

    this.os.cliente = new Cliente();
    this.os.cliente.id = this.clienteDtoSelecionado.id;
    this.os.cliente.nome = this.clienteDtoSelecionado.nome;
    this.os.cliente.nomeFantasia = this.clienteDtoSelecionado.nomeFantasia;

     if (this.modoEdicao) {
      //remover a lista de serviço
      var osEditado = new OrdemServico();
      osEditado.alterarOs(this.os);


      this.load = true;
      this.service.salvarEdicao(osEditado)
          .toPromise()
          .then( () => {
            this.load = false;
            this.message.add( { severity: 'success', summary: 'Ordem de serviço salva',
                detail: 'A  alteração na ordem de serviço foi salva com sucesso '} );
            this.voltar();
          })
          .catch( er => {
            this.load = false;
            this.error.handler(er);
          } );

     } else {
      this.load = true;
      this.service.cadastrar(this.os)
          .toPromise()
          .then( () => {
            this.load = false;
            this.message.add( { severity: 'success', summary: 'Ordem de serviço aberta',
                detail: 'A ordem de serviço foi aberta com sucesso para o cliente ' + this.clienteDtoSelecionado.nome } );
            this.os = new OrdemServico();
            this.tecnico = undefined;
            this.statusOs = undefined;
            this.alertaOs = false;
          })
          .catch( er => {
            this.load = false;
            this.error.handler(er);
          } );

     }
  }//fecha salvar os


  voltar() {

      this.location.back();
  }


}//fecha classe
