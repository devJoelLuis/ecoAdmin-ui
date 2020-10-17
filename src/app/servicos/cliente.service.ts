import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Cliente } from '../model/Cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {


  url = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) { }


buscarTodos(page: number, size: number, order: string) {
  return this.http.get(`${this.url}/clientes?page=${page}&size=${size}&order=${order}`);
}

buscarTodosNome(page: number, size: number, order: string, nome: string) {
  return this.http.get(`${this.url}/clientes/nome?page=${page}&size=${size}&order=${order}&nome=${nome}`);
}

buscarTodosNomeFantasia(page: number, size: number, order: string, nome: string) {
  return this.http.get(`${this.url}/clientes/nomeFantasia?page=${page}&size=${size}&order=${order}&nome=${nome}`);
}

novoCliente(cliente: Cliente) {
  return this.http.post(`${this.url}/clientes`, cliente);
}

editaCliente(cliente: Cliente) {
  return this.http.put(`${this.url}/clientes`, cliente);
}

buscarPorId(id: number) {
  return this.http.get(`${this.url}/clientes/${id}`);
}

excluirCliente(id: number) {
  return this.http.delete(`${this.url}/clientes/${id}`);
}

getClienteDtoParam(param: string) {
  return this.http.get(`${this.url}/clientes/clientedto?param=${param}`);
}


}// fecha classe
