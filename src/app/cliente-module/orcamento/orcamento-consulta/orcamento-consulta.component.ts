import { AuthService } from './../../../seguranca/auth.service';
import { CalendarioBr } from 'src/app/model/calendarioBR';
import { OrcamentoService } from 'src/app/servicos/orcamento.service';
import { ErrorHandlerService } from './../../../shared/error-handler.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Orcamento } from 'src/app/model/orcamento';

@Component({
  selector: 'app-orcamento-consulta',
  templateUrl: './orcamento-consulta.component.html',
  styleUrls: ['./orcamento-consulta.component.css']
})
export class OrcamentoConsultaComponent implements OnInit {

  load = false;
  orcamentos: Orcamento[] = []
  consultaString = '';
  dtNowMili = new Date(new Date().setHours(0,0,0,0)).getTime();
  br = new CalendarioBr();

  dataEntrega = false;
  buscarPorData = false;

  dtincio = new Date();
  dtfim = new Date();

  @Output() novoOuEdit = new EventEmitter();
  @Input() idcliente: number;

  // colunas
  opcaoCol = true;
  dataEntregaCol = true;
  valorCol= true;
  assuntoCol=true;
  numeroCol=true;
  obsCol=false;


  constructor(
    public auth: AuthService,
    private message: MessageService,
    private errorHandler: ErrorHandlerService,
    private confirm: ConfirmationService,
    private service: OrcamentoService
  ) { }

  ngOnInit() {
    this.carregarOrcamentoDoCliente()
  }


  carregarOrcamentoDoCliente() {
    if(this.idcliente) {
      this.load = true;
      this.service.getByIdCliente(this.idcliente)
           .toPromise()
           .then( ret => {
             this.load = false;
             this.orcamentos = ret['dados'];
             this.orcamentos.map( o => {
               o.dataEntrega = new Date(`${o.dataEntrega}  00:00:00 GMT-0300`);
               o.dataAlerta = new Date(`${o.dataAlerta}  00:00:00 GMT-0300`);
             });
           })
           .catch( er => {
             this.load = false;
             this.errorHandler.handler(er);
           });

    } else {
      this.message.add( { severity: 'error', summary: 'Erro no id',
          detail: 'O id do cliente está nulo!!!' } );
    }
  }

  excluir(orc: Orcamento) {
    this.confirm.confirm({
      message: 'Tem certeza que deseja excluir o orçamento ' + orc.assunto + '?',
      accept: () => {
        this.load = true;
        this.service.excluir(orc.id)
            .toPromise()
            .then( () => {
              this.load = false;
              this.carregarOrcamentoDoCliente();
              this.message.add( { severity: 'success', summary: 'Orçamento excluído',
            detail: 'O orçamento foi excluído com sucesso!!!' } );
            } )
            .catch( er => {
              this.load = false;
              this.errorHandler.handler(er);
            } );
      }
    });
  }

  consultarChange() {
    if (!this.buscarPorData) {
      this.carregarOrcamentoDoCliente();
    }
  }


  consultarPorData() {
    if (this.dtincio.getTime() > this.dtfim.getTime()) {
      this.message.add( { severity: 'warn', summary: 'Erro de validação',
      detail: 'A data de início não pode ser maior que a data fim!!!' });
      return;
    }

    var dti = new Date(this.dtincio).toISOString().slice(0,10);
    var dtf = new Date(this.dtfim).toISOString().slice(0,10);

     this.load = true;
    this.service.getByDataEntrega(dti, dtf, this.idcliente)
                .toPromise()
                .then( ret => {
                  this.load =false;
                  this.orcamentos = ret['dados'];
                  this.orcamentos.map( o => {
                    o.dataEntrega = new Date(`${o.dataEntrega}  00:00:00 GMT-0300`);
                    o.dataAlerta = new Date(`${o.dataAlerta}  00:00:00 GMT-0300`);
                  });
                })
                .catch( er => {
                  this.load = false;
                  this.errorHandler.handler(er);
                });

  }



  verificarDataAlerta(o: Orcamento) {
    if(o.alerta == 0) {
      return false;
    }
    return o.dataAlerta.getTime() < this.dtNowMili;
  }

  novoOrcamento() {
    this.novoOuEdit.emit({idOrcamento: 0});
  }

  editOrcamento(idOrcamento: number) {
    this.novoOuEdit.emit({idOrcamento: idOrcamento});
  }



}// fecha classe

