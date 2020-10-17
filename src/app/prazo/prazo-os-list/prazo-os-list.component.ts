import { AuthService } from './../../seguranca/auth.service';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { OrdemServicoService } from './../../servicos/ordemServico.service';
import { OrdemServico } from './../../model/OrdemServico';
import { PrazoService } from './../../servicos/prazo.service';
import { ErrorHandlerService } from './../../shared/error-handler.service';
import { Prazo } from 'src/app/model/prazo.class';

import { MessageService, ConfirmationService } from 'primeng/api';
import { CalendarioBr } from 'src/app/model/calendarioBR';
import { FiltroOs } from 'src/app/model/osfiltro.class';

@Component({
  selector: 'app-prazo-os-list',
  templateUrl: './prazo-os-list.component.html',
  styleUrls: ['./prazo-os-list.component.css']
})
export class PrazoOsListComponent implements OnInit {


  br = new CalendarioBr();

  load = false;
  os = new OrdemServico();

  prazo = new Prazo();

  dialogOn = false;

  modoEdit = false;


  dtNowMili = new Date().getTime();





  constructor(
    private error: ErrorHandlerService,
    private service: PrazoService,
    private serviceOs: OrdemServicoService,
    private route: ActivatedRoute,
    private message: MessageService,
    private location: Location,
    private confirm: ConfirmationService,
    public auth: AuthService
  ) {




    const idos = this.route.snapshot.params['idos'];
    if (idos) {
      this.os.id = idos;
      this.carregarOs();
    } else {
      this.message.add( { severity: 'warn', summary: 'Id da O.S. não identificada',
      detail: 'Não foi possível identificar o ID da O.S. para consultar os prazos.', life: 6000 } );
      this.location.back();
    }
   }

  ngOnInit() {
  }



  carregarOs() {
    this.load = true;
    this.serviceOs.getById(this.os.id)
      .toPromise()
      .then( ret => {
        this.load = false;
        var ords = new OrdemServico();
        ords = ret['dados'];
        this.os.alterarOs(ords);
      } )
      .catch( er => {
        this.load = false;
        this.error.handler(er);
        this.location.back();
      });
  }

  salvarPrazo() {
    if (this.prazo.descricao == undefined) {
      this.message.add({severity: 'warn', summary: 'Erro de Validação',
         detail: 'Digite a descrição do Prazo.'});
         return;
    }
    if (this.prazo.descricao == '') {
      this.message.add({severity: 'warn', summary: 'Erro de Validação',
      detail: 'Digite a descrição do Prazo.'});
      return;
    }
    if (this.prazo.alerta && !this.prazo.dataAlerta) {
      this.message.add({severity: 'warn', summary: 'Erro de Validação',
      detail: 'Informe a data do alerta.'});
      return;
    }
    if (this.prazo.alerta && this.prazo.dataAlerta == null) {
      this.message.add({severity: 'warn', summary: 'Erro de Validação',
      detail: 'Informe a data do alerta.'});
      return;
    }

    this.prazo.os = new OrdemServico();
    this.prazo.os.id = this.os.id;

    if (this.modoEdit) {

      this.load = true;
      this.prazo.edit = false;
      this.service.alterar(this.prazo)
         .toPromise()
         .then(() => {
           this.load = false;
           this.message.add({severity:'success', summary:'Prazo alterado', detail:
           'O prazo foi alterado com sucesso.'});
           this.modoEdit = false;
           this.carregarOs();
         })
         .catch( er => {
           this.load = false;
           this.error.handler(er);
         })

    } else {

      this.load = true;
      this.service.cadastrar(this.prazo)
         .toPromise()
         .then(() => {
           this.load = false;
           this.cancelarDialog();
           this.carregarOs();
           this.message.add({severity:'success', summary:'Prazo cadastrado', detail:
           'O novo prazo foi cadastrado com sucesso.'});
         })
         .catch( er => {
           this.load = false;
           this.error.handler(er);
         });

    }
  }//fecha salvar prazo






  novoPrazo() {
    this.prazo = new Prazo();
    this.dialogOn = true;
  }

  cancelarDialog() {
    this.prazo = new Prazo();
    this.dialogOn = false;
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
   this.carregarOs();
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
    this.modoEdit = true;
    this.salvarPrazo();
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
            this.carregarOs();
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
