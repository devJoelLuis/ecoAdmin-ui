import { AuthService } from './../../seguranca/auth.service';

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
    public auth: AuthService
  ) { }

  nomeUsuario = '';

  ngOnInit() {
    if(!this.auth.isAccessTokenInvalido())
    this.nomeUsuario = this.auth.jwtPayload.nome;
  }

  logout() {
    this.auth.logout();
  }

}
