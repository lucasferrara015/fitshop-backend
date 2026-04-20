import flask_app

with flask_app.app.app_context():
    flask_app.db.create_all()

    productos = [
        flask_app.Producto(
            nombre="Mancuernas de Acero 5kg",
            descripcion="Mancuernas resistentes de acero, ideales para entrenamientos de fuerza en casa.",
            precio=15500,
            categoria="musculacion",
            imagen="/images/products/mancuernas5kg.jpg"
        ),
        flask_app.Producto(
            nombre="Proteína Whey Premium 2kg",
            descripcion="Suplemento de proteína de alta calidad para mejorar la recuperación y el crecimiento muscular.",
            precio=18999,
            categoria="suplementos",
            imagen="/images/products/whey-premium-2kg.jpg"
        ),
        flask_app.Producto(
            nombre="Barra de Dominadas Profesional",
            descripcion="Barra de dominadas robusta y fácil de instalar, perfecta para entrenamientos de espalda y brazos.",
            precio=35999,
            categoria="estructuras",
            imagen="/images/products/barradedominadaspro.jpg"
        ),
        flask_app.Producto(
            nombre="Banco Plegable Ajustable Reclinable",
            descripcion="Banco plegable multifunción con respaldo reclinable, ideal para press de banca y ejercicios variados.",
            precio=45999,
            categoria="estructuras",
            imagen="/images/products/banca-plegable-.jpg"
        ),
        flask_app.Producto(
            nombre="Creatina Monohidratada 300g",
            descripcion="Creatina pura para aumentar fuerza, potencia y rendimiento en entrenamientos intensos.",
            precio=9999,
            categoria="suplementos",
            imagen="/images/products/creatina300g.jpg"
        ),
    ]

    flask_app.db.session.add_all(productos)
    flask_app.db.session.commit()

    print("✅ Base inicializada y productos cargados correctamente.")



