import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { UsuarioService } from './../../servicos/usuario.service';
import { ErrorHandlerService } from './../../shared/error-handler.service';
import { Usuario } from 'src/app/model/usuario.class';


import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-usuario-consulta',
  templateUrl: './usuario-consulta.component.html',
  styleUrls: ['./usuario-consulta.component.css']
})
export class UsuarioConsultaComponent implements OnInit {

  usuarios: Usuario[] = [];
  load= false;
  consulta = '';

  constructor(
    private erroHandler: ErrorHandlerService,
    private service: UsuarioService,
    private message: MessageService,
    private confirm: ConfirmationService,
    private location: Location,
    private router: Router
  ) { }

  ngOnInit() {
    this.consultar();
  }


 consultar() {
   if (this.consulta == '' || this.consulta == null || this.consulta == undefined) {
      this.load = true;
      this.service.getAll()
          .toPromise()
          .then( ret => {
            this.load = false;
            this.usuarios = ret['dados'];
          })
          .catch( er => {
            this.load = false;
            this.erroHandler.handler(er);
          });
   } else {

   }
 }


 excluir(u: Usuario) {
   this.confirm.confirm({
     message: 'Tem certeza que deseja excluir o usuário '+ u.nome+ '?',
     accept: () => {
       this.load = true;
       this.service.excluir(u.id)
          .toPromise()
          .then( () => {
            this.load = false;
            this.message.add( { severity: 'info', summary: 'Usuário Excluído', detail: 'O usuário foi excluído com sucesso!!!' } );
            this.consultar();
          })
          .catch( er => {
            this.load = false;
            this.erroHandler.handler(er);
          } );
     }
   });
 }

voltar() {
  this.location.back();
}


cadastrarNovo() {
  this.router.navigate(['/usuarios/novo']);
}



} //fecha classe
