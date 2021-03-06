import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriaRecebimentoRoutingModule } from './categoria-recebimento-routing.module';
import { CategoriaRecebimentoComponent } from './categoria-recebimento/categoria-recebimento.component';


import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import {TooltipModule} from 'primeng/tooltip';
import {PaginatorModule} from 'primeng/paginator';
import {DropdownModule} from 'primeng/dropdown';

import { CurrencyMaskModule } from 'ng2-currency-mask';
import { HistoricoCatRecebimentoComponent } from './historico-cat-recebimento/historico-cat-recebimento.component';
import { TranferenciaComponent } from './tranferencia/tranferencia.component';

@NgModule({
  declarations: [CategoriaRecebimentoComponent, HistoricoCatRecebimentoComponent, TranferenciaComponent],
  imports: [
    CommonModule,
    CategoriaRecebimentoRoutingModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    TooltipModule,
    CurrencyMaskModule,
    PaginatorModule,
    DropdownModule
  ]
})
export class CategoriaRecebimentoModule { }
