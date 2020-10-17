import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';
import { Recibo } from '../model/recibo.class';

@Injectable({
  providedIn: 'root'
})
export class ReciboService {

  url = '';

  constructor(
    private http: HttpClient
  ) {
    this.url = environment.apiUrl;
   }

   gerarRecibo(rc: Recibo) {
      return this.http.post(`${this.url}/recibo`, rc, { responseType: 'blob' as 'json'});
   }


}//fecha classe
