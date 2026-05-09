describe('ServeRest API - CRUD Completo', () => {

  let usuarioId
  let token
  let produtoId
  let carrinhoId

  const random = Math.floor(Math.random() * 99999)

  const usuario = {
    nome: `API User ${random}`,
    email: `api${random}@qa.com`,
    password: '123456',
    administrador: 'true'
  }

  const produto = {
    nome: `Produto API ${random}`,
    preco: 100,
    descricao: 'Produto teste automação',
    quantidade: 10
  }

  // ===============================
  // USUÁRIOS
  // ===============================

  it('POST - Cadastrar usuário', () => {
    cy.request('POST', '/usuarios', usuario)
      .then((response) => {

        expect(response.status).to.eq(201)

        expect(response.body).to.have.property('message')
        expect(response.body.message)
          .to.eq('Cadastro realizado com sucesso')

        expect(response.body).to.have.property('_id')

        usuarioId = response.body._id

        cy.log(JSON.stringify(response.body, null, 2))
      })
  })

  it('GET - Listar usuários', () => {
    cy.request('GET', '/usuarios')
      .then((response) => {

        expect(response.status).to.eq(200)

        expect(response.body).to.have.property('quantidade')
        expect(response.body).to.have.property('usuarios')

        expect(response.body.usuarios).to.be.an('array')

        cy.log(JSON.stringify(response.body, null, 2))
      })
  })

  it('GET - Buscar usuário por ID', () => {
    cy.request('GET', `/usuarios/${usuarioId}`)
      .then((response) => {

        expect(response.status).to.eq(200)
        expect(response.body.nome).to.eq(usuario.nome)
        expect(response.body.email).to.eq(usuario.email)

        cy.log(JSON.stringify(response.body, null, 2))
      })
  })

  it('PUT - Editar usuário', () => {

    const usuarioEditado = {
      nome: `${usuario.nome} Editado`,
      email: `edit${random}@qa.com`,
      password: '654321',
      administrador: 'true'
    }

    cy.request('PUT', `/usuarios/${usuarioId}`, usuarioEditado)
      .then((response) => {

        expect(response.status).to.eq(200)
        expect(response.body.message)
          .to.eq('Registro alterado com sucesso')

        usuario.email = usuarioEditado.email
        usuario.password = usuarioEditado.password

        cy.log(JSON.stringify(response.body, null, 2))
      })
  })

  // ===============================
  // LOGIN
  // ===============================

  it('POST - Login com sucesso', () => {
    cy.request('POST', '/login', {
      email: usuario.email,
      password: usuario.password
    })
      .then((response) => {

        expect(response.status).to.eq(200)

        expect(response.body.message)
          .to.eq('Login realizado com sucesso')

        expect(response.body).to.have.property('authorization')

        token = response.body.authorization

        cy.log(JSON.stringify(response.body, null, 2))
      })
  })

  it('POST - Login inválido', () => {
    cy.request({
      method: 'POST',
      url: '/login',
      failOnStatusCode: false,
      body: {
        email: usuario.email,
        password: 'senhaErrada'
      }
    })
      .then((response) => {

        expect(response.status).to.eq(401)
        expect(response.body.message)
          .to.eq('Email e/ou senha inválidos')

        cy.log(JSON.stringify(response.body, null, 2))
      })
  })

  // ===============================
  // PRODUTOS
  // ===============================

  it('POST - Cadastrar produto', () => {
    cy.request({
      method: 'POST',
      url: '/produtos',
      headers: {
        Authorization: token
      },
      body: produto
    })
      .then((response) => {

        expect(response.status).to.eq(201)
        expect(response.body.message)
          .to.eq('Cadastro realizado com sucesso')

        produtoId = response.body._id

        cy.log(JSON.stringify(response.body, null, 2))
      })
  })

  it('GET - Listar produtos', () => {
    cy.request('GET', '/produtos')
      .then((response) => {

        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('quantidade')
        expect(response.body.produtos).to.be.an('array')

        cy.log(JSON.stringify(response.body, null, 2))
      })
  })

  it('GET - Buscar produto por ID', () => {
    cy.request('GET', `/produtos/${produtoId}`)
      .then((response) => {

        expect(response.status).to.eq(200)
        expect(response.body.nome).to.eq(produto.nome)

        cy.log(JSON.stringify(response.body, null, 2))
      })
  })

  it('PUT - Editar produto', () => {

    const produtoEditado = {
      nome: `${produto.nome} Editado`,
      preco: 200,
      descricao: 'Produto atualizado',
      quantidade: 20
    }

    cy.request({
      method: 'PUT',
      url: `/produtos/${produtoId}`,
      headers: {
        Authorization: token
      },
      body: produtoEditado
    })
      .then((response) => {

        expect(response.status).to.eq(200)
        expect(response.body.message)
          .to.eq('Registro alterado com sucesso')

        cy.log(JSON.stringify(response.body, null, 2))
      })
  })

  // ===============================
  // CARRINHO
  // ===============================

  it('POST - Criar carrinho', () => {
    cy.request({
      method: 'POST',
      url: '/carrinhos',
      headers: {
        Authorization: token
      },
      body: {
        produtos: [
          {
            idProduto: produtoId,
            quantidade: 1
          }
        ]
      }
    })
      .then((response) => {

        expect(response.status).to.eq(201)

        expect(response.body.message)
          .to.eq('Cadastro realizado com sucesso')

        carrinhoId = response.body._id

        cy.log(JSON.stringify(response.body, null, 2))
      })
  })

  it('GET - Buscar carrinho por ID', () => {
    cy.request('GET', `/carrinhos/${carrinhoId}`)
      .then((response) => {

        expect(response.status).to.eq(200)

        expect(response.body).to.have.property('produtos')
        expect(response.body).to.have.property('precoTotal')

        cy.log(JSON.stringify(response.body, null, 2))
      })
  })

  it('DELETE - Cancelar compra', () => {
    cy.request({
      method: 'DELETE',
      url: '/carrinhos/cancelar-compra',
      headers: {
        Authorization: token
      }
    })
      .then((response) => {

        expect(response.status).to.eq(200)

        cy.log(JSON.stringify(response.body, null, 2))
      })
  })

  // ===============================
  // LIMPEZA
  // ===============================

  it('DELETE - Excluir produto', () => {
    cy.request({
      method: 'DELETE',
      url: `/produtos/${produtoId}`,
      headers: {
        Authorization: token
      }
    })
      .then((response) => {

        expect(response.status).to.eq(200)

        cy.log(JSON.stringify(response.body, null, 2))
      })
  })

  it('DELETE - Excluir usuário', () => {
    cy.request('DELETE', `/usuarios/${usuarioId}`)
      .then((response) => {

        expect(response.status).to.eq(200)

        cy.log(JSON.stringify(response.body, null, 2))
      })
  })

})