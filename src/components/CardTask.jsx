

import { useState } from "react";

const STATUS_CONFIG = {
  pending: {
    label: "Pendiente",
    icon: "ti-clock",
    bg: "#FFF7ED",
    border: "#FED7AA",
    text: "#C2410C",
    dot: "#F97316",
  },
  "in-progress": {
    label: "En progreso",
    icon: "ti-loader-2",
    bg: "#EFF6FF",
    border: "#BFDBFE",
    text: "#1D4ED8",
    dot: "#3B82F6",
  },
  completed: {
    label: "Completada",
    icon: "ti-circle-check",
    bg: "#F0FDF4",
    border: "#BBF7D0",
    text: "#15803D",
    dot: "#22C55E",
  },
};

const EMPTY_FORM = { title: "", description: "", status: "pending" };

function TaskForm({ onSave, onCancel }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const current = STATUS_CONFIG[form.status];

  const handleSave = () => {
    if (!form.title.trim()) return;
    onSave({ ...form, id: Date.now() });
    setForm(EMPTY_FORM);
  };

  return (
    <div className="card-task form-card">
      <div className="card-header">
        <span className="card-label">Nueva tarea</span>
        <span
          className="status-badge"
          style={{ background: current.bg, borderColor: current.border, color: current.text }}
        >
          <span className="status-dot" style={{ background: current.dot }} />
          {current.label}
        </span>
      </div>

      <div className="field-group">
        <label className="field-label">Título</label>
        <input
          className="field-input title-input"
          type="text"
          placeholder="¿Qué hay que hacer?"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
      </div>

      <div className="field-group">
        <label className="field-label">Descripción</label>
        <textarea
          className="field-input"
          placeholder="Agrega más detalles sobre esta tarea…"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>

      <div className="status-selector">
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
          <button
            key={key}
            className={`status-option ${form.status === key ? `active-${key}` : ""}`}
            onClick={() => setForm({ ...form, status: key })}
          >
            <i className={`ti ${cfg.icon}`} aria-hidden="true" />
            {cfg.label}
          </button>
        ))}
      </div>

      <div className="form-actions">
        <button className="btn-cancel" onClick={onCancel}>Cancelar</button>
        <button
          className="btn-save"
          onClick={handleSave}
          disabled={!form.title.trim()}
        >
          <i className="ti ti-plus" aria-hidden="true" />
          Guardar tarea
        </button>
      </div>
    </div>
  );
}

function TaskCard({ task, onDelete, onStatusChange }) {
  const cfg = STATUS_CONFIG[task.status];
  return (
    <div className="card-task task-item">
      <div className="card-header">
        <h3 className="task-title">{task.title}</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            className="status-badge"
            style={{ background: cfg.bg, borderColor: cfg.border, color: cfg.text }}
          >
            <span className="status-dot" style={{ background: cfg.dot }} />
            {cfg.label}
          </span>
          <button className="btn-delete" onClick={() => onDelete(task.id)} aria-label="Eliminar tarea">
            <i className="ti ti-trash" aria-hidden="true" />
          </button>
        </div>
      </div>
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}
      <div className="status-selector mini">
        {Object.entries(STATUS_CONFIG).map(([key, c]) => (
          <button
            key={key}
            className={`status-option ${task.status === key ? `active-${key}` : ""}`}
            onClick={() => onStatusChange(task.id, key)}
          >
            <i className={`ti ${c.icon}`} aria-hidden="true" />
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function CardTask() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const addTask = (task) => {
    setTasks([task, ...tasks]);
    setShowForm(false);
  };

  const deleteTask = (id) => setTasks(tasks.filter((t) => t.id !== id));

  const changeStatus = (id, status) =>
    setTasks(tasks.map((t) => (t.id === id ? { ...t, status } : t)));

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.7.0/dist/tabler-icons.min.css"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@400;500&display=swap"
        rel="stylesheet"
      />

      <style>{`
        .task-root * { box-sizing: border-box; }
        .task-root {
          font-family: 'DM Sans', sans-serif;
          max-width: 480px;
          width: 100%;
        }

        .top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
        }

        .top-title {
          font-family: 'Lora', serif;
          font-size: 18px;
          font-weight: 500;
          color: #111827;
          margin: 0;
        }

        .task-count {
          font-size: 12px;
          color: #9CA3AF;
          background: #F3F4F6;
          padding: 2px 10px;
          border-radius: 20px;
          font-weight: 500;
        }

        .btn-new {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 10px;
          border: none;
          background: #111827;
          color: #FFFFFF;
          font-size: 13px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: background 0.15s ease, transform 0.1s ease;
        }
        .btn-new:hover { background: #374151; }
        .btn-new:active { transform: scale(0.97); }
        .btn-new i { font-size: 15px; }

        .card-task {
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 16px;
          padding: 1.5rem;
          width: 100%;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.03);
          margin-bottom: 12px;
        }

        .form-card {
          border: 1.5px solid #A5B4FC;
          box-shadow: 0 0 0 3px rgba(165,180,252,0.12);
        }

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
          gap: 8px;
        }

        .card-label {
          font-family: 'Lora', serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #9CA3AF;
          flex-shrink: 0;
        }

        .task-title {
          font-family: 'Lora', serif;
          font-size: 15px;
          font-weight: 500;
          color: #111827;
          margin: 0;
          flex: 1;
          min-width: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .task-description {
          font-size: 13px;
          color: #6B7280;
          line-height: 1.6;
          margin: 0 0 1rem;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 3px 9px 3px 7px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 500;
          border: 1px solid;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .status-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .field-group { margin-bottom: 1rem; }

        .field-label {
          display: block;
          font-size: 12px;
          font-weight: 500;
          color: #6B7280;
          margin-bottom: 5px;
        }

        .field-input {
          width: 100%;
          border: 1px solid #E5E7EB;
          border-radius: 10px;
          padding: 9px 13px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: #111827;
          background: #FAFAFA;
          outline: none;
          transition: border-color 0.15s ease, background 0.15s ease;
        }
        .field-input::placeholder { color: #D1D5DB; }
        .field-input:focus {
          border-color: #A5B4FC;
          background: #FFFFFF;
          box-shadow: 0 0 0 3px rgba(165,180,252,0.15);
        }
        .field-input.title-input {
          font-family: 'Lora', serif;
          font-size: 16px;
          font-weight: 500;
        }
        textarea.field-input {
          resize: none;
          min-height: 80px;
          line-height: 1.6;
        }

        .status-selector {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 7px;
          margin-top: 1.25rem;
          padding-top: 1.25rem;
          border-top: 1px solid #F3F4F6;
        }

        .status-option {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          padding: 8px 6px;
          border-radius: 9px;
          border: 1.5px solid #E5E7EB;
          background: #FAFAFA;
          cursor: pointer;
          font-size: 10px;
          font-weight: 500;
          color: #9CA3AF;
          transition: all 0.15s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .status-option:hover { border-color: #D1D5DB; color: #6B7280; }
        .status-option i { font-size: 16px; }

        .status-option.active-pending { background: #FFF7ED; border-color: #FED7AA; color: #C2410C; }
        .status-option.active-in-progress { background: #EFF6FF; border-color: #BFDBFE; color: #1D4ED8; }
        .status-option.active-completed { background: #F0FDF4; border-color: #BBF7D0; color: #15803D; }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          margin-top: 1.25rem;
          padding-top: 1.25rem;
          border-top: 1px solid #F3F4F6;
        }

        .btn-cancel {
          padding: 8px 16px;
          border-radius: 9px;
          border: 1px solid #E5E7EB;
          background: transparent;
          color: #6B7280;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .btn-cancel:hover { background: #F9FAFB; }

        .btn-save {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 18px;
          border-radius: 9px;
          border: none;
          background: #111827;
          color: #FFFFFF;
          font-size: 13px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: background 0.15s ease, opacity 0.15s ease;
        }
        .btn-save:disabled { opacity: 0.35; cursor: not-allowed; }
        .btn-save:not(:disabled):hover { background: #374151; }
        .btn-save i { font-size: 14px; }

        .btn-delete {
          background: transparent;
          border: none;
          cursor: pointer;
          color: #D1D5DB;
          padding: 4px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          transition: color 0.15s ease, background 0.15s ease;
          flex-shrink: 0;
        }
        .btn-delete:hover { color: #EF4444; background: #FEF2F2; }
        .btn-delete i { font-size: 15px; }

        .empty-state {
          text-align: center;
          padding: 2.5rem 1rem;
          color: #9CA3AF;
          font-size: 14px;
          border: 1.5px dashed #E5E7EB;
          border-radius: 16px;
        }
        .empty-state i { font-size: 32px; display: block; margin-bottom: 10px; color: #D1D5DB; }
      `}</style>

      <div className="task-root">
        <div className="top-bar">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h2 className="top-title">Mis tareas</h2>
            {tasks.length > 0 && (
              <span className="task-count">{tasks.length}</span>
            )}
          </div>
          {!showForm && (
            <button className="btn-new" onClick={() => setShowForm(true)}>
              <i className="ti ti-plus" aria-hidden="true" />
              Nueva tarea
            </button>
          )}
        </div>

        {showForm && (
          <TaskForm onSave={addTask} onCancel={() => setShowForm(false)} />
        )}

        {tasks.length === 0 && !showForm ? (
          <div className="empty-state">
            <i className="ti ti-clipboard-list" aria-hidden="true" />
            No hay tareas aún. ¡Crea una!
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={deleteTask}
              onStatusChange={changeStatus}
            />
          ))
        )}
      </div>
    </>
  );
}

export default CardTask;