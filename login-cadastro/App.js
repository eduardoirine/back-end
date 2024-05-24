const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');


const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password: '',
    database: 'Login'
});

db.connect((error)=>{
    if(error){
        console.log('Erro ao conectar com o MySQL', error);
    }else{
        console.log('Conectado ao MySQL')
    }
});

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended:true}))

app.get("/", (req, res)=>{
    res.sendFile(__dirname + '/login.html')
})

app.get("/cadastro", (req, res)=>{
  res.sendFile(__dirname + '/cadastro.html')
})

app.post("/login", (req, res)=>{
    const username = req.body.username;
    const password = req.body.password;

    db.query('SELECT password FROM user WHERE username = ?', [username], (error, results)=>{
      if(error){
        console.error("Erro ao executar QUERY", error);
        res.redirect('/erroquery');
      } else if(results.length>0){
        const passwordBD = results[0].password;
        if(password === passwordBD){
          console.log('Bem vindo')
          res.redirect('/bemVindo.html')
        }else {
          console.log('Senha Incorreta')
          res.redirect('/senhaerrada.html')
        }
      } else {
        ('Usuario não existe')
      }
});
});

app.post("/cadastro", (req, res)=>{
  const username = req.body.username
  const password = req.body.password
  const confirm = req.body.passwordComfirm

  if (password === confirm){
    db.query('insert into user (username, password) values (?, ?)', [username, password], (error, results) => {
      if(error){
        console.log("Erro ao realizar o cadastro")
      }else{
        console.log("Cadastro realizado com sucesso")
      }
    });
  } else{
    console.log('Senhas não coincidem')
  }

})

app.listen(port, ()=>{
    console.log(`Servidor rodando no endereço: http://localhost:${port}`)
})