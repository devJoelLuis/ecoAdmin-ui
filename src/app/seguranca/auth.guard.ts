import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {


  constructor(
    private auth: AuthService,
    private router: Router
  ) {

  }


  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      // se tentar acessar qualquer url sem ser o login, e não tiver token, redireciona para /login
      if (state.url != '/' && state.url != '/' && !this.auth.temToken()) {
        this.router.navigate(['/']);
        return false;
      }

      if (state.url != '/login' && state.url != '/' && this.auth.temToken() && this.auth.isAccessTokenInvalido()) {
        console.log('Navegação com access token inválido. Obtendo novo token...');


        return this.auth.obterNovoAccessToken()
          .then(() => {
            if (this.auth.isAccessTokenInvalido()) {
              this.router.navigate(['/']);
              return false;
            }

            return true;
          });
      } else if (next.data.roles && !this.auth.temQualquerPermissao(next.data.roles)) {
        this.router.navigate(['/nao-autorizado']);
        return false;
      }

      return true;
  }

}
