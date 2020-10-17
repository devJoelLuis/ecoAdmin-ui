import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HistoricoCatRecebimentoService {

  url = '';

  constructor(
    private http: HttpClient
  ) { 
    this.url = environment.apiUrl;
  }


 getAllHistorico(page: number, size: number, idcategoriaRec: number) {
   return this.http.get(`${this.url}/categoriasRecebimento/historico?page=${page}&size=${size}&id=${idcategoriaRec}`);
 } 



}//fecha classe
