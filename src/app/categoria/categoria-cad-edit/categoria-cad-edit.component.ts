import { ActivatedRoute } from '@angular/router';
import { CategoriaService } from './../../servicos/categoria.service';
import { ErrorHandlerService } from './../../shared/error-handler.service';
import { MessageService } from 'primeng/api';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Categoria } from 'src/app/model/categoria.class';

@Component({
  selector: 'app-categoria-cad-edit',
  templateUrl: './categoria-cad-edit.component.html',
  styleUrls: ['./categoria-cad-edit.component.css']
})
export class CategoriaCadEditComponent implements OnInit {

  load = false;
  edicao = false;
  titulo = 'Nova Categoria';
  cssContainer = 'container alturaMinima bg-color-novo';

  categoria = new Categoria();

  constructor(
    private location: Location,
    private message: MessageService,
    private errorHandler: ErrorHandlerService,
    private servide: CategoriaService,
    private route: ActivatedRoute
  ) {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.edicao = true;
      this.cssContainer = 'container alturaMinima bg-color-edit';
      this.carregarCategoria(id);
    } else {
      this.edicao = false;
      this.cssContainer = 'container alturaMinima bg-color-novo';
    }
  }

  ngOnInit() {
  }


  carregarCategoria(id: number) {
    this.load = true;
    this.servide.getId(id)
        .toPromise()
        .then( ret => {
          this.load = false;
          this.categoria = ret['dados'];
        })
        .catch( er => {
          this.load = false;
          this.errorHandler.handler(er);
        });
  }


  salvar() {
    if (this.categoria.descricao == undefined || this.categoria.descricao == '') {
      this.message.add({ severity: 'warn', summary: 'Erro de validação',
       detail: 'Informe a descrição da categoria!!!' });
       return;
    }

    if (this.edicao) {

      this.load = true;
      this.servide.alterar(this.categoria)
          .toPromise()
          .then( () => {
            this.load = false;
            this.message.add({ severity: 'success', summary: 'Categoria Alterada',
          detail: 'A categoria foi alterada com sucesso!!!' });
           this.voltarPagina();
          })
          .catch( er => {
            this.load = false;
            this.errorHandler.handler(er);
          });

    } else {
      // nova categoria
      this.load = true;
      this.servide.cadastrar(this.categoria)
          .toPromise()
          .then( () => {
            this.load = false;
            this.message.add({ severity: 'success', summary: 'Nova Categoria Cadastrada',
          detail: 'A nova categoria foi cadastrada com sucesso!!!' });
          this.categoria = new Categoria();
          })
          .catch( er => {
            this.load = false;
            this.errorHandler.handler(er);
          });
    }

  }// fecha metodo salvar











  voltarPagina() {
    this.location.back();
  }

}// fecha classe
