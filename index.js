//obtendo o Express
const express = require('express')
var app = express ()

//definimos a rota pública do frontend

app.use(express.static('public'))

//iremos ouvir o servidor na porta especificada
app.listen(3002, function(){
    console.log('Servidor WEB do Front end rodando na porta 3001')
})