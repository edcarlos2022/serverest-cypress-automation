Cypress.Commands.add('gerarNomeAleatorio', () => {
  const nomes = ['Carlos', 'Maria', 'João', 'Ana', 'Lucas'];
  const sobrenomes = ['Silva', 'Souza', 'Oliveira', 'Santos'];

  const quantidade = Math.floor(Math.random() * 3) + 2;
  const partes = [];

  for (let i = 0; i < quantidade; i++) {
    const lista = i === 0 ? nomes : sobrenomes;
    partes.push(lista[Math.floor(Math.random() * lista.length)]);
  }

  return cy.wrap(partes.join(' '));
});

Cypress.Commands.add('gerarEmailAleatorio', () => {
  return cy.wrap(`teste${Date.now()}@qa.com`);
});

Cypress.Commands.add('gerarSenhaAleatoria', () => {
  const senha = Math.floor(100000 + Math.random() * 900000).toString();
  return cy.wrap(senha);
});

Cypress.Commands.add('gerarProdutoAleatorio', () => {

  const produtos = [
    'Skol Lata',
    'Brahma Duplo Malte',
    'Stella Long Neck',
    'Budweiser 350ml',
    'Bohemia Pilsen',
    'Original 600ml'
  ];

  const tamanhos = [
    '269ml',
    '350ml',
    '473ml',
    '600ml'
  ];

  const produto = produtos[Math.floor(Math.random() * produtos.length)];
  const tamanho = tamanhos[Math.floor(Math.random() * tamanhos.length)];

  // gera 4 dígitos aleatórios
  const sufixo = Math.floor(1000 + Math.random() * 9000);

  return cy.wrap(`${produto} ${tamanho} ${sufixo}`);
});

Cypress.Commands.add('gerarDescricaoProduto', () => {
  const descricoes = [
    'Cerveja refrescante ideal para consumo gelado.',
    'Produto premium com sabor equilibrado.',
    'Embalagem econômica para revenda.',
    'Alta qualidade com excelente custo benefício.',
    'Bebida leve e perfeita para ocasiões especiais.',
    'Cerveja puro malte com aroma marcante.'
  ];

  const formatos = [
    'Unidade',
    'Pack com 6',
    'Caixa com 12',
    'Fardo promocional'
  ];

  const descricao =
    `${descricoes[Math.floor(Math.random() * descricoes.length)]} ` +
    `${formatos[Math.floor(Math.random() * formatos.length)]}`;

  return cy.wrap(descricao);
});

Cypress.Commands.add('gerarEmailApi', () => {
  const numero = Math.floor(Math.random() * 99999)
  return cy.wrap(`api${numero}@qa.com`)
})

Cypress.Commands.add('gerarProdutoApi', () => {
  const numero = Math.floor(Math.random() * 9999)
  return cy.wrap(`Produto API ${numero}`)
})