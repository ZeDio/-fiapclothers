const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
const port = 3000;

mongoose.connect('mongodb://127.0.0.1:27017/fiapclothers',
{   useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS : 20000
});

const usuarioSchema = new mongoose.Schema({
    nome : {type : String},
    email : {type : String, Required : true},
    senha : {type : String}
});
const Usuario = mongoose.model("Usuario", usuarioSchema);

//criando a segunda model
const produtoSchema = new mongoose.Schema({
    codigo : {type : String, Required : true},
    descricao : {type : String},
    fornecedor : {type : String},
    dataFabricacao : {type : Date},
    quantidadeEstoque : {type : Number}
});
const Produto = mongoose.model("Produto", produtoSchema);

app.post("/cadastrousuario", async(req, res)=>{
    const nome = req.body.name;
    const email = req.body.email;
    const senha = req.body.senha;

    if(nome == null || email == null || senha == null){
        return res.status(400).json({error: "Preencha todos os dados.."})
    }
    const emailExistente = await Usuario.findOne({email:email})
    if(emailExistente){
        return res.status(400).json({error : "O e-mail cadastrado já existe!!"})
    }

    //mandando para banco
    const usuario = new Usuario({
        nome : nome,
        email : email,
        senha : senha,
    })

    try{
        const newUsuario = await usuario.save();
        res.json({error : null, msg : "Cadastro ok", usuarioId : newUsuario._id});
    } catch(error){
        res.status(400).json({error});
    }
});

app.post("/cadastroproduto", async(req, res)=>{
    const codigo = req.body.codigo;
    const descricao = req.body.descricao;
    const fornecedor = req.body.fornecedor;
    const dataFabricacao = req.body.dataFabricacao;
    const quantidadeEstoque = req.body.quantidadeEstoque

    if(quantidadeEstoque <= 0 || quantidadeEstoque > 21){
        return res.status(400).json({error: "Estoque so é posivel de 0 até 21.."})
    }

    //mandando para banco
    const produto = new Produto({
        codigo : codigo,
        descricao : descricao,
        fornecedor : fornecedor,
        dataFabricacao : dataFabricacao,
        quantidadeEstoque : quantidadeEstoque
    })

    try{
        const newProduto = await produto.save();
        res.json({error : null, msg : "Cadastro ok", produtoId : newProduto._id});
    } catch(error){
        res.status(400).json({error});
    }
});

app.get("/cadastrousuario", async(req, res)=>{
    res.sendFile(__dirname +"/cadastrousuario.html");
})

app.get("/cadastroproduto", async(req, res)=>{
    res.sendFile(__dirname +"/cadastroproduto.html");
})

app.get("/", async(req, res)=>{
    res.sendFile(__dirname +"/index.html");
})

app.listen(port, ()=>{
    console.log(`Servidor rodando na porta ${port}`);
})