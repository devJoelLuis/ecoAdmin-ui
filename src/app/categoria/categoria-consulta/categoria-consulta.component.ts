import { AuthService } from './../../seguranca/auth.service';
import { ErrorHandlerService } from './../../shared/error-handler.service';
import { CategoriaService } from './../../servicos/categoria.service';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Categoria } from 'src/app/model/categoria.class';
import { throttleTime } from 'rxjs/operators';

@Component({
  selector: 'app-categoria-consulta',
  templateUrl: './categoria-consulta.component.html',
  styleUrls: ['./categoria-consulta.component.css']
})
export class CategoriaConsultaComponent implements OnInit {


  load = false;
  categorias: Categoria[] = [];


  constructor(
    public auth: AuthService,
    private location: Location,
    private confirm: ConfirmationService,
    private router: Router,
    private service: CategoriaService,
    private errorHandler: ErrorHandlerService,
    private message: MessageService
  ) { }

  ngOnInit() {
    this.consultar();
  }


  excluircategoria(c: Categoria) {
     this.confirm.confirm({
       message: 'Tem certeza que deseja excluir a categoria '+ c.descricao,
       accept: () => {
            // excluir categoria
            this.load = true;
            this.service.excluir(c.id)
                .toPromise()
                .then( () => {
                  this.load = false;
                  this.message.add({ severity: 'info', summary: 'Categoria Excluída', detail: 'A categoria foi excluída com sucesso!!!' });
                  this.consultar();
                })
                .catch( er => {
                  this.load = false;
                  this.errorHandler.handler(er);
                });
       }
     });
  }



  consultar() {
    this.load = true;
    this.service.getAll()
        .toPromise()
        .then( ret => {
          this.load = false;
          this.categorias = ret['dados'];
        })
        .catch( er => {
          this.load = false;
          this.errorHandler.handler(er);
        });
  }


  novaCategoria() {
    //redireciona para nova categoria
    this.router.navigate(['/categorias/nova']);
  }


  editar(id) {
    // redireciona para editar
    this.router.navigate(['/categorias', id]);
  }




  voltarPagina() {
    this.location.back();
  }

}// fecha classe
