import { Location } from '@angular/common';
import { ErrorHandlerService } from './../../shared/error-handler.service';
import { AuthService } from './../../seguranca/auth.service';
import { MessageService } from 'primeng/api';
import { UsuarioService } from './../../servicos/usuario.service';
import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/model/usuario.class';

@Component({
  selector: 'app-perfil-edit',
  templateUrl: './perfil-edit.component.html',
  styleUrls: ['./perfil-edit.component.css']
})
export class PerfilEditComponent implements OnInit {

  user = new Usuario();
  load = false;

  resenha = '';

  constructor(
    private auth: AuthService,
    private service: UsuarioService,
    private message: MessageService,
    private errorHandler: ErrorHandlerService,
    private location: Location
  ) { }



  ngOnInit() {
    const username = this.auth.jwtPayload.user_name;
    this.carregarUsuario(username);
  }


 carregarUsuario(username: string) {
   this.load = true;
   this.service.getByEmail(username)
       .toPromise()
       .then( ret => {
         this.load = false;
         this.user = ret['dados'];
       })
       .catch( er => {
         this.load = false;
         this.errorHandler.handler(er);
       });
 }



 onSubmit(f) {
    if (f.valid) {

      if (this.user.senha !== this.resenha) {
        this.message.add({severity: 'warn', summary: 'Erro de validação', detail: 'As senhas digitadas não são iguais!!!', life: 6000});
        return;
      }

      if (this.auth.temQualquerPermissao(['ROLE_ADMIN'])) {
        var regex1 = /[0-9]/g;
        var regex2 = /[a-z]/gi;

        if (!regex1.exec(this.user.senha) || !regex2.exec(this.user.senha)) {
          this.message.add({severity:'error', summary:'Erro de Validação',
          detail: 'A senha de ADMINISTRADOR dever conter letras e números', life: 6000});
          return;
        }

      }

       this.load = true;
       this.service.alterarPerfil(this.user)
           .toPromise()
           .then(ret => {
             this.load = false;
             this.message.add({ severity: 'success', summary: 'Perfil salvo', detail: 'O perfil do usuário foi salvo com sucesso!!!' });
             this.voltar();
           })
           .catch( er => {
             this.load = false;
             this.errorHandler.handler(er);
           });


    } else {
     this.message.add({severity:'warn', summary:'Erro de validação', life: 6000,
     detail: 'Verifique se todos os campos com * asterisco foram preenchidos corretamente'});
     return;
    }

  }// fecha submit



  voltar() {
    this.location.back();
  }




}// fecha classe
