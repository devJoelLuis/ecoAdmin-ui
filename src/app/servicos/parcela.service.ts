import { Parcela } from './../model/parcela';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParcelaService {

  url = '';

  constructor(
    private http: HttpClient
  ) {
    this.url = environment.apiUrl;
   }


   getAllPageableIdGerenciamento(page: number, size: number, idg: number) {
     return this.http.get(`${this.url}/parcelas?page=${page}&size=${size}&idg=${idg}`);
   }

   getById(id: number) {
    return this.http.get(`${this.url}/parcelas/${id}`);
  }

   cadastrar(p: Parcela) {
     return this.http.post(`${this.url}/parcelas`, p);
   }


   salvarEdicao(p: Parcela) {
     return this.http.put(`${this.url}/parcelas`, p);
   }


   excluir(id: number) {
     return this.http.delete(`${this.url}/parcelas/${id}`);
   }

   alerarPagoOuDevedor(idp: number, pago: number, pagamento: string) {
     return this.http.put(`${this.url}/parcelas/status?id=${idp}&pago=${pago}&pagamento=${pagamento}`, null);
   }

}
