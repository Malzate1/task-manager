
const URL_BASE = "https://6a15bb4191ff9a63de08b05f.mockapi.io/";

export const end_points = {
  tarea: URL_BASE + "task",
};

export const getTareas = async () => {
  const res = await fetch(end_points.tarea);
  if (!res.ok) throw new Error("Error al obtener tareas");
  return res.json();
};

export const crearTarea = async (tarea) => {
  const res = await fetch(end_points.tarea, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tarea),
  });
  if (!res.ok) throw new Error("Error al crear tarea");
  return res.json();
};

export const actualizarTarea = async (id, tarea) => {
  const res = await fetch(`${end_points.tarea}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tarea),
  });
  if (!res.ok) throw new Error("Error al actualizar tarea");
  return res.json();
};

export const eliminarTarea = async (id) => {
  const res = await fetch(`${end_points.tarea}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar tarea");
  return res.json();
};