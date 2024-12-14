import { ErrorHandlerService } from 'src/app/shared/error-handler.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
//import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  url = '';

  jwtHelper = new JwtHelperService();
  jwtPayload: any;


  constructor(
    private http: HttpClient,
    private erroHandler: ErrorHandlerService,
    private router: Router
  ) {
    this.url = environment.apiUrl;
    this.carregarToken();
  }


  estaLogado() {
    return this.jwtPayload &&
    !this.isAccessTokenInvalido() ? true : false;
  }


  login(email: string, senha: string): Promise<void> {

    const body =`username=${email}&password=${senha}&grant_type=password`;

    const headers = new HttpHeaders()
             .append('Content-Type', 'application/x-www-form-urlencoded')
             .append('Authorization', 'Basic ');

    return this.http.post<any>(`${this.url}/oauth/token`, body, { headers, withCredentials: true })
              .toPromise()
              .then( ret => {
                this.armazenarToken(ret['access_token']);
                return Promise.resolve(null);
              })
              .catch( er =>{
               this.erroHandler.handler(er);
               return Promise.resolve(null);
              });
  }



    logout() {
      this.http.delete(`${this.url}/tokens/logout`, { withCredentials: true })
          .toPromise()
          .then(() =>{
            console.log('logout api success !!!');
            this.router.navigate(['/']);
            this.limparTokenLocal();
          })
          .catch(()=> {
            console.log('falha no logout api');
            this.limparTokenLocal();
            this.router.navigate(['/']);
          })

    }

    limparTokenLocal() {
      localStorage.clear();
      sessionStorage.clear();
      this.jwtPayload = null;
    }



  private armazenarToken(token: string) {
   this.jwtPayload = this.jwtHelper.decodeToken(token);
    localStorage.setItem('token', token);
 }

 private carregarToken() {
   const token = localStorage.getItem('token');
   if(token && token != 'undefined') {
     this.armazenarToken(token);
   }
 }


 temPermissao(permissao: string) {
  return this.jwtPayload && this.jwtPayload.authorities.includes(permissao);
}

temQualquerPermissao(roles) {
  for (const role of roles) {
    if (this.temPermissao(role)) {
      return true;
    }
  }

  return false;
}


temToken() {
  return localStorage.getItem('token') ? true : false;
}


isAccessTokenInvalido() {
  const token = localStorage.getItem('token');
  return !token || this.jwtHelper.isTokenExpired(token);
}


obterNovoAccessToken(): Promise<void> {

  const headers = new HttpHeaders()
   .append('Content-Type', 'application/x-www-form-urlencoded')
   .append('Authorization', 'Basic ');
   const body = 'grant_type=refresh_token';

   return this.http.post<any>(`${this.url}/oauth/token`, body,
       { headers, withCredentials: true })
     .toPromise()
     .then(response => {
       this.armazenarToken(response['access_token']);

       console.log('Novo access token criado!');

       return Promise.resolve(null);
     })
     .catch(response => {
       console.error('Erro ao renovar token.', response);
       return Promise.resolve(null);
     });

 }


}// fecha classe
