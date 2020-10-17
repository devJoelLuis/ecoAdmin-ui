
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Tarefa } from './../model/tarefa.class';
import { environment } from 'src/environments/environment';

import * as moment from 'moment';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {


 url = '';

  constructor(
    private http: HttpClient
  ) {
    this.url = environment.apiUrl;
   }

   getDahs() {
     return this.http.get(`${this.url}/dash`);
   }

   getServicoReceber(dtinicio: Date, dtfim: Date) {
     const ini = moment(dtinicio).format('YYYY-MM-DD');
     const final = moment(dtfim).format('YYYY-MM-DD');
     return this.http.get(`${this.url}/dash/servicoreceber?dtinicio=${ini}&dtfim=${final}`);
   }


   getTecnicosTarefas() {
     return this.http.get(`${this.url}/tarefas`);
   }

   cadastraTarefa(t: Tarefa) {
    return this.http.post(`${this.url}/tarefas`, t);
   }

   alteraTarefa(t: Tarefa) {
    return this.http.put(`${this.url}/tarefas`, t);
   }

   excluiTarefa(id: number) {
    return this.http.delete(`${this.url}/tarefas/${id}`);
   }

   getByIdTarefa(id: number) {
    return this.http.get(`${this.url}/tarefas` );
   }


}// fecha classe
