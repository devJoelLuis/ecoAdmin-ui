import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ErrorHandlerService } from 'src/app/shared/error-handler.service';
import { MessageService } from 'primeng/api';
import { PermissaoService } from './../../servicos/permissao.service';
import { UsuarioService } from './../../servicos/usuario.service';
import { Component, OnInit, Renderer, NgZone } from '@angular/core';
import { Usuario, Permissao } from 'src/app/model/usuario.class';

@Component({
  selector: 'app-usuario-cad-edit',
  templateUrl: './usuario-cad-edit.component.html',
  styleUrls: ['./usuario-cad-edit.component.css']
})
export class UsuarioCadEditComponent implements OnInit {


  titulo = 'Cadastro de novo usuário';
  containerCss = 'container bg-color-novo alturaMinima';
  load = false;
  edicao = false;

  //validacao
  inputNome = false;
  inputEmail = false;
  inputSenha = false;
  inputResenha = false;
  tablePermissao = false;
  alteraSenha = false;

  usuario = new Usuario();
  permissoes: Permissao[] = [];
  resenha = '';

  constructor(
    private service: UsuarioService,
    private servicePermissao: PermissaoService,
    private message: MessageService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private location: Location,
    private render: Renderer,
    private ngZone: NgZone
  ) {

     const id = this.route.snapshot.params['id'];
     if (id) {
       this.edicao = true;
       this.titulo = 'Edição de usuário';
       this.containerCss = 'container bg-color-edit alturaMinima';
       this.carregarUsuario(id);
     } else {
       this.carregarPermissoes();
       this.titulo = 'Cadastro de novo usuário';
       this.containerCss = 'container bg-color-novo alturaMinima';
     }
   }

  ngOnInit() {
  }



  carregarUsuario(id) {
    this.load = true;
    this.service.getById(id)
        .toPromise()
        .then( ret => {
          this.load = false;
          this.usuario = ret['dados'];
          this.carregarPermissoes();
        })
        .catch( er => {
          this.load = false;
          this.errorHandler.handler(er);
        })
  }



  setFocus(selector: string) {
    this.ngZone.runOutsideAngular( () => {
      setTimeout( () => {
       this.render.selectRootElement(selector).focus();
      }, 0);
    });
 }




  preCadastro() {


    if (this.usuario.nome == undefined || this.usuario.nome == null || this.usuario.nome == '') {
      this.message.add({severity:'warn', summary:'Erro de Validação',
          detail: 'Informe corretamente o nome completo do usuário', life: 6000});
          this.inputNome = true;
          this.setFocus('#nomeUser');
          return;
    }

    if (this.usuario.email == undefined || this.usuario.email == null || this.usuario.email == '') {
        this.message.add({severity:'warn', summary:'Erro de Validação',
          detail: 'Informe corretamente o e-mail do usuário', life: 6000});
          this.inputEmail = true;
          this.setFocus('#emailUser');
          return;
    }

  if (this.edicao && this.alteraSenha || !this.edicao)  {


    if (this.usuario.senha == undefined || this.usuario.senha == null || this.usuario.senha == '') {
        this.message.add({severity:'warn', summary:'Erro de Validação',
          detail: 'Informe corretamente a senha do usuário', life: 6000});
          this.inputSenha = true;
          this.setFocus('#senhaUser')
          return;
    }

    if (this.usuario.senha.length < 6) {
      this.message.add({severity:'warn', summary:'Erro de Validação',
          detail: 'A senha deve conter no mínimo seis dígitos', life: 6000});
          this.inputSenha = true;
          this.setFocus('#senhaUser')
          return;
    }


    if (this.resenha == undefined || this.resenha == null || this.resenha == '') {
      this.message.add({severity:'warn', summary:'Erro de Validação',
          detail: 'Re-digite a senha', life: 6000});
          this.inputResenha = true;
          this.setFocus('#resenhaUser')
          return;
    }
    if (this.resenha != this.usuario.senha) {
      this.message.add({severity:'warn', summary:'Erro de Validação',
          detail: 'As senha não são iguais', life: 6000});
          this.inputResenha = true;
          this.inputSenha = true;
          this.setFocus('#senhaUser')
          return;
    }
    // se for admin a senha deve conter letras e numeros
     if (this.usuario.permissoes[0].role == 'ROLE_ADMIN') {
      var regex1 = /[0-9]/g;
      var regex2 = /[a-z]/gi;

      if (!regex1.exec(this.usuario.senha) || !regex2.exec(this.usuario.senha)) {
        this.message.add({severity:'error', summary:'Erro de Validação',
        detail: 'A senha de ADMINISTRADOR dever conter letras e números', life: 6000});
        this.inputResenha = true;
        this.inputSenha = true;
        this.setFocus('#senhaUser')
        return;
      }
     }

    }

    if (this.edicao && !this.alteraSenha) {
      this.usuario.senha = 'none';
    }


    if (this.usuario.permissoes.length == 0) {
      this.message.add({severity:'warn', summary:'Erro de Validação',
          detail: 'Adicione as permissões do usuário', life: 6000});
          this.tablePermissao = true;
          return;
    }

   this.cadastrar();

  }// fecha pre cadastro




  cadastrar() {
    if (this.edicao) {

      this.load = true;
      this.service.alterar(this.usuario)
          .toPromise()
          .then( () => {
            this.load = false;
            this.message.add({ severity: 'success', summary: 'Usuário Salvo', detail: 'Alteração do usuário salvo com sucesso!!!' });
            this.voltar();
          })
          .catch( er => {
            this.load = false;
            this.errorHandler.handler(er);
          });

    } else {
      this.load = true;
      this.service.cadastrar(this.usuario)
          .toPromise()
          .then( () => {
            this.load = false;
            this.usuario = new Usuario();
            this.carregarPermissoes();
            this.resenha = '';
            this.message.add({ severity: 'success', summary: 'Usuário cadastrado', detail: 'Usuário cadastrado com sucesso!!!' });
          })
          .catch( er => {
            this.load = false;
            this.errorHandler.handler(er);
          });
    }
  }


  carregarPermissoes() {
    this.load = true;
    this.servicePermissao.getall()
        .toPromise()
        .then( ret => {
          this.load = false;
          this.permissoes = ret['dados'];
          if (this.edicao) {
            var temp: Permissao[] = [];
            var teste = false;
            this.permissoes.map(p => {
              teste = false;
              this.usuario.permissoes.map(pu => {
                  if (pu.id == p.id) {
                    teste = true;
                  }
              });
              if (!teste) {
                temp.push(p);
              }
            });
            this.permissoes = temp;
            this.permissoes.sort((a, b) => {
              if (a.role < b.role) {
                return -1;
              }
              if ( a.role > b.role ) {
                return 1;
              }
              return 0;
         });
          }
        })
        .catch( er => {
          this.load = false;
          this.errorHandler.handler(er);
        });
  }



  addPermissao(p: Permissao) {
    if (p.role === 'ROLE_ADMIN') {
      this.usuario.permissoes = [];
      this.usuario.permissoes.push(p);
    } else {
      var testAdmin = false;
      this.usuario.permissoes.map( p => {
        if (p.role == 'ROLE_ADMIN') {
          testAdmin = true;
        }
      });
      if (testAdmin) {
        this.usuario.permissoes = [];
        this.carregarPermissoes();
      }
      this.usuario.permissoes.push(p);
    }
    var tempList: Permissao[] =[];
    this.permissoes.map( pp => {
      if (pp.id !=  p.id ) {
        tempList.push(pp);
      }
    });
    this.permissoes = tempList;
    this.permissoes.sort((a, b) => {
      if (a.role < b.role) {
        return -1;
      }
      if ( a.role > b.role ) {
        return 1;
      }
      return 0;
 });
  }//

  removePermissao(p: Permissao) {
    if (p.role == 'ROLE_ADMIN') {
        this.usuario.permissoes = [];
        this.carregarPermissoes();
    } else {
      var permTemp: Permissao[] = [];
      this.usuario.permissoes.map( pp => {
        if (pp.id != p.id) {
          permTemp.push(pp);
        }
      });
      this.usuario.permissoes = permTemp;
    }
    this.permissoes.push(p);
    this.permissoes.sort((a, b) => {
         if (a.role < b.role) {
           return -1;
         }
         if ( a.role > b.role ) {
           return 1;
         }
         return 0;
    });
  }



  voltar() {
    this.location.back();
  }


}//fecha classe
