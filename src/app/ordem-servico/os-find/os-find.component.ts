import { AuthService } from './../../seguranca/auth.service';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { ErrorHandlerService } from './../../shared/error-handler.service';
import { MessageService } from 'primeng/api';
import { OrdemServicoService } from './../../servicos/ordemServico.service';
import { Component, OnInit } from '@angular/core';

import { OrdemServico } from 'src/app/model/OrdemServico';

@Component({
  selector: 'app-os-find',
  templateUrl: './os-find.component.html',
  styleUrls: ['./os-find.component.css']
})
export class OsFindComponent implements OnInit {

  load = false;

  param = '';
  oss: OrdemServico[] = [];
   idOsSelecionada = 0;
  tipoSelecao = '';
  porNomeCliente = false;
  ano = new Date().getFullYear();

  dialogLancamento = false;
  dialogRecebimento = false;

  constructor(
    private serviceOs: OrdemServicoService,
    private message: MessageService,
    private erroHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    public auth: AuthService
  ) {

    const tipo = this.route.snapshot.params['tipo'];
    if (tipo) {
       if (tipo == 'lancamento') {
          this.tipoSelecao = 'lançamento';
       } else if (tipo == 'recebimento') {
          this.tipoSelecao = 'recebimento';

       } else {
        this.router.navigate(['/fsdfs']);
       }
    } else {
      this.router.navigate(['/fsdfs']);
    }

  }

  ngOnInit() {
  }


  selecionarOsLancamento(os: OrdemServico) {
    this.idOsSelecionada = os.id;
    this.dialogLancamento = true;
    this.dialogRecebimento = false;
  }
  cancelarNovoLancamento() {
    this.idOsSelecionada = 0;
    this.dialogLancamento = false;
    this.dialogRecebimento = false;
  }
  selecionarOsRecebimento(os: OrdemServico) {
    this.dialogLancamento = true;
    this.dialogRecebimento = false;
  }



  consultarOs() {
    if (this.param.length < 2) {
      this.message.add({severity: 'warn', summary: 'Erro de validação', detail: 'Digite no mínimo dois caracteres!'});
      return;
    }
    if (this.porNomeCliente) {
      this.load = true;
      this.serviceOs.getAllNomeClienteAno(this.param, this.ano)
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
           this.erroHandler.handler(er);
         }); 
    } else {
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
         this.erroHandler.handler(er);
       });
    }
  }




  keyup(event) {
    if (event.key == 'Enter') {
      this.consultarOs();
    }
  }

  voltar() {
    this.location.back();
  }


  gotoLancamentosFinancas(idos: number) {
    this.router.navigate(['/ordem-servico/lancamentos', idos]);
    //const filtro = this.setFiltroOs();
    //this.router.navigateByUrl(`/os-servico/servicos-os/${idos}`,  { state: { filtro: filtro } });
  }


}//fecha classe
