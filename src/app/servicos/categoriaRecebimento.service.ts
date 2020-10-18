import { Transferencia } from './../model/transferencia.class';
import { CategoriaRecebimento } from './../model/categoriaRecebimento.class';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';





@Injectable({
  providedIn: 'root'
})
export class CategoriaRecebimentoService {


  url = '';

  constructor(
    private http: HttpClient
  ) {
    this.url = environment.apiUrl;
   }


   //cadastrar
   cadastrar(cr: CategoriaRecebimento) {
     console.log(cr)
     return this.http.post(`${this.url}/categoriasRecebimento`, cr);
   }

   //alterar
   alterar(cr: CategoriaRecebimento) {
    return this.http.put(`${this.url}/categoriasRecebimento`, cr);
  }

   //excluir
   excluir(id: number) {
    return this.http.delete(`${this.url}/categoriasRecebimento/${id}`);
  }

   //get id
   getById(id: number) {
    return this.http.get(`${this.url}/categoriasRecebimento/${id}`);
  }

   //get all
   getAll() {
    return this.http.get(`${this.url}/categoriasRecebimento`);
   }

   transferencia(t: Transferencia) {
     return this.http.post(`${this.url}/categoriasRecebimento/transferencia`, t);
   }


}//fecha classe
