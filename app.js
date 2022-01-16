const http = require('http');
const queryString = require('query-string')
const url = require('url');
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 3080;

const server = http.createServer(function (req, res) {

    var resposta;
    const urlParse = url.parse(req.url, true)

    // Receber informacoes do usuario
    const params = queryString.parse(urlParse.search);

    // Criar um usuario - Atualizar um usuario
    if(urlParse.pathname == '/criar-usuario'){
        
        // Salvar as informacoes
        fs.writeFile('users/'+params.id+'.txt',JSON.stringify(params), function (err){
            if(err) throw err;
            console.log('Saved!');
        });

        resposta = 'Usuario Criado com Sucesso!'
        
        res.statusCode = 200;
        res.setHeader('content-type', 'text/plain');
        res.end(resposta);
    }

    // Selecionar o usuario
    else if(urlParse.pathname == '/selecionar-usuario'){
        fs.readFile('users/'+params.id+'.txt',function(err, data){
            resposta = data;
            res.statusCode = 201;
            res.setHeader('content-type', 'application/json');
            res.end(resposta);
        })
    }

    // Remover o usuario
    else if(urlParse.pathname == '/remover-usuario'){
        fs.unlink('users/'+params.id+'.txt',function(err){
            console.log('File deleted!');

            resposta = err ? "Usuario nao encontradoi" : "Usuario removido.";

            res.statusCode = 204;
            res.setHeader('content-type', 'tex/plain');
            res.end(resposta);
        })
    }

    // Consultar uma tabela do banco de dados para
    else if(urlParse.pathname == '/consultar-banco'){
        var mysql = require('mysql');

        var con = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "152535",
            database: "livraria",
            insecureAuth : true,
            port: 3306
        });

        con.connect(function(err) {
            if (err) throw err;
            con.query("SELECT * FROM tb_products", function (err, result, fields) {
                if (err) throw err;
                res.statusCode = 200;
                res.setHeader('content-type', 'application/json');
                res.end(JSON.stringify(result));
            });
        });
    }

})

server.listen(port, hostname, ()=>{
    console.log('Server is Run');
})