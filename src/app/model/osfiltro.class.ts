import { OrdemServicoFiltroDTO } from './ordemServicoFiltroDTO.class';
import { StatusOs } from './statusOs';

export class FiltroOs {
  filtroOs = new OrdemServicoFiltroDTO();
  pendencia: boolean;
  todosStatus: boolean;
  statusOsSelecionada: StatusOs;
}
