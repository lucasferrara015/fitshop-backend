PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE producto (
	id INTEGER NOT NULL, 
	nombre VARCHAR(100) NOT NULL, 
	descripcion VARCHAR(200), 
	precio FLOAT NOT NULL, 
	categoria VARCHAR(50), 
	imagen VARCHAR(100), 
	PRIMARY KEY (id)
);
INSERT INTO producto VALUES(1,'Mancuernas de Acero 5kg','Mancuernas resistentes de acero, ideales para entrenamientos de fuerza en casa.',15499.999999999999999,'musculacion','/images/products/mancuernas5kg.jpg');
INSERT INTO producto VALUES(2,'Proteína Whey Premium 2kg','Suplemento de proteína de alta calidad para mejorar la recuperación y el crecimiento muscular.',18999.0,'suplementos','/images/products/whey-premium-2kg.jpg');
INSERT INTO producto VALUES(3,'Barra de Dominadas Profesional','Barra de dominadas robusta y fácil de instalar, perfecta para entrenamientos de espalda y brazos.',35999.0,'estructuras','/images/products/barradedominadaspro.jpg');
INSERT INTO producto VALUES(4,'Banco Plegable Ajustable Reclinable','Banco plegable multifunción con respaldo reclinable, ideal para press de banca y ejercicios variados.',45999.0,'estructuras','/images/products/banca-plegable-.jpg');
INSERT INTO producto VALUES(5,'Creatina Monohidratada 300g','Creatina pura para aumentar fuerza, potencia y rendimiento en entrenamientos intensos.',9998.9999999999999999,'suplementos','/images/products/creatina300g.jpg');
COMMIT;
