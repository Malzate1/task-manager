const OPCIONES = [
  { value: "todos", label: "Todas" },
  { value: "Pendiente", label: "Pendiente" },
  { value: "En Progreso", label: "En Progreso" },
  { value: "Completada", label: "Completada" },
];

export default function FiltroEstado({ filtro, onChange }) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: "1.25rem" }}>
      {OPCIONES.map((op) => (
        <button
          key={op.value}
          onClick={() => onChange(op.value)}
          style={{
            padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 500,
            cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            border: `1.5px solid ${filtro === op.value ? "#111827" : "#E5E7EB"}`,
            background: filtro === op.value ? "#111827" : "#FAFAFA",
            color: filtro === op.value ? "#fff" : "#6B7280",
            transition: "all 0.15s",
          }}
        >
          {op.label}
        </button>
      ))}
    </div>
  );
}