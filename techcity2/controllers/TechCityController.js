// ============================================================
// Classe: TechCityController
// Responsabilidade (RF04):
//   É o "cérebro" do sistema — a única porta de entrada para
//   todas as operações. Nenhuma classe externa acessa diretamente
//   os dados das entidades; tudo passa por aqui.
//
//   Ele é responsável por:
//     - guardar as listas de todos os objetos em memória
//     - validar as regras antes de executar qualquer ação
//     - coordenar as mudanças de estado entre objetos
//     - registrar logs de auditoria de cada operação relevante
//
//   Esse padrão de design se chama "Controller" ou "Fachada":
//   simplifica o uso do sistema para quem está de fora.
// ============================================================

const Usuario  = require("../classes/Usuario");
const Operacao = require("../classes/Operacao");
const Drone    = require("../classes/Drone");
const Pedido   = require("../classes/Pedido");
const Entrega  = require("../classes/Entrega");

class TechCityController {

  // Todas as listas são privadas — ninguém de fora acessa diretamente
  #usuarios  = [];
  #drones    = [];
  #pedidos   = [];
  #entregas  = [];
  #operacoes = []; // histórico de auditoria (RF03)

  // ------------------------------------------------------------------
  // MÉTODO INTERNO: gera um ID único com prefixo + timestamp + random
  // Exemplo de resultado: "PED-1717200000000-432"
  // ------------------------------------------------------------------
  #gerarId(prefixo) {
    const numero = Math.floor(Math.random() * 1000);
    return `${prefixo}-${Date.now()}-${numero}`;
  }

  // ------------------------------------------------------------------
  // MÉTODO INTERNO: cria e salva um log de auditoria (RF03)
  // Chamado sempre que uma operação importante ocorre
  // ------------------------------------------------------------------
  #registrarLog(descricao, usuario) {
    const log = new Operacao(descricao, usuario);
    this.#operacoes.push(log);
  }

  // ------------------------------------------------------------------
  // MÉTODO INTERNO: busca um usuário pelo ID
  // Retorna o objeto ou null se não existir
  // ------------------------------------------------------------------
  #buscarUsuario(id) {
    const usuario = this.#usuarios.find(u => u.getId() === id);
    if (!usuario) {
      console.log(`  ERRO: Usuário com ID "${id}" não encontrado.`);
      return null;
    }
    return usuario;
  }

  // ------------------------------------------------------------------
  // MÉTODO INTERNO: valida se o operador existe E está ativo
  // Usado antes de qualquer operação que exige autorização humana
  // ------------------------------------------------------------------
  #validarOperador(idOperador) {
    const operador = this.#buscarUsuario(idOperador);
    if (!operador) return null;

    if (!operador.isAtivo()) {
      console.log(`  ERRO: O operador "${operador.getNome()}" está inativo e não pode autorizar operações.`);
      return null;
    }

    return operador;
  }


  // ==================================================================
  // RF01 — CADASTRO DE USUÁRIOS
  // Registra um novo operador no sistema.
  // Impede duplicidade de ID.
  // ==================================================================
  cadastrarUsuario(id, nome) {
    const jaExiste = this.#usuarios.find(u => u.getId() === id);
    if (jaExiste) {
      console.log(`  ERRO: Já existe um operador com o ID "${id}".`);
      return null;
    }

    const usuario = new Usuario(id, nome);
    this.#usuarios.push(usuario);
    console.log(`  ✔ Operador cadastrado: ${usuario}`);
    return usuario;
  }

  // ==================================================================
  // RF02 — CONTROLE DE USUÁRIOS ATIVOS
  // Ativa ou desativa um operador pelo ID.
  // ==================================================================
  ativarUsuario(id) {
    const usuario = this.#buscarUsuario(id);
    if (!usuario) return;

    usuario.ativar();
    console.log(`  ✔ Operador "${usuario.getNome()}" foi ativado.`);
  }

  desativarUsuario(id) {
    const usuario = this.#buscarUsuario(id);
    if (!usuario) return;

    usuario.desativar();
    console.log(`  ✔ Operador "${usuario.getNome()}" foi desativado.`);
  }


  // ==================================================================
  // RF05 (M2-RF01) — CADASTRO DE DRONES
  // Adiciona um novo drone à frota da cidade.
  // O drone começa automaticamente como "Disponível".
  // ==================================================================
  cadastrarDrone(id, capacidadeCarga) {
    const drone = new Drone(id, capacidadeCarga);
    this.#drones.push(drone);
    console.log(`  ✔ Drone cadastrado: ${drone}`);
    return drone;
  }


  // ==================================================================
  // RF06 (M2-RF02) — REGISTRO DE PEDIDOS
  // Cria um novo pedido de entrega.
  // O ID é gerado automaticamente pelo sistema.
  // O pedido começa com status "Pendente".
  // ==================================================================
  registrarPedido(descricao, destino, peso) {
    const id     = this.#gerarId("PED");
    const pedido = new Pedido(id, descricao, destino, peso);
    this.#pedidos.push(pedido);
    console.log(`  ✔ Pedido registrado: ${pedido}`);
    return pedido;
  }


  // ==================================================================
  // RF07 (M2-RF03) — INICIAR ENTREGA
  // Liga um drone disponível a um pedido pendente.
  // Valida: operador ativo, drone disponível, pedido pendente,
  //         e se o peso não ultrapassa a capacidade do drone (RF09).
  // Cria o objeto Entrega e atualiza os status de drone e pedido.
  // ==================================================================
  iniciarEntrega(idDrone, idPedido, idOperador) {

    // 1. Verificar se o operador existe e está ativo
    const operador = this.#validarOperador(idOperador);
    if (!operador) return null;

    // 2. Verificar se o drone existe
    const drone = this.#drones.find(d => d.getId() === idDrone);
    if (!drone) {
      console.log(`  ERRO: Drone "${idDrone}" não encontrado.`);
      return null;
    }

    // 3. Verificar se o drone está disponível
    if (drone.getStatus() !== "Disponível") {
      console.log(`  ERRO: Drone "${idDrone}" não está disponível (status atual: ${drone.getStatus()}).`);
      return null;
    }

    // 4. Verificar se o pedido existe
    const pedido = this.#pedidos.find(p => p.getId() === idPedido);
    if (!pedido) {
      console.log(`  ERRO: Pedido "${idPedido}" não encontrado.`);
      return null;
    }

    // 5. Verificar se o pedido ainda está pendente
    if (pedido.getStatus() !== "Pendente") {
      console.log(`  ERRO: Pedido "${idPedido}" não está pendente (status atual: ${pedido.getStatus()}).`);
      return null;
    }

    // 6. RF09 — Validação de sobrecarga
    // Se o peso do pedido for maior que a capacidade do drone, bloqueia
    if (pedido.getPeso() > drone.getCapacidadeCarga()) {
      console.log(
        `  ERRO: Sobrecarga detectada! O pedido pesa ${pedido.getPeso()}kg, ` +
        `mas o drone ${idDrone} suporta no máximo ${drone.getCapacidadeCarga()}kg.`
      );
      return null;
    }

    // 7. Tudo validado — atualizar os estados e criar a Entrega
    drone.setStatus("Em Operação");
    pedido.setStatus("Em Rota");

    const idEntrega = this.#gerarId("ENT");
    const entrega   = new Entrega(idEntrega, drone, pedido);
    this.#entregas.push(entrega);

    // 8. Registrar log de auditoria
    this.#registrarLog(
      `Entrega ${idEntrega} iniciada por ${operador.getNome()} — ` +
      `Drone: ${idDrone}, Pedido: ${idPedido}, Destino: ${pedido.getDestino()}`,
      operador
    );

    console.log(`  ✔ Entrega iniciada com sucesso: ${entrega}`);
    return entrega;
  }


  // ==================================================================
  // RF08 (M2-RF04) — CONCLUIR ENTREGA
  // Marca a entrega como concluída, o pedido como entregue
  // e devolve o drone para "Disponível" (ele volta à frota).
  // Exige operador ativo para autorizar.
  // ==================================================================
  concluirEntrega(idEntrega, idOperador) {

    const operador = this.#validarOperador(idOperador);
    if (!operador) return;

    const entrega = this.#entregas.find(e => e.getId() === idEntrega);
    if (!entrega) {
      console.log(`  ERRO: Entrega "${idEntrega}" não encontrada.`);
      return;
    }

    if (entrega.getStatus() !== "Iniciada") {
      console.log(`  ERRO: Esta entrega não está ativa (status atual: ${entrega.getStatus()}).`);
      return;
    }

    // Atualiza os três objetos envolvidos
    entrega.setStatus("Concluída");
    entrega.getPedido().setStatus("Entregue");
    entrega.getDrone().setStatus("Disponível"); // drone volta para a frota

    this.#registrarLog(
      `Entrega ${idEntrega} concluída por ${operador.getNome()} — ` +
      `Drone ${entrega.getDrone().getId()} retornou à frota`,
      operador
    );

    console.log(`  ✔ Entrega concluída: ${entrega}`);
  }


  // ==================================================================
  // RF10 (Adicional) — CANCELAR ENTREGA
  // Aborta uma entrega que já está em andamento.
  // O drone é liberado de volta para "Disponível".
  // O pedido vai para "Cancelado".
  // Exige operador ativo para autorizar.
  // ==================================================================
  cancelarEntrega(idEntrega, idOperador) {

    const operador = this.#validarOperador(idOperador);
    if (!operador) return;

    const entrega = this.#entregas.find(e => e.getId() === idEntrega);
    if (!entrega) {
      console.log(`  ERRO: Entrega "${idEntrega}" não encontrada.`);
      return;
    }

    if (entrega.getStatus() !== "Iniciada") {
      console.log(`  ERRO: Só é possível cancelar entregas ativas (status atual: ${entrega.getStatus()}).`);
      return;
    }

    // Atualiza os três objetos envolvidos
    entrega.setStatus("Cancelada");
    entrega.getPedido().setStatus("Cancelado");
    entrega.getDrone().setStatus("Disponível"); // drone liberado imediatamente

    this.#registrarLog(
      `Entrega ${idEntrega} cancelada por ${operador.getNome()} — ` +
      `Drone ${entrega.getDrone().getId()} liberado de volta à frota`,
      operador
    );

    console.log(`  ✔ Entrega cancelada: ${entrega}`);
  }


  // ==================================================================
  // MÉTODOS DE CONSULTA — listagens para visualização do estado atual
  // ==================================================================

  listarDrones() {
    console.log("\n  === FROTA DE DRONES ===");
    if (this.#drones.length === 0) {
      console.log("  Nenhum drone cadastrado.");
      return;
    }
    this.#drones.forEach(d => console.log("   •", d.toString()));
  }

  listarPedidos() {
    console.log("\n  === PEDIDOS ===");
    if (this.#pedidos.length === 0) {
      console.log("  Nenhum pedido registrado.");
      return;
    }
    this.#pedidos.forEach(p => console.log("   •", p.toString()));
  }

  listarEntregas() {
    console.log("\n  === ENTREGAS ===");
    if (this.#entregas.length === 0) {
      console.log("  Nenhuma entrega registrada.");
      return;
    }
    this.#entregas.forEach(e => console.log("   •", e.toString()));
  }

  listarLogs() {
    console.log("\n  === LOG DE AUDITORIA ===");
    if (this.#operacoes.length === 0) {
      console.log("  Nenhuma operação registrada.");
      return;
    }
    this.#operacoes.forEach(op => console.log("   •", op.toString()));
  }
}

module.exports = TechCityController;
