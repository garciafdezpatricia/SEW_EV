drop table IF EXISTS prestamos;
drop table IF EXISTS cliente;
drop table IF EXISTS libro;
drop table IF EXISTS autor;
drop table IF EXISTS editorial;
-- Crear la tabla autor
CREATE TABLE IF NOT EXISTS autor(
    ID_Autor INTEGER PRIMARY KEY AUTO_INCREMENT,
    Nombre VARCHAR(50),
    Apellido VARCHAR(50)
);

-- Crear la tabla editorial
CREATE TABLE IF NOT EXISTS editorial(
    ID_Editorial INTEGER PRIMARY KEY AUTO_INCREMENT,
    Nombre_Editorial VARCHAR(100),
    Direccion VARCHAR(255)
);

-- Crear la tabla libro
CREATE TABLE IF NOT EXISTS libro(
    ID_Libro INTEGER PRIMARY KEY AUTO_INCREMENT,
    Titulo VARCHAR(100),
    ID_Autor INTEGER,
    ID_Editorial INTEGER,
    Stock VARCHAR(50),
    FOREIGN KEY (ID_Autor) REFERENCES autor(ID_Autor),
    FOREIGN KEY (ID_Editorial) REFERENCES editorial(ID_Editorial)
);

-- Crear la tabla cliente
CREATE TABLE IF NOT EXISTS cliente(
    ID_Cliente INTEGER PRIMARY KEY AUTO_INCREMENT,
    Nombre VARCHAR(50),
    Apellido VARCHAR(50),
    Direccion VARCHAR(255)
);

-- Crear la tabla prestamos
CREATE TABLE IF NOT EXISTS prestamos(
    ID_Prestamo INTEGER PRIMARY KEY AUTO_INCREMENT,
    ID_Cliente INTEGER,
    ID_Libro INTEGER,
    Fecha_Prestamo VARCHAR(50),
    Fecha_Devolucion VARCHAR(50),
    FOREIGN KEY (ID_Cliente) REFERENCES cliente(ID_Cliente),
    FOREIGN KEY (ID_Libro) REFERENCES libro(ID_Libro)
);