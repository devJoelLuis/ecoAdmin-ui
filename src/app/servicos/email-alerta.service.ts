import { EmailAlerta } from 'src/app/model/emailAlerta.class';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmailAlertaService {

  url = '';

  constructor(
    private http: HttpClient
  ) {
    this.url = environment.apiUrl;
  }



  cadastrar(e: EmailAlerta) {
    return this.http.post(`${this.url}/emailsAlerta`, e);
  }

  alterar(e: EmailAlerta) {
    return this.http.put(`${this.url}/emailsAlerta`, e);
  }

  excluir(id: number) {
    return this.http.delete(`${this.url}/emailsAlerta/${id}`);
  }

  getById(id: number) {
    return this.http.get(`${this.url}/emailsAlerta/${id}`);
  }

  getAll() {
    return this.http.get(`${this.url}/emailsAlerta`);
  }


}// fecha classe
