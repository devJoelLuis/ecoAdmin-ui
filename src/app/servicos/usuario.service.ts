import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../model/usuario.class';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  url = '';

  constructor(
    private http: HttpClient
  ) {
    this.url = environment.apiUrl;
   }


 //cadastrar
 cadastrar(u: Usuario) {
   return this.http.post(`${this.url}/usuarios`, u);
 }

 //alterar
 alterar(u: Usuario) {
  return this.http.put(`${this.url}/usuarios`, u);
}


 //excluir
 excluir(id: number) {
  return this.http.delete(`${this.url}/usuarios/${id}`);
}

 //get by id
 getById(id: number) {
  return this.http.get(`${this.url}/usuarios/${id}`);
}

//get by email
getByEmail(email: string) {
  return this.http.get(`${this.url}/usuarios/email/${email}`);
}

 //get all
 getAll() {
  return this.http.get(`${this.url}/usuarios`);
}


recuperarSenha(email: string) {
  return this.http.get(`${this.url}/publico/recover-pwd/${email}`);
}

 alterarPerfil(u: Usuario) {
  return this.http.put(`${this.url}/usuarios/perfil`, u);
}

}// fecha classe
