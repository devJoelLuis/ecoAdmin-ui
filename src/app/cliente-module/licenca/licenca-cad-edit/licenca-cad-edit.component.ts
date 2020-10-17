import { CalendarioBr } from './../../../model/calendarioBr.class';
import { ErrorHandlerService } from 'src/app/shared/error-handler.service';
import { LicencaService } from './../../../servicos/licenca.service';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Licenca } from 'src/app/model/licenca';
import { Cliente } from 'src/app/model/Cliente';

@Component({
  selector: 'app-licenca-cad-edit',
  templateUrl: './licenca-cad-edit.component.html',
  styleUrls: ['./licenca-cad-edit.component.css']
})
export class LicencaCadEditComponent implements OnInit {

  load = false;

  modoEdicao = false;
  licenca = new Licenca();
  titulo = 'Nova Licença';
  br = new CalendarioBr();
  alerta = false;


  @Input() idcliente: number;
  @Input() idLicenca: number;
  @Output() fimCadEdit = new EventEmitter();


  constructor(
    private service: LicencaService,
    private errorHandler: ErrorHandlerService,
    private message: MessageService
  ) { }

  ngOnInit() {
    if (this.idLicenca > 0) {
      this.titulo = 'Alteração de Licença';
      this.modoEdicao = true;
      this.carregarLicenca();
    } else {
      this.titulo = 'Nova Licença';
      this.licenca = new Licenca();
    }
  }




 carregarLicenca() {
   this.load = true;
   this.service.getById(this.idLicenca)
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
       });
 }


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
  this.licenca.cliente = new Cliente();
  this.licenca.cliente.id = this.idcliente;
  if (this.modoEdicao) {
    this.load = true;
    this.service.alterar(this.licenca)
        .toPromise()
        .then( () => {
          this.load = false;
          this.message.add( { severity: 'success', summary: 'Alteração Salva',
              detail: 'Aleração salva com sucesso!!!' } );
              this.fimCadEdit.emit({cadEdit: false});
        })
        .catch( er => {
          this.load = false;
          this.errorHandler.handler(er);
        });

  } else {
    this.licenca.dataInicio = new Date();
    this.load = true;
    this.service.cadastrar(this.licenca)
        .toPromise()
        .then(() => {
          this.load = false;
          this.message.add( { severity: 'success', summary: 'Licença Cadastrada',
             detail: 'A nova licença foi cadastrada com sucesso!!!' } );
          this.licenca = new Licenca();
        })
        .catch( er => {
          this.load = false;
          this.errorHandler.handler(er);
        });
  }

 }// fecha salvar



  cancelar() {
    this.fim();
  }


  fim() {
   // após as operações emite ao controle pai um sinal para fechar este componente
   this.fimCadEdit.emit({cadEdit: false});
  }


}// fecha classe
