const Pedido = require("../classes/Pedido");
class GerenciadorPedidos {
  #pedidos = [];
  registrarPedido(descricao, destino, peso) {
    // Gerar ID simples para o pedido
    const id = `PED-${Date.now().toString().slice(-4)}-${Math.floor(Math.random() * 1000)}`;
    const novo = new Pedido(id, descricao, destino, peso);
    this.#pedidos.push(novo);
    return novo;
  }
  buscarPedido(id) { return this.#pedidos.find(p => p.getId() === id); }
}
module.exports = GerenciadorPedidos;