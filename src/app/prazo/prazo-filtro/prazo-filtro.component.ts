import { AuthService } from './../../seguranca/auth.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ErrorHandlerService } from 'src/app/shared/error-handler.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { PrazoService } from './../../servicos/prazo.service';
import { Prazo } from 'src/app/model/prazo.class';

@Component({
  selector: 'app-prazo-filtro',
  templateUrl: './prazo-filtro.component.html',
  styleUrls: ['./prazo-filtro.component.css']
})
export class PrazoFiltroComponent implements OnInit {

  load = false;

  prazos: Prazo[] = [];
  prazo = new Prazo();


  modoEdit = false;


  dtNowMili = new Date().getTime();

  param: string;

  ROWS_POR_PAGINA_INICIAL = 20;
  page = 0;
  size = this.ROWS_POR_PAGINA_INICIAL;
  totalRegistro = 0;

  numOs: number;
  anoOs: number;



  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private service: PrazoService,
    private error: ErrorHandlerService,
    private confirm: ConfirmationService,
    private message: MessageService,
    public auth: AuthService
  ) {
     this.param = this.route.queryParams['value']['param'];

    if (this.param) {
      this.consultarPrazo();
    }

   }//fecha construtor




  ngOnInit() {
  }





  getPrazosAlerta() {
    this.load = true;
    this.service.getAllAlerta()
       .toPromise()
       .then( ret => {
         this.load = false;
         this.prazos = ret['dados'];
       })
       .catch( er => {
          this.load = false;
          this.error.handler(er);
       });
  }




  getPrazosVencidos() {
    this.load = true;
    this.service.getAllVencido()
       .toPromise()
       .then( ret => {
         this.load = false;
         this.prazos = ret['dados'];
       })
       .catch( er => {
          this.load = false;
          this.error.handler(er);
       });
  }

  getPrazosVencendo() {
    this.load = true;
    this.service.getAllVencendo()
       .toPromise()
       .then( ret => {
         this.load = false;
         this.prazos = ret['dados'];
       })
       .catch( er => {
          this.load = false;
          this.error.handler(er);
       });
  }


  getAll() {
    this.load = true;
    this.service.getAll(this.page, this.size)
       .toPromise()
       .then( ret => {
         this.load = false;
         this.prazos = ret['dados']['content'];
         this.totalRegistro = ret['dados']['totalElements'];
       })
       .catch( er => {
          this.load = false;
          this.error.handler(er);
       });
  }

  resetPageable() {
    this.size = this.ROWS_POR_PAGINA_INICIAL;
    this.page = 0;
    this.totalRegistro = 0;
  }


  consultarPrazo() {
    this.resetPageable();
    if (this.param == 'alerta') {
      this.getPrazosAlerta();
      return;
    }
    if (this.param == 'vencido') {
       this.getPrazosVencidos();
     return;
    }
    if (this.param == 'vencendo') {
      this.getPrazosVencendo();
    }
    if (this.param == 'todos') {
      this.getAll();
    }
  }


  consultaPorOs() {
    this.param = '';
    if (!this.numOs) {
      this.message.add( { severity: 'warn', summary: 'Informe o número da O.S.' } );
      return;
    }
    if (this.numOs  == 0) {
      this.message.add( { severity: 'warn', summary: 'Informe o número da O.S.' } );
      return;
    }
    if (!this.anoOs) {
      this.message.add( { severity: 'warn', summary: 'Informe o Ano.' } );
      return;
    }
    if (this.anoOs  < 2000 || this.anoOs > 2100) {
      this.message.add( { severity: 'warn', summary: 'Informe o Ano.' } );
      return;
    }

     this.load = true;
     this.service.getAllNumOs(this.numOs, this.anoOs)
         .toPromise()
         .then( ret => {
           this.load = false;
           this.prazos = ret['dados'];
         })
         .catch( er => {
           this.load = false;
           this.error.handler(er);
         });

  }



  alterar(p: Prazo) {
  //  p.dataVencimento = new Date(`${p.dataVencimento} 00:00:00 GMT-0300`);
   // if (p.alerta) {
  //    p.dataAlerta = new Date(`${p.dataAlerta} 00:00:00 GMT-0300`);
  //  }
    p.edit = true;
    this.modoEdit = true;
  }
  cancelarAlteracao(p: Prazo) {
   this.consultarPrazo();
   p.edit = false;
   this.modoEdit = false;
  }

  salvarAlteracao(p: Prazo) {
   // converter string dd-MM-yyyy para date
    p.dataVencimento = new Date(p.dataVencimento.toString().replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")+ ' 00:00:00 GMT-0300');
    if (p.alerta) {
      p.dataAlerta = new Date(p.dataAlerta.toString().replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")+ ' 00:00:00 GMT-0300');
    } else {
      p.dataAlerta = null;
    }
    this.prazo = p;
    this.salvarPrazo();
  }




  salvarPrazo() {
    this.load = true;
    this.prazo.edit = false;
   // const idOs = this.prazo.os.id;
   // this.prazo.os = new OrdemServico();
  //  this.prazo.os.id = idOs;
    this.service.alterar(this.prazo)
       .toPromise()
       .then(() => {
         this.load = false;
         this.message.add({severity:'success', summary:'Prazo alterado', detail:
         'O prazo foi alterado com sucesso.'});
         this.modoEdit = false;
         this.consultarPrazo();
       })
       .catch( er => {
         this.load = false;
         this.consultarPrazo();
         this.error.handler(er);
       })
  }





  confirmaExclusao(p: Prazo) {
    this.confirm.confirm({
      message: 'Tem certeza que deseja excluir o prazo '+ p.descricao +'?',
      accept: () => {
        this.load = true;
        this.service.excluir(p.id)
          .toPromise()
          .then(() => {
            this.load = false;
            this.message.add({ severity: 'info', summary: 'Prazo excluído', detail: 'O prazo foi excluído com sucesso!!!'});
            this.consultarPrazo();
          })
          .catch( er => {
            this.load = false;
            this.error.handler(er);
          });
      }
    });
  }


  goback() {
    this.location.back();
  }

  verificarAlerta(p: Prazo): boolean {
     if (p.alerta) {
       const dtAlertaMili = new Date(`${p.dataAlerta} 00:00:00 GMT-0300`).getTime();
       return this.dtNowMili > dtAlertaMili;
     } else {
       return false;
     }
  }

  verificarVencido(p: Prazo): boolean {
    const dtVencimentoMili = new Date(`${p.dataVencimento} 00:00:00 GMT-0300`).getTime();
    return this.dtNowMili > dtVencimentoMili;
  }



  paginate(event) {
    //event.first = Index of the first record
    //event.rows = Number of rows to display in new page
    //event.page = Index of the new page
    //event.pageCount = Total number of pages
    this.size = event.rows;
    this.page = event.page;
    this.getAll();
}



 prazoCumprido(p: Prazo){

    this.confirm.confirm({
      message: 'Tem certeza que deseja definir o prazo '+ p.descricao +' como cumprido?',
      accept: () => {
        p.cumprido = true;
        this.salvarAlteracao(p);
      }
    });

 }

 retornarPrazo(p: Prazo) {

  this.confirm.confirm({
    message: 'Tem certeza que deseja reabilitar o prazo '+ p.descricao +'?',
    accept: () => {
      p.cumprido = false;
      this.salvarAlteracao(p);
    }
  });

 }



}//fecha classe
