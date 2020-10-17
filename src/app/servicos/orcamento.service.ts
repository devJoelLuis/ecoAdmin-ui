import { Orcamento } from './../model/orcamento';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrcamentoService {

  url = '';

  constructor(
    private http: HttpClient
  ) {
    this.url = environment.apiUrl;
   }



 getById(idOrcamento: number) {
  return this.http.get(`${this.url}/orcamentos/${idOrcamento}`);
 }


 getByIdCliente(idcliente: number) {
   return this.http.get(`${this.url}/orcamentos/cliente?id=${idcliente}`);
 }

 cadastrar(orcamento: Orcamento) {
   return this.http.post(`${this.url}/orcamentos`, orcamento);
 }

 alterar(orcamento: Orcamento) {
  return this.http.put(`${this.url}/orcamentos`, orcamento);
}

excluir(idorcamento: number) {
  return this.http.delete(`${this.url}/orcamentos/${idorcamento}`);
}

getByDataEntrega(dtinicio, dtfim, idcliente: number) {
  return this.http.get(`${this.url}/orcamentos/data?inicio=${dtinicio}&fim=${dtfim}&idcliente=${idcliente}`);
}



}// fecha classe
