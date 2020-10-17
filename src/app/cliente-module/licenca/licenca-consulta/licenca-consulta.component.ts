import { AuthService } from './../../../seguranca/auth.service';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Licenca } from 'src/app/model/licenca';
import { LicencaService } from 'src/app/servicos/licenca.service';
import { ErrorHandlerService } from 'src/app/shared/error-handler.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CalendarioBr } from 'src/app/model/calendarioBR';

@Component({
  selector: 'app-licenca-consulta',
  templateUrl: './licenca-consulta.component.html',
  styleUrls: ['./licenca-consulta.component.css']
})
export class LicencaConsultaComponent implements OnInit {


  buscarPorData = false;
  dtNowMili = new Date(new Date().setHours(0,0,0,0)).getTime();

  load = false;
  page = 0;
  size = 15;
  totalRegistro = 0;
  licencas: Licenca[] = [];
  br = new CalendarioBr();
  semPermissao = false;

  dtinicio = new Date();
  dtfim = new Date();

  @Input() idcliente: number;
  @Output() novoOuEdit = new EventEmitter();

  constructor(
    public auth: AuthService,
    private service: LicencaService,
    private errorHandler: ErrorHandlerService,
    private message: MessageService,
    private confirm: ConfirmationService
  ) { }

  ngOnInit() {
    if (this.auth.temQualquerPermissao(['ROLE_ADMIN', 'ROLE_LICENCA'])) {
      if(this.idcliente !== undefined) {
        this.carregarLicencas();
        this.semPermissao = false;
      }
    } else {
      this.semPermissao = true;
    }

  }

  carregarLicencas() {
    this.load = true;
    this.service.getByAllIdCliente(this.page, this.size, this.idcliente)
        .toPromise()
        .then( ret => {
          this.load = false;
          this.licencas = ret['dados']['content'];
          this.totalRegistro = ret['dados']['totalElements'];
          if(this.licencas.length > 0) {
            this.licencas.map( l => {
              l.dataInicio = new Date(`${l.dataInicio} 00:00:00 GMT-0300`);
              l.dataVencimento = new Date(`${l.dataVencimento} 00:00:00 GMT-0300`);
              l.dataAlerta = new Date(`${l.dataAlerta} 00:00:00 GMT-0300`);
            })
          }
        })
        .catch( er => {
          this.load = false;
          this.errorHandler.handler(er);
        })
  }



  excluirLicenca(l: Licenca) {
    this.confirm.confirm({
      message: 'Tem certeza que deseja excluir a licença ' + l.assunto + '?',
      accept: () => {
        this.load = true;
        this.service.excluir(l.id)
            .toPromise()
            .then( () => {
              this.load = false;
              this.message.add({ severity: 'info', summary: 'Licença excluida',
                  detail: 'A Licença foi excluida com sucesso!!!' });
              this.carregarLicencas();
            })
            .catch( er => {
              this.load = false;
              this.errorHandler.handler(er);
            });
      }
    })
  }


  resetPage() {
    this.page = 0;
  }

  consultarPorData() {
    if (this.dtinicio.getTime() > this.dtfim.getTime()) {
      this.message.add({ severity: 'warn', summary: 'Range de data incorreto',
                  detail: 'A data de inicio não pode ser maior que a data final!!!', life: 9000 });
       return;
    }



    var dti = new Date(this.dtinicio).toISOString().slice(0,10);
    var dtf = new Date(this.dtfim).toISOString().slice(0,10);


    this.load = true;
    this.service.getAllPorDataVencimento(this.page, this.size, this.idcliente, dti, dtf)
        .toPromise()
        .then( ret => {
          this.load = false;
          this.licencas = ret['dados']['content'];
          this.totalRegistro = ret['dados']['totalElements'];
          if(this.licencas.length > 0) {
            this.licencas.map( l => {
              l.dataInicio = new Date(`${l.dataInicio} 00:00:00 GMT-0300`);
              l.dataVencimento = new Date(`${l.dataVencimento} 00:00:00 GMT-0300`);
              l.dataAlerta = new Date(`${l.dataAlerta} 00:00:00 GMT-0300`);
            })
          }
        })
        .catch();
  }

  consultarChange() {
     if(this.buscarPorData) {

     } else {
       this.page = 0;
       this.carregarLicencas();
     }
  }


  novaLicenca() {
     this.novoOuEdit.emit({idLicenca: 0});
  }

  editarLicenca(id: number) {
    this.novoOuEdit.emit({idLicenca: id});
  }


  paginate(e) {
    //event.first = Index of the first record
    //event.rows = Number of rows to display in new page
    //event.page = Index of the new page
    //event.pageCount = Total number of pages
    this.page = e.page;
    if (this.buscarPorData) {
      this.consultarPorData();
    } else {
      this.carregarLicencas();
    }
  }


}// fecha classe
