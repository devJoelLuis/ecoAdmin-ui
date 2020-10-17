import { AuthService } from './../../../seguranca/auth.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-orcamento',
  templateUrl: './orcamento.component.html',
  styleUrls: ['./orcamento.component.css']
})
export class OrcamentoComponent implements OnInit {

  cadEdit= false;
  idOrcamento: number;
  semPermissao = false;
  @Input() idcliente: number;



  constructor(
    private auth: AuthService
  ) {
    if (!this.auth.temQualquerPermissao(['ROLE_ADMIN', 'ROLE_ORCAMENTO'])) {
       this.semPermissao = true;
    } else {
      this.semPermissao = false;
    }
   }

  ngOnInit() {
  }

  cadOuEdit(event) {
    if (!this.semPermissao) {
      this.idOrcamento = event.idOrcamento;
      this.cadEdit = true;
    }
  }

  consultar(event) {
    if (!this.semPermissao) {
      this.cadEdit = event.cadEdit;
    }
  }

}
