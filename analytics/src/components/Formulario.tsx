import React, { useState } from "react";

const Formulario: React.FC = () => {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [esError, setEsError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEsError(false);

    try {
      const response = await fetch(
        "https://lucasferrara015dev.pythonanywhere.com/api/suscribir",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setEsError(true);
        setMensaje(data.mensaje || "No se pudo completar la suscripción");
        return;
      }

      setMensaje(data.mensaje);
      setEmail(""); // Limpiamos el input tras suscribirse con éxito

      // 📊 Disparamos generate_lead en GA4 (sin enviar el email por privacidad)
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "generate_lead",
        lead_source: "newsletter_footer",
        form_name: "suscripcion_fitshop",
      });
    } catch (error) {
      console.error("Error en la suscripción:", error);
      setEsError(true);
      setMensaje("Hubo un problema al suscribirte");
    }
  };

  return (
    <div className="subscribe container-fluid my-5 py-5 text-center">
      <h4 className="display-4 text-white font-weight-bold mt-5 mb-3">
        Suscríbete a FitShop
      </h4>
      <p className="text-white mb-4">
        Recibe ofertas exclusivas, lanzamientos de productos y consejos fitness
        directamente en tu correo
      </p>
      <form
        className="form-inline justify-content-center mb-5"
        onSubmit={handleSubmit}
      >
        <div className="input-group">
          <input
            type="email"
            className="form-control-lg"
            placeholder="Tu correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="input-group-append">
            <button className="btn btn-primary" type="submit">
              Suscribirme
            </button>
          </div>
        </div>
      </form>

      {mensaje && (
        <p
          className="mt-3"
          style={{ color: esError ? "#dc3545" : "#28a745", fontWeight: "bold" }}
        >
          {mensaje}
        </p>
      )}
    </div>
  );
};

export default Formulario;