import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { CategoriaRecebimentoService } from 'src/app/servicos/categoriaRecebimento.service';
import { ErrorHandlerService } from './../../shared/error-handler.service';
import { Transferencia } from './../../model/transferencia.class';
import { CategoriaRecebimento } from 'src/app/model/categoriaRecebimento.class';

import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-tranferencia',
  templateUrl: './tranferencia.component.html',
  styleUrls: ['./tranferencia.component.css']
})
export class TranferenciaComponent implements OnInit {

  load = false;
  transferencia = new Transferencia();
  categoriasRec: CategoriaRecebimento[] = [];
  categoriasRecDeposito: CategoriaRecebimento[] = [];
  provedor: any;
  receptor: any;

  constructor(
    private error: ErrorHandlerService,
    private service: CategoriaRecebimentoService,
    private location: Location,
    private message: MessageService
  ) { }

  ngOnInit() {
    this.carregarCategorias();
  }

  carregarCategorias() {
    this.load = true;
    this.service.getAll()
       .toPromise()
       .then( ret => {
         this.load = false;
         const cat = ret['dados'];
         // remover sem categoria
         this.categoriasRec = cat.filter( c => c.id != 1);
         console.log(this.categoriasRec);
       } )
       .catch( er => {
         this.load = false;
         this.error.handler(er);
       });
  }

  transferir() {
    console.log(this.provedor);
    console.log(this.receptor);

    if (!this.provedor || !this.receptor) {
      this.message.add({severity: 'warn', summary: 'Erro de validação', 
                        detail: 'Selecione a categoria para retirada e a categoria para depósito.'});
      return;
    }
    if (!this.transferencia.valor || this.transferencia.valor < 0.01) {
      this.message.add({severity: 'warn', summary: 'Erro de validação', 
                        detail: 'Informe corretamente o valor para transferência.'});
      document.getElementById("valor").focus();                
      return;
    }
    this.transferencia.idCatRecebProvedor = this.provedor.id;
    this.transferencia.idCatRecebReceptor = this.receptor.id;
    this.load = true
    this.service.transferencia(this.transferencia)
        .toPromise()
        .then(() => {
          this.load = false;
          this.message.add({ severity: 'success', summary: 'Transferência concluída', detail: 'A transferência foi feita com sucesso!!!' });
          this.provedor = undefined;
          this.receptor = undefined;
          this.transferencia = new Transferencia();
          this.carregarCategorias();
        })
        .catch(er => {
          this.load = false;
          this.error.handler(er);
        })


  }// fecha transferir



  changedDropdown() {
    if (this.provedor) {
      this.categoriasRecDeposito = this.categoriasRec.filter(c => c.id != this.provedor.id);
    }
  }


  voltar() {
     this.location.back();
  }



}// fecha classe
