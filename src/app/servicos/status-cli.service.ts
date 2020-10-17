import { StatusCli } from './../model/statusCli';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatusCliService {

  url = '';

  constructor(
    private http: HttpClient
  ) {
    this.url = environment.apiUrl;
   }

   buscarTodo(page: number, size: number, nome: string) {
     return this.http.get(`${this.url}/status?page=${page}&size=${size}&nome=${nome}`);
   }

   cadastrar(st: StatusCli) {
     return this.http.post(`${this.url}/status`, st);
   }


   salvarEdicao(st: StatusCli) {
     return this.http.put(`${this.url}/status`, st);
   }

   excluir(id: number) {
     return this.http.delete(`${this.url}/status/${id}`);
   }
}
