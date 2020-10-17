import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Lembrete } from './../model/lembrete.class';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class LembreteService {

  url = '';

  constructor(
    private http: HttpClient
  ) {
    this.url = environment.apiUrl
  }


  cadastar(l: Lembrete) {
   return this.http.post(`${this.url}/lembretes`, l);
  }

  editar(l: Lembrete) {
   return  this.http.put(`${this.url}/lembretes`, l);
  }

  excluir(id: number) {
    return this.http.delete(`${this.url}/lembretes/${id}`);
  }


}// fecha classe
