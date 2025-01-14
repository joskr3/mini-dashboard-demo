// @ts-nocheck
import {
  checkLogin,
  getTareas,
  createTarea,
  updateTarea,
  deleteTarea,
  getCurrentUserEmail,
} from "./backend.js";
import {
  showError,
  getInputValue,
  clearInput,
  renderTareas,
  renderStats,
} from "./frontend.js";

document.addEventListener("DOMContentLoaded", async () => {
  const currentUserSpan = document.getElementById("currentUser");
  const btnAddTask = document.getElementById("btnAddTask");
  const errorMsg = document.getElementById("errorMsg");

  // Verificar login
  const loggedIn = await checkLogin();
  if (!loggedIn) {
    window.location.href = "login.html";
    return;
  }

  if (currentUserSpan) {
    currentUserSpan.textContent = getCurrentUserEmail();
  }

  if (btnAddTask) {
    btnAddTask.disabled = false;
  }

  // Cargar y renderizar tareas
  await loadTareas();

  // Evento crear tarea

  if (btnAddTask) {
    btnAddTask.addEventListener("click", async () => {
      errorMsg.textContent = "";
      const titleVal = getInputValue("taskTitle");
      if (!titleVal) return;
      try {
        await createTarea(titleVal);
        clearInput("taskTitle");
        await loadTareas();
      } catch (e) {
        showError(errorMsg, e.message);
      }
    });
  }
});

// Función para cargar y renderizar
async function loadTareas() {
  const errorMsg = document.getElementById("errorMsg");
  const taskList = document.getElementById("taskList");
  const statsEl = document.getElementById("stats");
  try {
    const tareas = await getTareas();
    // Render la lista con map
    renderTareas(tareas, taskList, onMarkDone, onDelete);
    // Render stats con reduce/filter
    renderStats(tareas, statsEl);
  } catch (e) {
    showError(errorMsg, e.message);
  }
}

// callback "marcar edit"
async function onEdit(taskId) {
  const tareasInputSection = document.getElementById("taskTitleSection");
  const tareasInput = document.getElementById("taskTitle");
  const realizadoLabel = document.createElement("label");
  const realizadoInput = document.createElement("input");
  realizadoLabel.id = "realizado";
  realizadoLabel.name = "realizado";
  realizadoLabel.textContent = "Realizado";

  realizadoInput.for = "realizado";
  realizadoInput.type = "checkbox";
  realizadoInput.value = true;

  // console.log(tareasInput);
  // console.log(realizadoInput, "realizado input");
  // console.log(taskId, {
  //   realizado: realizadoInput.checked,
  //   titulo: tareasInput.value,
  // });

  tareasInputSection.appendChild( realizadoLabel );
  
  tareasInputSection.appendChild( realizadoInput );
  
  try {
    await updateTarea(taskId, {
      realizado: realizadoInput.checked,
      titulo: tareasInput.value,
    });
    await loadTareas();
  } catch (e) {
    console.error(e);
  }
}

// callback "borrar"
async function onDelete(taskId) {
  try {
    await deleteTarea(taskId);
    await loadTareas();
  } catch (e) {
    console.error(e);
  }
}
