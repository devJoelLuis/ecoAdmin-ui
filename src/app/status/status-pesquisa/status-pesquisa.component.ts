import { AuthService } from './../../seguranca/auth.service';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';


import { StatusCliService } from 'src/app/servicos/status-cli.service';
import { StatusCli, StatusEdicao } from 'src/app/model/statusCli';


import { MessageService, ConfirmationService } from 'primeng/api';
import { ErrorHandlerService } from 'src/app/shared/error-handler.service';


@Component({
  selector: 'app-status-pesquisa',
  templateUrl: './status-pesquisa.component.html',
  styleUrls: ['./status-pesquisa.component.css']
})

export class StatusPesquisaComponent implements OnInit {



  consultaString = '';
  listStatus: StatusEdicao[] = [];
  listStatusTemp = [];
  size = 10;
  page = 0;
  totalRegistro = 0;
  load = false;
  estato = new StatusCli(0, '');
  edicao = false;
  novo = false;
  containerStatusCliente = 'container bg-color alturaMinima';



  constructor(
    public auth: AuthService,
    private service: StatusCliService,
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




  submitNovoStatus(f) {
   if (f.invalid) {
    f.form.controls.statusNovo.touched = true;
    return false;
   } else {
     this.edicao = false;
     this.load = true;
     this.service.cadastrar(this.estato)
         .toPromise()
         .then( () => {
           this.load = false;
           this.message.add( { severity: 'success', summary: 'Cadastro realizado',
           detail: 'O cadastro do novo status foi feito com sucesso!!!' } );
           this.consultar();
           this.estato = new StatusCli(0, '');
           this.novo = false;
           this.containerStatusCliente = 'container bg-color alturaMinima';
         })
         .catch( er => {
           this.load = false;
           this.containerStatusCliente = 'container bg-color alturaMinima';
           this.errorHandle.handler(er);
         } );
   }
  }

 novoStatus() {
   this.edicao = false;
   this.novo = true;
   this.containerStatusCliente = 'container bg-color-novo alturaMinima';
 }


  cancelarNovo() {
    this.estato = new StatusCli(0, '');
    this.edicao = false;
    this.novo = false;
    this.containerStatusCliente = 'container bg-color alturaMinima';
  }



  editarStatus(st: StatusEdicao) {
    this.listStatusTemp = JSON.parse(JSON.stringify(this.listStatus));
    this.edicao = true;
    this.containerStatusCliente = 'container bg-color-edit alturaMinima';
    this.estato.converterStatus(st);
    st.edit = true;
  }

  cancelarEdicao(st: StatusEdicao) {
    this.listStatus = JSON.parse(JSON.stringify(this.listStatusTemp));
    this.containerStatusCliente = 'container bg-color alturaMinima';
    this.edicao = false;
    this.estato = new StatusCli(0, '');
    st.edit = false;
  }

  editStatusKey(event, st: StatusEdicao) {
    if (event.key == 'Enter') {
      this.page = 0;
      this.salvarEdicao(st);
    }
  }

  salvarEdicao(st: StatusEdicao) {
    if (this.estato) {
      if(this.estato.statusCli == undefined || this.estato.statusCli === '') {
        this.message.add( { severity: 'warn', summary: 'Erro de validação',
        detail: 'Informe uma descrição para o status', life: 6000 } );
        return false;
      }

      if (this.estato.statusCli.length < 2) {
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
            this.estato = ret['dados'];
            st.id = this.estato.id;
            st.statusCli = this.estato.statusCli;
            this.containerStatusCliente = 'container bg-color alturaMinima';
            this.edicao = false;
            this.estato = new StatusCli(0, '');
            st.edit = false;
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
          if(this.listStatus.length == 0) {
            this.message.add( { severity: 'warn', summary: 'Nenhum registro encontrado',
                  detail: 'Não foi encontrado nenhum status de cliente no banco de dados!!!' } );
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
          this.totalRegistro = ret['dados']['totalElements'];
          this.load = false;
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
        this.consultar();
    }
  }

  voltarPagina() {
    this.location.back();
  }


} // fecha classe
