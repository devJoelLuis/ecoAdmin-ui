import { StatusOs } from '../model/StatusOs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatusOsService {

 url = '';

  constructor(
    private http: HttpClient
  ) {
    this.url = environment.apiUrl;
   }

   buscarTodo(page: number, size: number, nome: string) {
     return this.http.get(`${this.url}/statusOs/nome?page=${page}&size=${size}&nome=${nome}`);
   }

   getAll() {
    return this.http.get(`${this.url}/statusOs`);
  }


   cadastrar(st: StatusOs) {
     return this.http.post(`${this.url}/statusOs`, st);
   }


   salvarEdicao(st: StatusOs) {
     return this.http.put(`${this.url}/statusOs`, st);
   }

   excluir(id: number) {
     return this.http.delete(`${this.url}/statusOs/${id}`);
   }


}// fecha classe
