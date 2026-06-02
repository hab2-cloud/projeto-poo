// ============================================================
// Classe: Operacao
// Responsabilidade (RF03):
//   Representa um registro histórico imutável de auditoria.
//   Toda vez que algo importante acontece no sistema
//   (entrega iniciada, cancelada, concluída...), um objeto
//   Operacao é criado e guardado para rastreabilidade.
//
//   Uma Operacao sabe:
//     - o que aconteceu (descrição)
//     - quando aconteceu (data e hora automáticas)
//     - quem autorizou (referência ao objeto Usuario)
// ============================================================

class Operacao {

  #descricao;
  #dataHora;
  #usuario;

  // A data/hora é capturada automaticamente no momento
  // em que o objeto é criado — por isso não vem como parâmetro.
  constructor(descricao, usuario) {
    this.#descricao = descricao;
    this.#dataHora  = new Date();   // registra o momento exato
    this.#usuario   = usuario;
  }

  // --- Getters ---

  getDescricao() { return this.#descricao; }
  getUsuario()   { return this.#usuario; }

  // Retorna a data no formato ISO (ex: 2026-06-01T20:30:00.000Z)
  getDataHora()  { return this.#dataHora.toISOString(); }

  // Exibe o log de forma legível: [data] (nome) descrição
  toString() {
    return `[${this.getDataHora()}] (${this.#usuario.getNome()}) ${this.#descricao}`;
  }
}

module.exports = Operacao;
