"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const queryString = __importStar(require("query-string"));
const url = __importStar(require("url"));
const fs = __importStar(require("fs"));
const os_1 = require("os");
const port = 5000;
const server = (0, http_1.createServer)((request, response) => {
    //Implementar código:
    const urlparse = url.parse(request.url ? request.url : '', true);
    var confirmacao;
    //receber os parâmetros:
    const params = queryString.parse(urlparse.search ? urlparse.search : '');
    //Salvar informaçeos e atualizar:
    if (urlparse.pathname == '/criar-atualizar-usuario') {
        fs.writeFile('user/' + params.id + 'txt', JSON.stringify(params), function (err) {
            if (err)
                throw err;
            console.log('Saved!');
            confirmacao = 'Cadastro ou alteracao concluído com sucesso.';
            response.statusCode = 200;
            response.setHeader('Content-Type', 'text/plain');
            response.end(confirmacao);
        });
    }
    //response.end('Servidor rodando.');
});
//EXecução:
server.listen(port, () => {
    console.log(`Server runnig at http://${os_1.hostname}:${port}/`);
});
