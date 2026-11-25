import React from "react";
import { useCarrito } from "../hooks/useCarrito";

// 1. Declaración global para que TypeScript reconozca el dataLayer
declare global {
  interface Window {
    dataLayer: any[];
  }
}

// 2. Definimos la interfaz con la estructura exacta de tu producto
interface ProductoType {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
  imagen: string;
  descripcion?: string;
  cantidad?: number; 
}

interface ProductoProps {
  producto: ProductoType;
}

const Producto: React.FC<ProductoProps> = ({ producto }) => {
  const { addItem } = useCarrito();

  const handleAddToCart = () => {
    // 3. Disparamos el evento de GA4 al dataLayer al hacer clic
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "add_to_cart",
      ecommerce: {
        currency: "ARS",
        value: producto.precio,
        items: [
          {
            item_id: producto.id.toString(), // Convertido a string por estándar de GA4
            item_name: producto.nombre,
            price: producto.precio,
            quantity: 1,
          },
        ],
      },
    });

    // 4. Añadimos el producto al carrito mediante tu hook sin errores de TS
    addItem({ ...producto, cantidad: 1 } as any);
  };

  return (
    <div className="card h-100 shadow-sm">
      <img
        src={producto.imagen}
        className="card-img-top"
        alt={producto.nombre}
      />
      <div className="card-body">
        <h5 className="card-title">{producto.nombre}</h5>
        <p className="card-text">{producto.descripcion}</p>
        <p className="card-text font-weight-bold text-primary">
          ${producto.precio}
        </p>
        <button
          className="btn btn-primary"
          onClick={handleAddToCart}
        >
          Añadir al carrito
        </button>
      </div>
    </div>
  );
};

export default Producto;