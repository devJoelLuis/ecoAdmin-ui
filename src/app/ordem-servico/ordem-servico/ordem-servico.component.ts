import { Router } from '@angular/router';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

import { TecnicoDTO } from './../../model/tecnicoDTO.class';
import { Tarefa } from './../../model/tarefa.class';
import { AuthService } from './../../seguranca/auth.service';
import { StatusOs } from './../../model/statusOs';
import { Tecnico } from 'src/app/model/tecnico';
import { TecnicoService } from 'src/app/servicos/tecnico.service';
import { Cliente } from 'src/app/model/Cliente';
import { OrdemServicoService } from 'src/app/servicos/ordemServico.service';
import { ErrorHandlerService } from 'src/app/shared/error-handler.service';
import { ClienteService } from 'src/app/servicos/cliente.service';
import { OrdemServico } from 'src/app/model/OrdemServico';
import { CalendarioBr } from 'src/app/model/calendarioBR';
import { StatusOsService } from 'src/app/servicos/statusOs.service';

import { MessageService, ConfirmationService } from 'primeng/api';
import { DashboardService } from 'src/app/servicos/dashboard.service';
import { OsFiltroDTO } from 'src/app/model/osFiltroDTO.class';


@Component({
  selector: 'app-ordem-servico',
  templateUrl: './ordem-servico.component.html',
  styleUrls: ['./ordem-servico.component.css'],
  animations: [
    trigger(
      'comTransacao',
      [
        transition(
          ':enter',
          [
            style({  opacity: 0 }),
            animate('1s ease-out',
                    style({  opacity: 1 }))
          ]
        ),
        transition(
          ':leave',
          [
            style({  opacity: 1 }),
            animate('1s ease-in',
                    style({  opacity: 0 }))
          ]
        )
      ]
    )
  ]
})



export class OrdemServicoComponent implements OnInit, OnDestroy {

 br = new CalendarioBr();
 cliente = new  Cliente();
 listOsFiltroDTO: OsFiltroDTO[] = [];
 os = new OrdemServico();
 anoOs = new Date().getFullYear();
 load = false;
 semOs = false;
 modeAddOs = false;
 modeEditarOs = false;
 dataNow = new Date();
 alertaServico = false;
 ultimoNumOs = '';
 osSelecionada: OrdemServico;
 tituloOsForm = 'Cadastro de nova Ordem de serviço';
 anoMax = new Date().getFullYear;
 modoDefinirPago = false;

 semPermissao = false;

 //manipulação do técnico
 tecnico: Tecnico;
 listTecnico: Tecnico[] = [];

 //manipulacao do statusOs
 statusOs: StatusOs;
 listStatusOs: StatusOs[] = [];

 //variáveis para tarefa
 novaTarefa = false;
 tarefa= new Tarefa();
 tecnicosDto: TecnicoDTO[] = [];
 osSelecionadaTarefa = new OrdemServico();
 idtecnicoTarefa = 0;
 erroNovaTarefa = '';
 headerDialogTarefa = '';


 // variaveis usadas para manipular serviços
 totalRegServ = 0;
 sizeServ = 10;
 pageServ = 0;
 alertaOs = false;
 ativaVencimentoService = false;
 modeNovoServico = false;
 modeEditServico = false;
 tituloServico = 'Novo Serviço';
 semData = new Date('1970-1-1 00:00:00 GMT-0300').getTime();
 dtNow = new Date();


@Input() idcliente: number;

  constructor(
    public auth: AuthService,
    private router: Router,
    private message: MessageService,
    private errorHandle: ErrorHandlerService,
    private serviceCli: ClienteService,
    private service: OrdemServicoService,
    private confirma: ConfirmationService,
    private serviceTec: TecnicoService,
    private serviceStatusOs: StatusOsService,
    private serviceDash: DashboardService,
  ) {

       // tslint:disable-next-line: no-string-literal
    // const idcliente = this.route.snapshot.params['id'];
    const anoStorage =  sessionStorage.getItem('anoOs');
    if (anoStorage) {
      this.anoOs = Number.parseInt(anoStorage);
    }
  }

  ngOnInit() {
    if (this.auth.temQualquerPermissao(['ROLE_ADMIN', 'ROLE_OS'])) {
      if (this.idcliente) {
        this.carregarCliente(this.idcliente);
        this.semPermissao = false;
     }
    } else {
      this.semPermissao = true;
    }

  }

  ngOnDestroy() {
    sessionStorage.setItem('anoOs', JSON.stringify(this.anoOs));
  }


  carregarTecnicos() {
    this.load = true;
    this.serviceTec.getAll(0, 1000)
       .toPromise()
       .then(ret => {
          this.load=false;
          this.listTecnico = ret['dados']['content'];
          if(this.modeEditServico) {
            var temp = [];
            var adicionado = false;
            // verificar se tecnico já esta adicionado ou não
           this.listTecnico.forEach( tec => {
             adicionado = false;

             if (!adicionado) {
               temp.push(tec);
             }
           });
            this.listTecnico = temp;
          }
       })
       .catch( er =>{
         this.load = false;
         this.errorHandle.handler(er);
       });
      this.carregarStatusOs();
  }

  carregarStatusOs() {
    this.load = true;
    this.serviceStatusOs.getAll()
        .toPromise()
        .then( ret => {
         this.load = false;
         this.listStatusOs = ret['dados'];
        })
        .catch( er => {
         this.load = false;
         this.errorHandle.handler(er);
        });
  }


  carregarCliente(idcliente) {
     this.load = true;
     this.serviceCli.buscarPorId(idcliente)
         .toPromise()
         .then(ret => {
// tslint:disable-next-line: no-string-literal
           this.cliente = ret['dados'];
           this.os.cliente = this.cliente;
           this.buscarOS();
           this.load = false;
         })
         .catch( er => {
           this.load = false;
           this.errorHandle.handler(er);
         });
  }


  buscarOS() {
    this.load = true;
    this.listOsFiltroDTO = [];
    this.osSelecionada = undefined;
    this.service.getAllOsClienteDto(this.cliente.id, this.anoOs)
        .toPromise()
        .then(ret => {
          this.load = false;
          this.listOsFiltroDTO = ret['dados'];
          if (this.listOsFiltroDTO.length === 0) {
            this.semOs = true;
            } else {
              this.semOs = false;
            }
        })
        .catch( er => {
          this.load = false;
          this.errorHandle.handler(er);
        });
  }





  getUltimoNumOs() {
    this.service.getUltimoNumeroOs()
        .toPromise()
        .then( ret => {
          this.ultimoNumOs = ret['dados'];
        })
        .catch( er => {
          this.errorHandle.handler(er);
        });
  }



  addOsMode() {
    this.os = new OrdemServico();
    this.modeAddOs = true;
    this.getUltimoNumOs();
    this.carregarTecnicos();
    this.tituloOsForm = 'Cadastro de nova Ordem de serviço';
  }



  alterarOs(ossDto: OsFiltroDTO) {


      //buscar os
      this.load = true;
      this.service.getById(ossDto.idos)
          .toPromise()
          .then( ret => {
            this.load = false;
            this.carregarTecnicos();
            let oss = <OrdemServico> ret['dados'];
            console.log(oss.dataInicio);
            oss.dataInicio = new Date(`${oss.dataInicio} 00:00:00`);
            this.os = new OrdemServico();
            this.statusOs = oss.statusOs;
            this.tecnico = oss.tecnico;
            if(oss.alerta == 1) {
              this.alertaOs == true;
              oss.dataAlerta = new Date(`${oss.dataAlerta} 00:00:00`);
            } else {
              this.alertaOs= false;
              oss.dataAlerta = new Date('1970-01-01 00:00:00');
            }
            this.os.alterarOs(oss);

            if (oss.alerta == 1) {
              this.alertaOs = true;
            } else {
              this.alertaOs = false;
            }
            this.modeEditarOs = true;
            this.tituloOsForm = 'Alterar O. S. ' + oss.numOs + '/' + oss.anoOs;

          })
          .catch(er => {
            this.load = false;
            this.errorHandle.handler(er);
          });




  }






  cancelarFormOs() {
    this.modeAddOs = false;
    this.modeEditarOs = false;
    this.osSelecionada = undefined;
    this.os = new OrdemServico();
  }





  salvarOs() {

    if (this.os.local === undefined || this.os.local === '') {
      this.message.add( { severity: 'warn', summary: 'Erro de validação',
      detail: 'O campo local dos documentos deve ser preenchido', life: 6000 } );
      return false;
    }


    // se nenhum tecnico foi selecionado
    if(this.tecnico === undefined) {
      this.message.add( { severity: 'warn', summary: 'Erro de validação',
           detail: 'Selecione o técnico da O.S.', life: 6000 } );
           return;
    }

    if(this.statusOs === undefined) {
      this.message.add( { severity: 'warn', summary: 'Erro de validação',
           detail: 'Selecione o status da O.S.', life: 6000 } );
           return;
    }
    if(this.os.anoOs < 1970 || this.os.anoOs > new Date().getFullYear()) {
      this.message.add( { severity: 'warn', summary: 'Erro de validação',
           detail: 'O ano informado é inválido', life: 6000 } );
           return;
    }

    this.os.statusOs = this.statusOs;
    this.os.tecnico = this.tecnico;
    if (this.alertaOs) {
      this.os.alerta = 1;
    } else {
      this.os.alerta = 0;
    }
    if (this.modeAddOs) {
      this.os.cliente = this.cliente;
      this.load = true;
      this.service.cadastrar(this.os)
          .toPromise()
          .then( () => {
            this.load = false;
            this.message.add( { severity: 'success', summary: 'Ordem de serviço aberta',
                detail: 'A ordem de serviço foi aberta com sucesso para o cliente ' + this.cliente.nome } );
            this.os = new OrdemServico();
            this.modeAddOs = false;
            this.osSelecionada = undefined;
            this.carregarCliente(this.cliente.id);
          })
          .catch( er => {
            this.load = false;
            this.modeAddOs = false;
            this.errorHandle.handler(er);
          } );
    }

    if ( this.modeEditarOs) {
      this.load = true;

      this.service.salvarEdicao(this.os)
          .toPromise()
          .then( () => {
            this.load = false;
            this.message.add( { severity: 'success', summary: 'Ordem de serviço alterada',
                detail: 'A ordem de serviço foi alterada com sucesso ' } );
            this.os = new OrdemServico();
            this.modeEditarOs = false;
            this.carregarCliente(this.cliente.id);
          })
          .catch( er => {
            this.load = false;
            this.modeEditarOs = false;
            this.errorHandle.handler(er);
          } );
    }
  }

  salvarOsApi() {

  }



  cancelarFormServico() {
    this.modeNovoServico = false;
    this.modeEditServico = false;
    this.osSelecionada = undefined;

  } // fecha metodo cancelar




  exibirFormAddServico(os: OrdemServico) {
    this.carregarTecnicos();
    this.modeNovoServico = true;
    this.tituloServico = 'Novo Serviço'
    this.osSelecionada = os;
  } // fecha metodo exibir








  ativaAlertaOs() {
    if(this.alertaOs) {
      this.os.dataAlerta = new Date();
      this.os.alerta = 1;
    } else {
      this.os.dataAlerta = new Date('1970-1-1 00:00:00 GMT-0300');
      this.os.alerta = 0;
    }
  }



    // exclusão da Ordem de serviço
    confirmarExclusao(oss: OsFiltroDTO) {
      this.confirma.confirm({
        message: 'Tem certeza que deseja excluir a ordem de serviço ' + oss.numOs +
         '/' + oss.anoOs + ' e todos os serviços vinculados a ela?',
        accept: () => {
           this.load = true;
           this.service.excluir(oss.idos)
               .toPromise()
               .then(ret => {
                this.buscarOS();
                this.load = false;
                this.message.add( { severity: 'success', summary: 'O.S. Excluída',
                                    detail: 'A O.S. foi excluída com sucesso!!!' } );
               })
               .catch( er => {
                 this.load = false;
                 this.errorHandle.handler(er);
               });
        }
      });
    }




/*

  gerarRecibo(serv: Servico) {
    var recibo = new Recibo();
    serv.dataPagamento = new Date(`${serv.dataPagamento} 00:00:00 GMT-0300`);
    recibo.ano = serv.dataPagamento.getFullYear().toString();
    recibo.mes = (serv.dataPagamento.getMonth() + 1).toString();
    recibo.dia = serv.dataPagamento.getDate().toString();
    recibo.total = serv.valor.toLocaleString('pt-BR', { minimumSignificantDigits: 2 });
    recibo.recebemosde = serv.ordemServico.cliente.nome;
    recibo.referente = serv.descricao;
    this.router.navigateByUrl('/recibo',{
      state: { recibo: recibo }
    });
  }
  */


  irCadTecnico() {
    this.router.navigate(['/tecnico/novo']);
  }

  irCadStatus() {
    this.router.navigate(['/statusOs']);
  }




  gotoServicosFinancas(id :number) {
    this.router.navigate(['/ordem-servico/lancamentos', id]);
  }

  gotoPrazos(os) {
    this.router.navigate(['/prazos', os.idos]);
  }



  salvarNovaTareva() {

    if (!this.osSelecionadaTarefa) {
        this.messageTarefa('Erro, nenhuma O.S. selecionada.');
        return;
    }
    if (!this.idtecnicoTarefa) {
      this.messageTarefa('Selecione o técnico para a tarefa.');
      return;
    }
    if (this.idtecnicoTarefa == 0) {
      this.messageTarefa('Selecione o técnico para a tarefa.');
      return;
    }
    if (this.tarefa.descricao == undefined || this.tarefa.descricao == '') {
      this.messageTarefa('Digite a descrição da tarefa.');
      return;
    }

  //salvar nova tarefa
  this.tarefa.tecnico.id = this.idtecnicoTarefa;
  this.tarefa.os.id = this.osSelecionadaTarefa.id;
  this.load = true;
  this.serviceDash.cadastraTarefa(this.tarefa)
      .toPromise()
      .then( () => {
        this.load = false;
        this.cancelaNovaTarefa();
        this.message.add({severity: 'success', summary: 'Tarefa Salva', detail:'A tarefa foi salva com sucesso!'});

      })
      .catch( er => {
        this.load = false;
        this.cancelaNovaTarefa();
        this.errorHandle.handler(er);

      });

  }//fecha salvar tarefa




  async messageTarefa(message) {
    this.erroNovaTarefa = message;
    await setTimeout(() => {
      this.erroNovaTarefa = '';
    }, 4000);
  }



  alertaTarefaOff() {
    this.erroNovaTarefa = '';
  }



  modoNovaTarefa(os: OsFiltroDTO) {
    this.carregarTecnicosDto();
    //buscar os
    this.load = true;
    this.service.getById(os.idos)
        .toPromise()
        .then( ret => {
          this.load = false;
          this.osSelecionadaTarefa = ret['dados'];
          this.novaTarefa = true;
          this.headerDialogTarefa =  `Nova tarefa para a O.S.: ${os.numOs}/${os.anoOs} ${os.descricaoOs}`;
        })
        .catch(er => {
          this.load = false;
          this.errorHandle.handler(er);
        });


  }



  cancelaNovaTarefa() {
    this.novaTarefa = false;
    this.idtecnicoTarefa = 0;
    this.osSelecionada = new OrdemServico();
    this.tarefa = new Tarefa();

  }

  carregarTecnicosDto() {
    this.load = true;
    this.serviceTec.getAllDto()
       .toPromise()
       .then( ret => {
         this.load = false;
         this.tecnicosDto = <any>ret;
       })
       .catch( er => {
        this.load = false;
         this.errorHandle.handler(er);
       });
  }

}// fecha classe
