const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = 3000;

const db = mysql.createConnection({
    host:'localhost',
    user: 'root',
    password:'',
    database: 'login'
});

db.connect((error)=>{
    if (error){
        console.log("Erro ao conectar com o banco de dados")
    } else {
        console.log("Conectado ao MySQL")
    }
});

app.use(bodyParser.urlencoded({extended:true}))

app.get("/", (req, res)=>{
    res.sendFile(__dirname + '/login.html')
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    db.query('SELECT password FROM user WHERE username = ?', [username], (error, results) => {
      if(error){
        res.status(500).send('Erro ao obter usuários')
      } else {
        if(results.length > 0){ // Verifica se há resultados
          const user = results[0]; // Obtém o primeiro resultado
          if(user.password === password){
             res.send(`Login bem-sucedido! Bem-vindo, ${username}.`);
          } else {
            res.status(401).send('Senha incorreta. Tente novamente.');
          }
        } else {
          res.status(401).send('Este usuário não existe');
        }
      }
    })
  });


app.listen(port, ()=>{
    console.log(`Servidor rodando no endereço: http://localhost:${port}`)
});