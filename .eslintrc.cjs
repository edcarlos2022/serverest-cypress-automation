module.exports = {
  extends: [
    'plugin:cypress/recommended'
  ],
  env: {
    'cypress/globals': true
  },
  plugins: [
    'cypress'
  ],
  rules: {
    // Adicione regras personalizadas aqui se necessário
    // Exemplo: 'no-unused-vars': 'warn'
  }
};