import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Licenca } from '../model/licenca';
import * as moment from 'moment';
import { LicencaFiltroConsulta } from '../model/licencaFiltroConsulta.class';

@Injectable({
  providedIn: 'root'
})
export class LicencaService {



  url = '';

  constructor(
    private http: HttpClient
  ) {
    this.url = environment.apiUrl;
   }

 cadastrar(l: Licenca) {
   return this.http.post(`${this.url}/licencas`, l);
 }
 alterar(l: Licenca) {
  return this.http.put(`${this.url}/licencas`, l);
}
excluir(id: number) {
  return this.http.delete(`${this.url}/licencas/${id}`);
}
getById(id: number) {
  return this.http.get(`${this.url}/licencas/${id}`);
}
getByAllIdCliente(page: number, size: number, idcliente: number) {
  return this.http.get(`${this.url}/licencas?page=${page}&size=${size}&idcliente=${idcliente}`);
}

getAllFiltro(filtro: LicencaFiltroConsulta) {
  return this.http.post(`${this.url}/licencas/filtro`, filtro);
}

getUltimoNumero() {
  return this.http.get(`${this.url}/licencas/numero`);
}

getAllPorDataVencimento(page: number, size: number, idcliente: number, dtinicio: string, dtfim: string) {
  return this.http.get(`${this.url}/licencas/vencimento?page=${page}&size=${size}&idcliente=${idcliente}&dtinicio=${dtinicio}&dtfim=${dtfim}`);
}

getAllPorDtVencimentoSemParam(page: number, size: number, dtinicio: Date, dtfim: Date, alerta: number) {
  const ini = moment(dtinicio).format('YYYY-MM-DD');
  const final = moment(dtfim).format('YYYY-MM-DD');
  return this.http.get(`${this.url}/licencas/all?page=${page}&size=${size}&dtinicio=${ini}&dtfim=${final}&alerta=${alerta}`);
}


getAllPorDtVencimentoComParam(page: number, size: number, dtinicio: Date, dtfim: Date, param: string, alerta: number) {
  const ini = moment(dtinicio).format('YYYY-MM-DD');
  const final = moment(dtfim).format('YYYY-MM-DD');
  return this.http.get(`${this.url}/licencas/allparam?page=${page}&size=${size}&dtinicio=${ini}&dtfim=${final}&param=${param}&alerta=${alerta}`);
}

getAllPorDtVencimentoTodas(page: number, size: number, dtinicio: Date, dtfim: Date) {
  const ini = moment(dtinicio).format('YYYY-MM-DD');
  const final = moment(dtfim).format('YYYY-MM-DD');
  return this.http.get(`${this.url}/licencas/all/alertaAll?page=${page}&size=${size}&dtinicio=${ini}&dtfim=${final}`);
}

getAllVencidas(page: number, size: number) {
  return this.http.get(`${this.url}/licencas/vencidas?page=${page}&size=${size}`);
}

getAllAlerta(page: number, size: number) {
  return this.http.get(`${this.url}/licencas/alerta?page=${page}&size=${size}`);
}

getAll(page: number, size: number) {
  return this.http.get(`${this.url}/licencas/todas?page=${page}&size=${size}`);
}

relatorio(id) {
  return this.http.get<Blob>(`${this.url}/licencas/relatorio/${id}`,
         { responseType: 'blob' as 'json'});
}

}// fecha classe
