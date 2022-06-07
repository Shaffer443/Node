import { createServer, ServerResponse, IncomingMessage } from 'http';
import *  as queryString from 'query-string';
import * as url from 'url';
import * as fs from 'fs';
import { hostname } from 'os';


const port = 5000;
const server = createServer((request: IncomingMessage, response: ServerResponse)=>{
    //Implementar código:

        const urlparse = url.parse(request.url? request.url : '' , true);
        var confirmacao;
        //receber os parâmetros:

        const params = queryString.parse(urlparse.search ? urlparse.search : '');

            

                //Salvar informaçeos e atualizar:

                if(urlparse.pathname == '/criar-atualizar-usuario'){
                    fs.writeFile('user/'+ params.id +'txt', JSON.stringify(params), function(err){
                        if (err) throw err;
                        console.log('Saved!');

                        confirmacao = 'Cadastro ou alteracao concluído com sucesso.';

                        response.statusCode = 200;
                        response.setHeader('Content-Type', 'text/plain');
                        response.end(confirmacao);
                    })
                }

        //response.end('Servidor rodando.');
    
});


//EXecução:

server.listen(port,() =>{
    console.log(`Server runnig at http://${hostname}:${port}/`);
});
