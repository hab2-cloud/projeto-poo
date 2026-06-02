// ============================================================
// Classe: Pedido
// Responsabilidade (RF06 — M2-RF02):
//   Representa uma solicitação de entrega feita à prefeitura.
//   Guarda o que precisa ser entregue, para onde, quanto pesa
//   e em qual etapa do processo está.
//
//   Ciclo de status possíveis:
//     "Pendente"  → aguardando um drone disponível
//     "Em Rota"   → drone já foi despachado com a carga
//     "Entregue"  → entrega concluída com sucesso
//     "Cancelado" → entrega foi abortada
// ============================================================

class Pedido {

  #id;
  #descricao; // descrição do que será entregue
  #destino;   // endereço ou nome do local de entrega
  #peso;      // peso da encomenda em kg
  #status;

  // Todo pedido começa como "Pendente" ao ser registrado
  constructor(id, descricao, destino, peso) {
    this.#id        = id;
    this.#descricao = descricao;
    this.#destino   = destino;
    this.#peso      = peso;
    this.#status    = "Pendente";
  }

  // --- Getters ---

  getId()         { return this.#id; }
  getDescricao()  { return this.#descricao; }
  getDestino()    { return this.#destino; }
  getPeso()       { return this.#peso; }
  getStatus()     { return this.#status; }

  // --- Setter controlado: status só muda via controlador ---
  setStatus(novoStatus) {
    this.#status = novoStatus;
  }

  toString() {
    return `Pedido[${this.#id}] "${this.#descricao}" → ${this.#destino} (${this.#peso}kg) — Status: ${this.#status}`;
  }
}

module.exports = Pedido;
