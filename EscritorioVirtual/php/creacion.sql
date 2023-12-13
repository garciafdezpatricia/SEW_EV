-- Crear la tabla autor
CREATE TABLE IF NOT EXISTS autor (
    ID_Autor VARCHAR(50) PRIMARY KEY,
    Nombre VARCHAR(50),
    Apellido VARCHAR(50)
);

-- Crear la tabla editorial
CREATE TABLE IF NOT EXISTS editorial (
    ID_Editorial VARCHAR(50) PRIMARY KEY,
    Nombre_Editorial VARCHAR(100),
    Direccion VARCHAR(255)
);

-- Crear la tabla libro
CREATE TABLE IF NOT EXISTS libro (
    ID_Libro VARCHAR(50) PRIMARY KEY,
    Titulo VARCHAR(100),
    ID_Autor VARCHAR(50),
    ID_Editorial VARCHAR(50),
    Stock VARCHAR(50),
    FOREIGN KEY (ID_Autor) REFERENCES autor(ID_Autor),
    FOREIGN KEY (ID_Editorial) REFERENCES editorial(ID_Editorial)
);

-- Crear la tabla cliente
CREATE TABLE IF NOT EXISTS cliente (
    ID_Cliente VARCHAR(50) PRIMARY KEY,
    Nombre VARCHAR(50),
    Apellido VARCHAR(50),
    Direccion VARCHAR(255)
);

-- Crear la tabla prestamos
CREATE TABLE IF NOT EXISTS prestamos (
    ID_Prestamo VARCHAR(50) PRIMARY KEY,
    ID_Cliente VARCHAR(50),
    ID_Libro VARCHAR(50),
    Fecha_Prestamo VARCHAR(50),
    Fecha_Devolucion VARCHAR(50),
    FOREIGN KEY (ID_Cliente) REFERENCES cliente(ID_Cliente),
    FOREIGN KEY (ID_Libro) REFERENCES libro(ID_Libro)
);
