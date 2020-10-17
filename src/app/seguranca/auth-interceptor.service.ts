
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { NotAuthenticatedError } from './notAuthenticatedError.class';




@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {



  //url = '';

  //refreshToken: string = '';

  constructor(
    private auth: AuthService
  ) {
   // this.url = environment.apiUrl;
  }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      // recuperação de senha
      if (
            req.url.includes('/oauth/token') ||
            req.url.includes('/publico/recover-pwd')
         ) {
        return next.handle(req);
      }

      if (!req.url.includes('/oauth/token') && this.auth.temToken() && this.auth.isAccessTokenInvalido()) {

        return from(this.auth.obterNovoAccessToken())
            .pipe(
                mergeMap(() => {
                  if (this.auth.isAccessTokenInvalido()) {
                    throw new NotAuthenticatedError();
                   }
                    req = req.clone({
                        setHeaders: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    return next.handle(req);
                })
            );
        }

        if (!this.auth.isAccessTokenInvalido()) {
          const authReq = req.clone({headers: req.headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`)});
          return next.handle(authReq);
      }  else {
        return next.handle(req);
      }
    }
  } //fecha classe


