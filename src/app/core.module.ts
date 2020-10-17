import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AngularFontAwesomeModule } from 'angular-font-awesome';

import { NavbarComponent } from './shared/navbar/navbar.component';
import { PaginaNaoEncontradaComponent } from './shared/pagina-nao-encontrada/pagina-nao-encontrada.component';
import { PrincipalComponent } from './principal/principal.component';
import { ReciboComponent } from './recibo/recibo.component';

import {ToastModule} from 'primeng/toast';
import {ButtonModule} from 'primeng/button';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {TableModule} from 'primeng/table';
import {TooltipModule} from 'primeng/tooltip';
import {CalendarModule} from 'primeng/calendar';
import {DropdownModule} from 'primeng/dropdown';
import {RadioButtonModule} from 'primeng/radiobutton';
import {DialogModule} from 'primeng/dialog';
import {AccordionModule} from 'primeng/accordion';
import { CurrencyMaskModule } from 'ng2-currency-mask';


@NgModule({
  declarations: [
    NavbarComponent,
    PaginaNaoEncontradaComponent,
    PrincipalComponent,
    ReciboComponent

  ],
  imports: [
    CommonModule,
    AngularFontAwesomeModule,
    ButtonModule,
    BrowserAnimationsModule,
    ToastModule,
    RouterModule,
    ConfirmDialogModule,
    TableModule,
    FormsModule,
    TooltipModule,
    CalendarModule,
    DropdownModule,
    DialogModule,
    AccordionModule,
    CurrencyMaskModule,
    RadioButtonModule

  ],
  exports: [
    AngularFontAwesomeModule,
    NavbarComponent,
    PrincipalComponent,
    ButtonModule,
    PaginaNaoEncontradaComponent,
    ToastModule,
    ConfirmDialogModule,
    FormsModule
  ]
})
export class CoreModule { }
