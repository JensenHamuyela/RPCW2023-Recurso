const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 16017;

// Configuração do MongoDB
const mongoHost = 'localhost';
const mongoPort = 27017;
const mongoDatabase = 'autoRepair';
const mongoCollection = 'repairs';

// Função para conectar ao MongoDB
async function connectToMongo() {
  const mongoURI = `mongodb://localhost:27017:16017`;
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

// Rota: Página principal
app.get('/repairs', async (req, res) => {
  try {
    const collection = await connectToMongo();
    const repairs = await collection.find().toArray();
    res.send(createTableHTML(repairs));
  } catch (error) {
    console.error('Erro ao buscar registros:', error);
    res.status(500).send('Erro interno do servidor');
  }
});

// Função para criar a tabela HTML
function createTableHTML(repairs) {
  let tableHTML = `
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Reparação de Automóveis</title>
      </head>
      <body>
        <h1>Reparação de Automóveis</h1>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Data</th>
              <th>Nome</th>
              <th>Matrícula</th>
              <th>Marca</th>
              <th>Número de Intervenções</th>
            </tr>
          </thead>
          <tbody>
  `;

  repairs.forEach((repair) => {
    const { _id, date, name, registration, brand, interventions } = repair;
    const repairId = encodeURIComponent(_repair);

    tableHTML += `
      <tr>
        <td><a href="/repairs/${repairId}">${_id}</a></td>
        <td>${date}</td>
        <td>${name}</td>
        <td>${registration}</td>
        <td><a href="/brands/${encodeURIComponent(_repair)}">${(_repair)}</a></td>
        <td>${interventions.length}</td>
      </tr>
    `;
  });

  tableHTML += `
          </tbody>
        </table>
      </body>
    </html>
  `;

  return tableHTML;
}

// Inicialização do servidor
app.listen(16017, () => {
  console.log(`Servidor rodando na porta 16017`);
});


// Rota: Página da Marca
app.get('/repairs/brands/:marca', async (req, res) => {
    const marca = req.params.marca;
  
    try {
      const collection = await connectToMongo();
      const brandRepairs = await collection.find({ brand: marca }).toArray();
      const brandModels = [...new Set(brandRepairs.map(repair => repair.model))];
      res.send(createBrandPageHTML(marca, brandModels, brandRepairs));
    } catch (error) {
      console.error('Erro ao buscar registros da marca:', error);
      res.status(500).send('Erro interno do servidor');
    }
  });
  
  // Função para criar a página HTML da marca
  function createBrandPageHTML(marca, models, repairs) {
    let pageHTML = `
      <html>
        <head>
          <meta charset="UTF-8">
          <title>${marca}</title>
        </head>
        <body>
          <h1>${marca}</h1>
          <h2>Modelos Intervencionados</h2>
          <ul>
    `;
  
    models.forEach(model => {
      pageHTML += `
        <li>${model}</li>
      `;
    });
  
    pageHTML += `
          </ul>
          <h2>Registos da Marca</h2>
          ${createTableHTML(repairs)}
        </body>
      </html>
    `;
  
    return pageHTML;
  }
  