import { useNavigate } from "react-router-dom";
import { removeLocalStorage } from "../helpers/local-storage";

function Header({ usuario }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeLocalStorage("taskapp_user");
    navigate("/login");
  };

  return (
    <header style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "12px 24px", borderBottom: "1px solid #E5E7EB",
      fontFamily: "'DM Sans', sans-serif", background: "#fff"
    }}>
      <span style={{ fontFamily: "'Lora', serif", fontWeight: 500, fontSize: 18, color: "#111827" }}>
        Task Maker
      </span>
      {usuario && (
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 14, color: "#374151" }}>
            <strong>{usuario.nombre}</strong>
            <span style={{ color: "#9CA3AF", marginLeft: 8 }}>{usuario.departamento}</span>
          </span>
          <button
            onClick={handleLogout}
            style={{
              padding: "7px 14px", borderRadius: 8, border: "1px solid #E5E7EB",
              background: "transparent", color: "#6B7280", fontSize: 13,
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
            }}
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;