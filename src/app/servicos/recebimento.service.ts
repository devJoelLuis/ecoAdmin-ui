import { Recebimento } from './../model/recebimento.class';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecebimentoService {


  url = '';

  constructor(
    private http: HttpClient
  ) {
    this.url = environment.apiUrl;
   }


   // cadastrar
   cadastrar(r: Recebimento) {
     return this.http.post(`${this.url}/recebimentos`, r);
   }

   //alterar
   alterar(r: Recebimento) {
    return this.http.put(`${this.url}/recebimentos`, r);
  }

   //excluir
   excluir(id: number) {
    return this.http.delete(`${this.url}/recebimentos/${id}`);
  }

  //get by id
  getById(id: number) {
    return this.http.get(`${this.url}/recebimentos/${id}`);
  }

  //get total recebido de um lancamento
  getTotalRecebido(idlancamento: number) {
    return this.http.get(`${this.url}/recebimentos/totalrecebido/${idlancamento}`);
  }



}//fecha classe
