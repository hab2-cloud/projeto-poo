const Drone = require("../classes/Drone");
class GerenciadorDrones {
  #drones = [];
  cadastrarDrone(id, capacidadeCarga) {
    const novo = new Drone(id, capacidadeCarga); this.#drones.push(novo); return novo;
  }
  buscarDrone(id) { return this.#drones.find(d => d.getId() === id); }
  listarTodos() { this.#drones.forEach(d => console.log("   •", d.toString())); }
}
module.exports = GerenciadorDrones;