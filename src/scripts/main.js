const form = document.querySelector("#form");
const inputTask = document.querySelector("#task");
const resultadoTask = document.querySelector("#resultado-task");
const limparHistorico = document.querySelector("#limpar-historico");

const todas = document.querySelector("#count-todas");
const pendentes = document.querySelector("#count-pendentes");
const concluidas = document.querySelector("#count-concluidas");
const filtros = document.querySelectorAll(".btn-status:first-child li");

const tarefas = [];
const tarefasConcluidas = [];

let editandoTarefaId = null;
let filtroAtual = "todas";

function renderizarTarefas(lista) {
  resultadoTask.innerHTML = "";

  lista.forEach(function (tarefa) {
    const card = document.createElement("div");
    const cardBtn = document.createElement("div");

    const nomeTarefa = document.createElement("p");
    card.classList.add("card-tarefa");
    nomeTarefa.textContent = `Nome: ${tarefa.nome}`;

    const botaoExcluir = document.createElement("button");
    const botaoEditar = document.createElement("button");
    const botaoConcluido = document.createElement("input");

    botaoConcluido.type = "checkbox";
    botaoConcluido.checked = tarefa.concluida;

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

      const indiceConcluidas = tarefasConcluidas.findIndex(
        function (tarefaConcluida) {
          return tarefaConcluida === id;
        },
      );

      if (indiceConcluidas !== -1) {
        tarefasConcluidas.splice(indiceConcluidas, 1);
      }

      renderizarTarefas(obterTarefasFiltradas());
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

        tarefa.concluida = true;
      } else {
        const indice = tarefasConcluidas.findIndex(function (tarefaDoArray) {
          return tarefaDoArray === id;
        });

        tarefasConcluidas.splice(indice, 1);
        concluidas.textContent = tarefasConcluidas.length;

        tarefa.concluida = false;
      }

      renderizarTarefas(obterTarefasFiltradas());
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
    tarefasConcluidas.length = 0;

    renderizarTarefas(obterTarefasFiltradas());
    renderizarStatus();
  });
}

// Mostra status
function renderizarStatus() {
  const tarefasPendentes = tarefas.filter(function (tarefa) {
    return tarefa.concluida === false;
  });

  const tarefasTotal = tarefas.length;

  todas.textContent = tarefasTotal;
  pendentes.textContent = tarefasPendentes.length;
  concluidas.textContent = tarefasConcluidas.length;
}

function obterTarefasFiltradas() {
  if (filtroAtual === "concluidas") {
    return tarefas.filter(function (tarefa) {
      return tarefa.concluida === true;
    });
  }

  if (filtroAtual === "pendentes") {
    return tarefas.filter(function (tarefa) {
      return tarefa.concluida === false;
    });
  }

  return tarefas;
}

filtros.forEach(function (filtro) {
  filtro.addEventListener("click", function () {
    if (filtro.textContent === "Todas") {
      filtroAtual = "todas";
    } else if (filtro.textContent === "Pendentes") {
      filtroAtual = "pendentes";
    } else {
      filtroAtual = "concluidas";
    }

    renderizarTarefas(obterTarefasFiltradas());
  });
});

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
    renderizarTarefas(obterTarefasFiltradas());

    editandoTarefaId = null;
    inputTask.value = "";

    return;
  }

  const novoId = tarefas.length + 1;

  const novaTarefas = {
    id: novoId,
    nome: task,
    concluida: false,
  };

  tarefas.push(novaTarefas);
  inputTask.value = "";

  renderizarTarefas(obterTarefasFiltradas());
  renderizarStatus();
});

limpar();
