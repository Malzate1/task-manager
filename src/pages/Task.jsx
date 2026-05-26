import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { TaskCard } from "../components/CardTask";
import { getLocalStorage } from "../helpers/local-storage";
import { getTareas, crearTarea, actualizarTarea, eliminarTarea } from "../services/api";

const EMPTY_FORM = { titulo: "", descripcion: "", fechaVencimiento: "", estado: "Pendiente" };
const ESTADOS = ["Pendiente", "En Progreso", "Completada"];

export default function Tablero() {
  const navigate = useNavigate();
  const usuario = getLocalStorage("taskapp_user");

  const [tareas, setTareas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editandoId, setEditandoId] = useState(null);
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (!usuario) { navigate("/login"); return; }
    cargarTareas();
  }, []);

  const cargarTareas = async () => {
    try {
      setCargando(true);
      const data = await getTareas();
      setTareas(data);
    } catch {
      Swal.fire("Error", "No se pudieron cargar las tareas", "error");
    } finally {
      setCargando(false);
    }
  };

  const validar = () => {
    const e = {};
    if (!form.titulo.trim()) e.titulo = "El título es obligatorio";
    return e;
  };

  const handleGuardar = async () => {
    const e = validar();
    if (Object.keys(e).length > 0) { setErrores(e); return; }
    setGuardando(true);
    try {
      if (editandoId) {
        const actualizada = await actualizarTarea(editandoId, form);
        setTareas(tareas.map((t) => (t.id === editandoId ? actualizada : t)));
        Swal.fire({ icon: "success", title: "Tarea actualizada", timer: 1500, showConfirmButton: false });
      } else {
        const nueva = await crearTarea(form);
        setTareas([nueva, ...tareas]);
        Swal.fire({ icon: "success", title: "Tarea creada", timer: 1500, showConfirmButton: false });
      }
      setForm(EMPTY_FORM);
      setEditandoId(null);
      setShowForm(false);
    } catch {
      Swal.fire("Error", "No se pudo guardar la tarea", "error");
    } finally {
      setGuardando(false);
    }
  };

  const handleEditar = (tarea) => {
    setForm({
      titulo: tarea.titulo,
      descripcion: tarea.descripcion || "",
      fechaVencimiento: tarea.fechaVencimiento || "",
      estado: tarea.estado,
    });
    setEditandoId(tarea.id);
    setShowForm(true);
    setErrores({});
  };

  const handleEliminar = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar tarea?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;
    try {
      await eliminarTarea(id);
      setTareas(tareas.filter((t) => t.id !== id));
      Swal.fire({ icon: "success", title: "Tarea eliminada", timer: 1500, showConfirmButton: false });
    } catch {
      Swal.fire("Error", "No se pudo eliminar la tarea", "error");
    }
  };

  const handleCambiarEstado = async (id, nuevoEstado) => {
    const tarea = tareas.find((t) => t.id === id);
    try {
      const actualizada = await actualizarTarea(id, { ...tarea, estado: nuevoEstado });
      setTareas(tareas.map((t) => (t.id === id ? actualizada : t)));
    } catch {
      Swal.fire("Error", "No se pudo cambiar el estado", "error");
    }
  };

  const handleCancelar = () => {
    setForm(EMPTY_FORM);
    setEditandoId(null);
    setShowForm(false);
    setErrores({});
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Lora:wght@400;500&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet" />
      <Header usuario={usuario} />

      <main style={{ flex: 1, maxWidth: 520, width: "100%", margin: "0 auto", padding: "2rem 1rem" }}>
        {/* Top bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h2 style={{ fontFamily: "'Lora', serif", fontSize: 20, fontWeight: 500, margin: 0, color: "#111827" }}>
              Mis tareas
            </h2>
            {tareas.length > 0 && (
              <span style={{ fontSize: 12, color: "#9CA3AF", background: "#F3F4F6", padding: "2px 10px", borderRadius: 20, fontWeight: 500 }}>
                {tareas.length}
              </span>
            )}
          </div>
          {!showForm && (
            <button
              onClick={() => { setForm(EMPTY_FORM); setEditandoId(null); setShowForm(true); setErrores({}); }}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 10, border: "none", background: "#111827", color: "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer" }}
            >
              + Nueva tarea
            </button>
          )}
        </div>

        {/* Formulario */}
        {showForm && (
          <div style={{ background: "#fff", border: "1.5px solid #A5B4FC", borderRadius: 16, padding: "1.5rem", marginBottom: 12, boxShadow: "0 0 0 3px rgba(165,180,252,0.12)" }}>
            <p style={{ fontFamily: "'Lora', serif", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "#9CA3AF", margin: "0 0 1.25rem" }}>
              {editandoId ? "Editar tarea" : "Nueva tarea"}
            </p>

            {/* Título */}
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#6B7280", marginBottom: 5 }}>Título *</label>
              <input
                type="text"
                placeholder="¿Qué hay que hacer?"
                value={form.titulo}
                onChange={(e) => { setForm({ ...form, titulo: e.target.value }); setErrores({ ...errores, titulo: "" }); }}
                style={{ width: "100%", border: `1px solid ${errores.titulo ? "#EF4444" : "#E5E7EB"}`, borderRadius: 10, padding: "9px 13px", fontSize: 15, fontFamily: "'Lora', serif", color: "#111827", background: "#FAFAFA", outline: "none", boxSizing: "border-box" }}
              />
              {errores.titulo && <span style={{ fontSize: 12, color: "#EF4444" }}>{errores.titulo}</span>}
            </div>

            {/* Descripción */}
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#6B7280", marginBottom: 5 }}>Descripción</label>
              <textarea
                placeholder="Agrega más detalles…"
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                style={{ width: "100%", border: "1px solid #E5E7EB", borderRadius: 10, padding: "9px 13px", fontSize: 14, fontFamily: "'DM Sans', sans-serif", color: "#111827", background: "#FAFAFA", outline: "none", resize: "none", minHeight: 80, boxSizing: "border-box" }}
              />
            </div>

            {/* Fecha */}
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#6B7280", marginBottom: 5 }}>Fecha de vencimiento</label>
              <input
                type="date"
                value={form.fechaVencimiento}
                onChange={(e) => setForm({ ...form, fechaVencimiento: e.target.value })}
                style={{ width: "100%", border: "1px solid #E5E7EB", borderRadius: 10, padding: "9px 13px", fontSize: 14, fontFamily: "'DM Sans', sans-serif", color: "#111827", background: "#FAFAFA", outline: "none", boxSizing: "border-box" }}
              />
            </div>

            {/* Estado */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 7, paddingTop: "1.25rem", borderTop: "1px solid #F3F4F6" }}>
              {ESTADOS.map((est) => (
                <button
                  key={est}
                  onClick={() => setForm({ ...form, estado: est })}
                  style={{
                    padding: "8px 6px", borderRadius: 9, fontSize: 11, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                    border: `1.5px solid ${form.estado === est ? (est === "Pendiente" ? "#FED7AA" : est === "En Progreso" ? "#BFDBFE" : "#BBF7D0") : "#E5E7EB"}`,
                    background: form.estado === est ? (est === "Pendiente" ? "#FFF7ED" : est === "En Progreso" ? "#EFF6FF" : "#F0FDF4") : "#FAFAFA",
                    color: form.estado === est ? (est === "Pendiente" ? "#C2410C" : est === "En Progreso" ? "#1D4ED8" : "#15803D") : "#9CA3AF",
                  }}
                >
                  {est}
                </button>
              ))}
            </div>

            {/* Acciones */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: "1.25rem", paddingTop: "1.25rem", borderTop: "1px solid #F3F4F6" }}>
              <button onClick={handleCancelar} style={{ padding: "8px 16px", borderRadius: 9, border: "1px solid #E5E7EB", background: "transparent", color: "#6B7280", fontSize: 13, cursor: "pointer" }}>
                Cancelar
              </button>
              <button
                onClick={handleGuardar}
                disabled={guardando || !form.titulo.trim()}
                style={{ padding: "8px 18px", borderRadius: 9, border: "none", background: "#111827", color: "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer", opacity: (!form.titulo.trim() || guardando) ? 0.4 : 1 }}
              >
                {guardando ? "Guardando…" : editandoId ? "Actualizar" : "Guardar tarea"}
              </button>
            </div>
          </div>
        )}

        {/* Lista de tareas */}
        {cargando ? (
          <p style={{ textAlign: "center", color: "#9CA3AF", padding: "2rem" }}>Cargando tareas…</p>
        ) : tareas.length === 0 && !showForm ? (
          <div style={{ textAlign: "center", padding: "2.5rem 1rem", color: "#9CA3AF", fontSize: 14, border: "1.5px dashed #E5E7EB", borderRadius: 16 }}>
            No hay tareas aún. ¡Crea una!
          </div>
        ) : (
          tareas.map((tarea) => (
            <TaskCard
              key={tarea.id}
              task={{
                ...tarea,
                title: tarea.titulo,
                description: tarea.descripcion,
                status: mapEstado(tarea.estado),
              }}
              onDelete={() => handleEliminar(tarea.id)}
              onEdit={() => handleEditar(tarea)}
              onStatusChange={(_, nuevoEstado) =>
                handleCambiarEstado(tarea.id, unmapEstado(nuevoEstado))
              }
              fechaVencimiento={tarea.fechaVencimiento}
            />
          ))
        )}
      </main>

      <Footer />
    </div>
  );
}

// Mapeos entre estados de la API y los de CardTask
function mapEstado(estado) {
  if (estado === "En Progreso") return "in-progress";
  if (estado === "Completada") return "completed";
  return "pending";
}
function unmapEstado(status) {
  if (status === "in-progress") return "En Progreso";
  if (status === "completed") return "Completada";
  return "Pendiente";
}