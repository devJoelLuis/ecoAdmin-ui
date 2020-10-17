import { Categoria } from 'src/app/model/categoria.class';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  url = '';

  constructor(
    private http: HttpClient
  ) {
    this.url = environment.apiUrl;
   }


   //cadastrar
   cadastrar(c: Categoria) {
     return this.http.post(`${this.url}/categorias`, c);
   }


   //alterar
   alterar(c: Categoria) {
    return this.http.put(`${this.url}/categorias`, c);
   }



   //excluir
   excluir(id: number) {
    return this.http.delete(`${this.url}/categorias/${id}`);
   }

   //get id
   getId(id: number) {
    return this.http.get(`${this.url}/categorias/${id}`);
   }

   //get all
   getAll() {
     return this.http.get(`${this.url}/categorias`);
   }




}//fecha classe
