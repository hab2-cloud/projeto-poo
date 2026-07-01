const Entrega = require("../classes/Entrega");
class GerenciadorEntregas {
  #entregas = [];
  criarEntrega(id, drone, pedido) {
    const nova = new Entrega(id, drone, pedido); this.#entregas.push(nova); return nova;
  }
  buscarEntrega(id) { return this.#entregas.find(e => e.getId() === id); }
}
module.exports = GerenciadorEntregas;
