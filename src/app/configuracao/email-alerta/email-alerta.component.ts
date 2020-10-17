import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';


import { EmailAlerta } from 'src/app/model/emailAlerta.class';
import { ErrorHandlerService } from 'src/app/shared/error-handler.service';
import { EmailAlertaService } from 'src/app/servicos/email-alerta.service';

import { ConfirmationService, MessageService } from 'primeng/api';


@Component({
  selector: 'app-email-alerta',
  templateUrl: './email-alerta.component.html',
  styleUrls: ['./email-alerta.component.css']
})
export class EmailAlertaComponent implements OnInit {

  emails: EmailAlerta[] = [];
  load = false;

  constructor(
    private router: Router,
    private service: EmailAlertaService,
    private errorHandler: ErrorHandlerService,
    private confirm: ConfirmationService,
    private message: MessageService
  ) { }

  ngOnInit() {
    this.carregarEmail();
  }


  carregarEmail() {
    this.load = true;
    this.service.getAll()
        .toPromise()
        .then( ret => {
          this.load = false;
          this.emails = ret['dados'];
        })
        .catch( er => {
          this.load = false;
          this.errorHandler.handler(er);
        })
  }


  novoEmailAlerta() {
      this.router.navigate(['/configuracao/novo']);
  }

  editarEmailAlerta(id: number) {
    this.router.navigate(['/configuracao', id]);
  }

  excluirEmailAlerta(e: EmailAlerta) {
       this.confirm.confirm( {
         message: `Tem certeza que deseja excluir o email ${e.email}?`,
         accept: () => {
           this.load = true;
           this.service.excluir(e.id)
               .toPromise()
               .then( () => {
                   this.load = false;
                   this.message.add( { severity: 'info', summary: 'E-mail excluído', detail: 'E-mail excluído com sucesso' } );
                   this.carregarEmail();
               })
               .catch( er => {
                  this.load = false;
                  this.errorHandler.handler(er);
               })
         }
       })
  }

}// fecha classe
