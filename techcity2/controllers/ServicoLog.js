const Operacao = require("../classes/Operacao");
class ServicoLog {
  #operacoes = [];
  registrarLog(descricao, usuario) {
    const op = new Operacao(descricao, usuario); this.#operacoes.push(op);
  }
  exibirLogs() { this.#operacoes.forEach(op => console.log("   •", op.toString())); }
}
module.exports = ServicoLog;