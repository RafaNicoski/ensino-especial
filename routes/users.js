const express = require('express'); // Importa o framework Express para criar o servidor
const fs = require('fs'); // Importa o módulo para manipular arquivos
const path = require('path'); // Importa o módulo para manipular caminhos de arquivos
const router = express.Router(); // Cria um objeto de roteamento para definir rotas da API

const jsonFilePath = path.join(__dirname, '..', 'data', 'users.json'); // Define o caminho do arquivo JSON onde os cadastros estão armazenados

// Função para ler o JSON
const readJSONFile = () => {
    return JSON.parse(fs.readFileSync(jsonFilePath, 'utf8')); // Lê o arquivo JSON e converte seu conteúdo para um objeto JavaScript
};

// Função para salvar o JSON
const saveJSONFile = (data) => {
    fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2)); // Converte o objeto JavaScript para JSON e salva no arquivo
};

//API http://localhost:3000/api-docs
// Este comentário informa que a documentação da API gerada pelo Swagger pode ser acessada neste endereço.

/**
 * @swagger
 * components:
 *   schemas:
 *     Cadastro:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         level:
 *           type: integer
 *       example:
 *         id: "123"
 *         nome: "João Silva"
 *         level: user
 */

// Swagger documenta o esquema de um cadastro, definindo as propriedades e tipos dos campos de cada objeto "Cadastro".

/**
 * @swagger
 * /cadastros:
 *   get:
 *     summary: Retorna cadastros por id, nome, ou level
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: Filtrar por ID
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filtrar por nome
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *         description: Filtrar por level
 *     responses:
 *       200:
 *         description: Lista de cadastros filtrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cadastro'
 */

// Swagger define a documentação da rota GET, que permite filtrar cadastros por ID, nome, ou level.

// Rota GET para buscar por ID
//http://localhost:3000/cadastros/9RzLaADBGZRzCat16GCvD3WZN4FxZYc87ytajdkL ID
router.get('/:id', (req, res) => {
    const data = readJSONFile(); // Lê o arquivo JSON com os cadastros
    const { id } = req.params; // Obtém o ID da URL
    const user = data.find(u => u.id === id); // Busca o usuário com o ID fornecido
    user ? res.json(user) : res.status(404).send(`Usuário com ID ${id} não encontrado.`); // Retorna o usuário ou um erro 404
});

// Rota GET para buscar todos os usuários ou filtrar por nome, level ou id
//http://localhost:3000/cadastros/?name=nick NOME
//http://localhost:3000/cadastros/?level=admin LEVEL
router.get('/', (req, res) => {
    const data = readJSONFile(); // Lê o arquivo JSON com os cadastros
    const { name, level, id } = req.query; // Obtém os parâmetros da query string (id, nome ou level)
    let resultados = data; // Inicializa a lista de resultados com todos os usuários

    // Filtra pelo id, se fornecido
    if (id) {
        resultados = resultados.filter(u => u.id === id);
    } else {
        // Filtra por nome, se fornecido
        if (name) resultados = resultados.filter(u => u.name.toLowerCase().includes(name.toLowerCase()));
        // Filtra por level, se fornecido
        if (level) resultados = resultados.filter(u => u.level && u.level.toLowerCase() === level.toLowerCase());
    }

    // Retorna os resultados filtrados ou uma mensagem de erro 404 se nenhum usuário for encontrado
    resultados.length > 0 ? res.json(resultados) : res.status(404).send('Nenhum usuário encontrado com os filtros especificados.');
});

/**
 * @swagger
 * /cadastros:
 *   post:
 *     summary: Adicionar um novo usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               level:
 *                 type: string
 *     responses:
 *       201:
 *         description: Cadastro criado
 *       400:
 *         description: Erro na requisição
 */

// Swagger documenta a rota POST, usada para adicionar um novo usuário à lista de cadastros.

// Rota POST para adicionar um novo usuário
//http://localhost:3000/cadastros CRIAR UM NOVO CADASTRO DE USUARIO NO BODY
router.post('/', (req, res) => {
    const data = readJSONFile(); // Lê o arquivo JSON com os cadastros
    const novoUsuario = { ...req.body, id: (data.length + 1).toString() }; // Cria um novo usuário com os dados recebidos e gera um novo ID
    data.push(novoUsuario); // Adiciona o novo usuário à lista de cadastros
    saveJSONFile(data); // Salva a lista de cadastros atualizada no arquivo JSON
    res.status(201).json(novoUsuario); // Retorna o novo usuário com status 201 (criado)
});

/**
 * @swagger
 * /cadastros/{id}:
 *   put:
 *     summary: Atualiza um cadastro existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do cadastro a ser atualizado
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               level:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cadastro atualizado
 *       404:
 *         description: Cadastro não encontrado
 */

// Swagger documenta a rota PUT, usada para atualizar os dados de um cadastro existente.

// Rota PUT para atualizar um usuário
//http://localhost:3000/cadastros/6 ADICIONAR DADOS NO CADASTRO JÁ EXISTENTE
//COLOCAR OS NOVOS DADOS NO BODY
router.put('/:id', (req, res) => {
    const data = readJSONFile(); // Lê o arquivo JSON com os cadastros
    const { id } = req.params; // Obtém o ID do parâmetro da URL
    const index = data.findIndex(u => u.id === id); // Encontra o índice do usuário com o ID fornecido

    if (index !== -1) {
        const updatedUser = { ...data[index], ...req.body }; // Atualiza os dados do usuário com as novas informações
        data[index] = updatedUser; // Substitui o usuário antigo pelo atualizado
        saveJSONFile(data); // Salva a lista de cadastros atualizada no arquivo JSON
        res.json(updatedUser); // Retorna o usuário atualizado
    } else {
        res.status(404).send(`Usuário com ID ${id} não encontrado.`); // Retorna um erro 404 se o usuário não for encontrado
    }
});

/**
 * @swagger
 * /cadastros/{id}:
 *   delete:
 *     summary: Remove um cadastro existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do cadastro a ser removido
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Cadastro removido
 *       404:
 *         description: Cadastro não encontrado
 */

// Swagger documenta a rota DELETE, usada para remover um cadastro existente da lista.

// Rota DELETE para deletar um usuário
//http://localhost:3000/cadastros/6
router.delete('/:id', (req, res) => {
    const data = readJSONFile(); // Lê o arquivo JSON com os cadastros
    const { id } = req.params; // Obtém o ID do parâmetro da URL
    const index = data.findIndex(u => u.id === id); // Encontra o índice do usuário com o ID fornecido

    if (index !== -1) {
        data.splice(index, 1); // Remove o usuário da lista de cadastros
        saveJSONFile(data); // Salva a lista de cadastros atualizada no arquivo JSON
        res.status(204).send(); // Retorna status 204 (sem conteúdo) indicando que a remoção foi bem-sucedida
    } else {
        res.status(404).send(`Usuário com ID ${id} não encontrado.`); // Retorna um erro 404 se o usuário não for encontrado
    }
});

module.exports = router; // Exporta o roteador para ser usado em outros arquivos
