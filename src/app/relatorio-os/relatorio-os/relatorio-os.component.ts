import { OrdemServicoService } from './../../servicos/ordemServico.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-relatorio-os',
  templateUrl: './relatorio-os.component.html',
  styleUrls: ['./relatorio-os.component.css']
})
export class RelatorioOsComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private message: MessageService,
    private service: OrdemServicoService
  ) {
    const idOs = this.route.snapshot.params['id'];
    if (idOs) {
       this.carregarRelatorio(idOs);
    } else {
      this.message.add({ severity: 'warn', summary: 'Erro ao gerar relatório',
                 detail: 'Não foi possível gerar o relatório porque o id da O.S. não foi fornecido corretamente',
                life: 6000 });
      this.location.back();
    }
  }

  ngOnInit() {
  }

  carregarRelatorio(idOs: number) {
    this.service.relatorioOs(idOs)
        .subscribe(
          (val) => {
            const url =  window.URL.createObjectURL(val);
            window.open(url);
          }
        )

  }


}// fecha classe
