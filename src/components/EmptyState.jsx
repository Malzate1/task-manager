export default function EmptyState({ filtro }) {
  return (
    <div style={{
      textAlign: "center", padding: "2.5rem 1rem", color: "#9CA3AF",
      fontSize: 14, border: "1.5px dashed #E5E7EB", borderRadius: 16
    }}>
      <span style={{ fontSize: 32, display: "block", marginBottom: 10 }}>📋</span>
      {filtro === "todos"
        ? "No hay tareas aún. ¡Crea una!"
        : `No hay tareas con estado "${filtro}".`}
    </div>
  );
}