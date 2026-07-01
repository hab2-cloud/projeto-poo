const Usuario = require("../classes/Usuario");
class GerenciadorUsuarios {
  #usuarios = [];
  cadastrarUsuario(id, nome) {
    const novo = new Usuario(id, nome); this.#usuarios.push(novo); return novo;
  }
  ativarUsuario(id) { const u = this.buscarUsuario(id); if (u) u.ativar(); }
  desativarUsuario(id) { const u = this.buscarUsuario(id); if (u) u.desativar(); }
  buscarUsuario(id) { return this.#usuarios.find(u => u.getId() === id); }
  validarOperador(idOperador) {
    const u = this.buscarUsuario(idOperador);
    if (!u) throw new Error("Acesso Negado: Usuário não cadastrado.");
    if (!u.isAtivo()) throw new Error("Acesso Negado: Operador inativo.");
    return u;
  }
}
module.exports = GerenciadorUsuarios;