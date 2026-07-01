// ============================================================
// main.js — Arquivo Principal de Execução (Atualizado - Entrega 2)
//
// Este arquivo simula situações reais de uso do sistema
// TechCity Control, validando a nova arquitetura de Gerenciadores
// e os novos requisitos de Bateria e Manutenção.
//
// Para executar: node main.js
// ============================================================

const TechCityController = require("./controllers/TechCityController");

// Criamos uma única instância do controlador (A nossa Fachada)
const sistema = new TechCityController();

console.log("=============================================================");
console.log("       TECHCITY CONTROL — Módulo 2: Entregas com Drones      ");
console.log("                         ENTREGA 2                           ");
console.log("=============================================================");


// -------------------------------------------------------------
// ETAPA 1: Cadastro de Operadores (RF01)
// -------------------------------------------------------------
console.log("\n[ ETAPA 1 ] Cadastrando operadores da prefeitura...\n");

sistema.cadastrarUsuario("OP001", "Carlos Mendes");
sistema.cadastrarUsuario("OP002", "Fernanda Rocha");


// -------------------------------------------------------------
// ETAPA 2: Cadastro de Drones na Frota Municipal (RF05)
// -------------------------------------------------------------
console.log("\n[ ETAPA 2 ] Cadastrando a frota de drones (Bateria inicial: 100%)...\n");

sistema.cadastrarDrone("DRONE-A1", 5);  // Suporta até 5kg
sistema.cadastrarDrone("DRONE-B2", 10); // Suporta até 10kg

sistema.listarDrones();


// -------------------------------------------------------------
// CENÁRIO 1: Fluxo de Sucesso e Consumo de Bateria (RF12)
//
// Cada voo iniciado deve consumir 25% de bateria do drone.
// -------------------------------------------------------------
console.log("\n[ CENÁRIO 1 ] Iniciando e concluindo entrega (Validação de Bateria)...\n");

const pedido1 = sistema.registrarPedido(
  "Vacinas para o Posto de Saúde",
  "Bairro Centro",
  3 // 3kg (dentro do limite do DRONE-A1)
);

console.log("  ➔ Tentando despachar o DRONE-A1...");
const entrega1 = sistema.iniciarEntrega("DRONE-A1", pedido1.getId(), "OP001");

// Vamos listar a frota para ver que a bateria do DRONE-A1 caiu para 75%
sistema.listarDrones();

console.log("\n  ➔ Finalizando a entrega no destino...");
sistema.concluirEntrega(entrega1.getId(), "OP001");


// -------------------------------------------------------------
// CENÁRIO 2: Bloqueio por Bateria Fraca e Recarga (RF12)
//
// Um drone precisa de pelo menos 25% de bateria para voar. 
// Forçaremos múltiplos voos no DRONE-A1 até a bateria esgotar.
// -------------------------------------------------------------
console.log("\n[ CENÁRIO 2 ] Forçando consumo até bloqueio por bateria fraca...\n");

const pedA = sistema.registrarPedido("Kit de Primeiros Socorros", "Upa Norte", 1);
const pedB = sistema.registrarPedido("Sorofisiológico", "Upa Sul", 1);
const pedC = sistema.registrarPedido("Medicamentos de Uso Contínuo", "Posto Oeste", 1);

console.log("  ➔ Segundo voo do DRONE-A1 (Bateria vai para 50%)...");
const entA = sistema.iniciarEntrega("DRONE-A1", pedA.getId(), "OP001");
sistema.concluirEntrega(entA.getId(), "OP001");

console.log("\n  ➔ Terceiro voo do DRONE-A1 (Bateria vai para 25%)...");
const entB = sistema.iniciarEntrega("DRONE-A1", pedB.getId(), "OP001");
sistema.concluirEntrega(entB.getId(), "OP001");

console.log("\n  ➔ Quarto voo do DRONE-A1 (Bateria vai para 0%)...");
const entC = sistema.iniciarEntrega("DRONE-A1", pedC.getId(), "OP001");
sistema.concluirEntrega(entC.getId(), "OP001");

// Agora o DRONE-A1 está com 0% de bateria. A próxima tentativa deve ser bloqueada.
console.log("\n  ➔ Tentando iniciar novo voo com o DRONE-A1 sem bateria...");
const pedBloqueado = sistema.registrarPedido("Insulina Emergencial", "Hosp. Geral", 2);
sistema.iniciarEntrega("DRONE-A1", pedBloqueado.getId(), "OP001");

console.log("\n  ➔ Efetuando recarga do drone...");
sistema.recarregarDrone("DRONE-A1", "OP001");

// Conferindo se voltou para 100%
sistema.listarDrones();


// -------------------------------------------------------------
// CENÁRIO 3: Controle de Manutenção Preventiva
//
// Drones em manutenção não podem receber ordens de entrega.
// Drones voando não podem ser mandados para a manutenção.
// -------------------------------------------------------------
console.log("\n[ CENÁRIO 3 ] Validação do Fluxo de Manutenção...\n");

console.log("  ➔ Enviando o DRONE-B2 para revisão preventiva...");
sistema.enviarDroneParaManutencao("DRONE-B2", "OP002");

const pedManutencao = sistema.registrarPedido("Desinfetantes Hospitalares", "Almoxarifado", 4);

console.log("\n  ➔ Tentando colocar drone em manutenção para voar (Deve bloquear)...");
sistema.iniciarEntrega("DRONE-B2", pedManutencao.getId(), "OP002");

console.log("\n  ➔ Retirando drone da manutenção...");
sistema.retirarDroneDaManutencao("DRONE-B2", "OP002");

console.log("\n  ➔ Tentando voar novamente após a liberação...");
sistema.iniciarEntrega("DRONE-B2", pedManutencao.getId(), "OP002");


// -------------------------------------------------------------
// RELATÓRIOS FINAIS
// -------------------------------------------------------------
console.log("\n\n=============================================================");
console.log("                    RELATÓRIOS FINAIS                       ");
console.log("=============================================================");

sistema.listarDrones();
sistema.listarLogs();

console.log("\n=============================================================\n");