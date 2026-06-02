// ============================================================
// Classe: Drone
// Responsabilidade (RF05 — M2-RF01):
//   Representa uma aeronave da frota pública de TechCity.
//   Cada drone tem um ID, uma capacidade máxima de carga (kg)
//   e um status que muda conforme o ciclo de operação.
//
//   Ciclo de status possíveis:
//     "Disponível"  → pronto para receber uma entrega
//     "Em Operação" → atualmente transportando uma carga
//     "Manutenção"  → fora de serviço temporariamente
// ============================================================

class Drone {

  #id;
  #capacidadeCarga; // peso máximo que o drone aguenta (em kg)
  #status;

  // Todo drone começa como "Disponível" ao ser cadastrado
  constructor(id, capacidadeCarga) {
    this.#id              = id;
    this.#capacidadeCarga = capacidadeCarga;
    this.#status          = "Disponível";
  }

  // --- Getters ---

  getId()               { return this.#id; }
  getCapacidadeCarga()  { return this.#capacidadeCarga; }
  getStatus()           { return this.#status; }

  // --- Setter controlado: só o controlador muda o status ---
  // Isso garante que nenhum código externo mude o status
  // de forma acidental ou sem validação.
  setStatus(novoStatus) {
    this.#status = novoStatus;
  }

  toString() {
    return `Drone[${this.#id}] Capacidade: ${this.#capacidadeCarga}kg — Status: ${this.#status}`;
  }
}

module.exports = Drone;
