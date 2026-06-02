# TechCity Control - Módulo 2: Sistema de Entregas com Drones

## 🎓 Contexto Acadêmico
* **Instituição:** Instituto Federal de Alagoas (IFAL) - Campus Maceió
* **Curso:** Técnico em Desenvolvimento de Sistemas (TDS)
* **Disciplina:** Programação Orientada a Objetos (POO)
* **Professor Orientador:** Prof. MSc. Ricardo Nunes ([ricardo@ifal.edu.br](mailto:ricardo@ifal.edu.br))
* **Projeto:** 2º Bimestre - Entrega 1 (Modelagem, Arquitetura e Código Inicial)

---

## 👥 Equipe e Divisão de Responsabilidades

Para a concepção, modelagem e implementação desta primeira etapa do projeto, a equipe organizou-se com papéis focados e integrados, distribuídos da seguinte forma:

* **FABIO JOSE DOS SANTOS FILHO** ([fjsf1@aluno.ifal.edu.br](mailto:fjsf1@aluno.ifal.edu.br))
  * **Responsabilidade:** Desenvolvimento do Código-Fonte. Ficou encarregado de traduzir a modelagem lógica para a sintaxe do JavaScript, aplicando as classes, o controlador centralizado (`TechCityController`), o encapsulamento estrito com propriedades privadas (`#`) e os cenários de simulação de testes executáveis no terminal.
  
* **GUILHERME WILLIAM DOS SANTOS SILVA** ([gwss2@aluno.ifal.edu.br](mailto:gwss2@aluno.ifal.edu.br))
  * **Responsabilidade:** Modelagem Arquitetural e Diagrama de Classes. Ficou encarregado do desenho estrutural e conceitual da aplicação, mapeando os atributos, visibilidades, métodos e os relacionamentos corretos (associações e agregações) através do formato visual UML/Mermaid.

* **HIAGO ALVES BARBOZA** ([hab2@aluno.ifal.edu.br](mailto:hab2@aluno.ifal.edu.br))
  * **Responsabilidade:** Documentação Geral, Escrita Técnico-Científica e Integração. Ficou encarregado de conceber o Documento de Modelagem de Software detalhado, redigir as justificações técnicas, alinhar os requisitos obrigatórios e adicionais com a arquitetura, além de estruturar o guia do projeto (`README.md`) e gerenciar a publicação e versionamento no repositório GitHub.

---

## 📝 Descrição do Projeto
O **TechCity Control** é uma plataforma unificada desenvolvida para otimizar e auditar as operações urbanas da cidade inteligente de TechCity. Este repositório contém o **Módulo 2**, responsável pela **automação da malha logística de entregas aéreas utilizando Drones**.

O sistema lida com o registro de frotas de drones, gestão de pedidos de entrega pendentes, associação inteligente de aeronaves disponíveis às cargas (respeitando limites físicos) e a monitorização de todo o ciclo de vida do frete. Adicionalmente, integra-se ao núcleo comum (*Core*) do sistema para controle de permissões de operadores e gravação de logs imutáveis de auditoria.

### ⚠️ Restrições de Implementação
Em conformidade com as diretrizes pedagógicas da disciplina, o projeto foi construído sob as seguintes regras estritas:
1. **Sem Herança:** Toda a arquitetura baseia-se em associação, agregação e composição.
2. **Sem Frameworks ou Base de Dados:** Persistência volátil em memória estruturada puramente através de Arrays (`[]`).
3. **Encapsulamento Estrito:** Uso de atributos privados nativos do JavaScript (`#`) em todas as entidades.

---

## 📂 Organização do Projeto

O projeto conta com a estrutura modularizada por pastas e também com uma versão consolidada em arquivo único na raiz:

~~~text
techcity-drones/
├── classes/
│   ├── Usuario.js
│   ├── Operacao.js
│   ├── Drone.js
│   ├── Pedido.js
│   └── Entrega.js
├── controllers/
│   └── TechCityController.js
├── main.js          <-- Ponto de entrada (Modo Modular)
├── techcity.js      <-- Ponto de entrada (Modo Arquivo Único)
└── README.md
~~~

---

## 📌 Requisitos Funcionais (RF)

### Núcleo Comum (Core)
* **RF01 – Cadastro de Usuários:** Registro de operadores com ID único, nome e estado inicial ativo.
* **RF02 – Controle de Usuários Ativos:** Ativação/desativação de utilizadores através de métodos explícitos. Operadores desativados ficam bloqueados de executar ou autorizar ações no sistema.
* **RF03 – Registro de Operações:** Geração automática de logs cronológicos e imutáveis contendo timestamp, descrição da atividade e o operador responsável.
* **RF04 – Controlador Principal:** Classe centralizadora (`TechCityController`) encarregada de coordenar as coleções de dados, aplicar regras de negócio e servir como interface única do sistema.

### Módulo 2 - Sistema de Drones
* **RF05 (M2-RF01) – Cadastro de Drones:** Registro de dispositivos com ID, capacidade de carga (kg) e status inicial "Disponível".
* **RF06 (M2-RF02) – Registro de Pedidos:** Entrada de ordens de serviço com descrição, destino e peso. O status inicial é "Pendente".
* **RF07 (M2-RF03) – Associação de Drones às Entregas:** Vínculo de um drone livre a um pedido pendente (método `iniciarEntrega`), instanciando um objeto `Entrega` e alterando os status para "Em Operação" (Drone) e "Em Rota" (Pedido). Requer validação de operador ativo.
* **RF08 (M2-RF04) – Atualização de Entregas:** Conclusão da entrega (`concluirEntrega`), liberando o drone ("Disponível") e finalizando o pedido ("Entregue"). Requer validação de operador ativo.

### Requisitos Adicionais Criados pela Equipe
* **RF09 (Adicional) – Validação de Sobrecarga de Carga Útil:** O sistema impede o despacho de uma entrega se o peso do pedido exceder a capacidade máxima nominal de carga do drone escolhido, emitindo um alerta no terminal e bloqueando a operação.
* **RF10 (Adicional) – Cancelamento de Entrega com Liberação de Frota:** Permite abortar missões ativas em andamento através do método `cancelarEntrega`. O status do pedido é revertido para "Cancelado" e o drone retorna imediatamente para o estado "Disponível".

---

## 📊 Diagrama de Classes (Mermaid)

Este diagrama representa fielmente a arquitetura implementada no código, evidenciando o encapsulamento estrito (`-` para elementos privados) e os métodos centralizados no Controlador:

~~~mermaid
classDiagram
    class TechCityController {
        -usuarios: Array
        -drones: Array
        -pedidos: Array
        -entregas: Array
        -operacoes: Array
        +cadastrarUsuario(id, nome)
        +ativarUsuario(id)
        +desativarUsuario(id)
        +cadastrarDrone(id, capacidadeCarga)
        +registrarPedido(descricao, destino, peso) Pedido
        +iniciarEntrega(idDrone, idPedido, idOperador) Entrega
        +concluirEntrega(idEntrega, idOperador)
        +cancelarEntrega(idEntrega, idOperador)
        -gerarId(prefixo) String
        -registrarLog(descricao, usuario)
        -buscarUsuario(id) Usuario
        -validarOperador(idOperador) Usuario
    }

    class Usuario {
        -id: String
        -nome: String
        -ativo: Boolean
        +getId() String
        +getNome() String
        +isAtivo() Boolean
        +ativar()
        +desativar()
    }

    class Operacao {
        -descricao: String
        -dataHora: Date
        -usuario: Usuario
        +getDescricao() String
        +getUsuario() Usuario
        +getDataHora() String
    }

    class Drone {
        -id: String
        -capacidadeCarga: Number
        -status: String
        +getId() String
        +getCapacidadeCarga() Number
        +getStatus() String
        +setStatus(novoStatus)
    }

    class Pedido {
        -id: String
        -descricao: String
        -destino: String
        -peso: Number
        -status: String
        +getId() String
        +getDescricao() String
        +getDestino() String
        +getPeso() Number
        +getStatus() String
        +setStatus(novoStatus)
    }

    class Entrega {
        -id: String
        -drone: Drone
        -pedido: Pedido
        -status: String
        +getId() String
        +getDrone() Drone
        +getPedido() Pedido
        +getStatus() String
        +setStatus(novoStatus)
    }

    TechCityController "1" o-- "*" Usuario : agrega
    TechCityController "1" o-- "*" Drone : agrega
    TechCityController "1" o-- "*" Pedido : agrega
    TechCityController "1" o-- "*" Entrega : agrega
    TechCityController "1" o-- "*" Operacao : agrega
    Operacao "1" --> "1" Usuario : associa
    Entrega "1" --> "1" Drone : associa
    Entrega "1" --> "1" Pedido : associa
~~~

---

## 🛠️ Como Executar a Simulação

O projeto possui cenários completos de testes automatizados para validar visualmente todas as regras de negócio diretamente no console do sistema.

### Pré-requisitos
* Ter o **Node.js** instalado (versão 16 ou superior).

### Passos para Execução
Abra o terminal ou prompt de comando na pasta raiz do projeto e escolha uma das duas formas disponíveis para rodar a simulação:

* **Opção A (Estrutura Modular):** Para executar o fluxo a partir da arquitetura dividida em pastas:
  ```bash
  node main.js
