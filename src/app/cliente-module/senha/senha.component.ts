import { AuthService } from './../../seguranca/auth.service';
import { ErrorHandlerService } from 'src/app/shared/error-handler.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { SenhaService } from './../../servicos/senha.service';
import { Component, OnInit, Input } from '@angular/core';
import { Senha, SenhaEdicao } from 'src/app/model/senha';
import { Cliente } from 'src/app/model/Cliente';

@Component({
  selector: 'app-senha',
  templateUrl: './senha.component.html',
  styleUrls: ['./senha.component.css']
})
export class SenhaComponent implements OnInit {

  @Input() idcliente: number;

  listSenha: SenhaEdicao[] = [];
  senha = new Senha();
  load = false;
  modoCadastro = false;
  modoEdicao = false;
  semPermissao = false;


  constructor(
    public auth: AuthService,
    private errorHandler: ErrorHandlerService,
    private service: SenhaService,
    private message: MessageService,
    private confirm: ConfirmationService
  ) { }

  ngOnInit() {
    if (this.auth.temQualquerPermissao(['ROLE_ADMIN', 'ROLE_SENHA'])) {
      this.semPermissao = false;
      if (this.idcliente) {
        this.carregarSenha();
     }
    } else {
      this.semPermissao = true;
    }
  }

  carregarSenha() {
      this.load = true;
      this.service.findAllClienteId(this.idcliente)
          .toPromise()
          .then( ret => {
            this.load = false;
            this.listSenha = ret['dados'];
          })
          .catch( er => {
            this.load = false;
            this.errorHandler.handler(er);
          });
  }


  cadastrarSenha() {

    if(this.senha.obs === undefined) {
      this.message.add( { severity: 'warn', summary: 'Erro de validação', detail: 'Digite o login do cliente!' });
      return;
    }
    if(this.senha.obs === '') {
      this.message.add( { severity: 'warn', summary: 'Erro de validação', detail: 'Digite o login do cliente!' });
      return;
    }
    if(this.senha.descricao === undefined) {
      this.message.add( { severity: 'warn', summary: 'Erro de validação', detail: 'Digite a descrição da senha' });
      return;
    }
    if(this.senha.descricao === '') {
      this.message.add( { severity: 'warn', summary: 'Erro de validação', detail: 'Digite a descrição da senha' });
      return;
    }
    if(this.senha.senha === undefined) {
      this.message.add( { severity: 'warn', summary: 'Erro de validação', detail: 'Digite a senha do cliente' });
      return;
    }
    if(this.senha.senha === '') {
      this.message.add( { severity: 'warn', summary: 'Erro de validação', detail: 'Digite a senha do cliente' });
      return;
    }

     if(this.modoCadastro) {
       var cli = new Cliente();
       cli.id = this.idcliente;
       this.senha.cliente = cli;
       this.load = true;
       this.service.cadastro(this.senha)
           .toPromise()
           .then( () => {
             this.load = false;
             this.desativaModoCadastro();
             this.carregarSenha();
             this.message.add( { severity: 'success', summary: 'Senha cadastrada',
                   detail: 'A senha foi cadastrada com sucesso!!!' });
           })
           .catch( er => {
             this.load = false;
             this.errorHandler.handler(er);
           });
      return;
     }
     if(this.modoEdicao){

      return;
     }

  }

  salvarEdicao(senha: SenhaEdicao) {

    if(senha.descricao === undefined) {
      this.message.add( { severity: 'warn', summary: 'Erro de validação', detail: 'Digite a descrição da senha' });
      return;
    }
    if(senha.descricao === '') {
      this.message.add( { severity: 'warn', summary: 'Erro de validação', detail: 'Digite a descrição da senha' });
      return;
    }
    if(senha.senha === undefined) {
      this.message.add( { severity: 'warn', summary: 'Erro de validação', detail: 'Digite a senha do cliente' });
      return;
    }
    if(senha.senha === '') {
      this.message.add( { severity: 'warn', summary: 'Erro de validação', detail: 'Digite a senha do cliente' });
      return;
    }

    var se = new Senha();
    se.convertToSenha(senha);
    se.cliente = new Cliente();
    se.cliente.id = this.idcliente;
    this.load = true;
    this.service.alteracao(se)
        .toPromise()
        .then(() => {
          this.load = false;
          this.message.add( { severity: 'success', summary: 'Senha salva',
              detail: `Senha ${se.descricao} foi salva com sucesso!!!` });
          this.modoEdicao = false;
          this.senha = new Senha();
          this.carregarSenha();
        })
         .catch( er => {
          this.load = false;
          this.errorHandler.handler(er);
        });

  }


  excluirSenha(s: SenhaEdicao) {
    this.confirm.confirm( {
      message: 'Tem certeza que deseja excluir a senha '+ s.descricao + '?',
      accept: () => {
        this.load = true;
        this.service.excluir(s.id)
          .toPromise()
          .then(() => {
            this.load = false;
            this.carregarSenha();
            this.message.add( { severity: 'info', summary: 'Senha excluída',
               detail: 'Senha excluída com sucesso!!!' } );
          })
          .catch( er => {
            this.load = false;
            this.errorHandler.handler(er);
          });
      }
    } );
  }


  ativaModoCadastro() {
   this.senha = new Senha();
   this.modoCadastro = true;
  }
  desativaModoCadastro() {
    this.senha = new Senha();
    this.modoCadastro = false;
  }
  ativaModoEditar(s: SenhaEdicao) {
    this.modoEdicao = true;
    s.edit = true;
  }
  desativaModoEditar(s: SenhaEdicao) {
    this.modoEdicao = false;
    s.edit = false;
    this.carregarSenha();
  }



}//fecha classe
