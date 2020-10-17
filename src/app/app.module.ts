import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import localePt from '@angular/common/locales/pt';
import { CommonModule, registerLocaleData } from '@angular/common';
import { JwtHelperService, JwtModule } from "@auth0/angular-jwt";


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core.module';
import { LoginComponent } from './login/login.component';
import { AuthInterceptorService } from './seguranca/auth-interceptor.service';

import {MessageService} from 'primeng/api';
import {ConfirmationService} from 'primeng/api';
import { NaoAutorizadoComponent } from './shared/nao-autorizado/nao-autorizado.component';
import { environment } from 'src/environments/environment';



//export function tokenGetter() {
//  return localStorage.getItem('token');
//}



registerLocaleData(localePt);


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NaoAutorizadoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    CommonModule,
    RouterModule,
    HttpClientModule,
    JwtModule
   // JwtModule.forRoot({
  //    config: {
   //     tokenGetter: tokenGetter,
   //     whitelistedDomains: [ new RegExp('191.252.110.212:8081'), new RegExp('localhost:8081') ],
  //      blacklistedRoutes: [ new RegExp('\/oauth\/token') ]
   //   }
  //  }),

  ],
  providers: [
    JwtHelperService,
    MessageService,
    ConfirmationService,
    {provide: LOCALE_ID, useValue: 'pt' },
    {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptorService,
    multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
