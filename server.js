const express = require('express'); // Importa o framework Express para criar o servidor
const fs = require('fs'); // Importa o módulo File System para manipular arquivos
const path = require('path'); // Importa o módulo path para trabalhar com diretórios e caminhos de arquivos
const swaggerUi = require('swagger-ui-express'); // Importa o Swagger UI para gerar uma interface de documentação
const swaggerJsDoc = require('swagger-jsdoc'); // Importa o Swagger JSDoc para gerar a documentação Swagger a partir dos comentários no código

const app = express(); // Cria uma instância do aplicativo Express, que é o servidor
const port = 3000; // Define a porta em que o servidor irá escutar, neste caso, 3000

// Middleware que analisa o corpo das requisições como JSON
app.use(express.json()); // Faz com que o servidor consiga interpretar requisições cujo corpo está em formato JSON

// Serve arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public'))); // Serve arquivos estáticos (como HTML, CSS, JS) da pasta 'public'

// Define o caminho do arquivo JSON onde os cadastros dos usuários estão armazenados
const jsonFilePath = path.join(__dirname, 'data', 'users.json'); 

// Configurações do Swagger, que define os detalhes da documentação da API
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0', // Define a versão do OpenAPI
    info: {
      title: 'API de Usuários', // Título da API
      version: '1.0.0', // Versão da API
      description: 'API para gerenciar usuários', // Descrição da API
    },
    servers: [
      {
        url: 'http://localhost:3000', // Define o servidor local onde a API está rodando
      },
    ],
  },
  apis: ['./routes/*.js'], // Caminho para os arquivos de rota com a documentação Swagger (usando JSDoc)
};

// Gera a documentação Swagger a partir das opções definidas acima e dos comentários no código
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs)); // Serve a interface de documentação do Swagger na rota /api-docs

// Importa as rotas de usuários
const cadastrosRoute = require('./routes/users'); // Importa o módulo 'users.js' que contém as rotas para gerenciar os usuários
app.use('/cadastros', cadastrosRoute); // Define a rota base '/cadastros' para acessar as funcionalidades da API relacionadas a cadastros

// Inicia o servidor, escutando na porta definida
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`); // Exibe uma mensagem no console indicando que o servidor está em execução
});
