import React from "react";
import { useCarrito } from "../context/CarritoContext";

const Header: React.FC = () => {
  const { carrito, removeItem } = useCarrito();

  const total = carrito.reduce(
    (acc, item) => acc + (Number(item.precio) || 0) * (item.cantidad || 1),
    0
  );

  return (
    <div className="nav-bar">
      <nav className="navbar navbar-expand-lg navbar-dark py-3">
        <a href="#inicio" className="navbar-brand">
          <h1 className="m-0 display-4 font-weight-bold text-uppercase logo-text">
            FitShop
          </h1>
        </a>

        <button
          type="button"
          className="navbar-toggler"
          data-toggle="collapse"
          data-target="#navbarCollapse"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse justify-content-between"
          id="navbarCollapse"
        >
          <div className="navbar-nav ml-auto p-4 bg-dark">
            <a href="#inicio" className="nav-item nav-link active">
              Inicio
            </a>
            <a href="#productos" className="nav-item nav-link">
              Productos
            </a>
            <a href="#contacto" className="nav-item nav-link">
              Contacto
            </a>
            <a href="#carrito" className="nav-item nav-link carrito-link">
              🛒 {carrito.length} - ${total}
            </a>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
