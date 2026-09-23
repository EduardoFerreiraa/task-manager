const form = document.querySelector("#form");
const inputTask = document.querySelector("#task");
const resultadoTask = document.querySelector("#resultado-task");
const limparHistorico = document.querySelector("#limpar-historico");

const todas = document.querySelector("#count-todas");
const pendentes = document.querySelector("#count-pendentes");
const concluidas = document.querySelector("#count-concluidas");

const tarefas = [];
const tarefasConcluidas = [];

let editandoTarefaId = null;

function renderizarTarefas() {
  resultadoTask.innerHTML = "";

  tarefas.forEach(function (tarefa) {
    const card = document.createElement("div");
    const cardBtn = document.createElement("div");

    const nomeTarefa = document.createElement("p");
    card.classList.add("card-tarefa");
    nomeTarefa.textContent = `Nome: ${tarefa.nome}`;

    const botaoExcluir = document.createElement("button");
    const botaoEditar = document.createElement("button");
    const botaoConcluido = document.createElement("input");

    botaoConcluido.type = "checkbox";

    botaoExcluir.classList.add("btn", "excluir");
    botaoEditar.classList.add("btn", "editar");
    botaoEditar.type = "button";
    botaoExcluir.type = "button";
    botaoConcluido.classList.add("btn", "concluido");

    botaoExcluir.textContent = "Excluir";
    botaoEditar.textContent = "Editar";
    botaoConcluido.textContent = "Concluído";

    botaoExcluir.addEventListener("click", function () {
      const id = tarefa.id;

      const indice = tarefas.findIndex(function (tarefaDoArray) {
        return tarefaDoArray.id === id;
      });

      tarefas.splice(indice, 1);
      renderizarTarefas();
      renderizarStatus();
    });

    botaoEditar.addEventListener("click", function () {
      editandoTarefaId = tarefa.id;

      inputTask.value = tarefa.nome;
    });

    botaoConcluido.addEventListener("change", function () {
      const id = tarefa.id;

      if (botaoConcluido.checked) {
        tarefasConcluidas.push(id);
        concluidas.textContent = tarefasConcluidas.length;
      } else {
        const indice = tarefasConcluidas.findIndex(function (tarefaDoArray) {
          return tarefaDoArray === id;
        });

        tarefasConcluidas.splice(indice, 1);
        concluidas.textContent = tarefasConcluidas.length;
      }
    });

    card.append(nomeTarefa);
    card.append(cardBtn);
    cardBtn.append(botaoExcluir, botaoEditar, botaoConcluido);

    resultadoTask.append(card);
  });
}

// Limpa histórico
function limpar() {
  limparHistorico.addEventListener("click", function () {
    tarefas.length = 0;

    renderizarTarefas();
    renderizarStatus();
  });
}

// Mostra status
function renderizarStatus() {
  const tarefasTotal = tarefas.length;
  todas.textContent = tarefasTotal;
  pendentes.textContent = tarefasTotal;
}

// Form
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const task = inputTask.value.trim();

  if (!task) {
    const erroExistente = resultadoTask.querySelector(".mostrar-erro");

    if (!erroExistente) {
      const mostrarErro = document.createElement("p");

      mostrarErro.textContent = "Você precisa escrever uma tarefa!";
      mostrarErro.classList.add("mostrar-erro");
      resultadoTask.appendChild(mostrarErro);
    }

    return;
  }

  if (editandoTarefaId !== null) {
    const tarefa = tarefas.find(function (tarefaDoArray) {
      return tarefaDoArray.id === editandoTarefaId;
    });

    tarefa.nome = task;
    renderizarTarefas();

    editandoTarefaId = null;
    inputTask.value = "";

    return;
  }

  const novoId = tarefas.length + 1;

  const novaTarefas = {
    id: novoId,
    nome: task,
  };

  tarefas.push(novaTarefas);
  inputTask.value = "";

  renderizarTarefas();
  renderizarStatus();
});

limpar();
