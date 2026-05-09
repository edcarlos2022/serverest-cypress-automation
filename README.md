# Automação de Testes - Ambev / Serverest

## Visão Geral
Este projeto contém automação de testes Cypress para o aplicativo Serverest.
Os testes cobrem cenários de API e interface web (UI) relacionados a cadastro, login, CRUD e fluxo de compra.

## Versões Utilizadas
- Node.js: recomendado 18.x ou superior
- Cypress: 15.14.2
- ESLint: 10.3.0
- eslint-plugin-cypress: 6.4.1

## Estrutura do Projeto
- `cypress/e2e/`: testes E2E e API
  - `API_serverRest.cy.js`: testes de API para CRUD de usuários, login, produtos, carrinho e limpeza
  - `UI_register_user_admin.cy.js`: testes de UI para cadastro de admin, login, cadastro de produto e exclusão
  - `UI_register_user_notAdmin.cy.js`: testes de UI para cadastro de admin, cadastro de cliente não admin e pesquisa de produto criado no cadastro anterior
- `cypress/support/commands.js`: comandos customizados para geração de dados aleatórios
- `cypress/support/e2e.js`: arquivo de suporte global do Cypress
- `cypress.config.js`: configuração do Cypress com `baseUrl` padrão

## Como Instalar
1. Instale as dependências do projeto:
   ```bash
   npm install
   ```

## Como Executar os Testes
### Em modo interativo
```bash
npx cypress open
```

### Em modo headless
```bash
npx cypress run --spec "cypress/e2e/**/*.cy.js"
```

### Lint
```bash
npm run lint
```

## Abrangência dos Testes
### Testes de API (`API_serverRest.cy.js`)
- Cadastro de usuário
- Listagem de usuários
- Busca de usuário por ID
- Edição de usuário
- Login válido e inválido
- Cadastro de produto com autenticação
- Listagem de produtos
- Busca de produto por ID
- Edição de produto
- Criação de carrinho e validação de conteúdo
- Cancelamento de compra
- Exclusão de produto e usuário para limpeza

### Testes de UI
#### `UI_register_user_admin.cy.js`
- Cadastro de usuário administrador
- Validação de telas de cadastro e login
- Login como admin
- Cadastro de produto via interface
- Exclusão de produto na lista de produtos

#### `UI_register_user_notAdmin.cy.js`
- Cadastro de usuário administrador
- Cadastro de produto como admin
- Cadastro de cliente não administrador
- Login do cliente não admin
- Pesquisa e validação de produto criado pelo admin

## Observações
- A configuração do Cypress está definida em `cypress.config.js` com base na URL `https://serverest.dev`.
- Os testes usam dados gerados dinamicamente para reduzir dependência de dados estáticos.
- Recomenda-se versionar este projeto com Git para rastrear alterações e manter histórico de commits.
