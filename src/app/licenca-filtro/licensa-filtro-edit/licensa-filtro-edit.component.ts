import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Location } from '@angular/common';
import { LicencaService } from './../../servicos/licenca.service';
import { Component, OnInit } from '@angular/core';
import { Licenca } from 'src/app/model/licenca';
import { CalendarioBr } from 'src/app/model/calendarioBR';
import { ErrorHandlerService } from 'src/app/shared/error-handler.service';


@Component({
  selector: 'app-licensa-filtro-edit',
  templateUrl: './licensa-filtro-edit.component.html',
  styleUrls: ['./licensa-filtro-edit.component.css']
})
export class LicensaFiltroEditComponent implements OnInit {

  load = false;
  licenca = new Licenca();
  alerta = false;


  br = new CalendarioBr();

  constructor(
    private service: LicencaService,
    private errorHandler: ErrorHandlerService,
    private location: Location,
    private message: MessageService,
    private route: ActivatedRoute
  ) {

    const idlicenca = this.route.snapshot.params['id'];
    this.carregarLicenca(idlicenca);

  }

  ngOnInit() {
  }


  cancelar() {
    this.location.back();
  }



  carregarLicenca(idlicenca: number) {
    this.load = true;
    this.service.getById(idlicenca)
        .toPromise()
        .then( ret => {
          this.load = false;
          this.licenca = ret['dados'];
          this.licenca.dataVencimento = new Date(`${this.licenca.dataVencimento} 00:00:00 GMT-0300`);
          this.licenca.dataInicio = new Date(`${this.licenca.dataInicio} 00:00:00 GMT-0300`);
          this.licenca.dataAlerta = new Date(`${this.licenca.dataAlerta} 00:00:00 GMT-0300`);
          if(this.licenca.alerta == 1) {
            this.alerta = true;
          } else {
            this.alerta = false;
          }
        })
        .catch( er => {
          this.load = false;
          this.errorHandler.handler(er);
        })
  }//fecha carregar licença




    salvar() {
      if (this.licenca.assunto == undefined){
        this.message.add( { severity: 'warn', summary: 'Erro de Validação',
           detail: 'O assunto não foi preenchido!!!' } );
        return;
      }
      if (this.licenca.assunto == ''){
       this.message.add( { severity: 'warn', summary: 'Erro de Validação',
          detail: 'O assunto não foi preenchido!!!' } );
       return;
     }
     if (this.licenca.dataVencimento == undefined || this.licenca.dataVencimento == null) {
       this.message.add( { severity: 'warn', summary: 'Erro de Validação',
           detail: 'Selecione a data de vencimento!!!' } );
       return;
     }
     if (this.licenca.numero == undefined || this.licenca.numero == null || this.licenca.numero == '') {
       this.message.add( { severity: 'warn', summary: 'Erro de Validação',
           detail: 'O número da licença não foi preenchido ou não é válido!!!' } );
       return;
     }
     if(this.alerta) {
       this.licenca.alerta = 1;
     } else {
       this.licenca.alerta = 0;
     }

     this.load = true;
     this.service.alterar(this.licenca)
         .toPromise()
         .then( () => {
           this.load = false;
           this.message.add( { severity: 'success', summary: 'Alteração Salva',
               detail: 'Aleração salva com sucesso!!!' } );
         })
         .catch( er => {
           this.load = false;
           this.errorHandler.handler(er);
         });


    }// fecha salvar




}// fecha classe
