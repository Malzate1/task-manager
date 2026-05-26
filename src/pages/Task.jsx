import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { TaskCard } from "../components/CardTask";
import Spinner from "../components/Spinner";
import FiltroEstado from "../components/FiltroEstado";
import EmptyState from "../components/EmptyState";
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
  const [filtro, setFiltro] = useState("todos");

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

  const tareasFiltradas = filtro === "todos"
    ? tareas
    : tareas.filter((t) => t.estado === filtro);

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
      setForm(EMPTY_FORM); setEditandoId(null); setShowForm(false);
    } catch {
      Swal.fire("Error", "No se pudo guardar la tarea", "error");
    } finally {
      setGuardando(false);
    }
  };

  const handleEditar = (tarea) => {
    setForm({ titulo: tarea.titulo, descripcion: tarea.descripcion || "", fechaVencimiento: tarea.fechaVencimiento || "", estado: tarea.estado });
    setEditandoId(tarea.id);
    setShowForm(true);
    setErrores({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEliminar = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar tarea?", text: "Esta acción no se puede deshacer.",
      icon: "warning", showCancelButton: true,
      confirmButtonColor: "#EF4444", cancelButtonColor: "#6B7280",
      confirmButtonText: "Sí, eliminar", cancelButtonText: "Cancelar",
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
    setForm(EMPTY_FORM); setEditandoId(null); setShowForm(false); setErrores({});
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "'DM Sans', sans-serif", background: "#F9FAFB" }}>
      <link href="https://fonts.googleapis.com/css2?family=Lora:wght@400;500&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet" />
      <style>{`
        .tablero-main { flex: 1; width: 100%; max-width: 560px; margin: 0 auto; padding: 2rem 1rem; box-sizing: border-box; }
        .top-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; gap: 8px; flex-wrap: wrap; }
        .top-left { display: flex; align-items: center; gap: 10px; }
        .top-title { font-family: 'Lora', serif; font-size: 20px; font-weight: 500; margin: 0; color: #111827; }
        .count-badge { font-size: 12px; color: #9CA3AF; background: #F3F4F6; padding: 2px 10px; border-radius: 20px; font-weight: 500; }
        .btn-new { display: inline-flex; align-items: center; gap: 6px; padding: 9px 18px; border-radius: 10px; border: none; background: #111827; color: #fff; font-size: 13px; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; white-space: nowrap; }
        .btn-new:hover { background: #374151; }
        .form-card { background: #fff; border: 1.5px solid #A5B4FC; border-radius: 16px; padding: 1.5rem; margin-bottom: 16px; box-shadow: 0 0 0 3px rgba(165,180,252,0.12); }
        .field-label { display: block; font-size: 12px; font-weight: 500; color: #6B7280; margin-bottom: 5px; }
        .field-input { width: 100%; border: 1px solid #E5E7EB; border-radius: 10px; padding: 9px 13px; font-size: 14px; font-family: 'DM Sans', sans-serif; color: #111827; background: #FAFAFA; outline: none; box-sizing: border-box; }
        .field-input:focus { border-color: #A5B4FC; box-shadow: 0 0 0 3px rgba(165,180,252,0.15); }
        .field-input.title-f { font-family: 'Lora', serif; font-size: 15px; }
        textarea.field-input { resize: none; min-height: 80px; line-height: 1.6; }
        .estado-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 7px; padding-top: 1.25rem; border-top: 1px solid #F3F4F6; margin-top: 1rem; }
        .estado-btn { padding: 8px 4px; border-radius: 9px; font-size: 11px; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; border: 1.5px solid #E5E7EB; background: #FAFAFA; color: #9CA3AF; transition: all 0.15s; }
        .form-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 1.25rem; padding-top: 1.25rem; border-top: 1px solid #F3F4F6; }
        .btn-cancel { padding: 8px 16px; border-radius: 9px; border: 1px solid #E5E7EB; background: transparent; color: #6B7280; font-size: 13px; cursor: pointer; font-family: 'DM Sans', sans-serif; }
        .btn-save { padding: 8px 18px; border-radius: 9px; border: none; background: #111827; color: #fff; font-size: 13px; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; }
        .btn-save:disabled { opacity: 0.35; cursor: not-allowed; }
        @media (max-width: 480px) {
          .tablero-main { padding: 1.25rem 0.75rem; }
          .top-title { font-size: 17px; }
          .btn-new { padding: 8px 14px; font-size: 12px; }
          .form-card { padding: 1.25rem; }
          .estado-grid { grid-template-columns: repeat(3,1fr); gap: 5px; }
        }
      `}</style>

      <Header usuario={usuario} />

      <main className="tablero-main">
        {/* Top bar */}
        <div className="top-bar">
          <div className="top-left">
            <h2 className="top-title">Mis tareas</h2>
            {tareas.length > 0 && <span className="count-badge">{tareas.length}</span>}
          </div>
          {!showForm && (
            <button className="btn-new" onClick={() => { setForm(EMPTY_FORM); setEditandoId(null); setShowForm(true); setErrores({}); }}>
              + Nueva tarea
            </button>
          )}
        </div>

        {/* Formulario */}
        {showForm && (
          <div className="form-card">
            <p style={{ fontFamily: "'Lora', serif", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "#9CA3AF", margin: "0 0 1.25rem" }}>
              {editandoId ? "Editar tarea" : "Nueva tarea"}
            </p>

            <div style={{ marginBottom: "1rem" }}>
              <label className="field-label">Título *</label>
              <input
                className="field-input title-f"
                type="text"
                placeholder="¿Qué hay que hacer?"
                value={form.titulo}
                onChange={(e) => { setForm({ ...form, titulo: e.target.value }); setErrores({ ...errores, titulo: "" }); }}
                style={{ borderColor: errores.titulo ? "#EF4444" : undefined }}
              />
              {errores.titulo && <span style={{ fontSize: 12, color: "#EF4444" }}>{errores.titulo}</span>}
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label className="field-label">Descripción</label>
              <textarea className="field-input" placeholder="Agrega más detalles…" value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
            </div>

            <div style={{ marginBottom: "0.5rem" }}>
              <label className="field-label">Fecha de vencimiento</label>
              <input className="field-input" type="date" value={form.fechaVencimiento} onChange={(e) => setForm({ ...form, fechaVencimiento: e.target.value })} />
            </div>

            <div className="estado-grid">
              {ESTADOS.map((est) => {
                const activo = form.estado === est;
                const colores = { "Pendiente": ["#FFF7ED","#FED7AA","#C2410C"], "En Progreso": ["#EFF6FF","#BFDBFE","#1D4ED8"], "Completada": ["#F0FDF4","#BBF7D0","#15803D"] };
                const [bg, border, color] = colores[est];
                return (
                  <button key={est} className="estado-btn" onClick={() => setForm({ ...form, estado: est })}
                    style={activo ? { background: bg, borderColor: border, color } : {}}>
                    {est}
                  </button>
                );
              })}
            </div>

            <div className="form-actions">
              <button className="btn-cancel" onClick={handleCancelar}>Cancelar</button>
              <button className="btn-save" onClick={handleGuardar} disabled={guardando || !form.titulo.trim()}>
                {guardando ? "Guardando…" : editandoId ? "Actualizar" : "Guardar tarea"}
              </button>
            </div>
          </div>
        )}

        {/* Filtros */}
        {!cargando && tareas.length > 0 && (
          <FiltroEstado filtro={filtro} onChange={setFiltro} />
        )}

        {/* Lista */}
        {cargando ? (
          <Spinner />
        ) : tareasFiltradas.length === 0 ? (
          <EmptyState filtro={filtro} />
        ) : (
          tareasFiltradas.map((tarea) => (
            <TaskCard
              key={tarea.id}
              task={{ ...tarea, title: tarea.titulo, description: tarea.descripcion, status: mapEstado(tarea.estado) }}
              onDelete={() => handleEliminar(tarea.id)}
              onEdit={() => handleEditar(tarea)}
              onStatusChange={(_, s) => handleCambiarEstado(tarea.id, unmapEstado(s))}
              fechaVencimiento={tarea.fechaVencimiento}
            />
          ))
        )}
      </main>

      <Footer />
    </div>
  );
}

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