import { defineI18n } from '../shared/define-i18n';

export const customersLiterals = defineI18n({
  ptBR: {
    title: 'Clientes',
    pageActions: {
      newCustomer: 'Novo cliente',
      refresh: 'Atualizar',
    },
    tableActions: {
      details: 'Detalhes',
      edit: 'Editar',
    },
    columns: {
      customer: 'Cliente',
      phone: 'Telefone',
      email: 'E-mail',
      city: 'Cidade',
      state: 'Estado',
    },
    fields: {
      customer: 'Cliente',
      phone: 'Telefone',
      email: 'E-mail',
      postalCode: 'CEP',
      street: 'Rua',
      number: 'Número',
      city: 'Cidade',
      state: 'Estado',
      country: 'País',
      complement: 'Complemento',
      reference: 'Referência',
    },
    modals: {
      create: {
        title: 'Novo cliente',
      },
      edit: {
        title: 'Editar cliente',
      },
      details: {
        title: 'Detalhes do cliente',
      },
    },
    details: {
      customer: 'Cliente',
      phone: 'Telefone',
      email: 'E-mail',
      address: 'Endereço',
      complement: 'Complemento',
      reference: 'Referência',
    },
    notifications: {
      created: 'Cliente criado com sucesso.',
      updated: 'Cliente atualizado com sucesso.',
    },
  },
  enUS: {
    title: 'Customers',
    pageActions: {
      newCustomer: 'New customer',
      refresh: 'Refresh',
    },
    tableActions: {
      details: 'Details',
      edit: 'Edit',
    },
    columns: {
      customer: 'Customer',
      phone: 'Phone',
      email: 'E-mail',
      city: 'City',
      state: 'State',
    },
    fields: {
      customer: 'Customer',
      phone: 'Phone',
      email: 'E-mail',
      postalCode: 'Postal code',
      street: 'Street',
      number: 'Number',
      city: 'City',
      state: 'State',
      country: 'Country',
      complement: 'Complement',
      reference: 'Reference',
    },
    modals: {
      create: {
        title: 'New service customer',
      },
      edit: {
        title: 'Edit service customer',
      },
      details: {
        title: 'Customer details',
      },
    },
    details: {
      customer: 'Customer',
      phone: 'Phone',
      email: 'E-mail',
      address: 'Address',
      complement: 'Complement',
      reference: 'Reference',
    },
    notifications: {
      created: 'Customer created successfully.',
      updated: 'Customer updated successfully.',
    },
  },
});
