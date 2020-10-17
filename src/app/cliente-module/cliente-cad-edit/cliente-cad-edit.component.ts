
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


import { Cliente } from './../../model/Cliente';
import { MessageService } from 'primeng/api';
import { ClienteService } from 'src/app/servicos/cliente.service';
import { StatusCliService } from 'src/app/servicos/status-cli.service';
import { ErrorHandlerService } from 'src/app/shared/error-handler.service';
import { StatusCli } from '../../model/statusCli';
import { CalendarioBr } from 'src/app/model/calendarioBR';

@Component({
  selector: 'app-cliente-cad-edit',
  templateUrl: './cliente-cad-edit.component.html',
  styleUrls: ['./cliente-cad-edit.component.css']
})
export class ClienteCadEditComponent implements OnInit {


  statuCli: StatusCli;
  cliente = new Cliente();
  statuslist: StatusCli[]=[];
  titulo = 'Cadastro de novo cliente';
  edicao = false;
  dataCadastro: Date;
  //estatusCliente: any;
  classeContainer = 'container bg-color-novo';
  load = false;
  cadStatusMod = false;
  br = new CalendarioBr();






  constructor(
    private location: Location,
    private message: MessageService,
    private service: ClienteService,
    private erroHandle: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private serviceStatus: StatusCliService,
// tslint:disable-next-line: deprecation

  ) {
     this.buscarStatus();

     // tslint:disable-next-line: no-string-literal
    const idcliente = this.route.snapshot.params['id'];
    if (idcliente) {
       this.edicao = true;
       this.titulo = 'Edição do Cliente';
       this.classeContainer = 'container bg-color-edit';
       this.carregarCliente(idcliente);
    }
  } // fecha construtor







  ngOnInit() {
  }




  addStatusCliente() {
    this.router.navigate(['/status']);
  }


  verificarSeStatusAdicionado(list: StatusCli[], id: number): boolean {
   let teste = false;
   list.forEach(el => {
       teste =  el.id === id;
     });
   return teste;
  }


  buscarStatus() {
    this.load = true;
    this.serviceStatus.buscarTodo(0, 1000, '')
        .toPromise()
        .then(ret => {
           // tslint:disable-next-line: no-string-literal
          this.statuslist = ret['dados']['content'];
          this.load = false;
        })
        .catch( er => {
          this.load = false;
          this.erroHandle.handler(er);
        });
  }







  goback() {
    this.location.back();
  }

  limparForm(f) {
    this.cliente = new Cliente();
    f.reset();
  }

  carregarCliente(idcliente) {
    this.load = true;
    this.service.buscarPorId(idcliente)
        .toPromise()
        .then( ret => {
// tslint:disable-next-line: no-string-literal
          this.cliente = ret['dados'];
// tslint:disable-next-line: no-string-literal
          this.dataCadastro = new Date(ret['dados']['dataCadastro']);
          this.statuCli = this.cliente.statusCli;
          this.load = false;
        })
        .catch( er => {
          this.load = false;
          this.erroHandle.handler(er);
        });
  }


  onSubmit(f) {
    if ( this.statuCli === undefined) {
      this.message.add( { severity: 'warn', summary: 'Status não selecionado',
      detail: 'Selecione um status para o cliente', life: 6000 } );
      return false;
     }
     this.cliente.statusCli =  this.statuCli;
    if (!this.edicao) {
        this.salvarNovoCliente(f);
    }
    if(this.edicao) {
      this.salvarEdicao(f);
    }

  }



  salvarEdicao(f: any) {
    // tslint:disable-next-line: curly
    if (!this.validarCliente(f)) return;
    this.fixarDadosCliente();
    this.load = true;
    this.service.editaCliente(this.cliente)
        .toPromise()
        .then(ret => {
           // tslint:disable-next-line: no-string-literal
          this.cliente = ret['dados'];
          this.load = false;
          this.message.add( { severity: 'success', summary: 'Alteração salva', detail: 'A alteração foi salva com sucesso!!!' } );
        })
        .catch(er => {
          this.load = false;
          this.erroHandle.handler(er);
        });
  }


  fixarDadosCliente() {
        if (this.cliente.nome != '') {
            this.cliente.nome = this.cliente.nome.toUpperCase();
        }
        if (this.cliente.nomeFantasia != '') {
           this.cliente.nomeFantasia = this.cliente.nomeFantasia.toUpperCase();
        }
        if (this.cliente.email != '') {
           this.cliente.email = this.cliente.email.toLowerCase();
        }

  }





  salvarNovoCliente(f) {

// tslint:disable-next-line: curly
    if (!this.validarCliente(f)) return;
    this.fixarDadosCliente();
    this.load = true;
    this.service.novoCliente(this.cliente)
      .toPromise()
      .then( () => {
      f.reset();
      this.cliente = new Cliente();
      this.load = false;
      this.message.add( { severity: 'info', summary: 'Cadastro realizado',
       detail: 'O cadastro do novo cliente foi realizado com sucesso!!!' } );
      })
      .catch( er => {
        this.load = false;
        this.erroHandle.handler(er);
      } );
  }


  validarCliente(f): boolean {
      // verificar se ao menos um nome ou nome fantasia foi informado
    if (this.cliente.nome == '' && this.cliente.nomeFantasia == '') {
      this.message.add({severity: 'warn', summary: 'Erro de validação',
      detail: 'O nome do cliente, ou o nome fantasia tem que ser preenchido!!!', life: 6000 });
      f.form.controls.nome.touched = true;
      f.form.controls.nomef.touched = true;
      return false;
    }
    return true;
  }


  voltarPagina() {
    this.location.back();
  }





}// fecha classe
