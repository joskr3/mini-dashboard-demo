// backend.js
// IMPORTAR PocketBase real
// @ts-ignore
import pocketbase from "https://cdn.jsdelivr.net/npm/pocketbase@0.25.0/+esm";
const pb = new pocketbase("http://127.0.0.1:8090");

// 1) doLogin => auth con email y pass
export async function doLogin(email, pass) {
  try {
    await pb.collection("users").authWithPassword(email, pass);
    // Si todo ok, no lanza error
  } catch (e) {
    throw new Error("Login fallido: " + e.message);
  }
}

// 2) checkLogin => verificar si hay un user logueado
export async function checkLogin() {
  // Si hay un token y un user en authStore => logueado
  // Sino => false
  return pb.authStore.isValid;
}

// 3) getCurrentUserEmail => user email
export function getCurrentUserEmail() {
  const user = pb.authStore.model;
  return user ? user.email : "";
}

// 4) getTareas => listar la colección "tareas" para el usuario actual
export async function getTareas() {
  if (!pb.authStore.isValid) throw new Error("No logueado");
  const user = pb.authStore.model;
  // Supongamos que la colección "tareas" tiene un campo "email"
  // con la dirección del usuario
  // Podemos filtrar: `filter: 'email = "..."'`
  const res = await pb.collection("tareas").getFullList({
    filter: `email = "${user.email}"`,
    sort: "-created",
  });
  return res.map((r) => ({
    id: r.id,
    titulo: r.titulo,
    realizado: r.realizado,
    email: r.email,
  }));
}

// 5) createTarea => crear en "tareas"
export async function createTarea(titulo) {
  if (!pb.authStore.isValid) throw new Error("No logueado");
  const user = pb.authStore.model;
  const newRec = await pb.collection("tareas").create({
    titulo,
    realizado: false,
    email: user.email,
  });
  return newRec;
}

// 6) updateTarea => PUT
export async function updateTarea(id, partial) {
  if (!pb.authStore.isValid) throw new Error("No logueado");
  const updated = await pb.collection("tareas").update(id, partial);
  return updated;
}

// 7) deleteTarea => DELETE
export async function deleteTarea(id) {
  if (!pb.authStore.isValid) throw new Error("No logueado");
  await pb.collection("tareas").delete(id);
  return true;
}
