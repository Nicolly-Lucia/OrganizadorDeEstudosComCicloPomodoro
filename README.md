# ☕ I Miss My Studies

> Organizador de estudos com Ciclo Pomodoro, inspirado visualmente no site [imissmycafe.com](https://imissmycafe.com).

Projeto desenvolvido para a disciplina de **Programação Web 2**, efetuada pelo professor **Marcello Collado**.

---

## 📖 Sobre o Projeto

O **I Miss My Studies** é uma aplicação web que une **organização de estudos** e **a técnica de estudos Pomodoro** em um ambiente visual aconchegante, inspirado em uma cafeteria.

O usuário pode:
- Cadastrar suas **matérias** e os **tópicos** que precisa estudar
- Marcar o **status** de cada tópico (A Estudar, Estudando, Concluído)
- Utilizar um **Timer Pomodoro** configurável (foco + pausa)
- Acompanhar o **tempo total dedicado** a cada tópico
- Ouvir **sons ambientes** (café, chuva, lo-fi) durante o estudo
- Alternar entre **modo claro e escuro**

Tudo isso com uma interface que lembra uma cafeteria calma — porque estudar também pode ser aconchegante.

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Uso |
|------------|-----|
| **PHP** | Backend e lógica de servidor |
| **MySQL** | Banco de dados relacional |
| **PDO** | Camada de acesso ao banco (segura contra SQL Injection) |
| **HTML5** | Estrutura das páginas |
| **CSS3** | Estilização com variáveis e modo escuro |
| **JavaScript** | Timer, sons, relógio, contador e interações |
| **Google Fonts** | Fontes *Playfair Display* e *Quicksand* |

---

## ✨ Funcionalidades

### 📚 Organização
- ✅ Cadastro de **matérias** (Create)
- ✅ Cadastro de **tópicos** vinculados a uma matéria (Create)
- ✅ **Listagem automática** de matérias e tópicos (Read)
- ✅ **Exclusão** de matérias e tópicos (Delete)
- ✅ **Atualização automática** de status e tempo estudado (Update)

### ⏱️ Pomodoro
- ✅ Timer com **tempo de foco e pausa** configuráveis
- ✅ **Ciclo automático**: foco → pausa → foco → pausa
- ✅ **Alerta sonoro** diferente no fim do foco e da pausa
- ✅ **Contador de pomodoros do dia** (salvo no navegador)
- ✅ **Salvamento no banco** do tempo estudado a cada foco finalizado

### 🎧 Experiência
- ✅ **Sons ambientes** (café, chuva, lo-fi) com fade-in/fade-out
- ✅ **Modo escuro** acessível pelo botão no canto superior direito
- ✅ **Relógio em tempo real**
- ✅ **Frases motivacionais** aleatórias a cada carregamento
- ✅ **Nuvens de vapor animadas** sobre o timer

---

## 🗂️ Estrutura do Projeto

```
estudos-cafe/
├── index.php                          # Página principal
├── db.php                             # Conexão com o MySQL
├── api.php                            # CRUD (Create, Read, Update, Delete)
├── style.css                          # Estilos + modo escuro
├── script.js                          # Timer, sons, modais, relógio
├── banco_de_dados.sql                 # Script de criação do banco
├── imissmystudiesfundocolorido.png    # Imagem central
└── sons/
    ├── cafe.mp3                       # Som ambiente de café
    ├── chuva.mp3                      # Som ambiente de chuva
    ├── lofi.mp3                       # Som ambiente de lo-fi
    ├── alerta-foco.mp3                # Alerta ao terminar o foco
    └── alerta-pausa.mp3               # Alerta ao terminar a pausa
```

---

## 🗄️ Banco de Dados

### Tabela: `materias`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INT (PK, AI) | Identificador |
| `nome` | VARCHAR(100) | Nome da matéria |

### Tabela: `topicos`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INT (PK, AI) | Identificador |
| `materia_id` | INT (FK) | Matéria vinculada |
| `nome` | VARCHAR(150) | Nome do tópico |
| `status` | ENUM | 'A Estudar', 'Estudando' ou 'Concluído' |
| `tempo_dedicado` | INT | Minutos estudados |

### Tabela: `sessoes_pomodoro`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INT (PK, AI) | Identificador |
| `topico_id` | INT (FK) | Tópico estudado |
| `duracao` | INT | Duração da sessão (em minutos) |
| `data_registro` | TIMESTAMP | Data e hora do registro |

> A FK `materia_id` usa **ON DELETE CASCADE** — ao excluir uma matéria, todos os tópicos vinculados também são removidos.

---

## 🔄 Operações CRUD

| Operação | Onde acontece | Como funciona |
|----------|---------------|---------------|
| **Create** (matéria) | Botão `+` no topo da lista | Envia via `POST` para `api.php?action=cadastrar_materia` |
| **Create** (tópico) | Botão `+` ao lado da matéria | Envia via `POST` para `api.php?action=cadastrar_topico` |
| **Read** | Carregamento da `index.php` | `SELECT` no banco, montagem dinâmica da lista |
| **Update** | Ao finalizar um Pomodoro | Atualiza `tempo_dedicado` e `status` do tópico |
| **Delete** (matéria) | Ícone 🗑️ ao lado da matéria | Envia `GET` para `api.php?action=excluir_materia` |
| **Delete** (tópico) | Ícone ✓ ao lado do tópico | Envia `GET` para `api.php?action=excluir_topico` |

---

## 🎨 Design

- Inspirado no site [imissmycafe.com](https://imissmycafe.com)
- Paleta em tons de bege, marrom e café
- Modo escuro ativado por botão no canto superior direito
- Nuvens de vapor animadas sobre o timer
- 

---

## 👨‍🏫 Créditos

- **Aluna:** Nicolly Lucia da Silva
- **Professor:** Marcello Collado
- **Disciplina:** Programação Web 2
- **Inspiração visual:** [imissmycafe.com](https://imissmycafe.com) criado por **ifthencreate**

---

## 📄 Licença

Projeto acadêmico sem fins comerciais.
