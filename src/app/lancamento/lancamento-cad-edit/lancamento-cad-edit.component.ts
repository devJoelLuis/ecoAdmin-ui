import { Location } from '@angular/common';
import { Component, OnInit, NgZone, Renderer, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { OrdemServicoService } from './../../servicos/ordemServico.service';
import { CategoriaRecebimentoService } from 'src/app/servicos/categoriaRecebimento.service';
import { Lancamento } from 'src/app/model/lancamento.class';
import { CalendarioBr } from 'src/app/model/calendarioBR';
import { CategoriaRecebimento } from './../../model/categoriaRecebimento.class';
import { LancamentoService } from 'src/app/servicos/lancamento.service';
import { ErrorHandlerService } from 'src/app/shared/error-handler.service';
import { CategoriaService } from './../../servicos/categoria.service';

import { MessageService } from 'primeng/api';

import * as moment from 'moment';
import { Categoria } from 'src/app/model/categoria.class';
import { OrdemServico } from 'src/app/model/OrdemServico';

@Component({
  selector: 'app-lancamento-cad-edit',
  templateUrl: './lancamento-cad-edit.component.html',
  styleUrls: ['./lancamento-cad-edit.component.css']
})
export class LancamentoCadEditComponent implements OnInit {


  @Input() idlancamento: number;
  @Input() idOs: number;
  @Output() fimCadEdit = new EventEmitter();


 classeContainer = 'container contColorNovo';
 titulo = 'Novo Lançamento';
 categorias: Categoria[] = [];
 categoria = new Categoria();
 os = new OrdemServico();
 novaCategoria = new Categoria();
 modoNovacategoria = false;
 parcelas = 1;
 categoriaRecebimentos: CategoriaRecebimento[] = [];
 categoriaRecebSelecionada: any;
 taxa = false;


 lancamento = new Lancamento();
 br = new CalendarioBr();
 edicao = false;
 load = false;


  constructor(
    private location: Location,
    private service: LancamentoService,
    private errorHandler: ErrorHandlerService,
    private message: MessageService,
    private render: Renderer,
    private ngZone: NgZone,
    private route: ActivatedRoute,
    private router: Router,
    private serviceCat: CategoriaService,
    private serviceOs: OrdemServicoService,
    private serviceCatRec: CategoriaRecebimentoService
  ) {

   }

  ngOnInit() {
    this.getAllCategorias();
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.classeContainer = 'container contColorEdit';
      this.titulo = 'Edição de lançamento';
      this.edicao = true;
      this.carregarLancamento(id);
    } else {
      this.carregarOrdemServico();
    if (this.idlancamento && this.idlancamento > 0) {
      this.edicao = true;
      this.titulo = 'Edição de Lançamento';
      this.classeContainer = 'container contColorEdit';
      this.carregarLancamento(this.idlancamento);
   }
    }

  }


  carregarOrdemServico() {
    this.load = true;
    this.serviceOs.getById(this.idOs)
        .toPromise()
        .then( ret => {
          this.load = false;
          this.os = ret['dados'];
        })
        .catch( er => {
          this.load = false;
          this.errorHandler.handler(er);
        });

  }

  alteradoOpcaoTaxa() {
    if (this.taxa) {
      this.parcelas = 1;
      this.carregarCategoriaRecebimento();
    } 
  }


 carregarCategoriaRecebimento() {
   this.load = true;
   this.serviceCatRec.getAll()
     .toPromise()
     .then( ret => {
       this.load = false;
       this.categoriaRecebimentos =  ret['dados'];
       if (this.lancamento.idCategoriaRecebimentoTaxa > 0) {
         this.categoriaRecebimentos.map( c => {
           if (c.id == this.lancamento.idCategoriaRecebimentoTaxa) {
              this.categoriaRecebSelecionada = c;
           }
         });
       }
     })
     .catch( er => {
       this.load = false;
       this.errorHandler.handler(er);
     });
 }




  carregarLancamento(id: number) {
      this.load = true;
      this.service.getId(id)
          .toPromise()
          .then( ret => {
            this.load = false;
            this.lancamento = ret['dados'];
            this.lancamento.dataLancamento = new Date(moment(this.lancamento.dataLancamento).format("YYYY-MM-DD h:mm:ss"));
            this.categoria = this.lancamento.categoria;
            this.os = this.lancamento.ordemServico;
            // verificar se é taxa se for carregar as categorias recebimentos
            if (this.lancamento.idCategoriaRecebimentoTaxa > 0) {
               this.taxa = true;
               this.carregarCategoriaRecebimento();
            } else {
              this.taxa = false;
              this.categoriaRecebSelecionada = undefined;
            }
          })
          .catch( er => {
            this.load = false;
            this.errorHandler.handler(er);
            this.fimCadEdit.emit();
          })

  }


  limparFomulario() {
    sessionStorage.removeItem("stcategoria");
    this.lancamento = new Lancamento();
  }


  salvar() {


     this.cancelaModoNovaCategoria();
 

    if (this.lancamento.descricao === undefined) {
      this.message.add( { severity: 'warn', summary: 'Erro de validação',
           detail: 'Digite a descrição do lançamento', life: 6000 } );
           this.setFocus('#descricao');
       return;
    }
    if (this.lancamento.descricao.length < 3) {
      this.message.add( { severity: 'warn', summary: 'Erro de validação',
           detail: 'A descrição deve conter no mínimo 3 tres dígitos', life: 6000 } );
           this.setFocus('#descricao');
       return;
    }
    if (this.lancamento.total === undefined) {
      this.message.add( { severity: 'warn', summary: 'Erro de validação',
           detail: 'Entre com o valor', life: 6000 } );
           this.setFocus('#valor');
       return;
    }
    if (this.lancamento.total < 0) {
        this.message.add( { severity: 'warn', summary: 'Erro de validação',
          detail: 'O valor não pode ser menor que zero', life: 6000 } );
          this.setFocus('#valor');
          return;
    }
    if (!this.categoria || !this.categoria.id) {
      this.message.add( { severity: 'warn', summary: 'Erro de validação',
      detail: 'Selecione a categoria', life: 6000 } );
       return;
     }

     if (this.taxa && !this.categoriaRecebSelecionada) {
      this.message.add( { severity: 'warn', summary: 'Erro de validação',
      detail: 'Selecione a categoria de recebimento', life: 6000 } );
       return;
     }

    this.lancamento.categoria = new Categoria();
    this.lancamento.ordemServico = new OrdemServico();
    this.lancamento.categoria.id = this.categoria.id;
    this.lancamento.ordemServico.id = this.os.id;
    this.lancamento.pago = false;
    this.lancamento.dataLancamento = new Date(moment(this.lancamento.dataLancamento).format("YYYY-MM-DD h:mm:ss"));

    // caso o modo taxa tenha cido selecionado
    if (this.taxa) {
      this.parcelas = 1;
      this.lancamento.idCategoriaRecebimentoTaxa = this.categoriaRecebSelecionada.id;
    } else {
      this.lancamento.idCategoriaRecebimentoTaxa = 0;
    }


    if (this.edicao) {
      this.load = true;
      this.service.alterar(this.lancamento)
          .toPromise()
          .then( ret => {
            this.load = false;
            this.message.add({ severity: 'success', summary: 'Alterações Salvas', detail: 'As alterações no lançamento foram salvas com sucesso!!!' });
            this.goback();
          })
          .catch( er => {
            this.load = false;
            this.errorHandler.handler(er);
            this.goback();
          });
    } else {

      // novo lançamento
      if (this.parcelas > 24) {
        this.message.add({ severity: 'warn', summary: 'Erro de validação', detail: 'O número de parcelas não pode ser maior que 24.' });
        return;
      }
      this.load = true;

      
      this.service.cadastrar(this.lancamento, this.parcelas)
          .toPromise()
          .then( ret => {
             this.load = false;
             this.message.add( { severity: 'success', summary: 'Lançamento salvo', detail: 'Lançamento salvo com sucesso!!!' } );
             this.lancamento = new Lancamento();
             this.parcelas = 1;
             this.taxa = false;
             this.categoriaRecebSelecionada = undefined;
          })
          .catch( er => {
            this.load = false;
            this.errorHandler.handler(er);
            this.goback();
          });
    }
    sessionStorage.removeItem("stcategoria");
  }




  goback() {
    if (this.edicao) {
      this.location.back()
    } else {
      this.fimCadEdit.emit();
    }

  }




  setFocus(selector: string) {
    this.ngZone.runOutsideAngular( () => {
      setTimeout( () => {
       this.render.selectRootElement(selector).focus();
      }, 0);
    });
 }



 getAllCategorias() {
   this.load = true;
   this.serviceCat.getAll()
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




 salvarCategoria() {
   if (this.novaCategoria.descricao == undefined) {
      this.message.add({ severity: 'warn', summary: 'Erro de validação', detail: 'Entre com a descrição da categoria' });
      return;
   }
   if (this.novaCategoria.descricao.length < 2) {
    this.message.add({ severity: 'warn', summary: 'Erro de validação', detail: 'A categoria deve conter no mínimo 2 dígitos' });
    return;
   }
   this.load = true;
   this.serviceCat.cadastrar(this.novaCategoria)
       .toPromise()
       .then( () => {
         this.load = false;
         this.cancelaModoNovaCategoria();
         this.getAllCategorias();
         this.message.add({ severity: 'success', summary: 'Nova Categoria Cadastrada',
                             detail: 'A nova categoria foi cadastrada com sucesso!' });
       })
       .catch( er => {
         this.load = false;
         this.errorHandler.handler(er);
         this.cancelaModoNovaCategoria();
       });

 }//fecha salvar categoria


 modoCadCategoria() {
  this.novaCategoria = new Categoria();
  this.modoNovacategoria = true;
 }
 cancelaModoNovaCategoria() {
   this.modoNovacategoria = false;
   this.novaCategoria = new Categoria();
 }



}// fecha classe
