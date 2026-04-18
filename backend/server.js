const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Libera a comunicação
app.use(cors());
// Permite entender JSON
app.use(express.json());

// 1. Conexão com o Banco de Dados
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado ao banco de dados da Pri Massas!'))
  .catch((err) => console.error('❌ Erro ao conectar ao banco:', err));

// 2. Molde do Produto
const ProdutoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  preco: { type: Number, required: true }
});

const Produto = mongoose.model('Produto', ProdutoSchema);

// 3. Rotas de Comunicação
app.get('/api/produtos', async (req, res) => {
  try {
    const produtos = await Produto.find();
    res.json(produtos);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao buscar os produtos.' });
  }
});

app.post('/api/produtos', async (req, res) => {
  try {
    const novoProduto = new Produto({
      nome: req.body.nome,
      preco: req.body.preco
    });
    await novoProduto.save(); 
    res.status(201).json(novoProduto);
  } catch (erro) {
    res.status(500).json({ erro: 'Falha ao salvar no banco de dados.' });
  }
});

// 4. Ligar o Motor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor da Pri Massas rodando na porta ${PORT}`);
});