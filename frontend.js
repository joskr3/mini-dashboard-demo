// frontend.js

// (1) Función para mostrar error en un elemento
export function showError(el, msg) {
  el.textContent = msg;
  el.classList.add("error");
  el.classList.remove("highlight");
}

// (2) Función para mostrar mensaje exitoso
export function showSuccess(el, msg) {
  el.textContent = msg;
  el.classList.remove("error");
  el.classList.add("highlight");
}

// (3) Obtener valor de un input
export function getInputValue(id) {
  const field = document.getElementById(id);
  if (!field) return "";
  // @ts-ignore
  return field.value.trim();
}

// (4) Vaciar un input
export function clearInput(id) {
  const field = document.getElementById(id);
  // @ts-ignore
  if (field) field.value = "";
}

/**
 * (5) renderTareas(tareas, container, onMarkDone, onDelete)
 *     -> se usa en dashboard.html
 *     -> demonstar map y render
 */
export function renderTareas(tareas, container, onMarkDone, onDelete) {
  container.innerHTML = "";
  tareas.map((t) => {
    const li = document.createElement("li");
    li.textContent = t.titulo + (t.realizado ? " (hecho)" : "");

    // Botón "Hecho"
    const btnDone = document.createElement("button");
    btnDone.textContent = "Hecho";
    btnDone.style.marginLeft = "0.5rem";
    btnDone.addEventListener("click", () => onMarkDone(t.id));
    li.appendChild(btnDone);

    // Botón "Borrar"
    const btnDel = document.createElement("button");
    btnDel.textContent = "Borrar";
    btnDel.style.marginLeft = "0.5rem";
    btnDel.addEventListener("click", () => onDelete(t.id));
    li.appendChild(btnDel);

    container.appendChild(li);
  });
}

/**
 * (6) renderStats(tareas, statsEl)
 *     -> muestra un ejemplo de reduce + filter
 */
export function renderStats(tareas, statsEl) {
  const total = tareas.length;
  const hechos = tareas.filter((t) => t.realizado).length;
  // reduce: concatenar títulos
  const titulos = tareas.reduce((acc, cur) => acc + cur.titulo + " | ", "");
  statsEl.textContent = `Total: ${total}, Hechos: ${hechos}. Títulos: ${titulos}`;
}
