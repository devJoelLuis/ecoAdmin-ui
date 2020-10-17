import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PermissaoService {

  url = '';

  constructor( private http: HttpClient) {
    this.url = environment.apiUrl;
   }


   getall() {
     return this.http.get(`${this.url}/permissoes`);
   }




}// fecha classe
