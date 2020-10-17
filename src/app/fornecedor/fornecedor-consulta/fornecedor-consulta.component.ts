import { AuthService } from './../../seguranca/auth.service';
import { Fornecedor } from 'src/app/model/fornecedor';
import { ErrorHandlerService } from './../../shared/error-handler.service';
import { FornecedorService } from './../../servicos/fornecedor.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-fornecedor-consulta',
  templateUrl: './fornecedor-consulta.component.html',
  styleUrls: ['./fornecedor-consulta.component.css']
})
export class FornecedorConsultaComponent implements OnInit {

  load = false;
  consultaString = '';

  page = 0;
  size = 10;
  totalRegistro = 0;

  fornecedores: Fornecedor[] = [];

  constructor(
    public auth: AuthService,
    private location: Location,
    private router: Router,
    private service: FornecedorService,
    private message: MessageService,
    private errorHandler: ErrorHandlerService,
    private confirm: ConfirmationService
  ) { }

  ngOnInit() {
    this.consultar();
  }

  voltarPagina() {
    this.location.back();
  }



  consultar() {
    this.load = true;
    this.service.getAllParam(this.page, this.size, this.consultaString)
        .toPromise()
        .then( ret =>{
          this.load = false;
          this.fornecedores = ret['dados']['content'];
          this.totalRegistro = ret['dados']['totalElements'];
        })
        .catch( er => {
          this.load = false;
          this.errorHandler.handler(er);
        });
  }


  editarFornecedor(f: Fornecedor) {
   this.router.navigate(['/fornecedor/', f.id]);
  }

  excluirFornecedor(f: Fornecedor) {
    this.confirm.confirm( {
      message: 'Tem certeza que deseja excluir o fornecedor '+ f.nome +'?',
      accept: () => {
       this.load = true;
       this.service.delete(f.id)
           .toPromise()
           .then( () => {
             this.load = false;
             this.message.add( { severity: 'info', summary: 'Fornecedor excluido', detail: 'O fornecedor foi excluído com sucesso!!!' } );
             this.consultar();
           })
           .catch( er => {
             this.load = false;
             this.errorHandler.handler(er);
           });
      }
    });
  }


  novofornecedor() {
    this.router.navigate(['/fornecedor/novo']);
  }

  onKey(event) {
     if (event.key === 'Enter') {
       this.page = 0;
       this.consultar();
     }
  }

  paginate(event) {
    this.size = event.rows;
    this.page = event.page;
    this.consultar();
  }

}// fecha classe
