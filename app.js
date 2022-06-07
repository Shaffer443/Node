//Incluindo uma biblioteca do http, trazendo a funcionalidade de servidor
const http = require('http');
const url = require('url');
const queryString = require('query-string');
const fs = require('fs');


// qual o IP e Porta onde o código vai rodar. definição de endereço /url
const hostname = '127.0.0.1'; //pode-se digitar localhost
const port = 3000;

// Implementação da regra de nogocio, é a lógica de programação.
const server = http.createServer((req, res) => {
  var confirmacao;
  const urlparse = url.parse(req.url, true);
  const params = queryString.parse(urlparse.search);
  //Pegar a pergunta na URL
  //console.log(req.url); //conferindo qual url está chegando.
  
  //Criar um usuário
      //Receber informações do usuário: //Atualizar um Usuário:
      if(urlparse.pathname == '/criar-usuario'){      
      //console.log(params);
      //Salvar informações em um arquivo:
      fs.writeFile('users/'+params.id+'.txt', JSON.stringify(params), function (err) {
        if (err) throw err;
        console.log('Saved!');

        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        console.log('Servidor Funcionando...')
        res.end(confirmacao); //INforma no navegador,e  podemos passar a variável que queremos que apareça.
      });
      
      confirmacao = 'Dados do usuario registrados com sucesso!';
    
    }else if(urlparse.pathname == '/selecionar-usuario'){
         //Selecionar Usuário
        fs.readFile('users/'+params.id+'.txt', function(err, data) {
          
          //console.log(data);
          
          confirmacao = err ? "Dados Não encontrados ou inexistentes" : data;

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          console.log('Servidor Funcionando...')
          res.end(confirmacao); //INforma no navegador,e  podemos passar a variável que queremos que apareça.
       
        }); 
    
        //Remover usuário
    }else if(urlparse.pathname == '/remover-usuario'){
      
      fs.unlink('users/'+params.id+'.txt', function (err) {
        
        confirmacao = err ? 'Usuário não encontrado': 'Usuario removido'; //if ternário
        console.log('File deleted!');


        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        console.log('Servidor Funcionando...')
        res.end(confirmacao); //IN
        
        
      });
    
    }
  
 
  




  /*  
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  //res.end('Hello World, Eu sou o Node.js e estou rodando em um servidor simulado! Divirta-se...');
  console.log('Servidor Funcionando...')
  res.end(confirmacao); //INforma no navegador,e  podemos passar a variável que queremos que apareça.
  */

});

//Execução
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});