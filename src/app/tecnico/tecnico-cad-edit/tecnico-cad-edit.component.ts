import { ActivatedRoute } from '@angular/router';

import { Component, OnInit, NgZone, Renderer } from '@angular/core';

import { Tecnico } from 'src/app/model/tecnico';
import { ErrorHandlerService } from 'src/app/shared/error-handler.service';
import { TecnicoService } from 'src/app/servicos/tecnico.service';

import { MessageService, ConfirmationService } from 'primeng/api';
import { Location } from '@angular/common';

@Component({
  selector: 'app-tecnico-cad-edit',
  templateUrl: './tecnico-cad-edit.component.html',
  styleUrls: ['./tecnico-cad-edit.component.css']
})
export class TecnicoCadEditComponent implements OnInit {


  titulo = 'Cadastro de novo técnico';
  containertecnico = 'container-tecnico-cad-edit alturaMinima bg-color-novo';
  load = false;


  tecnico = new Tecnico(); // utilizado para alterar ou cadastro um novo ténico

  modoCadastro = false;
  modoEdicao = false;



  constructor(
    private errorHandle: ErrorHandlerService,
    private service: TecnicoService,
    private message: MessageService,
    private render: Renderer,
    private ngZone: NgZone,
    private confirm: ConfirmationService,
    private location: Location,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    const idtecnico = this.route.snapshot.params['id'];
    if(idtecnico) {
     this.modoEdicao = true;
     this.modoCadastro = false;
     this.carregarOs(idtecnico);
     this.titulo = "Edição de Técnico";
     this.containertecnico = 'container-tecnico-cad-edit alturaMinima bg-color-edit';

    } else {
      this.titulo = "Cadastro de Técnico";
      this.containertecnico = 'container-tecnico-cad-edit alturaMinima bg-color-novo';
      this.modoCadastro = true;
      this.modoEdicao = false;
    }
  }



carregarOs(idtecnico: number) {
  this.load = true;
  this.service.getById(idtecnico)
      .toPromise()
      .then( ret => {
        this.load = false;
        this.tecnico = ret['dados'];
      })
      .catch( er => {
        this.load = false;
        this.errorHandle.handler(er);
      });
}



  salvarTecnico() {

    if (this.tecnico.nome == undefined || this.tecnico.nome == '') {
      this.message.add( { severity: 'warn', summary: 'Erro de validação',
                    detail: 'Informe o nome do técnico!!!', life: 6000 } );
      this.setFocus('#nometecnico');
      return;
    }


    if (this.modoCadastro) {

      this.load = true;
      this.service.cadastrar(this.tecnico)
          .toPromise()
          .then( ret => {
            this.load = false;
            this.message.add( { severity: 'success', summary: 'Técnico Salvo',
            detail: 'Novo técnico salvo com sucesso!!!' } );
            this.tecnico = new Tecnico();
          })
          .catch( er => {
            this.load = false;
            this.errorHandle.handler(er);
          });

    } else {
      if (this.modoEdicao) {
        this.load = true;
        this.service.alterar(this.tecnico)
            .toPromise()
            .then( ret => {
              this.load = false;
              this.message.add( { severity: 'success', summary: 'Técnico Salvo',
              detail: 'Os dados do técnico foram salvos com sucesso!!!' } );

            })
            .catch( er => {
              this.load = false;
              this.errorHandle.handler(er);
            });
      }
    }
  }



  ativarModoCadastro() {
    this.modoCadastro = true;
    this.titulo = 'Cadastro de novo técnico';
  }

  desativarModoCadastro() {
   this.modoCadastro = false;
   this.tecnico = new Tecnico();
  }

  ativarModoEdicao(tec: Tecnico) {
    this.modoEdicao = true;
    this.titulo = 'Alterar dados do Técnico';
    this.tecnico.alterarTecnico(tec);

  }

  voltarPagina() {
    this.location.back()
  }



  setFocus(selector: string) {
    this.ngZone.runOutsideAngular( () => {
      setTimeout( () => {
       this.render.selectRootElement(selector).focus();
      }, 0);
    });
 }



 confirmarExclusao(tec: Tecnico) {
   this.confirm.confirm({
     message: 'Tem certeza que deseja excluír o técnico ' + tec.nome + '?',
     accept: () => {
       this.load = true;
       this.service.excluir(tec.id)
        .toPromise()
        .then( () => {
          this.load = false;
          this.message.add( { severity: 'success', summary: 'Técnico Excluído',
                              detail: 'Técnico excluído com sucesso!!!' } );
        })
        .catch( er => {
          this.load = false;
          this.errorHandle.handler(er);
        });
     }
   });
 }



} // fecha classe
