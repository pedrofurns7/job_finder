const express = require('express');
const app = express();
const db = require('./db/connection');
const bodyParser = require('body-parser');

const PORT=3000;

app.listen(PORT, function(){
    console.log(`Express funcionando na portal ${PORT}`);
});

//body parser
app.use(bodyParser.urlencoded({extended: false}));

//connection
db
    .authenticate()
    .then(() => {
        console.log("connect with success")
    })
    .catch(err =>{
        console.log("connection was failed", err);
    }); 

//routes
app.get('/', (req, res) =>{
    res.send("Funcionando!");
});

//jobs routes
app.use('/jobs', require('./routes/jobs'));