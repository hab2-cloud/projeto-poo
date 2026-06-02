// ============================================================
// Classe: Entrega
// Responsabilidade (RF07, RF08, RF10 — M2-RF03 e M2-RF04):
//   É a "classe de associação" do sistema: ela une um Drone
//   a um Pedido e representa a missão logística em si.
//   Sem ela, o drone e o pedido existem separados, sem vínculo.
//
//   Criada pelo controlador no momento em que um drone é
//   despachado para um pedido.
//
//   Ciclo de status possíveis:
//     "Iniciada"  → drone em voo com a carga
//     "Concluída" → entrega realizada com sucesso
//     "Cancelada" → missão abortada antes da conclusão
// ============================================================

class Entrega {

  #id;
  #drone;   // referência ao objeto Drone responsável
  #pedido;  // referência ao objeto Pedido transportado
  #status;

  // Ao ser criada, a entrega já nasce com status "Iniciada"
  constructor(id, drone, pedido) {
    this.#id     = id;
    this.#drone  = drone;
    this.#pedido = pedido;
    this.#status = "Iniciada";
  }

  // --- Getters ---

  getId()      { return this.#id; }
  getDrone()   { return this.#drone; }
  getPedido()  { return this.#pedido; }
  getStatus()  { return this.#status; }

  // --- Setter controlado ---
  setStatus(novoStatus) {
    this.#status = novoStatus;
  }

  toString() {
    return (
      `Entrega[${this.#id}] ` +
      `Drone: ${this.#drone.getId()} | ` +
      `Pedido: ${this.#pedido.getId()} — ` +
      `Status: ${this.#status}`
    );
  }
}

module.exports = Entrega;
