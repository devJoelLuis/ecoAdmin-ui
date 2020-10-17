import { Gerenciamento } from './../model/gerenciamento';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GerenciamentoService {

  url = '';

  constructor(
    private http: HttpClient
  ) {
    this.url = environment.apiUrl;
   }

   getAllPageableIdCliente(page: number, size: number, idcliente: number) {
     return this.http.get(`${this.url}/gerenciamentos?page=${page}&size=${size}&idcliente=${idcliente}`);
   }

   getById(id: number) {
    return this.http.get(`${this.url}/gerenciamentos/${id}`);
  }

   cadastrar(ge: Gerenciamento) {
     return this.http.post(`${this.url}/gerenciamentos`, ge);
   }


   salvarEdicao(g: Gerenciamento) {
     return this.http.put(`${this.url}/gerenciamentos`, g);
   }


   excluir(id: number) {
     return this.http.delete(`${this.url}/gerenciamentos/${id}`);
   }


}
