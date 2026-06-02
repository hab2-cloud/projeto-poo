# TechCity Control - Módulo 2: Sistema de Entregas com Drones

## 🎓 Contexto Académico
* **Instituição:** Instituto Federal de Alagoas (IFAL) - Campus Maceió
* **Curso:** Técnico em Desenvolvimento de Sistemas (TDS)
* **Disciplina:** Programação Orientada a Objetos (POO)
* **Orientador:** Prof. MSc. Ricardo Nunes
* **Projeto:** 2º Bimestre - Entrega 1 (Modelagem, Arquitetura e Código Inicial)

---

## 👥 Equipa e Divisão de Responsabilidades

Para a conceção, modelagem e implementação desta primeira etapa do projeto, a equipa organizou-se com papéis focados e integrados, distribuídos da seguinte forma:

* **FABIO JOSE DOS SANTOS FILHO** ([fjsf1@aluno.ifal.edu.br](mailto:fjsf1@aluno.ifal.edu.br))
  * **Responsabilidade:** Desenvolvimento do Código-Fonte. Ficou encarregue de traduzir a modelagem lógica para a sintaxe do JavaScript, aplicando as classes, o controlador centralizado (`TechCityController`), o encapsulamento estrito com propriedades privadas (`#`) e os cenários de simulação de testes executáveis no terminal.
  
* **GUILHERME WILLIAM DOS SANTOS SILVA** ([gwss2@aluno.ifal.edu.br](mailto:gwss2@aluno.ifal.edu.br))
  * **Responsabilidade:** Modelagem Arquitetural e Diagrama de Classes. Ficou encarregue do desenho estrutural e conceitual da aplicação, mapeando os atributos, visibilidades, métodos e os relacionamentos corretos (associações e agregações) através do formato visual UML/Mermaid.

* **HIAGO ALVES BARBOZA** ([hab2@aluno.ifal.edu.br](mailto:hab2@aluno.ifal.edu.br))
  * **Responsabilidade:** Documentação Geral, Escrita Técnica e Integração. Ficou encarregue de conceber o Documento de Modelagem de Software detalhado, redigir as justificações técnicas, alinhar os requisitos obrigatórios e adicionais com a arquitetura, além de estruturar o guia do projeto (`README.md`) e gerir a publicação e versionamento no repositório GitHub.

---

## 📝 Descrição do Projeto
O **TechCity Control** é uma plataforma unificada desenvolvida para otimizar e auditar as operações urbanas da cidade inteligente de TechCity. Este repositório contém o **Módulo 2**, responsável pela **automação da malha logística de entregas aéreas utilizando Drones**.

O sistema lida com o registo de frotas de drones, gestão de pedidos de entrega pendentes, associação inteligente de aeronaves disponíveis às cargas (respeitando limites físicos) e a monitorização de todo o ciclo de vida do frete. Adicionalmente, integra-se ao núcleo comum (*Core*) do sistema para controlo de permissões de operadores e gravação de logs imutáveis de auditoria.

### ⚠️ Restrições de Implementação
Em conformidade com as diretrizes pedagógicas da disciplina, o projeto foi construído sob as seguintes regras estritas:
1. **Sem Herança:** Toda a arquitetura baseia-se em associação, agregação e composição.
2. **Sem Frameworks ou Base de Dados:** Persistência volátil em memória estruturada puramente através de Arrays (`[]`).
3. **Encapsulamento Estrito:** Uso de atributos privados nativos do JavaScript (`#`) em todas as entidades.

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
├── techcity.js
└── README.md

---

## 📊 Diagrama de Classes (Mermaid)

Este diagrama representa fielmente a arquitetura implementada no código, evidenciando o encapsulamento estrito (`-` para elementos privados) e os métodos centralizados no Controlador:

```mermaid
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
