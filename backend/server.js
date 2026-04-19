const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors()); // Permite que o HTML fale com o servidor sem bloqueios

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ BANCO CONECTADO"))
  .catch(err => console.error("❌ ERRO BANCO:", err));

const Produto = mongoose.model('Produto', {
  nome: String,
  preco: Number,
  quantidade: { type: Number, default: 0 }
});

// LISTAR
app.get('/api/produtos', async (req, res) => {
  try {
    const produtos = await Produto.find();
    res.json(produtos);
  } catch (err) {
    console.error("Erro ao listar:", err);
    res.status(500).json({ mensagem: "Erro ao listar produtos", erro: err.message });
  }
});

// CADASTRAR
app.post('/api/produtos', async (req, res) => {
  try {
    const novo = new Produto(req.body);
    await novo.save();
    res.json({ mensagem: "Sucesso" });
  } catch (err) {
    console.error("Erro ao salvar:", err);
    res.status(500).json({ mensagem: "Erro ao salvar produto", erro: err.message });
  }
});

// APAGAR
app.delete('/api/produtos/:id', async (req, res) => {
  try {
    const apagado = await Produto.findByIdAndDelete(req.params.id);
    if (!apagado) return res.status(404).json({ mensagem: "Produto não encontrado" });
    res.json({ mensagem: "Removido" });
  } catch (err) {
    console.error("Erro ao apagar:", err);
    res.status(500).json({ mensagem: "Erro ao apagar produto" });
  }
});

// ADICIONAR ESTOQUE
app.patch('/api/produtos/:id/adicionar', async (req, res) => {
  try {
    const { quantidadeAdicional } = req.body;
    const produto = await Produto.findById(req.params.id);
    if (!produto) return res.status(404).json({ mensagem: "Produto não encontrado" });
    produto.quantidade = (produto.quantidade || 0) + Number(quantidadeAdicional);
    await produto.save();
    res.json(produto);
  } catch (err) {
    console.error("Erro ao adicionar estoque:", err);
    res.status(500).json({ mensagem: "Erro ao adicionar estoque", erro: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Rodando na porta ${PORT}`));