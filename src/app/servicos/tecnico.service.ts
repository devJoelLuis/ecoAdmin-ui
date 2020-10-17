import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Tecnico } from '../model/tecnico';

@Injectable({
  providedIn: 'root'
})
export class TecnicoService {


  url = '';



  constructor(
    private http: HttpClient
  ) {
    this.url = environment.apiUrl;
  }


getAll( page: number, size : number ) {
  return this.http.get(`${this.url}/tecnicos?page=${page}&size=${size}`);
}

getAllDto() {
  return this.http.get(`${this.url}/tecnicos/dto`);
}

getAllPartNome( page: number, size : number, nome: string ) {
  return this.http.get(`${this.url}/tecnicos/nome?page=${page}&size=${size}&nome=${nome}`);
}

cadastrar( t: Tecnico ) {
  return this.http.post(`${this.url}/tecnicos`, t);
}

 alterar( t: Tecnico ) {
  return this.http.put(`${this.url}/tecnicos`, t);
}

getById( id: number ) {
  return this.http.get(`${this.url}/tecnicos/${id}`);
}

excluir( id: number) {
  return this.http.delete(`${this.url}/tecnicos/${id}`);
}

}// fecha classe
