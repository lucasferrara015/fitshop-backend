from flask_app import app, db, Producto

with app.app_context():
    productos = [
        Producto(
            nombre="Mancuernas de Acero 5kg",
            categoria="musculacion",
            precio=15500,
            imagen="/images/products/mancuernas5kg.jpg",
            descripcion="Mancuernas resistentes de acero, ideales para entrenamientos de fuerza en casa."
        ),
        Producto(
            nombre="Proteína Whey Premium 2kg",
            categoria="suplementos",
            precio=18999,
            imagen="/images/products/whey-premium-2kg.jpg",
            descripcion="Suplemento de proteína de alta calidad para mejorar la recuperación y el crecimiento muscular."
        ),
        Producto(
            nombre="Barra de Dominadas Profesional",
            categoria="estructuras",
            precio=35999,
            imagen="/images/products/barradedominadaspro.jpg",
            descripcion="Barra de dominadas robusta y fácil de instalar, perfecta para entrenamientos de espalda y brazos."
        ),
        Producto(
            nombre="Banco Plegable Ajustable Reclinable",
            categoria="estructuras",
            precio=45999,
            imagen="/images/products/banca-plegable-.jpg",
            descripcion="Banco plegable multifunción con respaldo reclinable, ideal para press de banca y ejercicios variados."
        ),
        Producto(
            nombre="Creatina Monohidratada 300g",
            categoria="suplementos",
            precio=9999,
            imagen="/images/products/creatina300g.jpg",
            descripcion="Creatina pura para aumentar fuerza, potencia y rendimiento en entrenamientos intensos."
        )
    ]

    db.session.add_all(productos)
    db.session.commit()
    print("Productos insertados correctamente")
