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

  it('Login com usuário cadastrado, cadastro de produto e exclusão do produto cadastrado', () => {

    cy.visit('https://front.serverest.dev/login');

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

    });
  
  //intercept para validar exclusão do produto
  cy.intercept('DELETE', '**/produtos/*').as('excluirProduto');

cy.contains('.jumbotron h1', 'Lista dos Produtos')
  .parents('.jumbotron')
  .within(() => {

    cy.contains('tbody tr', produtoSelecionado.nome)
      .within(() => {
        cy.contains('button', 'Excluir').click();
      });

  });

cy.wait('@excluirProduto').then(({ request, response }) => {

  expect(response.statusCode).to.eq(200);

  expect(response.body.message)
    .to.eq('Registro excluído com sucesso');

  const produtoId = request.url.split('/').pop();

  cy.log(`Produto excluído: ${produtoSelecionado.nome}`);
  cy.log(`ID removido: ${produtoId}`);
});

cy.reload();

cy.contains('.jumbotron h1', 'Lista dos Produtos')
  .parents('.jumbotron')
  .within(() => {
    cy.get('tbody')
      .should('not.contain', produtoSelecionado.nome);
  });

  });

})

