// ============================================================
// Classe: Usuario
// Responsabilidade (RF01 e RF02):
//   Representa um operador humano da prefeitura de TechCity.
//   Cada operador tem um ID único, um nome e um estado que
//   indica se ele está ativo ou inativo no sistema.
//   Operadores inativos não podem autorizar nenhuma operação.
// ============================================================

class Usuario {

  // Os atributos com # são privados — só podem ser lidos ou
  // alterados pelos métodos desta própria classe (encapsulamento).
  #id;
  #nome;
  #ativo;

  // O construtor é chamado quando criamos um novo usuário.
  // Todo usuário começa ativo por padrão.
  constructor(id, nome) {
    this.#id   = id;
    this.#nome = nome;
    this.#ativo = true; // começa ativo automaticamente
  }

  // --- Getters: permitem ler os dados sem expô-los diretamente ---

  getId()    { return this.#id; }
  getNome()  { return this.#nome; }
  isAtivo()  { return this.#ativo; }

  // --- Métodos de negócio: alteram o estado do usuário ---

  // Reativa um operador que estava inativo
  ativar() {
    this.#ativo = true;
  }

  // Desativa um operador (ele perde acesso às operações)
  desativar() {
    this.#ativo = false;
  }

  // Retorna uma descrição legível do usuário (útil para logs e prints)
  toString() {
    const estado = this.#ativo ? "Ativo" : "Inativo";
    return `Usuario[${this.#id}] ${this.#nome} — ${estado}`;
  }
}

module.exports = Usuario;
