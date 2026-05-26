export default function Spinner() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "3rem 1rem", gap: 12 }}>
      <div style={{
        width: 36, height: 36, borderRadius: "50%",
        border: "3px solid #E5E7EB", borderTopColor: "#111827",
        animation: "spin 0.7s linear infinite"
      }} />
      <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0 }}>Cargando tareas…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}