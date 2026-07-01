const GerenciadorUsuarios = require('./GerenciadorUsuarios');
const GerenciadorDrones   = require('./GerenciadorDrones');
const GerenciadorPedidos  = require('./GerenciadorPedidos');
const GerenciadorEntregas = require('./GerenciadorEntregas');
const ServicoLog          = require('./ServicoLog');

class TechCityController {
  #gerenciadorUsuarios; 
  #gerenciadorDrones; 
  #gerenciadorPedidos; 
  #gerenciadorEntregas; 
  #servicoLog;

  constructor() {
    this.#gerenciadorUsuarios = new GerenciadorUsuarios();
    this.#gerenciadorDrones   = new GerenciadorDrones();
    this.#gerenciadorPedidos  = new GerenciadorPedidos();
    this.#gerenciadorEntregas = new GerenciadorEntregas();
    this.#servicoLog          = new ServicoLog();
  }

  cadastrarUsuario(id, nome) { return this.#gerenciadorUsuarios.cadastrarUsuario(id, nome); }
  desativarUsuario(id)       { this.#gerenciadorUsuarios.desativarUsuario(id); }
  cadastrarDrone(id, cap)    { return this.#gerenciadorDrones.cadastrarDrone(id, cap); }
  registrarPedido(d, dest, p){ return this.#gerenciadorPedidos.registrarPedido(d, dest, p); }
  listarDrones()             { console.log("\n  === FROTA DE DRONES ==="); this.#gerenciadorDrones.listarTodos(); }
  listarLogs()               { console.log("\n  === LOG DE AUDITORIA ==="); this.#servicoLog.exibirLogs(); }

  #gerarId(prefixo) { return `${prefixo}-${Date.now().toString().slice(-4)}-${Math.floor(Math.random() * 1000)}`; }

  iniciarEntrega(idDrone, idPedido, idOperador) {
    try {
      const operador = this.#gerenciadorUsuarios.validarOperador(idOperador);
      const drone    = this.#gerenciadorDrones.buscarDrone(idDrone);
      const pedido   = this.#gerenciadorPedidos.buscarPedido(idPedido);

      if (!drone || !pedido) return console.log("  ❌ Erro: Drone ou Pedido não encontrado.");
      if (drone.getStatus() === "Manutenção") return console.log(`  ❌ Erro: Drone ${idDrone} está em Manutenção.`);
      if (drone.getStatus() !== "Disponível") return console.log(`  ❌ Erro: Drone ${idDrone} não está disponível.`);
      if (pedido.getStatus() !== "Pendente") return console.log("  ❌ Erro: Pedido não está pendente.");
      if (pedido.getPeso() > drone.getCapacidadeCarga()) return console.log("  ❌ Erro: Carga excede o limite do drone.");
      if (drone.getBateria() < 25) return console.log(`  ❌ Erro: Bateria fraca (${drone.getBateria()}%). Necessária recarga.`);

      drone.setStatus("Em Operação");
      drone.consumirBateria(25);
      pedido.setStatus("Em Rota");

      const idEntrega = this.#gerarId("ENT");
      const entrega = this.#gerenciadorEntregas.criarEntrega(idEntrega, drone, pedido);

      this.#servicoLog.registrarLog(`Iniciou entrega ${idEntrega} no Drone ${idDrone}`, operador);
      console.log(`  ✔ Entrega ${idEntrega} iniciada com sucesso.`);
      return entrega;
    } catch (err) { console.log(`  ❌ ${err.message}`); }
  }

  concluirEntrega(idEntrega, idOperador) {
    try {
      const operador = this.#gerenciadorUsuarios.validarOperador(idOperador);
      const entrega  = this.#gerenciadorEntregas.buscarEntrega(idEntrega);
      if (!entrega) return;
      entrega.getDrone().setStatus("Disponível");
      entrega.getPedido().setStatus("Entregue");
      this.#servicoLog.registrarLog(`Concluiu entrega ${idEntrega}`, operador);
      console.log(`  ✔ Entrega ${idEntrega} concluída.`);
    } catch (err) { console.log(`  ❌ ${err.message}`); }
  }

  cancelarEntrega(idEntrega, idOperador) {
    try {
      const operador = this.#gerenciadorUsuarios.validarOperador(idOperador);
      const entrega  = this.#gerenciadorEntregas.buscarEntrega(idEntrega);
      if (!entrega) return;
      entrega.getDrone().setStatus("Disponível");
      entrega.getPedido().setStatus("Cancelado");
      this.#servicoLog.registrarLog(`Cancelou entrega ${idEntrega}`, operador);
      console.log(`  ✔ Entrega ${idEntrega} cancelada.`);
    } catch (err) { console.log(`  ❌ ${err.message}`); }
  }

  enviarDroneParaManutencao(idDrone, idOperador) {
    try {
      const op = this.#gerenciadorUsuarios.validarOperador(idOperador);
      const d = this.#gerenciadorDrones.buscarDrone(idDrone);
      if (d.getStatus() === "Em Operação") return console.log("  ❌ Erro: Drone em voo.");
      d.setStatus("Manutenção");
      this.#servicoLog.registrarLog(`Enviou drone ${idDrone} para manutenção`, op);
      console.log(`  ✔ Drone ${idDrone} em Manutenção.`);
    } catch (err) { console.log(`  ❌ ${err.message}`); }
  }

  retirarDroneDaManutencao(idDrone, idOperador) {
    try {
      const op = this.#gerenciadorUsuarios.validarOperador(idOperador);
      const d = this.#gerenciadorDrones.buscarDrone(idDrone);
      d.setStatus("Disponível");
      this.#servicoLog.registrarLog(`Liberou drone ${idDrone} da manutenção`, op);
      console.log(`  ✔ Drone ${idDrone} Disponível.`);
    } catch (err) { console.log(`  ❌ ${err.message}`); }
  }

  recarregarDrone(idDrone, idOperador) {
    try {
      const op = this.#gerenciadorUsuarios.validarOperador(idOperador);
      const d = this.#gerenciadorDrones.buscarDrone(idDrone);
      d.recarregar();
      this.#servicoLog.registrarLog(`Recarregou drone ${idDrone}`, op);
      console.log(`  ✔ Drone ${idDrone} recarregado (100%).`);
    } catch (err) { console.log(`  ❌ ${err.message}`); }
  }
}
module.exports = TechCityController;