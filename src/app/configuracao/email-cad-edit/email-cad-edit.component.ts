import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';


import { EmailAlertaService } from 'src/app/servicos/email-alerta.service';
import { EmailAlerta } from 'src/app/model/emailAlerta.class';
import { ErrorHandlerService } from 'src/app/shared/error-handler.service';

import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-email-cad-edit',
  templateUrl: './email-cad-edit.component.html',
  styleUrls: ['./email-cad-edit.component.css']
})
export class EmailCadEditComponent implements OnInit {

  emailAlerta = new EmailAlerta();
  cssContainer = 'container bg-color-novo alturaMinima';
  titulo = 'Cadastro de novo E-mail receptor';

  load = false;
  edicao = false;


  constructor(
    private service: EmailAlertaService,
    private erroHandler: ErrorHandlerService,
    private message: MessageService,
    private route: ActivatedRoute,
    private location: Location
  ) {

    const id = this.route.snapshot.params['id'];
    if (id) {
      this.cssContainer = 'container bg-color-edit alturaMinima';
      this.titulo = 'Edição de E-mail receptor';
      this.edicao = true;
      this.carregarEmail(id);
    } else {
      this.edicao = false;
      this.cssContainer = 'container bg-color-novo alturaMinima';
      this.titulo = 'Cadastro de novo E-mail receptor';
      this.emailAlerta = new EmailAlerta();
    }

  }

  ngOnInit() {
  }



  carregarEmail(id) {
    this.load = true;
    this.service.getById(id)
        .toPromise()
        .then( ret => {
          this.load = false;
          this.emailAlerta = ret['dados'];
        })
        .catch( er => {
          this.load = false;
          this.erroHandler.handler(er);
        });
  }





  onSubmit(f) {
    if (f.valid) {
      if (this.edicao) {
        this.load = true;
        this.service.alterar(this.emailAlerta)
            .toPromise()
            .then( () => {
              this.load = false;
              this.message.add( { severity: 'success', summary: 'Alteração salva', detail: 'Alteração salva com sucesso!!!' } );
              this.voltar();
            })
            .catch( er => {
              this.load = false;
              this.erroHandler.handler(er);
            });

      } else {
        this.load = true;
        this.service.cadastrar(this.emailAlerta)
            .toPromise()
            .then( () => {
              this.load = false;
              this.message.add( { severity: 'success', summary: 'E-mail cadastrado', detail: 'Cadastro do e-mail realizado com sucesso!!!' } );
              this.emailAlerta = new EmailAlerta();
              f.reset();
            })
            .catch( er => {
              this.load = false;
              this.erroHandler.handler(er);
            });

      }

    } else {
      this.message.add( { severity: 'warn', summary: 'Erro de validação', detail: 'Verifique se o e-mail foi digitado corretamente!!!' } );
    }
  }


voltar() {
  this.location.back();
}


}//fecha classe
