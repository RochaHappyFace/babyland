// Requisitando os módulos
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

// Configurando o Express
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = 3000;

// Configurando o banco de dados
mongoose.connect('mongodb://127.0.0.1:27017/babyland', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Estamos conectados ao MongoDB!');
});

// Criando a model do projeto para Produtos
const produtoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  descricao: { type: String },
  fabricante: { type: String },
  preco: { type: Number },
  estoque: { type: Number },
});

const Produto = mongoose.model('Produto', produtoSchema);

// Criando a model do projeto para Usuários
const usuarioSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  senha: { type: String, required: true },
  email: { type: String },
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

// Configuração dos roteamentos
// Rota para cadastrar Produto
app.post('/cadastraproduto', async (req, res) => {
  const { nome, descricao, fabricante, preco, estoque } = req.body;

  // Criando uma nova instância do Produto com os dados recebidos
  const produto = new Produto({
    nome,
    descricao,
    fabricante,
    preco,
    estoque,
  });

  try {
    // Tenta salvar o novo produto no banco de dados
    await produto.save();
    // Se bem-sucedido, envia uma resposta de status 201 (Criado)
    res.status(201).json({ message: 'Produto cadastrado com sucesso!' });
  } catch (error) {
    // Se houver erro, envia uma resposta de erro
    res.status(500).json({ message: 'Erro ao cadastrar produto', error: error.message });
  }
});

// Rota para cadastrar Usuário
app.post('/cadastrousuario', async (req, res) => {
  const { nome, senha, email } = req.body;

  const usuario = new Usuario({
    nome,
    senha,
    email,
  });

  try {
    // Tenta salvar o novo usuário no banco de dados
    await usuario.save();
    // Se bem-sucedido, envia uma resposta de status 201 (Criado)
    res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
  } catch (error) {
    // Se houver erro, envia uma resposta de erro
    res.status(500).json({ message: 'Erro ao cadastrar usuário', error: error.message });
  }
});

// Iniciando o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});