//Incluindo uma biblioteca do http, trazendo a funcionalidade de servidor
const http = require('http');
const url = require('url'); //biblioteca de url
const queryString = require('query-string'); //biblioteca querystring

// qual o IP e Porta onde o código vai rodar. definição de endereço /url
const hostname = '127.0.0.1'; //pode-se digitar localhost
const port = 3000;

// Implementação da regra de nogocio, é a lógica de programação.
const server = http.createServer((req, res) => {
  //Pegar a pergunta na URL
  //console.log(req.url); //conferindo qual url está chegando.
  
  const params = queryString.parse(url.parse(req.url,true).search);
  console.log(params);

  //verificar a pergunta e escolher a respostas

  let teste;
  if(params.teste == 'funcionando'){
    teste = 'Tudo ok !';
    console.log('Tudo ok !');
  }else if(params.teste == 'linguagem'){
    console.log('Python');
    teste = 'Python';
  }else{
    console.log('Erro! ');
    teste = 'Erro';
  }

  //retornar a resposta escolhida


  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  //res.end('Hello World, Eu sou o Node.js e estou rodando em um servidor simulado! Divirta-se...');
  res.end(teste); //INforma no navegador,e  podemos passar a variável que queremos que apareça.
});

//Execução
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});