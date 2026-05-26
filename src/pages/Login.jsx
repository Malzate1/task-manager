import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const DEPARTAMENTOS = ["Desarrollo", "Diseño", "Marketing", "Recursos Humanos", "Finanzas"];

const Login = () => {
  const [nombre, setNombre] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [errores, setErrores] = useState({});
  const navigate = useNavigate();

  const validar = () => {
    const e = {};
    if (!nombre.trim()) e.nombre = "El nombre es obligatorio";
    if (!departamento) e.departamento = "Selecciona un departamento";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const erroresEncontrados = validar();
    if (Object.keys(erroresEncontrados).length > 0) {
      setErrores(erroresEncontrados);
      return;
    }
    localStorage.setItem("taskapp_user", JSON.stringify({ nombre: nombre.trim(), departamento }));
    navigate("/task");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "'DM Sans', sans-serif", background: "#F9FAFB" }}>
      <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet" />

      <Header />

      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1rem" }}>
        <div style={{ width: "100%", maxWidth: 420 }}>

          {/* Card */}
          <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 20, padding: "2.5rem 2rem", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>

            {/* Icono + título */}
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              
              <h1 style={{ fontFamily: "'Lora', serif", fontSize: 22, fontWeight: 500, color: "#111827", margin: "0 0 6px" }}>
                Bienvenido
              </h1>
              <p style={{ fontSize: 14, color: "#9CA3AF", margin: 0 }}>
                Ingresa tus datos para ver el panel de tareas
              </p>
            </div>

            {/* Campo nombre */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 6 }}>
                Nombre de usuario
              </label>
              <input
                type="text"
                placeholder="Ej: Carlos Mora"
                value={nombre}
                onChange={(e) => { setNombre(e.target.value); setErrores((p) => ({ ...p, nombre: "" })); }}
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: 10, fontSize: 14,
                  border: `1.5px solid ${errores.nombre ? "#EF4444" : "#E5E7EB"}`,
                  background: "#FAFAFA", color: "#111827", outline: "none",
                  fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box",
                  transition: "border-color 0.15s"
                }}
                onFocus={(e) => e.target.style.borderColor = "#A5B4FC"}
                onBlur={(e) => e.target.style.borderColor = errores.nombre ? "#EF4444" : "#E5E7EB"}
              />
              {errores.nombre && (
                <span style={{ fontSize: 12, color: "#EF4444", marginTop: 4, display: "block" }}>
                  {errores.nombre}
                </span>
              )}
            </div>

            {/* Campo departamento */}
            <div style={{ marginBottom: "1.75rem" }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 6 }}>
                Departamento
              </label>
              <select
                value={departamento}
                onChange={(e) => { setDepartamento(e.target.value); setErrores((p) => ({ ...p, departamento: "" })); }}
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: 10, fontSize: 14,
                  border: `1.5px solid ${errores.departamento ? "#EF4444" : "#E5E7EB"}`,
                  background: "#FAFAFA", color: departamento ? "#111827" : "#9CA3AF",
                  outline: "none", fontFamily: "'DM Sans', sans-serif",
                  boxSizing: "border-box", cursor: "pointer", appearance: "none",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center",
                }}
              >
                <option value="">Selecciona tu departamento</option>
                {DEPARTAMENTOS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              {errores.departamento && (
                <span style={{ fontSize: 12, color: "#EF4444", marginTop: 4, display: "block" }}>
                  {errores.departamento}
                </span>
              )}
            </div>

            {/* Botón */}
            <button
              onClick={handleSubmit}
              style={{
                width: "100%", padding: "11px", borderRadius: 10, border: "none",
                background: "#111827", color: "#fff", fontSize: 14, fontWeight: 500,
                fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
                transition: "background 0.15s, transform 0.1s",
              }}
              onMouseEnter={(e) => e.target.style.background = "#374151"}
              onMouseLeave={(e) => e.target.style.background = "#111827"}
              onMouseDown={(e) => e.target.style.transform = "scale(0.98)"}
              onMouseUp={(e) => e.target.style.transform = "scale(1)"}
            >
              Ingresar 
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;