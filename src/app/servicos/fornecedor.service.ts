import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Fornecedor } from '../model/fornecedor';

@Injectable({
  providedIn: 'root'
})
export class FornecedorService {

  url = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) { }


  alterar(f: Fornecedor) {
    return this.http.put(`${this.url}/fornecedores`, f);
  }

 cadastrar(f: Fornecedor) {
   return this.http.post(`${this.url}/fornecedores`, f);
 }

 getAllParam(page: number, size: number, param: string) {
    return this.http.get(`${this.url}/fornecedores?page=${page}&size=${size}&param=${param}`);
 }

 getById(id: number) {
   return this.http.get(`${this.url}/fornecedores/${id}`);
 }

 delete(id: number) {
   return this.http.delete(`${this.url}/fornecedores/${id}`);
 }

}// fecha classe
