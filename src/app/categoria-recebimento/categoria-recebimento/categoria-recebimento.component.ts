import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ErrorHandlerService } from './../../shared/error-handler.service';
import { CategoriaRecebimentoService } from './../../servicos/categoriaRecebimento.service';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { CategoriaRecebimento } from './../../model/categoriaRecebimento.class';

@Component({
  selector: 'app-categoria-recebimento',
  templateUrl: './categoria-recebimento.component.html',
  styleUrls: ['./categoria-recebimento.component.css']
})
export class CategoriaRecebimentoComponent implements OnInit {

  load = false;

  categoriasRec: CategoriaRecebimento[] = [];
  catRec = new CategoriaRecebimento();
  modoNovaCategoria = false;
  messageErroDialog = '';

  clonedCats: { [id: number]: CategoriaRecebimento; } = {};

  constructor(
    private location: Location,
    private service: CategoriaRecebimentoService,
    private error: ErrorHandlerService,
    private message: MessageService,
    private confirm: ConfirmationService,
    private router: Router
  ) {
    this.carregarCategoriasRecebimento();
  }

  ngOnInit() {
  }


onRowEditInit(cat: CategoriaRecebimento) {
    this.clonedCats[cat.id] = {...cat};
}

onRowEditSave(cat: CategoriaRecebimento) {
   if (cat.descricao == undefined || cat.descricao == '') {
     this.message.add({ severity: 'warn', summary: 'Erro de validação', detail:'Informe a descrição da categoria.' });
     return;
   }
   console.log(cat);
   this.load = true;
   this.service.alterar(cat)
     .toPromise()
     .then( ret => {
       this.load = false;
       this.message.add({ severity: 'success', summary: 'Alerações salvas', detail: 'As alterações foram salvas com sucesso!!' });
       this.carregarCategoriasRecebimento();
     } )
     .catch( er => {
       this.load = false;
       this.error.handler(er);
       this.carregarCategoriasRecebimento();
     });
}

onRowEditCancel(cat: CategoriaRecebimento, index: number) {
   this.carregarCategoriasRecebimento();
}



onSubmit(f) {
  console.dir(f.form);
  if (f.form.status == 'INVALID') {
     f.form.controls.descricao.touched = true;
    return;
  }
  this.load = true;
  this.service.cadastrar(this.catRec)
     .toPromise()
     .then(() => {
       this.load = false;
       this.cancelarNovaCategoria(f);
       this.message.add({ severity: 'success', summary: 'Categoria cadastrada',
      detail: 'A nova categoria de recebimento foi cadastrada com sucesso!' });
     })
     .catch( er => {
       this.load = false;
       this.error.handler(er);
     })
}


excluir(c: CategoriaRecebimento) {
  this.confirm.confirm({
    message: `Tem certeza que deseja excluir a categoria de recebimento ${c.descricao}?`,
    accept: () => {
      this.load = true;
      this.service.excluir(c.id)
        .toPromise()
        .then(()=> {
          this.load = false;
          this.message.add({ severity: 'info', summary: 'Categoria excluída', detail: 'A categoria foi excluída com sucesso!' });
          this.carregarCategoriasRecebimento();
        })
        .catch( er => {
          this.load = false;
          this.error.handler(er);
        });
    }
  });
}



carregarCategoriasRecebimento() {
  this.load = true;
  this.service.getAll()
  .toPromise()
  .then( ret => {
    this.load=false;
    this.categoriasRec = ret['dados'];
  })
  .catch( er => {
    this.load = false;
    this.error.handler(er);
  });
}


ativarNovaCategoria() {
  this.catRec = new CategoriaRecebimento();
  this.modoNovaCategoria = true;
  this.messageErroDialog = '';
}
cancelarNovaCategoria(f) {
  if (f != null)
  f.reset();
  this.catRec = new CategoriaRecebimento();
  this.modoNovaCategoria = false;
  this.messageErroDialog = '';
  this.carregarCategoriasRecebimento();
}



historico(id: number) {
   this.router.navigate(['/categoriasRecebimento/historico', id]);
}

  voltar() {
    this.location.back();
  }

}//fecha classe
