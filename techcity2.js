// ============================================================================
// TECHCITY CONTROL — Módulo 2: Sistema de Entregas com Drones
// Arquivo Único Consolidado — Entrega 2 (Gerenciadores, Bateria e Oficina)
//
// Autores: HIAGO ALVES BARBOZA, FABIO JOSE DOS SANTOS FILHO, GUILHERME WILLIAM
// Para executar no terminal: node techcity2.js
// ============================================================================

// ============================================================================
// ENGENHARIA DE ENTIDADES (CLASSES BASE)
// ============================================================================

class Usuario {
  #id;
  #nome;
  #ativo;

  constructor(id, nome) {
    this.#id = id;
    this.#nome = nome;
    this.#ativo = true;
  }

  getId() { return this.#id; }
  getNome() { return this.#nome; }
  isAtivo() { return this.#ativo; }

  ativar() { this.#ativo = true; }
  desativar() { this.#ativo = false; }

  toString() {
    return `Operador[${this.#id}] ${this.#nome} (${this.#ativo ? "ATIVO" : "INATIVO"})`;
  }
}

class Drone {
  #id;
  #capacidadeCarga;
  #status;
  #bateria;

  constructor(id, capacidadeCarga) {
    this.#id = id;
    this.#capacidadeCarga = capacidadeCarga;
    this.#status = "Disponível";
    this.#bateria = 100; // Sistema inicia com carga cheia (RF12)
  }

  getId() { return this.#id; }
  getCapacidadeCarga() { return this.#capacidadeCarga; }
  getStatus() { return this.#status; }
  getBateria() { return this.#bateria; }

  setStatus(novoStatus) { this.#status = novoStatus; }

  consumirBateria(qtd) {
    this.#bateria = Math.max(0, this.#bateria - qtd);
  }

  recarregar() {
    this.#bateria = 100; // Abastecimento completo (RF14)
  }

  toString() {
    return `Drone[${this.#id}] Carga Máx: ${this.#capacidadeCarga}kg | Bateria: ${this.#bateria}% | Status: ${this.#status}`;
  }
}

class Pedido {
  #id;
  #descricao;
  #destino;
  #peso;
  #status;

  constructor(id, descricao, destino, peso) {
    this.#id = id;
    this.#descricao = descricao;
    this.#destino = destino;
    this.#peso = peso;
    this.#status = "Pendente";
  }

  getId() { return this.#id; }
  getDescricao() { return this.#descricao; }
  getDestino() { return this.#destino; }
  getPeso() { return this.#peso; }
  getStatus() { return this.#status; }

  setStatus(novoStatus) { this.#status = novoStatus; }

  toString() {
    return `Pedido[${this.#id}] '${this.#descricao}' -> Destino: ${this.#destino} (${this.#peso}kg) | Status: ${this.#status}`;
  }
}

class Entrega {
  #id;
  #drone;
  #pedido;
  #status;

  constructor(id, drone, pedido) {
    this.#id = id;
    this.#drone = drone;
    this.#pedido = pedido;
    this.#status = "Iniciada";
  }

  getId() { return this.#id; }
  getDrone() { return this.#drone; }
  getPedido() { return this.#pedido; }
  getStatus() { return this.#status; }

  setStatus(novoStatus) { this.#status = novoStatus; }

  toString() {
    return `Entrega[${this.#id}] Drone: ${this.#drone.getId()} -> Pedido: ${this.#pedido.getId()} [${this.#status}]`;
  }
}

class Operacao {
  #descricao;
  #dataHora;
  #usuario;

  constructor(descricao, usuario) {
    this.#descricao = descricao;
    this.#dataHora = new Date();
    this.#usuario = usuario;
  }

  getDescricao() { return this.#descricao; }
  getUsuario() { return this.#usuario; }
  getDataHora() { return this.#dataHora.toISOString(); }

  toString() {
    return `[${this.getDataHora()}] (Resp: ${this.#usuario.getNome()}) ${this.#descricao}`;
  }
}

// ============================================================================
// ARQUITETURA DE SUBGERENCIADORES DE DOMÍNIO
// ============================================================================

class GerenciadorUsuarios {
  #usuarios = [];

  cadastrarUsuario(id, nome) {
    const novo = new Usuario(id, nome);
    this.#usuarios.push(novo);
    return novo;
  }

  desativarUsuario(id) {
    const usuario = this.buscarUsuario(id);
    if (usuario) usuario.desativar();
  }

  ativarUsuario(id) {
    const usuario = this.buscarUsuario(id);
    if (usuario) usuario.ativar();
  }

  buscarUsuario(id) {
    return this.#usuarios.find(u => u.getId() === id) || null;
  }

  validarOperador(idOperador) {
    const op = this.buscarUsuario(idOperador);
    if (!op) throw new Error(`Operador com ID ${idOperador} não cadastrado.`);
    if (!op.isAtivo()) throw new Error(`Operação Negada: O Operador ${op.getNome()} está INATIVO.`);
    return op;
  }
}

class GerenciadorDrones {
  #drones = [];

  cadastrarDrone(id, capacidadeCarga) {
    const novo = new Drone(id, capacidadeCarga);
    this.#drones.push(novo);
    return novo;
  }

  buscarDrone(id) {
    return this.#drones.find(d => d.getId() === id) || null;
  }

  listarTodos() {
    return [...this.#drones];
  }
}

class GerenciadorPedidos {
  #pedidos = [];

  registrarPedido(id, descricao, destino, peso) {
    const novo = new Pedido(id, descricao, destino, peso);
    this.#pedidos.push(novo);
    return novo;
  }

  buscarPedido(id) {
    return this.#pedidos.find(p => p.getId() === id) || null;
  }

  listarTodos() {
    return [...this.#pedidos];
  }
}

class GerenciadorEntregas {
  #entregas = [];

  criarEntrega(id, drone, pedido) {
    const nova = new Entrega(id, drone, pedido);
    this.#entregas.push(nova);
    return nova;
  }

  buscarEntrega(id) {
    return this.#entregas.find(e => e.getId() === id) || null;
  }

  listarTodos() {
    return [...this.#entregas];
  }
}

class ServicoLog {
  #operacoes = [];

  registrarLog(descricao, usuario) {
    const log = new Operacao(descricao, usuario);
    this.#operacoes.push(log);
  }

  exibirLogs() {
    if (this.#operacoes.length === 0) {
      console.log("   Nenhum registro encontrado.");
      return;
    }
    this.#operacoes.forEach(log => console.log("   •", log.toString()));
  }
}

// ============================================================================
// CONTROLADOR CENTRAL (FACADE / FACHADA)
// ============================================================================

class TechCityController {
  #gerenciadorUsuarios;
  #gerenciadorDrones;
  #gerenciadorPedidos;
  #gerenciadorEntregas;
  #servicoLog;
  #contadorEntregas = 0;

  constructor() {
    this.#gerenciadorUsuarios = new GerenciadorUsuarios();
    this.#gerenciadorDrones = new GerenciadorDrones();
    this.#gerenciadorPedidos = new GerenciadorPedidos();
    this.#gerenciadorEntregas = new GerenciadorEntregas();
    this.#servicoLog = new ServicoLog();
  }

  cadastrarUsuario(id, nome) { return this.#gerenciadorUsuarios.cadastrarUsuario(id, nome); }
  desativarUsuario(id) { this.#gerenciadorUsuarios.desativarUsuario(id); }
  ativarUsuario(id) { this.#gerenciadorUsuarios.ativarUsuario(id); }
  cadastrarDrone(id, cap) { return this.#gerenciadorDrones.cadastrarDrone(id, cap); }
  registrarPedido(id, desc, dest, peso) { return this.#gerenciadorPedidos.registrarPedido(id, desc, dest, peso); }

  iniciarEntrega(idDrone, idPedido, idOperador) {
    try {
      const operador = this.#gerenciadorUsuarios.validarOperador(idOperador);
      const drone = this.#gerenciadorDrones.buscarDrone(idDrone);
      const pedido = this.#gerenciadorPedidos.buscarPedido(idPedido);

      if (!drone) throw new Error(`Drone ${idDrone} inexistente.`);
      if (!pedido) throw new Error(`Pedido ${idPedido} inexistente.`);

      // Regra Avançada: Validação de Estado de Manutenção (RF15)
      if (drone.getStatus() === "Manutenção") {
        throw new Error(`Decolagem Abortada: O drone ${idDrone} está retido na oficina técnica.`);
      }

      // Regra Avançada: Blindagem de Drone Ocupado
      if (drone.getStatus() === "Em Operação") {
        throw new Error(`Conflito: O drone ${idDrone} já se encontra em missão ativa.`);
      }

      // Regra Clássica: Sobrecarga (RF09)
      if (pedido.getPeso() > drone.getCapacidadeCarga()) {
        throw new Error(`Alerta de Sobrecarga: Peso de ${pedido.getPeso()}kg excede o limite de ${drone.getCapacidadeCarga()}kg do ${idDrone}.`);
      }

      // CORREÇÃO AQUI: Trava se a bateria for menor ou igual a 25% (RF13)
      if (drone.getBateria() <= 25) {
        throw new Error(`Insumo Crítico: Nível de bateria do ${idDrone} está em ${drone.getBateria()}%. Mínimo para decolar deve ser SUPERIOR a 25%.`);
      }

      // Despacho Autorizado - Mudanças de Estado Coesas
      this.#contadorEntregas++;
      const idEntrega = `ENT-${String(this.#contadorEntregas).padStart(3, '0')}`;
      
      drone.setStatus("Em Operação");
      drone.consumirBateria(25); // Redução dinâmica por voo (RF12)
      pedido.setStatus("Em Rota");

      const entrega = this.#gerenciadorEntregas.criarEntrega(idEntrega, drone, pedido);
      
      this.#servicoLog.registrarLog(`Missão ${idEntrega} despachada. Drone: ${idDrone} (Bateria restante: ${drone.getBateria()}%)`, operador);
      console.log(`  ✔ Sucesso: ${entrega}`);
      return entrega;

    } catch (erro) {
      console.log(`  ❌ Erro Operacional: ${erro.message}`);
      return null;
    }
  }

  concluirEntrega(idEntrega, idOperador) {
    try {
      const operador = this.#gerenciadorUsuarios.validarOperador(idOperador);
      const entrega = this.#gerenciadorEntregas.buscarEntrega(idEntrega);

      if (!entrega) throw new Error(`Entrega ${idEntrega} não localizada.`);
      if (entrega.getStatus() !== "Iniciada") throw new Error(`A entrega ${idEntrega} não está ativa.`);

      entrega.setStatus("Concluída");
      entrega.getDrone().setStatus("Disponível");
      entrega.getPedido().setStatus("Entregue");

      this.#servicoLog.registrarLog(`Missão ${idEntrega} finalizada. Encomenda entregue no destino.`, operador);
      console.log(`  ✔ Finalizado: Entrega ${idEntrega} dada como concluída.`);

    } catch (erro) {
      console.log(`  ❌ Erro Operacional: ${erro.message}`);
    }
  }

  enviarDroneParaManutencao(idDrone, idOperador) {
    try {
      const operador = this.#gerenciadorUsuarios.validarOperador(idOperador);
      const drone = this.#gerenciadorDrones.buscarDrone(idDrone);

      if (!drone) throw new Error(`Drone ${idDrone} não localizado.`);
      
      // Regra Avançada: Impedir parada em voo ativo (RF16)
      if (drone.getStatus() === "Em Operação") {
        throw new Error(`Risco de Queda: Proibido recolher o drone ${idDrone} para a oficina enquanto estiver em voo ativo.`);
      }

      drone.setStatus("Manutenção");
      this.#servicoLog.registrarLog(`Aeronave ${idDrone} recolhida para triagem e manutenção de rotina.`, operador);
      console.log(`  ✔ Oficina: Drone ${idDrone} enviado para manutenção.`);

    } catch (erro) {
      console.log(`  ❌ Erro Operacional: ${erro.message}`);
    }
  }

  retirarDroneDaManutencao(idDrone, idOperador) {
    try {
      const operador = this.#gerenciadorUsuarios.validarOperador(idOperador);
      const drone = this.#gerenciadorDrones.buscarDrone(idDrone);

      if (!drone) throw new Error(`Drone ${idDrone} não localizado.`);
      if (drone.getStatus() !== "Manutenção") throw new Error(`O drone ${idDrone} não está na oficina.`);

      drone.setStatus("Disponível");
      this.#servicoLog.registrarLog(`Aeronave ${idDrone} liberada da oficina com laudo técnico aprovado.`, operador);
      console.log(`  ✔ Oficina: Drone ${idDrone} retornou ao estado Disponível.`);

    } catch (erro) {
      console.log(`  ❌ Erro Operacional: ${erro.message}`);
    }
  }

  recarregarDrone(idDrone, idOperador) {
    try {
      const operador = this.#gerenciadorUsuarios.validarOperador(idOperador);
      const drone = this.#gerenciadorDrones.buscarDrone(idDrone);

      if (!drone) throw new Error(`Drone ${idDrone} não localizado.`);
      if (drone.getStatus() === "Em Operação") throw new Error(`Impossível acoplar o carregador no drone ${idDrone} em pleno voo.`);

      drone.recarregar(); // Restaura para 100% (RF14)
      this.#servicoLog.registrarLog(`Abastecimento Energético: Carga do drone ${idDrone} restaurada para 100%.`, operador);
      console.log(`  ✔ Bateria: Carga do drone ${idDrone} reabastecida com sucesso (100%).`);

    } catch (erro) {
      console.log(`  ❌ Erro Operacional: ${erro.message}`);
    }
  }

  listarDrones() {
    console.log("\n  === FROTA ATUAL DE DRONES ===");
    this.#gerenciadorDrones.listarTodos().forEach(d => console.log("   •", d.toString()));
  }

  listarPedidos() {
    console.log("\n  === HISTÓRICO DE PEDIDOS ===");
    this.#gerenciadorPedidos.listarTodos().forEach(p => console.log("   •", p.toString()));
  }

  listarLogs() {
    console.log("\n  === LIVRO DE AUDITORIA PÚBLICA (IMUTÁVEL) ===");
    this.#servicoLog.exibirLogs();
  }
}

// ============================================================================
// AMBIENTE INTEGRADO DE SIMULAÇÃO (CENÁRIOS OPERACIONAIS)
// ============================================================================

const sistema = new TechCityController();

console.log("=============================================================================");
console.log("           TECHCITY CONTROL — Módulo 2: Simulação da Entrega 2               ");
console.log("=============================================================================");

// Cadastro da Equipe no Core do Sistema
sistema.cadastrarUsuario("OP001", "Carlos Mendes");
sistema.cadastrarUsuario("OP002", "Fernanda Rocha");
sistema.cadastrarUsuario("OP003", "Hiago Alves Barboza"); // VOCÊ NO CONTROLE TOTAL DO FLUXO!

// Cadastro da Frota e Pedidos
sistema.cadastrarDrone("DRONE-M1", 5);  // Drone de Carga Média (Limite: 5kg)
sistema.cadastrarDrone("DRONE-H2", 20); // Drone de Carga Pesada (Limite: 20kg)

sistema.registrarPedido("P01", "Vacinas Glaucoma", "Hospital Central", 2);
sistema.registrarPedido("P02", "Desfibrilador de Emergência", "UPA Sul", 12);
sistema.registrarPedido("P03", "Pranchas de Sangue Coagulado", "Hemoal", 3);
sistema.registrarPedido("P04", "Alimentos e Suprimentos Básicos", "Zona Rural", 4);

// ----------------------------------------------------------------------------
// CENÁRIO 1: Lançamentos Sucessivos e Depreciação de Bateria (RF12 & RF13)
// Comandado pelo Operador Hiago Barboza
// ----------------------------------------------------------------------------
console.log("\n[ CENÁRIO 1 ] Lançamentos sequenciais e Monitoramento Elétrico por Hiago");

// Lançamento 1: Consome 25% (Bateria cai para 75%)
const e1 = sistema.iniciarEntrega("DRONE-M1", "P01", "OP003"); 
if (e1) sistema.concluirEntrega(e1.getId(), "OP003");

// Lançamento 2: Consome 25% (Bateria cai para 50%)
const e2 = sistema.iniciarEntrega("DRONE-M1", "P03", "OP003");
if (e2) sistema.concluirEntrega(e2.getId(), "OP003");

// Lançamento 3: Consome 25% (Bateria cai para 25%)
const e3 = sistema.iniciarEntrega("DRONE-M1", "P04", "OP003");
if (e3) sistema.concluirEntrega(e3.getId(), "OP003");

// Estado Crítico: Drone M1 está com 25% de bateria. O próximo voo vai travar!
console.log("\n  (Tentativa de quarto voo consecutivo sem recarga prévia...)");
sistema.iniciarEntrega("DRONE-M1", "P01", "OP003"); // Trava com sucesso aqui!

// ----------------------------------------------------------------------------
// CENÁRIO 2: Abastecimento Energético na Base (RF14)
// Autorizado pelo Operador Hiago Barboza
// ----------------------------------------------------------------------------
console.log("\n[ CENÁRIO 2 ] Comando de Carga Rápida na Base Elétrica");
sistema.recarregarDrone("DRONE-M1", "OP003"); // Agora funciona! Volta para 100%

console.log("\n  (Nova tentativa de decolagem após Hiago autorizar reabastecimento...)");
const e4_corrigido = sistema.iniciarEntrega("DRONE-M1", "P01", "OP003"); // Decola com sucesso!
if (e4_corrigido) sistema.concluirEntrega(e4_corrigido.getId(), "OP003");

// ----------------------------------------------------------------------------
// CENÁRIO 3: Controle de Oficina e Blindagem de Segurança (RF15 & RF16)
// Testes de integridade física da frota municipal
// ----------------------------------------------------------------------------
console.log("\n[ CENÁRIO 3 ] Validação de Ciclo de Vida de Oficina / Manutenção");

// Tentativa de enviar o Drone H2 para manutenção em pleno voo ativo
console.log("\n  (Hiago tenta enviar o Drone-H2 para a oficina no meio de um frete pesado...)");
const e4 = sistema.iniciarEntrega("DRONE-H2", "P02", "OP003"); // Drone entra "Em Operação"
sistema.enviarDroneParaManutencao("DRONE-H2", "OP003"); // Deve reter por segurança (RF16)

// Concluindo o frete para poder revisar o equipamento em solo seguro
if (e4) sistema.concluirEntrega(e4.getId(), "OP003");
sistema.enviarDroneParaManutencao("DRONE-H2", "OP003"); // Agora entra em manutenção!

// Tentativa de usar um drone retido na oficina
console.log("\n  (Fernanda tenta despachar uma rota usando o drone que está documento na oficina...)");
sistema.iniciarEntrega("DRONE-H2", "P04", "OP002"); // Deve bloquear imediatamente!

// Retirada autorizada da manutenção
sistema.retirarDroneDaManutencao("DRONE-H2", "OP003");

// ----------------------------------------------------------------------------
// CENÁRIO 4: Auditoria do Bloqueio Administrativo (RF02)
// Diretor Hiago desativa uma conta e testa a segurança do Core
// ----------------------------------------------------------------------------
console.log("\n[ CENÁRIO 4 ] Teste de Travamento de Acesso Core do Sistema");
console.log("\n  (Hiago suspende as credenciais da operadora Fernanda Rocha)");
sistema.desativarUsuario("OP002");

console.log("\n  (Fernanda tenta forçar a liberação de um voo mesmo estando suspensa...)");
sistema.iniciarEntrega("DRONE-H2", "P04", "OP002"); // Bloqueado pelo Core do sistema!

// ============================================================================
// RELATÓRIOS FINAIS DE HOMOLOGAÇÃO
// ============================================================================
console.log("\n\n=============================================================================");
console.log("                    EMISSÃO DE RELATÓRIOS FINAIS DE AUDITORIA                ");
console.log("=============================================================================");

sistema.listarDrones();
sistema.listarPedidos();
sistema.listarLogs();

console.log("\n=============================================================================\n");