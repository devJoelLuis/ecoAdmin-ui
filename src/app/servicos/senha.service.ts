import { Senha } from 'src/app/model/senha';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SenhaService {
  url = '';

  constructor(
    private http: HttpClient
  ) {
    this.url = environment.apiUrl;
   }

   excluir(id: number) {
     return this.http.delete(`${this.url}/senhas/${id}`);
   }

   alteracao(senha: Senha) {
     return this.http.put(`${this.url}/senhas`, senha);
   }

   cadastro(senha: Senha) {
     return this.http.post(`${this.url}/senhas`, senha);
   }

   findAllClienteId(idcliente: number) {
     return this.http.get(`${this.url}/senhas/cliente/${idcliente}`);
   }

}// fecha classe
