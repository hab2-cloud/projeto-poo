# TechCity Control - Módulo 2: Sistema de Entregas com Drones

## 🎓 Contexto Acadêmico
* **Instituição:** Instituto Federal de Alagoas (IFAL) - Campus Maceió
* **Curso:** Técnico em Desenvolvimento de Sistemas (TDS)
* **Disciplina:** Programação Orientada a Objetos (POO)
* **Professor Orientador:** Prof. MSc. Ricardo Nunes (ricardo@ifal.edu.br)
* **Projeto:** 2º Bimestre - Entrega 2 (Evolução Arquitetural, Gerenciadores e Requisitos Avançados)

---

## 👥 Equipe e Divisão de Responsabilidades

Para a concepção, modelagem, reestruturação arquitetural e implementação desta segunda etapa do projeto, a equipe organizou-se com papéis focados e integrados, distribuídos da seguinte forma:

* **HIAGO ALVES BARBOZA** (hab2@aluno.ifal.edu.br)
  * **Responsabilidade:** Gestão de Ambiente, Integração, Validação de Sistemas e Documentação. Ficou encarregado da consolidação do ambiente operacional de testes, implantação de scripts de simulação unificados (techcity2.js), monitoramento e validação de ponta a ponta das regras de integridade do sistema diretamente no console, além de gerenciar a atualização do guia do projeto (README.md).

* **FABIO JOSE DOS SANTOS FILHO** (fjsf1@aluno.ifal.edu.br)
  * **Responsabilidade:** Engenharia de Software, Desenvolvimento do Código-Fonte e Regras de Negócio. Ficou encarregado de traduzir os novos requisitos avançados para a sintaxe do JavaScript, aplicando a lógica matemática de depreciação e restauração energética da bateria, os mecanismos internos de validação e as travas de segurança do fluxo de manutenção.
  
* **GUILHERME WILLIAM DOS SANTOS SILVA** (gwss2@aluno.ifal.edu.br)
  * **Responsabilidade:** Modelagem Arquitetural e Diagrama de Classes. Ficou encarregado del redesenho estrutural e conceitual da aplicação, idealizando a transição do controlador centralizado para a nova topologia baseada em subgerenciadores independentes e especializados sob o padrão de projeto Facade (Fachada).

---

## 📝 Descrição do Projeto
O **TechCity Control** é uma plataforma unificada desenvolvida para otimizar e auditar as operações urbanas da cidade inteligente de TechCity. Este repositório contém o **Módulo 2**, responsável pela **automação da malha logística de entregas aéreas utilizando Drones**.

Na presente etapa (Entrega 2), o sistema evoluiu para uma arquitetura robusta de microsserviços internos, onde o controle central delega responsabilidades para gerenciadores de domínio especializados. Foram incorporados novos requisitos operacionais críticos, governando a autonomia energética (bateria), o ciclo de vida técnico das aeronaves (oficina e manutenção preventiva) e a auditoria histórica estrita.

### ⚠️ Restrições de Implementação
Em conformidade com as diretrizes pedagógicas da disciplina, o projeto foi construído sob as seguintes regras estritas:
1. **Sem Herança:** Toda a arquitetura baseia-se em associação, agregação e composição.
2. **Sem Frameworks ou Base de Dados:** Persistência volátil em memória estruturada puramente através de Arrays ([]).
3. **Encapsulamento Estrito:** Uso de atributos privados nativos do JavaScript (#) em todas as entidades e coleções de dados.

---

## 📂 Organização do Projeto

O projeto conta com a estrutura modularizada por pastas e também com uma versão consolidada em arquivo único na raiz para simulação rápida:

```text
techcity-modulo2/
├── classes/
│   ├── Usuario.js
│   ├── Operacao.js
│   ├── Drone.js
│   ├── Pedido.js
│   └── Entrega.js
├── controllers/
│   ├── GerenciadorUsuarios.js
│   ├── GerenciadorDrones.js
│   ├── GerenciadorPedidos.js
│   ├── GerenciadorEntregas.js
│   ├── ServicoLog.js
│   └── TechCityController.js  <-- A Fachada Central (Facade)
├── main.js                    <-- Ponto de entrada (Modo Modular)
├── techcity2.js               <-- Ponto de entrada (Modo Arquivo Único)
└── README.md