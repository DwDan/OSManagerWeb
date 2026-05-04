import { defineI18n } from '../shared/define-i18n';

export const customRecordsLiterals = defineI18n({
  ptBR: {
    actions: {
      create: 'Novo registro',
      edit: 'Editar',
      delete: 'Excluir',
    },
    columns: {
      name: 'Nome',
      status: 'Status',
    },
    fields: {
      name: 'Nome',
    },
    notifications: {
      created: 'Registro criado com sucesso.',
      updated: 'Registro atualizado com sucesso.',
      deleted: 'Registro excluído com sucesso.',
      functionExecuted: 'Função executada com sucesso.',
    },
    dialogs: {
      deleteTitle: 'Excluir registro',
      deleteMessage: 'Deseja excluir o registro {name}?',
    },
  },
  enUS: {
    actions: {
      create: 'New record',
      edit: 'Edit',
      delete: 'Delete',
    },
    columns: {
      name: 'Name',
      status: 'Status',
    },
    fields: {
      name: 'Name',
    },
    notifications: {
      created: 'Record created successfully.',
      updated: 'Record updated successfully.',
      deleted: 'Record deleted successfully.',
      functionExecuted: 'Function executed successfully.',
    },
    dialogs: {
      deleteTitle: 'Delete record',
      deleteMessage: 'Do you want to delete record {name}?',
    },
  },
});
