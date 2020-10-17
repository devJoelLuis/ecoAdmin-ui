import { StatusFornecedor } from './../model/statusFornecedor';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatusFornecedorService {

  url = '';

  constructor(
    private http: HttpClient
  ) {
    this.url = environment.apiUrl;
   }


delete(id: number) {
  return this.http.delete(`${this.url}/statusFornecedor/${id}`);
}


cadastrar(st: StatusFornecedor) {
  return this.http.post(`${this.url}/statusFornecedor`, st);
}



}// fecha classe
