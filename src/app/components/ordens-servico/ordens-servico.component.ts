import { Component, signal } from '@angular/core';
import { PoTableColumn, PoTableColumnSpacing, PoTableModule } from '@po-ui/ng-components';
import { OrdemServicoResponse } from '../../models/ordens-servico/responses/ordem-servico.response';

@Component({
  selector: 'app-ordens-servico',
  standalone: true,
  imports: [PoTableModule],
  templateUrl: './ordens-servico.component.html',
  styleUrl: './ordens-servico.component.scss',
})
export class OrdensServicoComponent {
  items = signal<OrdemServicoResponse[]>([
    {
      codigo: 1001,
      cliente: 'João da Silva',
      tecnico: 'Carlos Henrique',
      status: 'Aberta',
      prioridade: 'Alta',
      dataAbertura: '21/03/2026',
    },
    {
      codigo: 1002,
      cliente: 'Maria Oliveira',
      tecnico: 'Fernanda Souza',
      status: 'Em andamento',
      prioridade: 'Média',
      dataAbertura: '20/03/2026',
    },
    {
      codigo: 1003,
      cliente: 'Pedro Santos',
      tecnico: 'Lucas Almeida',
      status: 'Finalizada',
      prioridade: 'Baixa',
      dataAbertura: '19/03/2026',
    },
    {
      codigo: 1004,
      cliente: 'Ana Paula',
      tecnico: 'Carlos Henrique',
      status: 'Aguardando peça',
      prioridade: 'Alta',
      dataAbertura: '18/03/2026',
    },
    {
      codigo: 1005,
      cliente: 'Empresa XPTO',
      tecnico: 'Fernanda Souza',
      status: 'Cancelada',
      prioridade: 'Baixa',
      dataAbertura: '17/03/2026',
    },
    {
      codigo: 1006,
      cliente: 'Ricardo Lima',
      tecnico: 'Lucas Almeida',
      status: 'Em andamento',
      prioridade: 'Alta',
      dataAbertura: '16/03/2026',
    },
  ]);

  spacing = PoTableColumnSpacing;

  columns: PoTableColumn[] = [
    { property: 'codigo', label: 'Código' },
    { property: 'cliente', label: 'Cliente' },
    { property: 'tecnico', label: 'Técnico' },
    { property: 'status', label: 'Status' },
    { property: 'prioridade', label: 'Prioridade' },
    { property: 'dataAbertura', label: 'Data de abertura' },
  ];
}
