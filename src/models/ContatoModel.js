const mongoose = require('mongoose');
const validator = require('validator');
const { ConcatenationScope } = require('webpack');

const ContatoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  sobrenome: { type: String, required: false, default: '' },
  email: { type: String, required: false, default: '' },
  telefone: { type: Number, required: false, default: '' },
  criadoEm: { type: Date, default: Date.now },
});

const ContatoModel = mongoose.model('Contato', ContatoSchema);

function Contato (body) {
  this.body = body;
  this.errors = [];
  this.contato = null;
}

// Sempre que criamos uma função assincrona ela retorna uma promessa
Contato.prototype.register = async function() {
  this.valida();
  if(this.errors.length > 0) return;
  this.contato = await ContatoModel.create(this.body);
};

Contato.prototype.valida = function() {
  this.cleanUp();
  
  // Validação
  // O e-mail precisa ser validado
  // Se o e-mail for enviado eu valido ele, se não, não valido -> Avaliação de curto circuito
  if(this.body.email && !validator.isEmail(this.body.email)) this.errors.push('E-mail inválido');
  if(!this.body.nome) this.errors.push('Nome é um campo obrigatório');
  if(!this.body.email && !this.body.telefone) {
    this.errors.push('Pelo menos um contato precisa ser enviado: E-mail ou Telefone.');
  }
}

Contato.prototype.cleanUp = function() {
  for(const key in this.body) {
    if(typeof this.body[key] !== 'string'){
      this.body[key] = '';
    }
  }

  this.body = {
    nome: this.body.nome,
    sobrenome: this.body.sobrenome,
    email: this.body.email,
    telefone: this.body.telefone
  };
}

Contato.prototype.edit = async function(id){
  if(typeof id!== 'string') return;
  this.valida();
  if(this.errors.length > 0) return;
  this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, { new: true });
}

// Métodos estaticos -> Métodos que não acessam o prototype, this.. valida, errors
Contato.buscaPorID = async function(id) {
  if(typeof id !== 'string') return;
  const contato = await ContatoModel.findById(id);
  return contato;
};

Contato.buscaContatos = async function() {
  const contatos = await ContatoModel.find()
    .sort({ criadoEm: 1 }); // 1 para ordem crescente e -1 para ordem decrescente
  return contatos;
};

Contato.delete = async function(id) {
  if(typeof id !== 'string') return;
  const contato = await ContatoModel.findOneAndDelete(id)
  return contato;
};

module.exports = Contato;