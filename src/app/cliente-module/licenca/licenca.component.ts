
import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-licenca',
  templateUrl: './licenca.component.html',
  styleUrls: ['./licenca.component.css']
})
export class LicencaComponent implements OnInit {

  cadEdit = false;
  idLicenca = 0;

  @Input() idcliente: number;

  constructor() { }

  ngOnInit() {

  }

  cadOuEdit(event) {
    this.idLicenca = event.idLicenca;
    this.cadEdit = true;
  }

  consultar(event) {
    this.cadEdit = event.cadEdit;
  }



}//fecha classe
