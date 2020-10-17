import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from './../../environments/environment';
import { Prazo } from '../model/prazo.class';

@Injectable({
  providedIn: 'root'
})
export class PrazoService {

  url = '';

  constructor( private http: HttpClient) {
    this.url = environment.apiUrl;
   }



   //cadastrar
   cadastrar(p: Prazo) {
     return this.http.post(`${this.url}/prazos`, p);
   }

   //editar
   alterar(p: Prazo) {
    return this.http.put(`${this.url}/prazos`, p);
  }

   //excluir
   excluir(id: number) {
    return this.http.delete(`${this.url}/prazos/${id}`);
  }

   //get id
   getById(id: number) {
    return this.http.get(`${this.url}/prazos/${id}`);
  }

   //get all os id
  getAllOs(idos: number) {
    return this.http.get(`${this.url}/prazos/os/${idos}`);
  }

  getAllAlerta() {
    return this.http.get(`${this.url}/prazos/alerta`);
  }

  getAllVencendo() {
    return this.http.get(`${this.url}/prazos/vencendo`);
  }

  getAllVencido() {
    return this.http.get(`${this.url}/prazos/vencido`);
  }

  getAll(page: number, size: number) {
    return this.http.get(`${this.url}/prazos?page=${page}&size=${size}`);
  }

  getAllNumOs(numOs: number, anoOs: number) {
    return this.http.get(`${this.url}/prazos/os?numOs=${numOs}&anoOs=${anoOs}`);
  }


}//fecha classe
