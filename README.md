# 🏋️ FitShop Backend
Backend de FitShop desarrollado en Flask.
Provee una API REST para el catálogo de productos, suscripción de usuarios y flujo de pagos con Mercado Pago.
Incluye scripts de inicialización de base de datos y endpoints listos para integrarse con el frontend en React.
# 🚀 Tecnologías
- Python 3 + Flask

- SQLite (base de datos inicial)

- Mercado Pago SDK

- Scripts de inicialización (init_db.py)

# 📂 Instalación
1. Clonar el repositorio:
   git clone https://github.com/lucasferrara015/fitshop-backend.git
cd fitshop-backend
2. Crear entorno virtual e instalar dependencias:
   pip install -r requirements.txt
3. Inicializar base de datos:
   python init_db.py
4. Ejecutar servidor:
   flask run
## 🔗 Relación con el frontend

Este backend expone endpoints que son consumidos por el proyecto [**fitshop-frontend**](https://github.com/lucasferrara015/fitshop-frontend):

- `/api/productos` → catálogo de productos  
- `/api/suscribir` → suscripción de usuarios vía email  
- `/api/pago` → integración con Mercado Pago (checkout sandbox)  

El frontend, desarrollado en React/TSX, se conecta a estos endpoints para mostrar el catálogo, gestionar el carrito y completar el flujo de pago.


# 📌 Próximos pasos
- Autenticación de usuarios.

- Panel de administración para gestión de productos.

- Integración de envíos y logística.

## 🔗 Demo del proyecto

El frontend de FitShop está disponible en CodeSandbox para pruebas rápidas:  
[Ver demo en CodeSandbox](https://4jdv7h.csb.app/)

Este backend se integra con fitshop-frontend para ofrecer un flujo completo de catálogo, suscripción, carrito y pagos.

