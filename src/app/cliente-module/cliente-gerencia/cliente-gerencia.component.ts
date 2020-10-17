import { AuthService } from './../../seguranca/auth.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { ClienteService } from 'src/app/servicos/cliente.service';
import { ErrorHandlerService } from 'src/app/shared/error-handler.service';
import { Cliente } from 'src/app/model/Cliente';

@Component({
  selector: 'app-cliente-gerencia',
  templateUrl: './cliente-gerencia.component.html',
  styleUrls: ['./cliente-gerencia.component.css']
})
export class ClienteGerenciaComponent implements OnInit {

  idcliente: number;
  load = false;
  cliente = new Cliente();

  constructor(
    public auth: AuthService,
    private route: ActivatedRoute,
    private serviceCli: ClienteService,
    private errorHandle: ErrorHandlerService,
    private location: Location,
  ) {
    this.idcliente = this.route.snapshot.params['id'];
    this.carregarCliente();
  }

  ngOnInit() {

  }


  carregarCliente() {
    this.load = true;
    this.serviceCli.buscarPorId(this.idcliente)
        .toPromise()
        .then(ret => {
// tslint:disable-next-line: no-string-literal
          this.cliente = ret['dados'];
          this.load = false;
        })
        .catch( er => {
          this.load = false;
          this.errorHandle.handler(er);
        });
 }


  voltarPagina() {
    this.location.back();
  }

} //fecha classe

