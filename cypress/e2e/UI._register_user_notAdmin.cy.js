describe('Teste de UI', () => {

  let nome;
  let email;
  let senha;
  let produtoSelecionado;

  const produtos = [
    {
      preco: 4.00,
      quantidade: 10,
      imagem: 'produto1.png'
    },
    {
      preco: 40.00,
      quantidade: 10,
      imagem: 'produto2.png'
    },
    {
      preco: 5.00,
      quantidade: 10,
      imagem: 'produto3.png'
    }
  ];

  before(() => {

    cy.gerarNomeAleatorio().then(valor => nome = valor);
    cy.gerarEmailAleatorio().then(valor => email = valor);
    cy.gerarSenhaAleatoria().then(valor => senha = valor);

    const indiceAleatorio = Math.floor(Math.random() * produtos.length);

    produtoSelecionado = produtos[indiceAleatorio];

    cy.gerarProdutoAleatorio().then(valor => {
      produtoSelecionado.nome = valor;
    });

    cy.gerarDescricaoProduto().then(valor => {
      produtoSelecionado.descricao = valor;
    });

  });

  function cadastrarProduto(produto) {

    cy.get('[data-testid="nome"]')
      .click()
      .type('{selectall}{backspace}')
      .type(produto.nome);

    cy.get('[data-testid="preco"]')
      .click()
      .type('{selectall}{backspace}')
      .type(produto.preco.toString());

    cy.get('[data-testid="descricao"]')
      .click()
      .type('{selectall}{backspace}')
      .type(produto.descricao);

    cy.get('[data-testid="quantity"]')
      .click()
      .type('{selectall}{backspace}')
      .type(produto.quantidade.toString());

    cy.get('[data-testid="imagem"]')
      .selectFile(`cypress/fixtures/${produto.imagem}`);

    cy.get('[data-testid="cadastarProdutos"]').click();
  }

  it('Cadastro de usuário administrador, validação das telas de cadastro e login', () => {

    cy.visit('https://front.serverest.dev');

    cy.intercept({
      method: 'POST',
      url: '**/usuarios',
      times: 1
    }).as('cadastroUsuario');

    cy.intercept('POST', '**/login').as('loginUsuario');

    cy.get('[data-testid="cadastrar"]').click();

    cy.get('[data-testid="nome"]').type(nome);
    cy.get('[data-testid="email"]').type(email);
    cy.get('[data-testid="password"]').type(senha);

    cy.get('[data-testid="checkbox"]')
      .check()
      .should('be.checked');

    cy.get('[data-testid="cadastrar"]').click();

    cy.wait('@cadastroUsuario').then(({ response }) => {
      expect(response.statusCode).to.eq(201);
      expect(response.body.message)
        .to.eq('Cadastro realizado com sucesso');

      expect(response.body._id).to.not.be.empty;

      cy.log(`ID usuário: ${response.body._id}`);
    });

    cy.wait('@loginUsuario').then(({ response }) => {
      expect(response.statusCode).to.eq(200);
      expect(response.body.message)
        .to.eq('Login realizado com sucesso');
    });

    cy.get('[data-testid="logout"]').click();
  });


it('Login com usuário admin cadastrado e cadastro de produto para consulta na tela de lista de produtos ', () => {

    cy.visit('https://front.serverest.dev');

    cy.get('[data-testid="email"]').type(email);

    cy.get('[data-testid="senha"]').type(senha);

    cy.get('[data-testid="entrar"]').click();

    cy.url().should('include', '/admin/home');

    cy.get('h1')
      .should('contain.text', nome);

    cy.get('[data-testid="cadastrarProdutos"]').click();

    cy.intercept('POST', '**/produtos').as('cadastroProduto');

    cadastrarProduto(produtoSelecionado);

    cy.wait('@cadastroProduto').then(({ response }) => {

      expect(response.statusCode).to.eq(201);

      expect(response.body.message)
        .to.eq('Cadastro realizado com sucesso');

      expect(response.body._id).to.not.be.empty;

      cy.log(`Produto cadastrado: ${produtoSelecionado.nome}`);
      cy.log(`Imagem usada: ${produtoSelecionado.imagem}`);
      cy.log(`ID produto: ${response.body._id}`);
      cy.get('[data-testid="logout"]').click();
    });
  });

  it('cadastro de usuário NÃO administrador, login com usuário cadastrado e consulta de produto criado pelo admin', () => {

  let nomeCliente;
  let emailCliente;
  let senhaCliente;

  cy.gerarNomeAleatorio().then(valor => {
    nomeCliente = valor;

    cy.gerarEmailAleatorio().then(valor => {
      emailCliente = valor;

      cy.gerarSenhaAleatoria().then(valor => {
        senhaCliente = valor;

        cy.visit('https://front.serverest.dev');

        cy.intercept({
          method: 'POST',
          url: '**/usuarios',
          times: 1
        }).as('cadastroUsuarioCliente');

        cy.intercept('POST', '**/login').as('loginUsuarioCliente');

        // cadastro
        cy.get('[data-testid="cadastrar"]').click();

        cy.get('[data-testid="nome"]').type(nomeCliente);
        cy.get('[data-testid="email"]').type(emailCliente);
        cy.get('[data-testid="password"]').type(senhaCliente);

        // NÃO marcar checkbox admin
        cy.get('[data-testid="cadastrar"]').click();

        cy.wait('@cadastroUsuarioCliente').then(({ response }) => {
          expect(response.statusCode).to.eq(201);
          expect(response.body.message)
            .to.eq('Cadastro realizado com sucesso');

          cy.log(`ID cliente: ${response.body._id}`);
        });

        cy.wait('@loginUsuarioCliente').then(({ response }) => {
          expect(response.statusCode).to.eq(200);
          expect(response.body.message)
            .to.eq('Login realizado com sucesso');
        });

        // valida home cliente
        cy.get('h1')
          .should('contain.text', 'Serverest Store');

        // pesquisa produto criado pelo admin
        cy.get('[data-testid="pesquisar"]')
          .type(produtoSelecionado.nome);

        cy.get('[data-testid="botaoPesquisar"]').click();

        cy.get('section.row.espacamento')
          .should('be.visible');

        cy.contains('h5.card-title', produtoSelecionado.nome)
          .should('be.visible')
          .parents('.card')
          .within(() => {

            cy.get('h5.card-title')
              .should('contain.text', produtoSelecionado.nome);

            cy.contains('h6', `$ ${produtoSelecionado.preco}`)
              .should('be.visible');

            cy.get('[data-testid="adicionarNaLista"]')
              .should('be.visible');

            cy.get('[data-testid="product-detail-link"]')
              .should('exist');
          });

        cy.log(`Produto encontrado: ${produtoSelecionado.nome}`);

        cy.get('[data-testid="logout"]').click();
      });
    });
  });

});

});

