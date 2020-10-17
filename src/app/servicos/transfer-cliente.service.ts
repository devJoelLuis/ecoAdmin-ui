import { Injectable } from '@angular/core';
import { Cliente } from '../model/Cliente';

@Injectable({
  providedIn: 'root'
})
export class TransferClienteService {

  private cliente: Cliente;

  constructor() { }


  setCliente(cli: Cliente) {
    this.cliente = cli;
  }

  getCliente() {
    return this.cliente;
  }


}
