import React, { useState, useEffect } from "react";
import { useCarrito } from "../hooks/useCarrito";
import "./Carrito.css";

declare global {
  interface Window {
    dataLayer: any[];
  }
}

const Carrito: React.FC = () => {
  const {
    carrito,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    total,
  } = useCarrito();

  const [mensajePago, setMensajePago] = useState<string>("");

  // REGISTRO DE COMPRA APROBADA
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const status = params.get("status");
    const collectionStatus = params.get("collection_status");

    const pagoAprobado =
      status === "approved" || collectionStatus === "approved";

    if (!pagoAprobado) return;

    setMensajePago("✅ Pago aprobado. Tu pedido fue registrado.");

    const ordenGuardada = localStorage.getItem("ultima_orden_mp");

    if (!ordenGuardada) {
      console.error("No se encontró la orden.");
      return;
    }

    let orden;

    try {
      orden = JSON.parse(ordenGuardada);
    } catch (error) {
      console.error("Error al recuperar la orden:", error);
      return;
    }

    if (
      !orden?.pedidoId ||
      !Array.isArray(orden.items) ||
      orden.items.length === 0
    ) {
      console.error("Orden inválida.");
      return;
    }

    const txId = String(orden.pedidoId);
    const yaRegistrada = localStorage.getItem(`ga4_tx_${txId}`);

    if (yaRegistrada) {
      console.log("Compra ya registrada:", txId);
      return;
    }

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ ecommerce: null });

    window.dataLayer.push({
      event: "purchase",
      ecommerce: {
        transaction_id: txId,
        currency: "ARS",
        value: Number(orden.value),
        items: orden.items,
      },
    });

    console.log("🚀 GA4 purchase enviado:", txId);

    localStorage.setItem(`ga4_tx_${txId}`, "true");
    localStorage.removeItem("ultima_orden_mp");
  }, []);

  // INICIO DEL PROCESO DE PAGO
  const pagar = async () => {
    if (carrito.length === 0) return;

    const itemsFormateados = carrito.map((item) => ({
      item_id: String(item.id),
      item_name: item.nombre,
      price: Number(item.precio),
      quantity: item.cantidad,
    }));

    // 1. Disparamos begin_checkout al dataLayer al hacer clic
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ ecommerce: null });

    window.dataLayer.push({
      event: "begin_checkout",
      ecommerce: {
        currency: "ARS",
        value: Number(total),
        items: itemsFormateados,
      },
    });

    try {
      const pedidoRes = await fetch(
        "https://lucasferrara015dev.pythonanywhere.com/api/crear-pedido",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "cliente@test.com",
            nombre: "Cliente Test",
            direccion: "Calle Falsa 123",
            carrito: carrito.map((item) => ({
              id: item.id,
              nombre: item.nombre,
              precio: item.precio,
              cantidad: item.cantidad,
            })),
          }),
        }
      );

      if (!pedidoRes.ok) {
        throw new Error("No se pudo crear el pedido.");
      }

      const pedidoData = await pedidoRes.json();
      const pedidoId = pedidoData.pedido_id;

      if (!pedidoId) {
        throw new Error("El servidor no devolvió un ID de pedido.");
      }

      const prefRes = await fetch(
        "https://lucasferrara015dev.pythonanywhere.com/api/crear-preferencia",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pedido_id: pedidoId,
            carrito: carrito.map((item) => ({
              nombre: item.nombre,
              cantidad: item.cantidad,
              precio: item.precio,
            })),
          }),
        }
      );

      if (!prefRes.ok) {
        throw new Error("No se pudo crear la preferencia de pago.");
      }

      const prefData = await prefRes.json();

      if (prefData.init_point) {
        localStorage.setItem(
          "ultima_orden_mp",
          JSON.stringify({
            pedidoId,
            value: Number(total),
            items: itemsFormateados,
          })
        );

        // ⏱️ Damos 300ms para que GTM alcance a capturar begin_checkout antes de redirigir
        setTimeout(() => {
          window.location.href = prefData.init_point;
        }, 300);
      } else {
        throw new Error("Mercado Pago no devolvió init_point.");
      }
    } catch (error) {
      console.error("Error en el flujo de pago:", error);
      alert("Hubo un problema al procesar el pago.");
    }
  };

  return (
    <div id="carrito" className="carrito-container">
      <h2>🛒 Tu Carrito</h2>

      {mensajePago && <div className="aviso">{mensajePago}</div>}

      {carrito.length === 0 && (
        <p>No hay productos en el carrito.</p>
      )}

      {carrito.map((item) => (
        <div key={item.id} className="carrito-item">
          <span className="item-nombre">{item.nombre}</span>
          <span className="item-precio">${item.precio}</span>

          <div className="cantidad-control">
            <button
              className="btn-cantidad"
              onClick={() => decreaseQuantity(item.id)}
            >
              -
            </button>

            <span className="cantidad-numero">
              {item.cantidad}
            </span>

            <button
              className="btn-cantidad"
              onClick={() => increaseQuantity(item.id)}
            >
              +
            </button>
          </div>

          <button
            className="btn-quitar"
            onClick={() => removeItem(item.id)}
          >
            Quitar
          </button>
        </div>
      ))}

      {carrito.length > 0 && (
        <>
          <hr />

          <h3>
            Total:{" "}
            <span className="total">
              ${total.toLocaleString("es-AR", {
                minimumFractionDigits: 2,
              })}
            </span>
          </h3>

          <button onClick={pagar} className="btn-pagar">
            Finalizar compra
          </button>
        </>
      )}
    </div>
  );
};

export default Carrito;
