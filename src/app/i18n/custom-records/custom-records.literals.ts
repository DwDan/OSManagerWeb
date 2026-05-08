import { defineI18n } from '../shared/define-i18n';

export const customRecordsLiterals = defineI18n({
  ptBR: {
    actions: {
      create: 'Novo registro',
      details: 'Detalhar',
      edit: 'Editar',
      delete: 'Excluir',
    },
    columns: {
      name: 'Nome',
      status: 'Status',
    },
    fields: {
      key: 'Código',
      name: 'Nome',
      status: 'Status',
      customFields: 'Campos customizados',
    },
    modals: {
      details: {
        title: 'Detalhes do registro',
      },
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
      details: 'Details',
      edit: 'Edit',
      delete: 'Delete',
    },
    columns: {
      name: 'Name',
      status: 'Status',
    },
    fields: {
      key: 'Code',
      name: 'Name',
      status: 'Status',
      customFields: 'Custom fields',
    },
    modals: {
      details: {
        title: 'Record details',
      },
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
