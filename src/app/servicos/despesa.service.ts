import { DespesaFiltro } from './../despesa/despesa-consulta/despesaFiltro.class';
import { Despesa } from './../model/despesa.class';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DespesaService {

  url = '';

  constructor(
    private http: HttpClient
  ) {
    this.url = environment.apiUrl;
  }


 cadastrar(d: Despesa) {

   return this.http.post(`${this.url}/despesas`, d);
 }

 alterar(d: Despesa) {
  return this.http.put(`${this.url}/despesas`, d);
}

excluir(id: number) {
  return this.http.delete(`${this.url}/despesas/${id}`);
}

getById(id: number) {
  return this.http.get(`${this.url}/despesas/${id}`);
}

getAll(page: number, size: number) {
  return this.http.get(`${this.url}/despesas?page=${page}&size=${size}`);
}

getFiltro(df: DespesaFiltro) {
  return this.http.post(`${this.url}/despesas/filtro`, df);
}


}//fecha classe
