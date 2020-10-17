import { Component, AfterViewInit, ViewChildren, QueryList, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router, ActivatedRoute } from '@angular/router';

import { OsFiltroDTO } from './../../model/osFiltroDTO.class';
import { FiltroOs } from './../../model/osfiltro.class';
import { OrdemServico, OrdemServicoEdit } from 'src/app/model/OrdemServico';
import { AuthService } from './../../seguranca/auth.service';
import { StatusOs } from './../../model/statusOs';
import { OrdemServicoService } from './../../servicos/ordemServico.service';
import { ErrorHandlerService } from 'src/app/shared/error-handler.service';
import { OrdemServicoFiltroDTO } from './../../model/ordemServicoFiltroDTO.class';

import { MessageService, ConfirmationService } from 'primeng/api';
import { Paginator } from 'primeng/paginator';

@Component({
  selector: 'app-ordem-servico-listagem',
  templateUrl: './ordem-servico-listagem.component.html',
  styleUrls: ['./ordem-servico-listagem.component.css'],
  animations: [
    trigger('rowExpansionTrigger', [
        state('void', style({
            transform: 'translateX(-10%)',
            opacity: 0
        })),
        state('active', style({
            transform: 'translateX(0)',
            opacity: 1
        })),
        transition('* <=> *', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
]
})



export class OrdemServicoListagemComponent implements AfterViewInit, OnDestroy {

  @ViewChildren("pag") paginador: QueryList<Paginator>;

consulta = '';
ano: number = new Date().getFullYear();
listOsFiltroDTO: OsFiltroDTO[] = [];
load = false;
todosStatus = true;
listStatusOs: StatusOs[] = [];
statusOs = new StatusOs();
dtNow = new Date();
semData = new Date('1970-1-1 00:00:00 GMT-0300').getTime();

pendencia = false;
novaTarefa = false;
idos: number;

filtroOs = new OrdemServicoFiltroDTO();
totalRegistro = 0;

init = true;


  constructor(
    private confirm: ConfirmationService,
    private errorHandler: ErrorHandlerService,
    private message: MessageService,
    private service: OrdemServicoService,
    private router: Router,
    public auth: AuthService,
    private route: ActivatedRoute,
    public location: Location
  ) {


    const idos = this.route.queryParams['value']['idos'];
    if (idos) {
      this.init = false;
       this.getOsById(idos);
       return;
    }


    const statusFiltro = JSON.parse(sessionStorage.getItem("filtroOs"));

     //verificar se foi passado os filtros

     if (statusFiltro) {
       this.carregarFiltro(statusFiltro);
       return;
     } else {
      this.init = false;
      this.filtroOs.tipoConsulta = 'tudo';
      this.consultar();
      return;
    }


  }

  ngAfterViewInit(): void {

   if (this.init) {
      var pag: Paginator;
      this.paginador.changes.subscribe( (p: QueryList<Paginator>) => {
        pag = p.first;
        if (this.init) {
          this.init = false;
          if (pag) {
            pag.paginatorState['page'] = this.filtroOs.page;
            pag.paginatorState['rows'] = this.filtroOs.size;
            pag.changePage(this.filtroOs.page);
          }
        }
        this.init = false;
      });
   }

    //this.paginador.changePage(this.size);

  }


  ngOnDestroy(): void {
    const filtro = this.setFiltroOs();
    sessionStorage.setItem("filtroOs", JSON.stringify(filtro));
  }



  carregarFiltro(f: FiltroOs) {
    this.filtroOs = f.filtroOs;
    this.init = true;
    this.consultar();
  }

/*
  imprimirOs(idOs) {
   this.load = true;
      this.service.relatorioOs(idOs)
          .subscribe(
            (val) => {
              this.load = false;
              const url =  window.URL.createObjectURL(val);
              window.open(url);
            }, error => {
              this.load = false;
              this.errorHandler.handler(error);
            })

  }

 */

  getOsById(idos: number) {
    this.load = true;
    this.service.getById(idos)
        .toPromise()
        .then( ret => {
          this.load = false;
          var os = new OrdemServico();
          os = ret['dados'];
          var osedit = new OrdemServicoEdit();
          osedit.convertOsParaOsEdit(os);
         // this.listOsEdit = [];
        //  this.listOsEdit.push(osedit);
        })
        .catch( er => {
          this.load = false;
          this.errorHandler.handler(er);
        });
  }



  consultar() {

     this.load = true;
     this.service.getAllFiltro(this.filtroOs)
       .toPromise()
       .then( ret => {
         this.load = false;
         this.carregarListaOsEdit(ret);

       })
       .catch( er => {
         this.load = false;
         this.errorHandler.handler(er);
       })
  }


  carregarListaOsEdit(ret: any) {
     this.listOsFiltroDTO = ret['dados']['content'];
     this.totalRegistro = ret['dados']['totalElements'];
  }


  keyupConsulta(event) {
    if (event.key == 'Enter') {
      this.filtroOs.page = 0;
      this.consultar();
    }
  }

 tipoConsultaChange() {
   this.filtroOs.page = 0;
 }


/*
  carregarStatusOs() {
    this.load = true;
    this.serviceStatusOs.buscarTodo(0, 1000, '')
        .toPromise()
        .then( ret => {
          this.load = false;
          this.listStatusOs = ret['dados']['content'];
        })
        .catch( er => {
          this.load = false;
          this.errorHandler.handler(er);
        });
  }
*/

  paginate(event) {
    this.filtroOs.page = event.page;
    this.filtroOs.size = event.rows;
    this.consultar();
  }


  setFiltroOs(): FiltroOs {
    var filtro = new FiltroOs();
    filtro.filtroOs = this.filtroOs;
    filtro.pendencia = this.pendencia;
    filtro.todosStatus = this.todosStatus;
    filtro.statusOsSelecionada = this.statusOs;
    return filtro;
  }




  confirmarExclusao(os: OsFiltroDTO) {

    this.confirm.confirm({
      message: 'Tem certeza que deseja excluir a ordem de serviço ' + os.numOs +
       '/' + os.anoOs + ' e todos os serviços vinculados a ela?',
      accept: () => {
         this.load = true;
         this.service.excluir(os.idos)
             .toPromise()
             .then(ret => {
              this.consultar();
              this.load = false;
              this.message.add( { severity: 'success', summary: 'O.S. Excluída',
                                  detail: 'A O.S. foi excluída com sucesso!!!' } );
             })
             .catch( er => {
               this.load = false;
               this.errorHandler.handler(er);
             });
      }
    });
  }


  alterarOs(os: OsFiltroDTO) {

    this.router.navigate(['/ordem-servico/edit', os.idos]);
  //  const filtro = this.setFiltroOs();
   // this.router.navigateByUrl(`/ordem-servico/edit/${os.id}`, { state: { filtro: filtro } });
 }


  gotoLancamentosFinancas(idos: number) {
    this.router.navigate(['/ordem-servico/lancamentos', idos]);
    //const filtro = this.setFiltroOs();
    //this.router.navigateByUrl(`/os-servico/servicos-os/${idos}`,  { state: { filtro: filtro } });
  }

  gotoPrazos(idos: number) {
    //this.message.add({severity: 'info', summary: 'EM PROGRAMAÇÃO',
   // detail: 'O gerenciamento de prazos está sendo desenvolvido e será publicado na versão 1.3.1 do sistema', life: 6000});
    this.router.navigate(['/prazos', idos]);
    //const filtro = this.setFiltroOs();
    //this.router.navigateByUrl(`/prazos/${idos}`,  { state: { filtro: filtro } });
  }


  // nova tarefa
  onDialogTarefa(idos: number) {
    this.idos = idos;
    this.novaTarefa = true;
  }

  fechaNovaTarefa(event) {
    this.novaTarefa = event.value;
  }

 

}// fecha classe
