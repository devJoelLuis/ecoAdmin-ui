import { LancamentoFiltro } from './../model/filtro.class';
import { Lancamento } from './../model/lancamento.class';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class LancamentoService {

  url = '';

  constructor(
    private http: HttpClient
  ) {
    this.url = environment.apiUrl;
   }


   //cadastrar
   cadastrar(l: Lancamento, parcelas: number) {
     return this.http.post(`${this.url}/lancamentos?parcelas=${parcelas}`, l);
   }


   //alterar
   alterar(l: Lancamento) {
    return this.http.put(`${this.url}/lancamentos`, l);
   }



   //excluir
   excluir(id: number) {
    return this.http.delete(`${this.url}/lancamentos/${id}`);
   }

   //get id
   getId(id: number) {
    return this.http.get(`${this.url}/lancamentos/${id}`);
   }

   //get all pageable
   getAllPageable(page: number, size: number, inicio: Date, fim: Date) {
     const ini = moment(inicio).format('YYYY-MM-DD');
     const f = moment(fim).format('YYYY-MM-DD');
     return this.http.get(`${this.url}/lancamentos?page=${page}&size=${size}&inicio=${ini}&fim=${f}`);
   }

   //get parte descricao
   //get all pageable
   getAllPageableParam(page: number, size: number, inicio: Date, fim: Date, param: string) {
    const ini = moment(inicio).format('YYYY-MM-DD');
    const f = moment(fim).format('YYYY-MM-DD');
    return this.http.get(`${this.url}/lancamentos/param?page=${page}&size=${size}&inicio=${ini}&fim=${f}&param=${param}`);
  }


  getPeriodoParam(page: number, size: number, inicio: Date, fim: Date, tipo: string, pago: number, param: string) {
    var params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString())
    .set('inicio', moment(inicio).format('YYYY-MM-DD'))
    .set('fim', moment(fim).format('YYYY-MM-DD'))
    .set('tipo', tipo)
    .set('pago', pago.toString())
    .set('param', param );
    return this.http.get(`${this.url}/lancamentos/filtro`, { params: params });
  }


  getAllFiltro(filtro: LancamentoFiltro) {
    return this.http.post(`${this.url}/lancamentos/filtro`, filtro);
  }

  getAllLancamentosOsId(page: number, size: number, idos: number) {
    return this.http.get(`${this.url}/lancamentos/idos?page=${page}&size=${size}&idos=${idos}`);
  }

  getAllLancamentosOsIdDTO(page: number, size: number, filtro: string, idos: number, inicio: Date, fim: Date) {
    var params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString())
    .set('inicio', moment(inicio).format('YYYY-MM-DD'))
    .set('fim', moment(fim).format('YYYY-MM-DD'))
    .set('filtro', filtro)
    .set('idos', idos.toString());
    return this.http.get(`${this.url}/lancamentos/dto`, { params: params });
  }


}//fecha classe
