import { ErrorHandlerService } from './../shared/error-handler.service';
import { UsuarioService } from './../servicos/usuario.service';
import { AuthService } from './../seguranca/auth.service';
import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email = '';
  senha = '';
  load = false;

  constructor(
    private auth: AuthService,
    private message: MessageService,
    private service: UsuarioService,
    private errorHandler: ErrorHandlerService,
    private confirm: ConfirmationService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  keyup(event) {
    if (event.key === 'Enter') {
      this.logar();
    }
  }

  logar() {
    if(this.email === undefined) {
     this.message.add( { severity: 'warn', summary: 'Erro de email', detail: 'E-mail inválido!!' } );
     return;
    }
    if(this.email === '') {
      this.message.add( { severity: 'warn', summary: 'Erro de email', detail: 'E-mail inválido!!' } );
      return;
    }
    if(this.senha === undefined) {
      this.message.add( { severity: 'warn', summary: 'Erro de senha', detail: 'Senha inválida!!' } );
      return;
    }
    if(this.senha === '') {
      this.message.add( { severity: 'warn', summary: 'Erro de email', detail: 'Senha inválida!!' } );
      return;
    }
  this.load = true;
  this.email.toLocaleLowerCase();
   this.auth.login(this.email, this.senha)
       .then(() => {
         this.load = false;
         console.log('login ok');
         this.router.navigate(['/dash']);
       })
       .catch( er => {
         this.load = false;
         this.errorHandler.handler(er);
       })

  }// fecha metodo



  recoverPasswd() {
    if(this.email === undefined) {
      this.message.add( { severity: 'warn', summary: 'Erro de email', detail: 'E-mail inválido!!' } );
      return;
     }
     if(this.email === '') {
       this.message.add( { severity: 'warn', summary: 'Erro de email', detail: 'E-mail inválido!!' } );
       return;
     }

    this.confirm.confirm({
      message: 'Tem certeza que deseja redefinir a senha? obs( uma nova senha será enviada para o e-mail '+ this.email + ' )',
      accept: () => {
        this.load = true;
        this.service.recuperarSenha(this.email)
            .toPromise()
            .then( () => {
              this.load = false;
              this.message.add( { severity: 'info', summary: 'Senha redefinida com sucesso',
                detail: 'Uma nova senha foi enviada para o e-mail '+ this.email, life: 9000 } );
            })
            .catch( er => {
              this.load = false;
              this.errorHandler.handler(er);
            });
      }
    });
  }




}// fecha classe
