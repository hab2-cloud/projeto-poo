// ============================================================
// Classe: Drone 
// ============================================================
class Drone {
  #id;
  #capacidadeCarga; 
  #status;
  #bateria; // NOVO: Controle de energia (0 a 100)

  constructor(id, capacidadeCarga) {
    this.#id              = id;
    this.#capacidadeCarga = capacidadeCarga;
    this.#status          = "Disponível";
    this.#bateria         = 100; // Começa sempre com 100%
  }

  getId()               { return this.#id; }
  getCapacidadeCarga()  { return this.#capacidadeCarga; }
  getStatus()           { return this.#status; }
  getBateria()          { return this.#bateria; }

  setStatus(novoStatus) { this.#status = novoStatus; }
  
  // NOVOS MÉTODOS (RF12)
  consumirBateria(qtd)  { this.#bateria = Math.max(0, this.#bateria - qtd); }
  recarregar()          { this.#bateria = 100; }

  toString() {
    return `Drone[${this.#id}] Capacidade: ${this.#capacidadeCarga}kg — Status: ${this.#status} — Bateria: ${this.#bateria}%`;
  }
}
module.exports = Drone;