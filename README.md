# TechCity Control - Módulo 2: Sistema de Entregas com Drones

## 🎓 Contexto Académico
* **Instituição:** Instituto Federal de Alagoas (IFAL) - Campus Maceió
* **Curso:** Técnico em Desenvolvimento de Sistemas (TDS)
* **Disciplina:** Programação Orientada a Objetos (POO)
* **Orientador:** Prof. MSc. Ricardo Nunes
* **Projeto:** 2º Bimestre - Entrega 1 (Modelagem, Arquitetura e Código Inicial)

---

## 📝 Descrição do Projeto
O **TechCity Control** é uma plataforma unificada desenvolvida para otimizar e auditar as operações urbanas da cidade inteligente de TechCity. Este repositório contém o **Módulo 2**, responsável pela **automação da malha logística de entregas aéreas utilizando Drones**.

O sistema lida com o registo de frotas de drones, gestão de pedidos de entrega pendentes, associação inteligente de aeronaves disponíveis às cargas (respeitando limites físicos) e a monitorização de todo o ciclo de vida do frete. Adicionalmente, integra-se ao núcleo comum (*Core*) do sistema para controlo de permissões de operadores e gravação de logs imutáveis de auditoria.

### ⚠️ Restrições de Implementação
Em conformidade com as diretrizes pedagógicas da disciplina, o projeto foi construído sob as seguintes regras:
1. **Sem Herança:** Toda a arquitetura baseia-se em associação, agregação e composição.
2. **Sem Frameworks ou Base de Dados:** Persistência volátil em memória estruturada através de Arrays (`[]`).
3. **Encapsulamento Estrito:** Uso de atributos privados nativos do JavaScript (`#`).

---

## 📂 Organização do Projeto

O código está estruturado seguindo a modularização sugerida no Guia de Arquitetura do projeto:

```text
techcity-drones/
├── classes/
│   ├── Usuario.js
│   ├── Operacao.js
│   ├── Drone.js
│   ├── Pedido.js
│   └── Entrega.js
├── controllers/
│   └── TechCityController.js
├── main.js
└── README.md
