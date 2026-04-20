# flask_app.py
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import mercadopago
import os

app = Flask(__name__)

# ------------------- CONFIGURACIÓN -------------------
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////home/lucasferrara015dev/tienda.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
CORS(app)

db = SQLAlchemy(app)

# Inicializar SDK de Mercado Pago con token de entorno
sdk = mercadopago.SDK(os.environ.get("MP_ACCESS_TOKEN"))

# ------------------- MODELOS -------------------
class Producto(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    descripcion = db.Column(db.String(200))
    precio = db.Column(db.Float, nullable=False)
    categoria = db.Column(db.String(50))
    imagen = db.Column(db.String(100))

    def to_dict(self):
        return {
            'id': self.id,
            'nombre': self.nombre,
            'descripcion': self.descripcion,
            'precio': self.precio,
            'categoria': self.categoria,
            'imagen': self.imagen
        }

class Suscripcion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    fecha = db.Column(db.DateTime, default=db.func.current_timestamp())

class Pedido(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), nullable=False)
    nombre = db.Column(db.String(100))
    direccion = db.Column(db.String(200))
    total = db.Column(db.Float)
    estado = db.Column(db.String(20), default='pendiente')
    opcion_envio = db.Column(db.String(50))
    costo_envio = db.Column(db.Float, default=0)
    fecha = db.Column(db.DateTime, default=db.func.current_timestamp())

    # Campos de pago
    pago_monto = db.Column(db.Float, nullable=True)
    pago_metodo = db.Column(db.String(50), nullable=True)
    pago_fecha = db.Column(db.DateTime, nullable=True)

    detalles = db.relationship('DetallePedido', backref='pedido', cascade='all, delete-orphan')

class DetallePedido(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    pedido_id = db.Column(db.Integer, db.ForeignKey('pedido.id'), nullable=False)
    producto_id = db.Column(db.Integer, nullable=False)
    nombre_producto = db.Column(db.String(100))
    cantidad = db.Column(db.Integer)
    precio_unitario = db.Column(db.Float)

# ------------------- ENDPOINTS -------------------
@app.route('/api/productos', methods=['GET'])
def get_productos():
    productos = Producto.query.all()
    return jsonify([p.to_dict() for p in productos])

@app.route('/api/suscribir', methods=['POST'])
def suscribir():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({'error': 'Email requerido'}), 400

    existente = Suscripcion.query.filter_by(email=email).first()
    if existente:
        return jsonify({'mensaje': 'Ya estás suscripto'}), 200

    nueva = Suscripcion(email=email)
    db.session.add(nueva)
    db.session.commit()
    return jsonify({'mensaje': 'Suscripción exitosa'}), 201

@app.route('/api/crear-pedido', methods=['POST'])
def crear_pedido():
    data = request.get_json()
    if not data.get('email') or not data.get('carrito'):
        return jsonify({'error': 'Faltan datos'}), 400

    total = sum(item['precio'] * item['cantidad'] for item in data['carrito'])
    costo_envio = 0
    total_con_envio = total + costo_envio

    pedido = Pedido(
        email=data['email'],
        nombre=data.get('nombre'),
        direccion=data.get('direccion'),
        total=total_con_envio,
        opcion_envio=data.get('opcion_envio', 'retiro'),
        costo_envio=costo_envio
    )
    db.session.add(pedido)
    db.session.flush()

    for item in data['carrito']:
        detalle = DetallePedido(
            pedido_id=pedido.id,
            producto_id=item.get('id'),
            nombre_producto=item['nombre'],
            cantidad=item['cantidad'],
            precio_unitario=item['precio']
        )
        db.session.add(detalle)

    db.session.commit()
    return jsonify({'pedido_id': pedido.id, 'mensaje': 'Pedido creado'}), 201

# Crear preferencia con carrito completo
@app.route("/api/crear-preferencia", methods=["POST"])
def crear_preferencia():
    data = request.json
    pedido_id = data.get("pedido_id")
    carrito = data.get("carrito")

    if not carrito:
        return jsonify({"error": "Carrito vacío"}), 400

    items = [
        {
            "title": item["nombre"],
            "quantity": int(item["cantidad"]),
            "unit_price": float(item["precio"]),
            "currency_id": "ARS"
        }
        for item in carrito
    ]

    preference_data = {
        "items": items,
        "back_urls": {
            "success": "https://4jdv7h.csb.app/?status=approved",
            "failure": "https://4jdv7h.csb.app/?status=failure",
            "pending": "https://4jdv7h.csb.app/?status=pending"
        },
        "auto_return": "approved",
        "external_reference": str(pedido_id),
        "notification_url": "https://lucasferrara015dev.pythonanywhere.com/webhook"
    }

    print("Enviando preferencia a MP:", preference_data)

    try:
        preference_response = sdk.preference().create(preference_data)
        print("Status de respuesta MP:", preference_response.get("status"))
        print("Respuesta completa de MP:", preference_response)

        if preference_response.get("status") != 201:
            error_msg = preference_response.get("response", {}).get("message", "Error desconocido")
            print("Error en creación de preferencia:", error_msg)
            return jsonify({"error": f"Error de Mercado Pago: {error_msg}"}), 500

        resp = preference_response["response"]
        pref_id = resp["id"]
        sandbox_init_point = resp["sandbox_init_point"]

        return jsonify({"preferenceId": pref_id, "init_point": sandbox_init_point})

    except Exception as e:
        print("Excepción al crear preferencia:", str(e))
        return jsonify({"error": "Error interno del servidor"}), 500

# Webhook al final
@app.route("/webhook", methods=["POST"])
def webhook():
    try:
        data = request.json
        print("Webhook recibido:", data)

        if data.get("type") == "payment":
            payment_id = data["data"]["id"]
            payment_info = sdk.payment().get(payment_id)
            payment = payment_info["response"]
            status = payment.get("status")
            external_ref = payment.get("external_reference")

            if external_ref and status:
                pedido = Pedido.query.get(int(external_ref))
                if pedido:
                    pedido.estado = status
                    pedido.pago_monto = payment.get("transaction_amount")
                    pedido.pago_metodo = payment.get("payment_method_id")
                    pedido.pago_fecha = payment.get("date_approved")
                    db.session.commit()
                    print(f"Pedido {pedido.id} actualizado a {status}")
                else:
                    print(f"Pedido {external_ref} no encontrado")
    except Exception as e:
        print("Error en webhook:", str(e))
    return "", 200

@app.route('/api/pedido/<int:pedido_id>', methods=['GET'])
def get_pedido(pedido_id):
    pedido = Pedido.query.get(pedido_id)
    if not pedido:
        return jsonify({'error': 'Pedido no encontrado'}), 404

    detalles = [{
        'nombre_producto': d.nombre_producto,
        'cantidad': d.cantidad,
        'precio_unitario': d.precio_unitario
    } for d in pedido.detalles]

    return jsonify({
        'id': pedido.id,
        'email': pedido.email,
        'nombre': pedido.nombre,
        'direccion': pedido.direccion,
        'total': pedido.total,
        'estado': pedido.estado,
        'opcion_envio': pedido.opcion_envio,
        'costo_envio': pedido.costo_envio,
        'fecha': pedido.fecha,
        'detalles': detalles
    })

