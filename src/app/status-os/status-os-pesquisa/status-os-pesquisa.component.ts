import { AuthService } from './../../seguranca/auth.service';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { StatusOs, StatusOsEdicao } from 'src/app/model/statusOs';
import { StatusOsService } from 'src/app/servicos/statusOs.service';
import { ErrorHandlerService } from 'src/app/shared/error-handler.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-status-os-pesquisa',
  templateUrl: './status-os-pesquisa.component.html',
  styleUrls: ['./status-os-pesquisa.component.css']
})
export class StatusOsPesquisaComponent implements OnInit {




  consultaString = '';
  listStatus: StatusOsEdicao[] = [];
  listStatusTemp = [];
  size = 10;
  page = 0;
  totalRegistro = 0;
  load = false;
  estato = new StatusOs();
  edicao = false;
  novo = false;
  containerStatusOs = 'container bg-color alturaMinima';
  cor: any;



  constructor(
    public auth: AuthService,
    private service: StatusOsService,
    private errorHandle: ErrorHandlerService,
    private confirma: ConfirmationService,
    private message: MessageService,
    private location: Location
  ) { }

  ngOnInit() {
    this.consultar();
  }


   // exclusão de cliente
   confirmarExclusao(nome, id) {
    this.confirma.confirm({
      message: 'Tem certeza que deseja excluir o status ' + nome + '?',
      accept: () => {
         this.service.excluir(id)
             .toPromise()
             .then( ret => {

              this.load = false;
              this.consultar();
              this.message.add( { severity: 'success', summary: 'Status excluído',
            detail: 'O Status foi excluído com sucesso!' } );
             })
             .catch( er => {
               this.load = false;
               this.errorHandle.handler(er);
             });
      }
    });
  }

exibeCor() {
  console.log(this.cor);
}


  submitNovoStatus(f) {
   if (f.invalid) {
    f.form.controls.statusNovo.touched = true;
    return false;
   } else {
     if (this.estato.cor === undefined || this.estato.cor === '') {
      this.message.add( { severity: 'warn', summary: 'Erro de validação',
      detail: 'selecione uma cor' } );
       return;
     }
     this.edicao = false;
     this.load = true;
     this.service.cadastrar(this.estato)
         .toPromise()
         .then( () => {
           this.load = false;
           this.message.add( { severity: 'success', summary: 'Cadastro realizado',
           detail: 'O cadastro do novo status foi feito com sucesso!!!' } );
           this.consultar();
           this.estato = new StatusOs();
           this.novo = false;
           this.containerStatusOs = 'container bg-color alturaMinima';
         })
         .catch( er => {
           this.load = false;
           this.containerStatusOs = 'container bg-color alturaMinima';
           this.errorHandle.handler(er);
         } );
   }
  }

 novoStatus() {
   this.edicao = false;
   this.novo = true;
   this.containerStatusOs = 'container bg-color-novo alturaMinima';
 }


  cancelarNovo() {
    this.estato = new StatusOs();
    this.edicao = false;
    this.novo = false;
    this.containerStatusOs = 'container bg-color alturaMinima';
  }



  editarStatus(st: StatusOsEdicao) {
    this.listStatusTemp = JSON.parse(JSON.stringify(this.listStatus));
    this.edicao = true;
    this.estato.convertStatusEditoToStatus(st);
    st.edit = true;
    this.containerStatusOs = 'container bg-color-edit alturaMinima';
  }

  cancelarEdicao(st: StatusOsEdicao) {
    this.listStatus = JSON.parse(JSON.stringify(this.listStatusTemp));
    this.edicao = false;
    this.estato = new StatusOs();
    st.edit = false;
    this.containerStatusOs = 'container bg-color alturaMinima';
  }

  editStatusKey(event, st: StatusOsEdicao) {
    if (event.key == 'Enter') {
      this.salvarEdicao(st);
    }
  }

  salvarEdicao(st: StatusOsEdicao) {
    if (this.estato) {
      if(this.estato.nome == undefined || this.estato.nome === '') {
        this.message.add( { severity: 'warn', summary: 'Erro de validação',
        detail: 'Informe uma descrição para o status que está sendo editado', life: 6000 } );
        return false;
      }

      if (this.estato.nome.length < 2) {
        this.message.add( { severity: 'warn', summary: 'Erro de validação',
        detail: 'A descrição do status deve conter no mínimo 3 caracteres', life: 6000 } );
        return false;
      }

      // salvar alteração
      this.load = true;
      this.service.salvarEdicao(this.estato)
          .toPromise()
          .then(ret => {
            this.message.add( { severity: 'success', summary: 'Alteração salva',
            detail: 'A alteração na descrição do status foi salva com sucesso!!!' } );
            this.load = false;
            this.edicao = false;
            this.estato = new StatusOs();
            st.edit = false;
            this.containerStatusOs = 'container bg-color alturaMinima';
            this.consultar();
          })
          .catch( er => {
            this.load = false;
            this.cancelarEdicao(st);
            this.errorHandle.handler(er);
          } );
    }
  }


  consultar() {
    this.load = true;
    if(this.consultaString == undefined || this.consultaString === '') {
    this.service.buscarTodo(this.page, this.size, '')
        .toPromise()
        .then(ret => {
        // tslint:disable-next-line: no-string-literal
          this.listStatus = ret['dados']['content'];
          this.totalRegistro = ret['dados']['totalElements'];
          // verificar se encontrou algum registro
          if (this.totalRegistro == 0) {
            this.message.add( { severity: 'warn', summary: 'Nenhum Status',
            detail: 'Não foi encontrado nenhum status cadastrado no banco de dados!!!', life: 6000 } );
         }
          this.load = false;
        })
        .catch( er => {
          this.load = false;
          this.errorHandle.handler(er);
        });
    } else {
      this.service.buscarTodo(this.page, this.size, this.consultaString)
        .toPromise()
        .then(ret => {
        // tslint:disable-next-line: no-string-literal
          this.listStatus = ret['dados']['content'];
          this.load = false;
          this.totalRegistro = ret['dados']['totalElements'];
          // verificar se encontrou algum registro
          if (this.listStatus.length == 0) {
             this.message.add( { severity: 'warn', summary: 'Status não encontrado',
             detail: 'Não foi encontrado nenhum status com a descrição ' + this.consultaString, life: 6000 } );
          }
        })
        .catch( er => {
          this.load = false;
          this.errorHandle.handler(er);
        });
    }
  } // fecha consulta


  // paginador simples do primeng
 // event contem as informações de escolha do usuário
 paginate(event) {
  this.size = event.rows;
  this.page = event.page;
  this.consultar();
}

// ao pressionar tecla no input de consulta esse método é chamado
  // se a tecla for enter faz a consulta chamando ordenar
  onKey(event) {
    if (event.key === 'Enter') {
        this.page = 0;
        this.consultar();
    }
  }

  voltarPagina() {
    this.location.back();
  }


}
