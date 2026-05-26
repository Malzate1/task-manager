
function Header({ usuario, onLogout }) {
  const handleLogout = () => {
    localStorage.clear();
    onLogout();
  };

  return (
    <header>
      <span>{usuario.nombre}</span>
      <span>{usuario.departamento}</span>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </header>
  );
}

export default Header