const express = require('express');
const { engine } = require('express-handlebars'); // Corrigido para importar 'engine'
const path = require('path');
const db = require('./db/connection');
const bodyParser = require('body-parser');
const Job = require('./models/Job');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const app = express();
const PORT = 3000;

// Configuração do motor de visualização
app.engine('handlebars', engine({ defaultLayout: 'main' })); // Use engine() aqui
app.set('view engine', 'handlebars');

// Configuração do diretório de views
app.set('views', path.join(__dirname, 'views'));

// Configuração do body-parser
app.use(bodyParser.urlencoded({ extended: false }));

// Configuração da pasta de arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Conexão com o banco de dados
db.authenticate()
  .then(() => {
    console.log("Conexão com sucesso");
  })
  .catch(err => {
    console.log("Falha na conexão", err);
  });

// Rotas
app.get('/', async (req, res) => {

  let search = req.query.job;
  let query =  '%'+search+'%'; 

  if(!search) {
    try { 
      const jobs = await Job.findAll();
      res.render('index', {jobs});
    } catch (err) {
      console.error('Erro ao buscar empregos:', err);
      res.status(500).send('Erro interno do servidor');
    }
  } else{
    try { 
      const jobs = await Job.findAll({
        where: {title: {[Op.like]: query}}
      }); 
      console.log('Jobs:', JSON.stringify(jobs,null,2));
      res.render('index', {jobs});
    } catch (err) {
      console.error('Erro ao buscar empregos:', err);
      res.status(500).send('Erro interno do servidor');
    }
  }
  
});

// Rotas de jobs
app.use('/jobs', require('./routes/jobs'));

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Express funcionando na porta ${PORT}`);
});