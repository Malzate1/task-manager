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

export function TaskCard({ task, onDelete, onStatusChange, onEdit, fechaVencimiento }) {
  const cfg = STATUS_CONFIG[task.status] || STATUS_CONFIG.pending;

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.7.0/dist/tabler-icons.min.css"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Lora:wght@400;500&family=DM+Sans:wght@400;500&display=swap"
        rel="stylesheet"
      />
      <style>{`
        .card-task * { box-sizing: border-box; }
        .card-task {
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 16px;
          padding: 1.25rem 1.5rem;
          width: 100%;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          margin-bottom: 12px;
          font-family: 'DM Sans', sans-serif;
        }
        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          gap: 8px;
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
          margin: 0 0 0.75rem;
        }
        .task-date {
          font-size: 12px;
          color: #9CA3AF;
          margin: 0 0 0.75rem;
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
        .card-actions {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
        }
        .btn-icon {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 5px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          transition: color 0.15s ease, background 0.15s ease;
          flex-shrink: 0;
          color: #D1D5DB;
        }
        .btn-icon.edit:hover  { color: #3B82F6; background: #EFF6FF; }
        .btn-icon.delete:hover { color: #EF4444; background: #FEF2F2; }
        .btn-icon i { font-size: 15px; }
        .status-selector {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 6px;
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid #F3F4F6;
        }
        .status-option {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 7px 4px;
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
        .status-option i { font-size: 14px; }
        .status-option:hover { border-color: #D1D5DB; color: #6B7280; }
        .status-option.active-pending    { background:#FFF7ED; border-color:#FED7AA; color:#C2410C; }
        .status-option.active-in-progress{ background:#EFF6FF; border-color:#BFDBFE; color:#1D4ED8; }
        .status-option.active-completed  { background:#F0FDF4; border-color:#BBF7D0; color:#15803D; }
      `}</style>

      <div className="card-task">
        <div className="card-header">
          <h3 className="task-title">{task.title}</h3>
          <div className="card-actions">
            <span
              className="status-badge"
              style={{ background: cfg.bg, borderColor: cfg.border, color: cfg.text }}
            >
              <span className="status-dot" style={{ background: cfg.dot }} />
              {cfg.label}
            </span>
            <button className="btn-icon edit" onClick={onEdit} aria-label="Editar tarea">
              <i className="ti ti-pencil" />
            </button>
            <button className="btn-icon delete" onClick={onDelete} aria-label="Eliminar tarea">
              <i className="ti ti-trash" />
            </button>
          </div>
        </div>

        {task.description && (
          <p className="task-description">{task.description}</p>
        )}

        {fechaVencimiento && (
          <p className="task-date">📅 Vence: {fechaVencimiento}</p>
        )}

        <div className="status-selector">
          {Object.entries(STATUS_CONFIG).map(([key, c]) => (
            <button
              key={key}
              className={`status-option ${task.status === key ? `active-${key}` : ""}`}
              onClick={() => onStatusChange(task.id, key)}
            >
              <i className={`ti ${c.icon}`} />
              {c.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export default TaskCard;