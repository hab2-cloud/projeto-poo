// ============================================================
// TECHCITY CONTROL — Módulo 2: Sistema de Entregas com Drones
// Arquivo único com todas as classes e cenários de execução
//
// Para executar: node techcity.js
// ============================================================


// ============================================================
// Classe: Usuario
// Responsabilidade (RF01 e RF02):
//   Representa um operador humano da prefeitura de TechCity.
//   Cada operador tem um ID único, um nome e um estado que
//   indica se ele está ativo ou inativo no sistema.
//   Operadores inativos não podem autorizar nenhuma operação.
// ============================================================

class Usuario {

  // Os atributos com # são privados — só podem ser lidos ou
  // alterados pelos métodos desta própria classe (encapsulamento).
  #id;
  #nome;
  #ativo;

  // O construtor é chamado quando criamos um novo usuário.
  // Todo usuário começa ativo por padrão.
  constructor(id, nome) {
    this.#id    = id;
    this.#nome  = nome;
    this.#ativo = true; // começa ativo automaticamente
  }

  // --- Getters: permitem ler os dados sem expô-los diretamente ---

  getId()   { return this.#id; }
  getNome() { return this.#nome; }
  isAtivo() { return this.#ativo; }

  // --- Métodos de negócio: alteram o estado do usuário ---

  // Reativa um operador que estava inativo
  ativar() {
    this.#ativo = true;
  }

  // Desativa um operador (ele perde acesso às operações)
  desativar() {
    this.#ativo = false;
  }

  // Retorna uma descrição legível do usuário (útil para logs e prints)
  toString() {
    const estado = this.#ativo ? "Ativo" : "Inativo";
    return `Usuario[${this.#id}] ${this.#nome} — ${estado}`;
  }
}


// ============================================================
// Classe: Operacao
// Responsabilidade (RF03):
//   Representa um registro histórico imutável de auditoria.
//   Toda vez que algo importante acontece no sistema
//   (entrega iniciada, cancelada, concluída...), um objeto
//   Operacao é criado e guardado para rastreabilidade.
//
//   Uma Operacao sabe:
//     - o que aconteceu (descrição)
//     - quando aconteceu (data e hora automáticas)
//     - quem autorizou (referência ao objeto Usuario)
// ============================================================

class Operacao {

  #descricao;
  #dataHora;
  #usuario;

  // A data/hora é capturada automaticamente no momento
  // em que o objeto é criado — por isso não vem como parâmetro.
  constructor(descricao, usuario) {
    this.#descricao = descricao;
    this.#dataHora  = new Date(); // registra o momento exato
    this.#usuario   = usuario;
  }

  // --- Getters ---

  getDescricao() { return this.#descricao; }
  getUsuario()   { return this.#usuario; }

  // Retorna a data no formato ISO (ex: 2026-06-01T20:30:00.000Z)
  getDataHora()  { return this.#dataHora.toISOString(); }

  // Exibe o log de forma legível: [data] (nome) descrição
  toString() {
    return `[${this.getDataHora()}] (${this.#usuario.getNome()}) ${this.#descricao}`;
  }
}


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

  getId()              { return this.#id; }
  getCapacidadeCarga() { return this.#capacidadeCarga; }
  getStatus()          { return this.#status; }

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

  getId()        { return this.#id; }
  getDescricao() { return this.#descricao; }
  getDestino()   { return this.#destino; }
  getPeso()      { return this.#peso; }
  getStatus()    { return this.#status; }

  // --- Setter controlado: status só muda via controlador ---
  setStatus(novoStatus) {
    this.#status = novoStatus;
  }

  toString() {
    return `Pedido[${this.#id}] "${this.#descricao}" → ${this.#destino} (${this.#peso}kg) — Status: ${this.#status}`;
  }
}


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
  #drone;  // referência ao objeto Drone responsável
  #pedido; // referência ao objeto Pedido transportado
  #status;

  // Ao ser criada, a entrega já nasce com status "Iniciada"
  constructor(id, drone, pedido) {
    this.#id     = id;
    this.#drone  = drone;
    this.#pedido = pedido;
    this.#status = "Iniciada";
  }

  // --- Getters ---

  getId()     { return this.#id; }
  getDrone()  { return this.#drone; }
  getPedido() { return this.#pedido; }
  getStatus() { return this.#status; }

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


// ============================================================
// EXECUÇÃO — Cenários de uso do sistema
//
// Simula situações reais de operação da frota de drones
// da prefeitura de TechCity.
// ============================================================

const sistema = new TechCityController();

console.log("=============================================================");
console.log("       TECHCITY CONTROL — Módulo 2: Entregas com Drones      ");
console.log("=============================================================");


// -------------------------------------------------------------
// ETAPA 1: Cadastro dos operadores da prefeitura (RF01)
//
// Operadores são os funcionários que autorizam as operações.
// Sem um operador ativo, nenhuma entrega pode ser despachada.
// -------------------------------------------------------------
console.log("\n[ ETAPA 1 ] Cadastrando operadores da prefeitura...\n");

sistema.cadastrarUsuario("OP001", "Carlos Mendes");
sistema.cadastrarUsuario("OP002", "Fernanda Rocha");


// -------------------------------------------------------------
// ETAPA 2: Cadastro dos drones da frota municipal (RF05)
//
// Cada drone tem um ID e uma capacidade máxima de carga (kg).
// Todos começam com status "Disponível".
// -------------------------------------------------------------
console.log("\n[ ETAPA 2 ] Cadastrando drones da frota municipal...\n");

sistema.cadastrarDrone("DRONE-A1", 15); // aguenta até 15kg
sistema.cadastrarDrone("DRONE-B2", 5);  // aguenta até 5kg


// -------------------------------------------------------------
// ETAPA 3: Registro dos pedidos de entrega (RF06)
//
// Pedidos chegam ao sistema com descrição, destino e peso.
// Todos começam com status "Pendente".
// -------------------------------------------------------------
console.log("\n[ ETAPA 3 ] Registrando pedidos de entrega...\n");

const pedido1 = sistema.registrarPedido("Vacinas para gripe",     "UBS Bairro da Paz",  4);
const pedido2 = sistema.registrarPedido("Contrato de licitação",  "Câmara Municipal",   1);
const pedido3 = sistema.registrarPedido("Equipamentos de obra",   "Depósito Central",  20); // muito pesado


// -------------------------------------------------------------
// CENÁRIO 1: Entrega normal e bem-sucedida (RF07 + RF08)
//
// O operador Carlos despacha o DRONE-A1 com as vacinas.
// Depois confirma que a entrega foi concluída.
// O drone volta automaticamente para "Disponível".
// -------------------------------------------------------------
console.log("\n[ CENÁRIO 1 ] Entrega normal de vacinas para a UBS...\n");

const entrega1 = sistema.iniciarEntrega("DRONE-A1", pedido1.getId(), "OP001");

console.log("\n  (Simulando o drone em voo... entrega realizada!)\n");

sistema.concluirEntrega(entrega1.getId(), "OP001");


// -------------------------------------------------------------
// CENÁRIO 2: Tentativa de sobrecarga (RF09 — requisito adicional)
//
// O operador tenta despachar o DRONE-B2 com os equipamentos
// de obra. O sistema detecta sobrecarga e bloqueia a operação.
// Nenhum estado é alterado.
// -------------------------------------------------------------
console.log("\n[ CENÁRIO 2 ] Tentativa de despachar carga acima do limite...\n");

sistema.iniciarEntrega("DRONE-B2", pedido3.getId(), "OP001");


// -------------------------------------------------------------
// CENÁRIO 3: Cancelamento de entrega em andamento (RF10 — adicional)
//
// A Fernanda inicia uma entrega com o contrato da licitação,
// mas precisa cancelar por conta de uma restrição de espaço aéreo.
// O drone é liberado e o pedido vai para "Cancelado".
// -------------------------------------------------------------
console.log("\n[ CENÁRIO 3 ] Cancelamento de entrega por restrição de voo...\n");

const entrega2 = sistema.iniciarEntrega("DRONE-A1", pedido2.getId(), "OP002");

console.log("\n  (Alerta meteorológico emitido — operadora cancela a missão)\n");

sistema.cancelarEntrega(entrega2.getId(), "OP002");


// -------------------------------------------------------------
// CENÁRIO 4: Operador inativo tentando agir (RF02)
//
// A Fernanda é desativada por suspensão administrativa.
// Qualquer tentativa dela de operar o sistema é bloqueada.
// -------------------------------------------------------------
console.log("\n[ CENÁRIO 4 ] Operador inativo tentando autorizar uma operação...\n");

sistema.desativarUsuario("OP002");

const pedido4 = sistema.registrarPedido("Documentos urgentes", "Secretaria de Saúde", 2);

// Esta chamada deve ser bloqueada pois Fernanda está inativa
sistema.iniciarEntrega("DRONE-A1", pedido4.getId(), "OP002");


// -------------------------------------------------------------
// RELATÓRIOS FINAIS
//
// Visão geral do estado atual de todo o sistema.
// -------------------------------------------------------------
console.log("\n\n=============================================================");
console.log("                    RELATÓRIOS FINAIS                       ");
console.log("=============================================================");

sistema.listarDrones();
sistema.listarPedidos();
sistema.listarEntregas();
sistema.listarLogs();

console.log("\n=============================================================\n");
