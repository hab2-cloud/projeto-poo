// ============================================================
// main.js — Arquivo principal de execução
//
// Este arquivo simula situações reais de uso do sistema
// TechCity Control, Módulo 2: Entregas com Drones.
//
// Para executar: node main.js
// ============================================================

const TechCityController = require("./controllers/TechCityController");

// Criamos uma única instância do controlador.
// Ele vai gerenciar tudo: usuários, drones, pedidos e entregas.
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

const pedido1 = sistema.registrarPedido(
  "Vacinas para gripe",
  "UBS Bairro da Paz",
  4
);

const pedido2 = sistema.registrarPedido(
  "Contrato de licitação",
  "Câmara Municipal",
  1
);

const pedido3 = sistema.registrarPedido(
  "Equipamentos de obra",
  "Depósito Central",
  20  // muito pesado — nenhum drone vai aguentar
);


// -------------------------------------------------------------
// CENÁRIO 1: Entrega normal e bem-sucedida (RF07 + RF08)
//
// O operador Carlos despacha o DRONE-A1 com as vacinas.
// Depois, ele mesmo confirma que a entrega foi concluída.
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
// O drone é liberado e o pedido volta ao status "Cancelado".
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

const pedido4 = sistema.registrarPedido(
  "Documentos urgentes",
  "Secretaria de Saúde",
  2
);

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
