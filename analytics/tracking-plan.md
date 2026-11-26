# Plan de Medición (Tracking Plan) — FitShop

## 1. Configuración General
* **Contenedor GTM:** Conectado en el frontend (React + TypeScript).
* **Propiedad GA4:** `G-EBC6QLZ7H4` (Flujo: *Web Tienda*).
* **Política de Privacidad (PII):** Prohibido enviar correos electrónicos, nombres o datos sensibles al `dataLayer`.

---

## 2. Diccionario de Eventos

| Evento GA4 | Tipo | Disparador / Condición | Regla de Negocio / Gobernanza |
| :--- | :--- | :--- | :--- |
| `view_item_list` | Estándar E-commerce | Renderizado del catálogo de productos en `ProductsSection.tsx`. | Registra exposición de inventario disponible. |
| `add_to_cart` | Estándar E-commerce | Clic en botón "Agregar al carrito". | Mide intención directa sobre producto específico (`item_id`, `item_name`, `price`). |
| `begin_checkout` | Estándar E-commerce | Inicio del flujo hacia preferencia de Mercado Pago. | Marca transición entre carrito local y pasarela externa. |
| `purchase` | **Evento Clave** | Confirmación de compra validada contra backend / webhook. | Evita falsos positivos por cierres de pestaña antes de la redirección. |
| `generate_lead` | **Evento Clave** | Respuesta `HTTP 201` de `POST /api/suscribir` en `Formulario.tsx`. | Desacoplado del `onSubmit`; no dispara si el correo ya existe (`HTTP 409/400`). |

---

## 3. Configuración de Reportes en GA4
* **Eventos Clave (Conversiones):** `purchase` (recuento por evento) y `generate_lead` (recuento por sesión/evento).
* **Exploración de Embudo (*Funnel Exploration*):**
  1. `view_item_list` (Catálogo visto)
  2. `add_to_cart` (Agregado al carrito) — *le sigue indirectamente*
  3. `begin_checkout` (Inicio de pago) — *le sigue indirectamente*
  4. `purchase` (Compra completada) — *le sigue indirectamente*
