import { LicencaFiltroConsulta } from './../../model/licencaFiltroConsulta.class';
import { AuthService } from './../../seguranca/auth.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Location } from '@angular/common';
import { Licenca } from './../../model/licenca';
import { Component, OnInit } from '@angular/core';
import { ErrorHandlerService } from 'src/app/shared/error-handler.service';
import { LicencaService } from 'src/app/servicos/licenca.service';
import { CalendarioBr } from 'src/app/model/calendarioBR';
import { Router, ActivatedRoute } from '@angular/router';

import * as moment from 'moment';

@Component({
  selector: 'app-licenca-filtro',
  templateUrl: './licenca-filtro.component.html',
  styleUrls: ['./licenca-filtro.component.css']
})
export class LicencaFiltroComponent implements OnInit {

licencas: Licenca[] = [];

consulta ='';
filtro = new LicencaFiltroConsulta();


diaMili = ((1000 * 60) * 60) * 24; // um dia em milisegundos
dtNow = new Date();
dtInicio = new Date(this.dtNow.getTime() - (this.diaMili * 60));
dtFim = new Date(this.dtNow.getTime() + (this.diaMili * 60)); // data dim 60 dias
br = new CalendarioBr();

// variaveis para pageable
page = 0;
size = 20;
totalRegistro = 0;




//variavel load
load = false;

  constructor(
    public auth: AuthService,
    private errorHandler: ErrorHandlerService,
    private service: LicencaService,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private confirm: ConfirmationService,
    private message: MessageService
  ) {

    const param = this.route.queryParams['value']['param'];
   // const param2 = this.route.queryParams['value']['param2'];



    if (param) {

      if (param == 'vencendo') {
          this.getAllLicencasVencendo();
         return;
      }
      if (param == 'vencidas') {
          this.getAllLicencasVencidas();
         return;
      }
      if (param == 'alerta') {
        this.filtro.tipo = 'alerta';
        this.consultar();
        return;
      }
      if (param == 'todas') {
         this.filtro.tipo = 'tudo';
         this.consultar();
         return;

      } else {
         this.consultar();
      }

    } else {
      this.consultar();
    }
   }

  ngOnInit() {


  }



  definirComoArquivoMorto(l: Licenca) {
    this.confirm.confirm({
      message: 'Tem certeza que deseja transformar a licença '+ l.assunto +' em arquivo morto?',
      accept: () => {
         l.arquivoMorto = true;
         this.load = true;
         this.service.alterar(l)
             .toPromise()
             .then( () => {
               this.load = false;
               this.licencas = this.licencas.filter( l => {
                 return !l.arquivoMorto;
               });
             })
             .catch( er => {
               this.load = false;
                l.arquivoMorto = false;
               this.errorHandler.handler(er);
             });
      }
    });
  }


  reativarLicencaDoArquivoMorto(l: Licenca) {
    this.confirm.confirm({
      message: 'Tem certeza que deseja retirar a licença '+ l.assunto +' do arquivo morto?',
      accept: () => {
         l.arquivoMorto = false;
         this.load = true;
         this.service.alterar(l)
             .toPromise()
             .then( () => {
               this.load = false;
               this.licencas = this.licencas.filter( l => {
                 return l.arquivoMorto;
               });
             })
             .catch( er => {
               this.load = false;
                l.arquivoMorto = true;
               this.errorHandler.handler(er);
             });
      }
    });
  }



  confirmarExclusaoLicenca(l: Licenca) {
    this.confirm.confirm({
       message: 'Tem certeza que deseja excluir a licença '+ l.assunto + '?',
       accept: () => {
          this.load = true;
          this.service.excluir(l.id)
              .toPromise()
              .then( () => {
                this.load = false;
                this.message.add( { severity: 'info', summary: 'Licença Excluída', detail: 'A Licença foi excluída com sucesso' } );
                this.consultar();
              })
              .catch( er => {
                this.load = false;
                this.errorHandler.handler(er);
              });
       }
    });
  }




  gerarRelatorio(id) {
    this.load = true;
       this.service.relatorio(id)
           .subscribe(
             (ret) => {
               this.load = false;
               const url =  window.URL.createObjectURL(ret);
               window.open(url);
             }, error => {
               this.load = false;
               this.errorHandler.handler(error);
             })

   }


   getAll() {
     this.load = true;
     this.service.getAll(this.page, this.size)
     .toPromise()
     .then( ret => {
       this.load = false;
       this.licencas = ret['dados']['content'];
       this.totalRegistro = ret['dados']['totalElements'];
       if (this.licencas && this.licencas.length > 0) {
         this.licencas.map( l => {
           l.dataVencimento = new Date(`${l.dataVencimento} 00:00:00 GMT-0300`);
           l.dataInicio = new Date(`${l.dataInicio} 00:00:00 GMT-0300`);
           l.dataAlerta = new Date(`${l.dataAlerta} 00:00:00 GMT-0300`);
         })
       }
     })
     .catch( er => {
       this.load = false;
       this.errorHandler.handler(er);
     });
   }


   getAllLicencasVencendo() {
     const data60dias =  new Date(this.dtNow.getTime() + (this.diaMili * 160));
     this.service.getAllPorDtVencimentoTodas(this.page, this.size, this.dtNow, data60dias )
     .toPromise()
     .then( ret => {
       this.load = false;
       this.licencas = ret['dados']['content'];
       this.totalRegistro = ret['dados']['totalElements'];
       if (this.licencas && this.licencas.length > 0) {
         this.licencas.map( l => {
           l.dataVencimento = new Date(`${l.dataVencimento} 00:00:00 GMT-0300`);
           l.dataInicio = new Date(`${l.dataInicio} 00:00:00 GMT-0300`);
           l.dataAlerta = new Date(`${l.dataAlerta} 00:00:00 GMT-0300`);
         })
       }
     })
     .catch( er => {
       this.load = false;
       this.errorHandler.handler(er);
     });
   }



   getAllLicencasVencidas() {
     this.load = true;
     this.service.getAllVencidas(this.page, this.size)
     .toPromise()
     .then( ret => {
       this.load = false;
       this.licencas = ret['dados']['content'];
       this.totalRegistro = ret['dados']['totalElements'];
       if (this.licencas && this.licencas.length > 0) {
         this.licencas.map( l => {
           l.dataVencimento = new Date(`${l.dataVencimento} 00:00:00 GMT-0300`);
           l.dataInicio = new Date(`${l.dataInicio} 00:00:00 GMT-0300`);
           l.dataAlerta = new Date(`${l.dataAlerta} 00:00:00 GMT-0300`);
         })
       }
     })
     .catch( er => {
       this.load = false;
       this.errorHandler.handler(er);
     })
   }


  getAllLicencas() {
    this.load = true;
    this.service.getAllPorDtVencimentoSemParam(this.page, this.size, this.dtInicio, this.dtFim, 0)
        .toPromise()
        .then( ret => {
          this.load = false;
          this.licencas = ret['dados']['content'];
          this.totalRegistro = ret['dados']['totalElements'];
          if (this.licencas && this.licencas.length > 0) {
            this.licencas.map( l => {
              l.dataVencimento = new Date(`${l.dataVencimento} 00:00:00 GMT-0300`);
              l.dataInicio = new Date(`${l.dataInicio} 00:00:00 GMT-0300`);
              l.dataAlerta = new Date(`${l.dataAlerta} 00:00:00 GMT-0300`);
            })
          }
        })
        .catch( er => {
          this.load = false;
          this.errorHandler.handler(er);
        });
  }

  getAllAlerta() {
    this.service.getAllAlerta(this.page, this.size)
    .toPromise()
    .then( ret => {
      this.load = false;
      this.licencas = ret['dados']['content'];
      this.totalRegistro = ret['dados']['totalElements'];
      if (this.licencas && this.licencas.length > 0) {
        this.licencas.map( l => {
          l.dataVencimento = new Date(`${l.dataVencimento} 00:00:00 GMT-0300`);
          l.dataInicio = new Date(`${l.dataInicio} 00:00:00 GMT-0300`);
          l.dataAlerta = new Date(`${l.dataAlerta} 00:00:00 GMT-0300`);
        })
      }
    })
    .catch( er => {
      this.load = false;
      this.errorHandler.handler(er);
    });
  }



  consultar() {

    this.filtro.page = this.page;
    this.filtro.size = this.size;
    this.filtro.dtInicio = moment(this.dtInicio).format('YYYY-MM-DD');
    this.filtro.dtFim = moment(this.dtFim).format('YYYY-MM-DD');

         this.load = true;
         this.service.getAllFiltro(this.filtro)
             .toPromise()
             .then( ret => {
              this.load = false;
              this.licencas = ret['dados']['content'];
              this.totalRegistro = ret['dados']['totalElements'];
              if (this.licencas && this.licencas.length > 0) {
                this.licencas.map( l => {
                  l.dataVencimento = new Date(`${l.dataVencimento} 00:00:00 GMT-0300`);
                  l.dataInicio = new Date(`${l.dataInicio} 00:00:00 GMT-0300`);
                  l.dataAlerta = new Date(`${l.dataAlerta} 00:00:00 GMT-0300`);
                })
              }
             })
             .catch( er => {
               this.load = false;
               this.errorHandler.handler(er);
             });

  }//fecha metodo consultar


  keyupConsulta(event) {
    if (event.key == 'Enter') {
      this.page = 0;
      this.consultar();
    }
  }


  paginate(event) {
    this.page = event.page;
    this.size = event.rows;
    this.consultar();
  }


  editar(id: number) {
    this.router.navigate([`/licenca-filtro/${id}`]);
  }

  goBack() {
    this.location.back();
  }


  radioTudo() {
    this.filtro.page = 0;
    this.filtro.param = '';
    this.consultar();
  }
  radioAlerta() {
    this.filtro.page = 0;
    this.filtro.param = '';
    this.consultar();
  }
  radioMorto() {
    this.filtro.page = 0;
    this.filtro.param = '';
    this.consultar();
  }
  radioVencimento() {
    this.filtro.page = 0;
    this.filtro.param = '';
    this.consultar();
  }



}// fecha classe
