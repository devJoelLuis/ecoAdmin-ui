import { MessageService } from 'primeng/api';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ErrorHandlerService } from './../../shared/error-handler.service';
import { CategoriaRecebimentoService } from './../../servicos/categoriaRecebimento.service';

import { DespesaService } from './../../servicos/despesa.service';
import { CategoriaRecebimento } from './../../model/categoriaRecebimento.class';
import { CalendarioBr } from 'src/app/model/calendarioBR';
import { Despesa } from 'src/app/model/despesa.class';
import * as moment from 'moment';
import { OrdemServico } from 'src/app/model/OrdemServico';
import { OrdemServicoService } from 'src/app/servicos/ordemServico.service';

@Component({
  selector: 'app-despesa-cad-edit',
  templateUrl: './despesa-cad-edit.component.html',
  styleUrls: ['./despesa-cad-edit.component.css']
})
export class DespesaCadEditComponent implements OnInit {



  //despesa = new Despesa();
  categoriaSelecionada: any;
  categorias: CategoriaRecebimento[] = [];

  formulario: FormGroup;
  dialogOn = false;
  load = false;
  modoEdit = false;
  titulo = '';
  css = '';


  br = new CalendarioBr();

  param = '';
  oss: OrdemServico[] = [];
  os = new OrdemServico();

  // variaveis da O.S.

  constructor(
    private route: ActivatedRoute,
    private service: DespesaService,
    private location: Location,
    private serviceCatRec: CategoriaRecebimentoService,
    private error: ErrorHandlerService,
    private formBuilder: FormBuilder,
    private message: MessageService,
    private serviceOs: OrdemServicoService,
  ) {
    const id = this.route.snapshot.params['id'];
    if (id) {
       // modo edicao
       this.modoEdit = true;
       this.carregarDespesa(id);
       this.titulo = 'Edição de despesa'
       this.css = 'container alturaMinima bg-color-edit pad';
    } else {
      // nova despesa
      this.modoEdit = false;
      //this.despesa = new Despesa();
      this.titulo = 'Lançamento de nova despesa'
      this.css = 'container alturaMinima bg-color-novo pad';
    }
    // carregar as categorias
    this.carregarCategoriaRecebimento();
     this.os.id = 0; 
  }



  ngOnInit() {
    this.configuarFormulario();
  }



  onSubmit() {
    if (this.formulario.invalid) {
      this.message.add({severity: 'warn', summary: 'Erro de validação', detail: 'Preencha todos os campos com * asterisco' });
      return;
    }
    if (this.formulario.get('valor').value <= 0) {
      this.message.add({severity: 'warn', summary: 'Erro de validação', detail: 'Informe o valor da despesa!' });
      return;
    }


    let desp  = new Despesa();
      
    desp.descricao = this.formulario.get('descricao').value;
    desp.categoriaRecebimento.id = this.formulario.get('categoriaRecebimento').get('id').value['id'];
    desp.data = new Date(moment(this.formulario.get('data').value).format("YYYY-MM-DD h:mm:ss"));
    desp.valor = this.formulario.get('valor').value;
    desp.obs = this.formulario.get('obs').value;
    desp.edit = false;
    if (this.os) {
      desp.os = this.os
    } else {
      desp.os = null;
    }

    if (this.modoEdit) {
      desp.id = this.formulario.get('id').value;
      this.load = true;
      this.service.alterar(desp)
        .toPromise()
        .then( () => {
          this.load = false;
          this.message.add({ severity: 'success', summary: 'Despesa Alterada', detail: 'A despesa foi alterada com sucesso.' });
          this.voltar();
        })
        .catch( er => {
          this.load = false;
          this.error.handler(er);
        })

    } else {
      this.load = true;

      desp.id = null;
    
     this.service.cadastrar(desp)
       .toPromise()
       .then( () => {
         this.load = false;
         this.message.add({ severity: 'success', summary: 'Despesa salva.', detail: 'A despesa foi salva com sucesso!!!'  });
         this.formulario.reset();
         this.limparConsultaOs();
       })
       .catch( er => {
         this.load = false;
         this.error.handler(er);
       })
    }
       
  }


  configuarFormulario() {
    this.formulario = this.formBuilder.group({
      id: [null],
      descricao: [null, [Validators.required, Validators.minLength(5)]],
      data: [new Date(), Validators.required],
      valor: [null, Validators.required],
      osId: [0],
      categoriaRecebimento: this.formBuilder.group({
        id: [null, Validators.required],
        descricao: []
      }),
      obs: []
    });
  }


  carregarDespesa(id: any) {
    this.load = true;
    this.service.getById(id)
        .toPromise()
        .then( ret => {
          this.load = false;
          this.preencherFormulario(ret['dados']);
        })
        .catch( er => {
          this.load = false;
          this.error.handler(er);
        })
  }


  preencherFormulario(d: Despesa) {
     console.log(d);
     d.data = new Date(`${d.data} 00:00:00`);
     this.formulario.get('id').setValue(d.id);
     this.formulario.get('descricao').setValue(d.descricao);
     this.formulario.get('data').setValue(d.data);
     this.formulario.get('valor').setValue(d.valor);
     this.formulario.get('categoriaRecebimento').get('id').setValue(d.categoriaRecebimento);
     if (d.os) {
       this.os = d.os;
     }
  }


  carregarCategoriaRecebimento() {
    this.load = true;
    this.serviceCatRec.getAll()
       .toPromise()
       .then(ret => {
         this.load = false;
         this.categorias = ret['dados'];
       })
       .catch( er => {
         this.load = false;
         this.error.handler(er);
       });
  }

  voltar() {
   this.location.back();
  }

  osDialogOn() {
    this.dialogOn = true;
  }

  osDialogOFF() {
    this.dialogOn = false;
  }

  desvicular() {
    this.os = new OrdemServico();
  }



  consultarOs() {
    if (this.param.length < 1) {
      this.message.add({severity: 'warn', summary: 'Erro de validação', detail: 'Digite no mínimo um caracter!'});
      return;
    }
    this.load = true;
    this.serviceOs.getAllNumDescricao(this.param)
       .toPromise()
       .then( ret => {
         this.load = false;
         this.oss = ret['dados'];
         if (this.oss.length == 0) {
          this.message.add({severity: 'warn', summary: 'O.S. não encontrada', detail: 'Nenhum O.S. foi encontrada com os dados informados.'});
         }
       })
       .catch( er => {
         this.load = false;
         this.error.handler(er);
       });
  }


  keyup(event) {
    if (event.key == 'Enter') {
      this.consultarOs();
    }
  }

  selecionarOs(os: OrdemServico) {
      this.os = os;
      this.dialogOn = false;
      console.log(this.os);
     
  }

  limparConsultaOs() {
    this.param = '';
    this.oss = [];
    this.os = new OrdemServico();
  }

}//fecha classe
