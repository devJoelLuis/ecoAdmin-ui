import { FornecedorService } from './../../servicos/fornecedor.service';
import { ErrorHandlerService } from './../../shared/error-handler.service';
import { StatusFornecedor } from './../../model/statusFornecedor';
import { MessageService } from 'primeng/api';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Fornecedor } from 'src/app/model/fornecedor';
import { ActivatedRoute } from '@angular/router';
import { StatusFornecedorService } from 'src/app/servicos/status-fornecedor.service';

@Component({
  selector: 'app-fornecedor-cad-edit',
  templateUrl: './fornecedor-cad-edit.component.html',
  styleUrls: ['./fornecedor-cad-edit.component.css']
})
export class FornecedorCadEditComponent implements OnInit {

  containerCss = 'container-cad-edit-fornecedor alturaMinima bg-color-novo';
  titulo = 'Cadastro de novo fornecedor';

  fornecedor = new Fornecedor();
  status = new StatusFornecedor();

  load = false;
  modoEdicao = false;

  constructor(
    private location: Location,
    private message: MessageService,
    private errorHandler: ErrorHandlerService,
    private service: FornecedorService,
    private route: ActivatedRoute,
    private serviceSt: StatusFornecedorService

  ) {
    const idfornecedor = this.route.snapshot.params['id'];
    if(idfornecedor) {
      this.containerCss = 'container-cad-edit-fornecedor alturaMinima bg-color-edit';
      this.titulo = 'Alteração de fornecedor';
      this.modoEdicao = true;
      this.getFornecedorId(idfornecedor);
    }
  }

  ngOnInit() {
  }

  voltar() {
    this.location.back();
  }


  getFornecedorId(idfornecedor: any) {
    this.load = true;
    this.service.getById(idfornecedor)
        .toPromise()
        .then( ret => {
          this.load = false;
          this.fornecedor = ret['dados'];
        })
        .catch( er => {
          this.load = false;
          this.errorHandler.handler(er);
        });
  }



  onSubmit(f) {
    if (f.invalid) {
      this.message.add({ severity: 'warn', summary: 'Erro de validação',
      detail: 'Preencha todos os campos com asteristicos *', life: 6000 });
      return;
    }
    if (this.fornecedor.nome === undefined) {
      this.message.add({ severity: 'warn', summary: 'Erro de validação',
      detail: 'O nome do fornecedor é obrigatório!!!', life: 6000 });
      return;
    }
    if (this.fornecedor.nome === '') {
      this.message.add({ severity: 'warn', summary: 'Erro de validação',
      detail: 'O nome do fornecedor é obrigatório!!!', life: 6000 });
      return;
    }
    if (this.fornecedor.statusFornecedor.length == 0) {
      this.message.add({ severity: 'warn', summary: 'Erro de validação',
      detail: 'Adicione ao menos um status ao fornecedor', life: 6000 });
      return;
    }

    this.load = false;
    this.fornecedor.nome.toLocaleUpperCase();

    if (this.fornecedor.rua)
    this.fornecedor.rua.toLocaleUpperCase();

    if (this.fornecedor.email)
    this.fornecedor.email.toLocaleLowerCase();

    if (this.fornecedor.cidade)
    this.fornecedor.cidade.toLocaleUpperCase();

    if (this.fornecedor.bairro)
    this.fornecedor.bairro.toLocaleUpperCase();

    if (this.modoEdicao) {

      this.service.alterar(this.fornecedor)
      .toPromise()
      .then( () => {
        this.load = false;
        this.message.add( { severity: 'success', summary: 'Fornecedor Alterado', detail: 'Fornecedor alterado com sucesso!!!' } );
        this.voltar();
      })
      .catch(er => {
        this.load = false;
        this.errorHandler.handler(er);
      });

    } else {
      this.service.cadastrar(this.fornecedor)
      .toPromise()
      .then( () => {
        this.load = false;
        this.fornecedor = new Fornecedor();
        this.status = new StatusFornecedor();
        this.message.add( { severity: 'success', summary: 'Fornecedor Cadastrado', detail: 'Fornecedor cadastrado com sucesso!!!' } );
        f.reset();
      })
      .catch(er => {
        this.load = false;
        this.errorHandler.handler(er);
      });
    }

  }// fecha metodo salvar


  adicionarStatus() {
    if (this.fornecedor.id) {
      // modo edicao
      this.status.fornecedor = this.fornecedor;
      this.load = true;
      this.serviceSt.cadastrar(this.status)
          .toPromise()
          .then( ret => {
            this.load = false;
            this.fornecedor.statusFornecedor.push(ret['dados']);
            this.status = new StatusFornecedor();
          })
          .catch( er => {
            this.load = false;
            this.errorHandler.handler(er);
          });

    } else {
      // modo novo
      this.fornecedor.statusFornecedor.push(this.status);
      this.status = new StatusFornecedor();
    }
  }

  removerStatus(st: StatusFornecedor) {
    var temp = [];
    this.fornecedor.statusFornecedor.map( s => {
      if(st.descricao != s.descricao) {
        temp.push(s);
      }
    });
    if (st.id) {
      // remover do banco de dados
      this.load = true;
      this.serviceSt.delete(st.id)
          .toPromise()
          .then(() => {
            this.load = false;
          })
          .catch( er => {
            this.load = false;
            this.errorHandler.handler(er);
          });
    }
    this.fornecedor.statusFornecedor = temp;
  }


}// fecha classe
