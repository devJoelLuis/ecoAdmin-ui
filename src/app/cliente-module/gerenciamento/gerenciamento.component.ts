import { AuthService } from './../../seguranca/auth.service';
import { CalendarioBr } from 'src/app/model/calendarioBR';
import { Parcela } from './../../model/parcela';
import { Gerenciamento } from './../../model/gerenciamento';
import { GerenciamentoService } from 'src/app/servicos/gerenciamento.service';
import { ErrorHandlerService } from 'src/app/shared/error-handler.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Component, OnInit, Input } from '@angular/core';
import { ParcelaService } from 'src/app/servicos/parcela.service';


@Component({
  selector: 'app-gerenciamento',
  templateUrl: './gerenciamento.component.html',
  styleUrls: ['./gerenciamento.component.css']
})
export class GerenciamentoComponent implements OnInit {

  @Input() idcliente: number;

  load = false;
  modoEdit = false;
  modoCadastro = false;
  modoAddTaxa = false;
  modoDefinirPago = false;
  titulo = "Cadastro";
  dtNow = new Date();
  br = new CalendarioBr();
  parcela = new Parcela();
  semDataMili = new Date('1970-1-1 00:00:00 GMT-0300').getTime();
  semPermissao = false;

  page = 0;
  size = 10;
  totalRegistro = 0;

  pageParc = 0;
  sizeParc = 10;
  totalRegParc = 0;


  taxa = new Parcela();
  gerenciamento = new Gerenciamento();
  gerenciamentoSelecionado = new Gerenciamento();
  listGer: Gerenciamento[] = [];

  constructor(
    public auth: AuthService,
    private message: MessageService,
    private erroHandler: ErrorHandlerService,
    private service: GerenciamentoService,
    private servicePar: ParcelaService,
    private confirm: ConfirmationService,
  ) { }

  ngOnInit() {
    if (this.auth.temQualquerPermissao(['ROLE_ADMIN', 'ROLE_GERENCIAMENTO'])){
      if(this.idcliente) {
        this.carregarGerenciamentos();
        this.semPermissao = false;
      }
    } else {
       this.semPermissao = true;
    }

  }

  carregarGerenciamentos() {
    this.load = true;
    this.service.getAllPageableIdCliente(this.page, this.size, this.idcliente)
        .toPromise()
        .then( ret => {
          this.load = false;
          this.listGer = ret['dados']['content'];
          this.totalRegistro = ret['dados']['totalElements'];
        })
        .catch( er => {
          this.load = false;
          this.erroHandler.handler(er);
        });
  }


  carregarParcelas() {
    this.load = true;
    this.servicePar.getAllPageableIdGerenciamento(this.pageParc, this.sizeParc, this.gerenciamentoSelecionado.id)
       .toPromise()
       .then(ret => {
         this.load = false;
         this.gerenciamentoSelecionado.parcelas = ret['dados']['content'];
         this.totalRegParc = ret['dados']['totalElements'];
         this.gerenciamentoSelecionado.parcelas.map( p => {
          p.dataVencimento = new Date(`${p.dataVencimento} 00:00:00 GMT-0300`);
          p.dataPagamento = new Date(`${p.dataPagamento} 00:00:00 GMT-0300`);
       });
       })
       .catch( er => {
         this.load = false;
         this.erroHandler.handler(er);
       });
  }


  tabGer(ger: Gerenciamento){
    this.gerenciamentoSelecionado = ger;
    this. resetPageableParcela();
    this.carregarParcelas();
  }

  ativaModoCadastro() {
    this.taxa = new Parcela();
    this.gerenciamento = new Gerenciamento();
    this.modoEdit = false;
    this.modoCadastro = true;
    this.titulo = "Cadastro";
  }
  desativarModoCadastro() {
    this.taxa = new Parcela();
    this.gerenciamento = new Gerenciamento();
    this.modoEdit = false;
    this.modoCadastro = false;
    this.titulo = "Cadastro";
  }
  ativaModoEdicao() {
    this.modoCadastro = false;
    this.modoEdit = true;
    this.titulo = "Edição";
  }



  salvar() {

    if(this.gerenciamento.descricao == undefined) {
      this.message.add( { severity: 'warn', summary: 'Erro de validação', life: 9000,
      detail: 'Informe a descrição' } );
      return;
    }

    if(this.modoEdit) {
       this.load = true;
       this.service.salvarEdicao(this.gerenciamento)
           .toPromise()
           .then( () => {
             this.load = false;
             this.carregarGerenciamentos();
             this.modoEdit = false;
             this.message.add( { severity: 'success', summary: 'Alteração salva', detail: 'Alteração salva com sucesso!!!'} );

           })
           .catch( er => {
             this.load = false;
             this.erroHandler.handler(er);
           } );
      return;
    }


    if(this.gerenciamento.totalParcela === undefined) {
      this.message.add({ severity: 'warn', summary: 'Erro de validação',
       detail: 'Número de parcelas inválido'});
       return;
    }
    if(this.gerenciamento.totalParcela < 1 || this.gerenciamento.totalParcela > 24) {
      this.message.add( { severity: 'warn', summary: 'Erro de validação', life: 9000,
                     detail: 'O número de parcelas deve ser de no mínimo 1 e máximo 24' } );
       return;
    }
    if(this.taxa.valor == 0) {
      this.message.add( { severity: 'warn', summary: 'Erro de validação', life: 9000,
      detail: 'informe o valor da parcela' } );
      return;
    }

    if(this.gerenciamento.descricao == '') {
      this.message.add( { severity: 'warn', summary: 'Erro de validação', life: 9000,
      detail: 'Informe a descrição' } );
      return;
    }
    this.load = true;
    this.gerenciamento.cliente.id = this.idcliente;
    this.gerenciamento.parcelas.push(this.taxa);
    this.service.cadastrar(this.gerenciamento)
        .toPromise()
        .then( () => {
          this.load = false;
        this.carregarGerenciamentos();
        this.desativarModoCadastro();
        this.message.add( { severity: 'success', summary: 'Gerenciamento cadastrado',
              detail: 'O gerenciamento e as parcelas foram criadas com sucesso' } );
        })
        .catch( er => {
          this.load = false;
          this.erroHandler.handler(er);
        });
  }

  resetPageableParcela() {
    this.pageParc = 0;
    this.sizeParc = 10;
    this.totalRegParc = 0;
  }

  cancelar() {
    this.modoCadastro = false;
    this.modoEdit = false;
    this.modoAddTaxa = false;
  }


  adicionarTaxaUnica(ger: Gerenciamento) {
    this.modoCadastro = false;
    this.modoEdit = false;
    this.taxa = new Parcela();
    this.gerenciamento = ger;
    this.modoAddTaxa = true;
  }

  salvarTaxaUnica() {
    if(this.taxa.valor == 0) {
      this.message.add( { severity: 'warn', summary: 'Erro de validação', life: 9000,
      detail: 'informe o valor da parcela' } );
      return;
    }
    if(this.taxa.dataVencimento == undefined || this.taxa.dataVencimento == null) {
      this.message.add( { severity: 'warn', summary: 'Erro de validação', life: 9000,
      detail: 'informe a data de vencimento' } );
      return;
    }
    this.taxa.gerenciamento = new Gerenciamento();
    this.taxa.gerenciamento.id = this.gerenciamento.id;
    this.load = true;
    this.servicePar.cadastrar(this.taxa)
        .toPromise()
        .then( ret => {
            this.load = false;
            this.message.add( { severity: 'success', summary: 'Parcela cadastrada', life: 9000,
                detail: 'A nova parcela foi cadastrada com sucesso!!!' } );
            this.carregarGerenciamentos();
            this.modoAddTaxa = false;
        })
        .catch( er => {
           this.load = false;
           this.erroHandler.handler(er);
        });

  }

  alterarGerenciamento(ger: Gerenciamento) {
    this.gerenciamento = ger;
    this.modoEdit = true;
  }

  confirmarExclusao(ger: Gerenciamento) {
     this.confirm.confirm({
       message: 'Tem certeza que deseja excluir o gerenciamento '+
       ger.descricao+ ' e todas a suas parcelas?',
       accept: () => {
         this.load = true;
         this.service.excluir(ger.id)
             .toPromise()
             .then( () => {
               this.load = false;
               this.message.add( { severity: 'success', summary: 'Gerenciamento Excluido',
               detail: 'Gerenciamanto excluído com sucesso!!'  } );
               this.carregarGerenciamentos();
             })
             .catch( er => {
               this.load = false;
               this.erroHandler.handler(er);
             });
       }
     })
  }

  ativaModoDefinirPago(p: Parcela) {
    this.confirm.confirm({
      message: 'Tem certeza que deseja definir a parcela '+ this.parcela.numeroParcela + ' como pago?',
      accept: () => {
    this.parcela = p;
    this.parcela.dataPagamento = new Date();
    this.modoDefinirPago = true;
      }
      });
  }

  desativaModoDefinirPago() {
    this.modoDefinirPago = false;
    this.carregarParcelas();
  }



  definirPago() {

        this.parcela.pago = 1;
        this.load = true;
        this.servicePar.alerarPagoOuDevedor(this.parcela.id, 1, this.parcela.dataPagamento.toISOString().slice(0,10))
            .toPromise()
            .then(() => {
              this.load = false;
              this.parcela = new Parcela();
              this.modoDefinirPago = false;
              this.carregarParcelas();
            })
            .catch( er => {
              this.load = false;
              this.modoDefinirPago = false;
              this.carregarParcelas();
              this.erroHandler.handler(er);
            });

  }




  definirDevedor(p: Parcela) {
    this.confirm.confirm({
      message: 'Tem certeza que deseja definir a parcela '+ p.numeroParcela + ' como devedor?',
      accept: () => {
       p.pago = 0;
       this.load = true;
       this.servicePar.alerarPagoOuDevedor(p.id, 0, '1970-01-01')
           .toPromise()
           .then(() => {
             this.load = false;
             this.carregarParcelas();
           })
           .catch( er => {
             this.load = false;
             p.pago = 1;
             this.erroHandler.handler(er);
           });
      }
    });
  }

  paginate(event) {
   this.pageParc = event.page;
   this.carregarParcelas();
  }

}// fecha classe
