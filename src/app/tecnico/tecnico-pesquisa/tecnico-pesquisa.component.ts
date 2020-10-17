import { AuthService } from './../../seguranca/auth.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ErrorHandlerService } from './../../shared/error-handler.service';
import { TecnicoService } from 'src/app/servicos/tecnico.service';
import { Component, OnInit } from '@angular/core';
import { Tecnico } from 'src/app/model/tecnico';
import { Router } from '@angular/router';
import { Location } from '@angular/common';


@Component({
  selector: 'app-tecnico-pesquisa',
  templateUrl: './tecnico-pesquisa.component.html',
  styleUrls: ['./tecnico-pesquisa.component.css']
})
export class TecnicoPesquisaComponent implements OnInit {

  consultaString: string;
  load = false;
  page = 0;
  size = 10;
  totalRegistro = 0;
  listTecnico: Tecnico[] = [];

  constructor(
    public auth: AuthService,
    private service: TecnicoService,
    private errorHandle: ErrorHandlerService,
    private message: MessageService,
    private router: Router,
    private location: Location,
    private confirm: ConfirmationService
  ) { }

  ngOnInit() {
    this.consultar();
  }



  consultar() {
    if ( this.consultaString == undefined || this.consultaString == '') {
      this.load = true;
      this.service.getAll(this.page, this.size)
          .toPromise()
          .then( ret => {
            this.load = false;
            this.totalRegistro = ret['dados']['totalElements'];
            this.listTecnico = ret['dados']['content'];
            if ( this.totalRegistro == 0 ) {
              this.message.add( { severity: 'warn', summary: 'Nenhum registro',
                  detail: 'Nenhum registro encontrado!!', life: 6000 } );
            }
          })
          .catch( er => {
            this.load = false;
            this.errorHandle.handler(er);
          } );
    } else {
          this.load = true;
          this.service.getAllPartNome(this.page, this.size, this.consultaString)
              .toPromise()
              .then( ret => {
                this.load = false;
                this.totalRegistro = ret['dados']['totalElements'];
                this.listTecnico = ret['dados']['content'];
                if ( this.totalRegistro == 0 ) {
                  this.message.add( { severity: 'warn', summary: 'Nenhum registro',
                      detail: 'Nenhum registro encontrado com nome '+ this.consultaString, life: 6000 } );
                }
              })
              .catch( er => {
                this.load = false;
                this.errorHandle.handler(er);
              } );

    }
  }


  excluirTecnico(nome: string, idTec: number) {
    this.confirm.confirm( {
      message: 'Tem certeza que deseja excluir o técnico '+ nome,
      accept: () => {
        this.load = true;
        this.service.excluir(idTec)
            .toPromise()
            .then( () => {
              this.load = false;
              this.message.add( { severity: 'success', summary: 'Tecnico excluído',
              detail: 'O técnico foi excluído com sucesso!!!' } );
              this.consultar();
            })
            .catch( er => {
              this.load = false;
              this.errorHandle.handler(er);
            });
      }
    });
  }


  onKey(event) {
    if(event.key === 'Enter') {
      this.page = 0;
      this.consultar();
    }
  }


  novoTecnico() {
    this.router.navigate(['/tecnico/novo']);
  }


  voltarPagina() {
    this.location.back();
  }

}// fecha classe
