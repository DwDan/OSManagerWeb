import { defineI18n } from '@i18n/shared/define-i18n';

export const paginationLiterals = defineI18n({
  ptBR: {
    info: 'Exibindo {{start}} até {{end}} de {{total}} registros',
    actions: {
      first: 'Primeira página',
      previous: 'Página anterior',
      next: 'Próxima página',
      last: 'Última página',
    },
  },
  enUS: {
    info: 'Showing {{start}} to {{end}} of {{total}} records',
    actions: {
      first: 'First page',
      previous: 'Previous page',
      next: 'Next page',
      last: 'Last page',
    },
  },
});
