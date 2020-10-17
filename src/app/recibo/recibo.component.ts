import { Location } from '@angular/common';
import { ReciboService } from './../servicos/recibo.service';
import { MessageService } from 'primeng/api';
import { ErrorHandlerService } from 'src/app/shared/error-handler.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Recibo } from '../model/recibo.class';

@Component({
  selector: 'app-recibo',
  templateUrl: './recibo.component.html',
  styleUrls: ['./recibo.component.css']
})
export class ReciboComponent implements OnInit {

  recibo: Recibo;
  load = false;
  mesSelecionado = {mes: 'janeiro'};

  meses = [{mes: 'janeiro'}, {mes: 'fevereiro'}, {mes: 'março'}, {mes: 'abril'}, { mes: 'maio'},
  { mes: 'junho'}, {mes: 'julho'}, {mes: 'agosto'}, {mes: 'setembro'},
  {mes: 'outubro'}, {mes: 'novembro'}, {mes: 'dezembro'}];

  constructor(
    private router: Router,
    private error: ErrorHandlerService,
    private message: MessageService,
    private service: ReciboService,
    private location: Location
  ) {
    const nav = this.router.getCurrentNavigation();
    if (nav.extras.state) {
      if (nav.extras.state.recibo) {
        this.recibo = nav.extras.state.recibo;
      }
    }

   }

  ngOnInit() {

    if (!this.recibo) {
      this.recibo = new Recibo();
    } else {

      switch(this.recibo.mes) {

        case '1':
        this.mesSelecionado = {mes: 'janeiro'};
        break;

        case '2':
        this.mesSelecionado = {mes: 'fevereiro'};
        break;

        case '3':
        this.mesSelecionado = {mes: 'março'};
        break;

        case '4':
        this.mesSelecionado = {mes: 'abril'};
        break;

        case '5':
        this.mesSelecionado = {mes: 'maio'};
        break;

        case '6':
        this.mesSelecionado = {mes: 'junho'};
        break;

        case '7':
        this.mesSelecionado = {mes: 'julho'};
        break;

        case '8':
        this.mesSelecionado = {mes: 'agosto'};
        break;

        case '9':
        this.mesSelecionado = {mes: 'setembro'};
        break;

        case '10':
        this.mesSelecionado = {mes: 'outubro'};
        break;

        case '11':
        this.mesSelecionado = {mes: 'novembro'};
        break;

        case '12':
        this.mesSelecionado = {mes: 'dezembro'};
        break;

      }//fecha switch

    }

  }

  gerarRecibo() {
    if (this.recibo.ano == undefined) {
      this.message.add({severity: 'warn', summary: 'Erro de validação', detail: 'Informe o ano!!!'});
      return
    }
    if (this.recibo.ano == '') {
      this.message.add({severity: 'warn', summary: 'Erro de validação', detail: 'Informe o ano!!!'});
      return
    }
    if (this.recibo.dia == undefined) {
      this.message.add({severity: 'warn', summary: 'Erro de validação', detail: 'Informe o dia!!!'});
      return
    }
    if (this.recibo.dia == '') {
      this.message.add({severity: 'warn', summary: 'Erro de validação', detail: 'Informe o dia!!!'});
      return
    }
    if (this.recibo.mes == undefined) {
      this.message.add({severity: 'warn', summary: 'Erro de validação', detail: 'Selecione o mês!!!'});
      return
    }
    if (this.recibo.mes == '') {
      this.message.add({severity: 'warn', summary: 'Erro de validação', detail: 'Selecione o mês!!!'});
      return
    }
    if (this.recibo.total == undefined) {
      this.message.add({severity: 'warn', summary: 'Erro de validação', detail: 'Informe o valor!!!'});
      return
    }
    if (this.recibo.total == '') {
      this.message.add({severity: 'warn', summary: 'Erro de validação', detail: 'Informe o valor!!!'});
      return
    }
    if (this.recibo.referente == undefined) {
      this.message.add({severity: 'warn', summary: 'Erro de validação', detail: 'Informe o referente!!!'});
      return
    }
    if (this.recibo.referente == '') {
      this.message.add({severity: 'warn', summary: 'Erro de validação', detail: 'Informe o referente!!!'});
      return
    }
    if (this.recibo.recebemosde == undefined) {
      this.message.add({severity: 'warn', summary: 'Erro de validação', detail: 'Informe o pagante!!!'});
      return
    }
    if (this.recibo.recebemosde == '') {
      this.message.add({severity: 'warn', summary: 'Erro de validação', detail: 'Informe o pagante!!!'});
      return
    }

    if (this.recibo.importancia == null || this.recibo.importancia == undefined) {
      this.recibo.importancia = '';
    }

    this.recibo.mes = this.mesSelecionado.mes;

    this.load = true;
    this.recibo.total = this.recibo.total.replace('R$', '');
    this.service.gerarRecibo(this.recibo)
    .subscribe(
      (val) => {
        this.load = false;
        const url =  window.URL.createObjectURL(val);
        window.open(url);
      }, er => {
        this.load = false;
        this.error.handler(er);
      })

  }//fecha imprimir


  goBack() {
    this.location.back();
  }

}//fecha classe
