const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
//const mongoose = require('mongodb');

// Conectar ao banco de dados MongoDB
mongoose.connect('mongodb://localhost:27017', 
{ useNewUrlParser: true, useUnifiedTopology: true });

// Criar a aplicação Express
const app = express();
const port = 16016;


// Verificar o estado da conexão
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erro de conexão com o MongoDB:'));
db.once('open', () => {
  console.log('Conexão com o MongoDB estabelecida.');
});

// Verificar automóveis reparados
db.autoRepair. repairs.count()

//verificar automóveis da marca "Cadillac" reparados
db.autoRepair. repairs.count({ "brand": "Cadillac" })

//verificar marcas de automóveis já apareceram na oficina
db.autoRepair. repairs.distinct("brand").sort()

//verificar distribuição por tipo de reparação
db.autoRepair. repairs.aggregate([
    { $group: { _id: "$repairType", count: { $sum: 1 } } }
  ])

  //Verificar distribuição do número de clientes por ano
  db.autoRepair. repairs.aggregate([
    { $group: { _id: { $year: "$date" }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ])

  
  // Configuração do MongoDB
  const mongoHost = 'localhost';
  const mongoPort = 27017;
  const mongoDatabase = 'autoRepair';
  const mongoCollection = 'repairs';
  
  // Middleware para o parsing do corpo das requisições
  app.use(bodyParser.json());
  
  // Função para conectar ao MongoDB
  async function connectToMongo() {
    const mongoURI = `mongodb://localhost:27017:16016`;
    const client = new MongoClient(mongoURI);
  
    try {
      await client.connect();
      const db = client.db(mongoDatabase);
      const collection = db.collection(mongoCollection);
      return collection;
    } catch (error) {
      console.error('Erro ao conectar ao MongoDB:', error);
      throw error;
    }
  }
  
  // Rota: GET /repairs
  app.get('/repairs', async (req, res) => {
    try {
      const collection = await connectToMongo();
      const repairs = await collection.find().toArray();
      res.json(repairs);
    } catch (error) {
      console.error('Erro ao buscar registros:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });
  
  // Rota: GET /repairs/:id
  app.get('/repairs/:id', getRepairs, (req, res) => {
    const id = req.repair.id;

    try {
      const collection = await repair.find();
      const repair = await collection.findOne({req_repair_id: repair_id });
  
      if (!repair) {
        return res.status(404).json({ error: 'Registro não encontrado' });
      }
  
      res.json(repair);
    } catch (error) {
      console.error('Erro ao buscar registro:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });
  
  // Rota: GET /repairs?ano=YYYY
  app.get('/repairs', async (req, res) => {
    const ano = req.query.ano;
  
    try {
      const collection = await connectToMongo();
      const repairs = await collection.find({ year: Number(ano) }).toArray();
      res.json(repairs);
    } catch (error) {
      console.error('Erro ao buscar registros:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });
  
  // Rota: GET /repairs?marca=VRUM
  app.get('/repairs', async (req, res) => {
    const marca = req.query.marca;
  
    try {
      const collection = await connectToMongo();
      const repairs = await collection.find({ brand: marca }).toArray();
      res.json(repairs);
    } catch (error) {
      console.error('Erro ao buscar registros:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });
  
  // Rota: GET /repairs/matrículas
  app.get('/repairs/matrículas', async (req, res) => {
    try {
      const collection = await connectToMongo();
      const matriculas = await collection.distinct('registration').sort().toArray();
      res.json(matriculas);
    } catch (error) {
      console.error('Erro ao buscar matrículas:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });
  
  // Rota: GET /repairs/interv
  app.get('/repairs/interv', async (req, res) => {
    try {
      const collection = await connectToMongo();
      const interventions = await collection.distinct('intervention').sort().toArray();
      res.json(interventions);
    } catch (error) {
      console.error('Erro ao buscar intervenções:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });
  
  // Rota: POST /repairs
  app.post('/repairs', async (req, res) => {
    const newRepair = req.body;
  
    try {
      const collection = await connectToMongo();
      const result = await collection.insertOne(newRepair);
      res.json(result.ops[0]);
    } catch (error) {
      console.error('Erro ao criar registro:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });
  
  // Rota: DELETE /repairs/:id
  app.delete('/repairs/:id', async (req, res) => {
    const id = req.params.id;
  
    try {
      const collection = await connectToMongo();
      const result = await collection.deleteOne({ _id: ObjectId(id) });
  
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Registro não encontrado' });
      }
  
      res.json({ message: 'Registro removido com sucesso' });
    } catch (error) {
      console.error('Erro ao remover registro:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });
  
  // Inicialização do servidor
  app.listen(16016, () => {
    console.log(`Servidor rodando na porta 16016`);
  });
    