

import { HttpClient, HttpHeaders } from '@angular/common/http';
import {  } from '@angular/common/http'
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';
import { OrdemServico } from '../model/OrdemServico';
import { OrdemServicoFiltroDTO } from '../model/ordemServicoFiltroDTO.class';

@Injectable({
  providedIn: 'root'
})
export class OrdemServicoService {

 url = '';

  constructor(
    private http: HttpClient
  ) {
    this.url = environment.apiUrl;
   }

   buscarTodo(page: number, size: number, nome: string) {
     return this.http.get(`${this.url}/ordem-servico?page=${page}&size=${size}`);
   }

   buscarPorClinteId(idcli: number) {
    return this.http.get(`${this.url}/ordem-servico/cliente/${idcli}`);
  }

   cadastrar(os: OrdemServico) {
     return this.http.post(`${this.url}/ordem-servico`, os);
   }


   salvarEdicao(os: OrdemServico) {
     return this.http.put(`${this.url}/ordem-servico`, os);
   }


   excluir(id: number) {
     return this.http.delete(`${this.url}/ordem-servico/${id}`);
   }

   getById(id: number) {
    return this.http.get(`${this.url}/ordem-servico/${id}`);
   }

   getUltimoNumeroOs() {
    return this.http.get(`${this.url}/ordem-servico/numOs`);
   }

   getAllSemParam(page: number, size: number, ano: number) {
     return this.http.get(`${this.url}/ordem-servico?page=${page}&size=${size}&ano=${ano}`);
   }

   getAllAlarmeSemParam(page: number, size: number, ano: number) {
    return this.http.get(`${this.url}/ordem-servico/alarme?page=${page}&size=${size}&ano=${ano}`);
  }

  getAllPendenciaSemParam(page: number, size: number, ano: number) {
    return this.http.get(`${this.url}/ordem-servico/pendencia?page=${page}&size=${size}&ano=${ano}`);
  }

  getAllComParam(page: number, size: number, ano: number, param: string) {
    return this.http.get(`${this.url}/ordem-servico/parametro?page=${page}&size=${size}&ano=${ano}&param=${param}`);
  }

  //getAllAlarmeComParam(page: number, size: number, ano: number, param: string) {
 //   return this.http.get(`${this.url}/ordem-servico/parametro/alarme?page=${page}&size=${size}&ano=${ano}&param=${param}`);
 // }

  getAllStatusId(page: number, size: number, ano: number, idstatus: number) {
    return this.http.get(`${this.url}/ordem-servico/status?page=${page}&size=${size}&ano=${ano}&idstatus=${idstatus}`);
  }

  relatorioOs(idOs) {
    return this.http.get<Blob>(`${this.url}/ordem-servico/relatorio/${idOs}`,
           { responseType: 'blob' as 'json'});
  }

  getAllNomeClienteAno(param: string, ano: number) {
    return this.http.get(`${this.url}/ordem-servico/nomecliente?param=${param}&ano=${ano}`);
  }

  getAllNumDescricao(param: string) {
    return this.http.get(`${this.url}/ordem-servico/descnum?param=${param}`);
  }

  getAllFiltro(filtro: OrdemServicoFiltroDTO) {
    return this.http.post(`${this.url}/ordem-servico/filtro`, filtro );
  }

  getAllOsClienteDto(idcliente: number, ano: number) {
    return this.http.get(`${this.url}/ordem-servico/oscliente?idcliente=${idcliente}&ano=${ano}`);
  }


}// fecha classe
