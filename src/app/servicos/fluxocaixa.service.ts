import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class FluxocaixaService {

  url = '';

  constructor(
    private http: HttpClient
  ) { 
    this.url = environment.apiUrl;
  }


  getFluxoCaixa(dtini: Date, dtfim: Date) {
   const dtiniFormatado =  moment(dtini).format('YYYY-MM-DD');
   const dtfimFormatado =  moment(dtfim).format('YYYY-MM-DD');
    return this.http.get(`${this.url}/fluxocaixa?dtini=${dtiniFormatado}&dtfim=${dtfimFormatado}`);
  }

}//fecha classe
