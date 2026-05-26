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
    const nuevosErrores = {};
    if (!nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio";
    if (!departamento) nuevosErrores.departamento = "Selecciona un departamento";
    return nuevosErrores;
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
    <>
      <Header />

      <main>
        <h1>Iniciar sesión</h1>

        <form onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="nombre">Nombre de usuario</label>
            <input
              id="nombre"
              type="text"
              placeholder="Ej: Carlos Mora"
              value={nombre}
              onChange={(e) => {
                setNombre(e.target.value);
                setErrores((prev) => ({ ...prev, nombre: "" }));
              }}
            />
            {errores.nombre && <span>{errores.nombre}</span>}
          </div>

          <div>
            <label htmlFor="departamento">Departamento</label>
            <select
              id="departamento"
              value={departamento}
              onChange={(e) => {
                setDepartamento(e.target.value);
                setErrores((prev) => ({ ...prev, departamento: "" }));
              }}
            >
              <option value="">Selecciona tu departamento</option>
              {DEPARTAMENTOS.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            {errores.departamento && <span>{errores.departamento}</span>}
          </div>

          <button type="submit">Ingresar al panel</button>
        </form>
      </main>

      <Footer />
    </>
  );
};

export default Login;