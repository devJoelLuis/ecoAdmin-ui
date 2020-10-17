import { AuthService } from './../../seguranca/auth.service';

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ConfirmationService, MessageService } from 'primeng/api';

import { Cliente } from 'src/app/model/Cliente';
import { ErrorHandlerService } from 'src/app/shared/error-handler.service';
import { ClienteService } from 'src/app/servicos/cliente.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-cliente-pesquisa',
  templateUrl: './cliente-pesquisa.component.html',
  styleUrls: ['./cliente-pesquisa.component.css']
})
export class ClientePesquisaComponent implements OnInit {


  listCliente: [];
  page = 0;
  size = 10;
  totalRegistro = 0;

  consultaString = '';
  consultaNomeFantasia = false;

   load = false;

   nomeOrder = false;
   nomefOrder = false;
   telOrder = false;
   celOrder = false;


  constructor(
    public auth: AuthService,
    private service: ClienteService,
    private router: Router,
    private errorHandle: ErrorHandlerService,
    private confirma: ConfirmationService,
    private message: MessageService,
    private location: Location

  ) { }

  ngOnInit() {
    this.ordenar('nome');
  }


  // ao pressionar tecla no input de consulta esse método é chamado
  // se a tecla for enter faz a consulta chamando ordenar
  onKey(event) {
    if (event.key === 'Enter') {
        this.page=0;
        this.ordenar('nome');
    }
  }




  // faz consulta conforme o parametro chamado
  // este metodo não é utilizado diretamente por causa da ordenação no cabeçalho da tabela
  // ele é invocado somente pelo metodo ordenar()
  consultar(order: string) {
    if(this.consultaString == undefined || this.consultaString == '') {
     this.load = true;
     this.service.buscarTodos(this.page, this.size, order)
          .toPromise()
          .then(ret => {
            // tslint:disable-next-line: no-string-literal
            this.listCliente = ret['dados']['content'];
           // tslint:disable-next-line: no-string-literal
            this.totalRegistro = ret['dados']['totalElements'];
            if(this.totalRegistro == 0) {
              this.message.add( { severity: 'warn', summary: 'Nenhum registro encontrado',
                  detail: 'não foi encontrado nenhum cliente cadastrado no banco de dados' } );
            }
            this.load = false;
          })
          .catch( er => {
            this.load = false;
            this.errorHandle.handler(er);
          });
        } else {
          if (this.consultaNomeFantasia) {
            this.load = true;
            this.service.buscarTodosNomeFantasia(this.page, this.size, order, this.consultaString)
                .toPromise()
                .then(ret => {
                  // tslint:disable-next-line: no-string-literal
                  this.listCliente = ret['dados']['content'];
                 // tslint:disable-next-line: no-string-literal
                  this.totalRegistro = ret['dados']['totalElements'];
                  if(this.totalRegistro == 0) {
                    this.message.add( { severity: 'warn', summary: 'Nenhum registro encontrado',
                        detail: 'não foi encontrado nenhum cliente com nome '+ this.consultaString } );
                  }
                  this.load = false;
                })
                .catch( er => {
                  this.load = false;
                  this.errorHandle.handler(er);
                });
          } else {
            this.load = true;
            this.service.buscarTodosNome(this.page, this.size, order, this.consultaString)
                .toPromise()
                .then(ret => {
                  // tslint:disable-next-line: no-string-literal
                  this.listCliente = ret['dados']['content'];
                 // tslint:disable-next-line: no-string-literal
                  this.totalRegistro = ret['dados']['totalElements'];
                  if(this.totalRegistro == 0) {
                    this.message.add( { severity: 'warn', summary: 'Nenhum registro encontrado',
                        detail: 'não foi encontrado nenhum cliente com nome '+ this.consultaString } );
                  }
                  this.load = false;
                })
                .catch( er => {
                  this.load = false;
                  this.errorHandle.handler(er);
                });
          }
        }
  }


  // metodo chamado ao clicar no botão novo cliente
  novoCliente() {
     this.router.navigate(['/cliente/novo']);
  }


  // exclusão de cliente
  confirmarExclusao(nome, id) {
    this.confirma.confirm({
      message: 'Tem certeza que deseja excluir o cliente ' + nome + ' e todos os dados vinculados a ele?',
      accept: () => {
         this.load = true;
         this.service.excluirCliente(id)
             .toPromise()
             .then(ret => {
              this.consultar('nome');
              this.load = false;
              this.message.add( { severity: 'success', summary: 'Cliente excluído', detail: 'Cliente excluído com sucesso' } );
             })
             .catch( er => {
               this.load = false;
               this.errorHandle.handler(er);
             });
      }
    });
  }


 // paginador simples do primeng
 // event contem as informações de escolha do usuário
  paginate(event) {
    this.size = event.rows;
    this.page = event.page;
    this.consultar('nome');
  }


  ordemServico(cliente: Cliente) {
     this.router.navigateByUrl('ordem-servico', { state: { cliente: cliente } });
  }



  voltarPagina() {
    this.location.back();
  }




  /*
   * Metodo utilizado para mostrar o icone no cabeçalho das colunas
   * na tabela de cliente, e depois chama o consultar passando o parametro
   * responsável para indormar o back-end o tipo de retorno, exemplo
   * parametro 'nome' retorna uma lista ordenado por nome em asc
   * parametro 'nomeDesc' retonr uma lista ordenada por nome em desc
   */
  ordenar(order: string) {
    switch (order) {
      case 'nome':
          this.nomeOrder = true;
          this.nomefOrder = false;
          this.telOrder = false;
          this.celOrder = false;
          this.consultar('nome');
          break;
        case 'nomeDesc':
            this.nomeOrder = false;
            this.nomefOrder = false;
            this.telOrder = false;
            this.celOrder = false;
            this.consultar('nomeDesc');
            break;
        case 'nomefDesc':
            this.nomefOrder = false;
            this.nomeOrder = false;
            this.telOrder = false;
            this.celOrder = false;
            this.consultar('nomefDesc');
          break;
          case 'nomef':
              this.nomefOrder = true;
              this.nomeOrder = false;
              this.telOrder = false;
              this.celOrder = false;
              this.consultar('nomef');
            break;
            case 'tel':
                this.nomefOrder = false;
                this.nomeOrder = false;
                this.telOrder = true;
                this.celOrder = false;
                this.consultar('tel');
              break;
              case 'telDesc':
                  this.nomefOrder = false;
                  this.nomeOrder = false;
                  this.telOrder = false;
                  this.celOrder = false;
                  this.consultar('telDesc');
                break;
                case 'cel':
                    this.nomefOrder = false;
                    this.nomeOrder = false;
                    this.telOrder = false;
                    this.celOrder = true;
                    this.consultar('cel');
                  break;
                  case 'celDesc':
                      this.nomefOrder = false;
                      this.nomeOrder = false;
                      this.telOrder = false;
                      this.celOrder = false;
                      this.consultar('celDesc');
                    break;
    }
  }


}// fecha classe
