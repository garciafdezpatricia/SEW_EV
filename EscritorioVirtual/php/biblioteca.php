<?php
class Biblioteca {

    public string $server;
    public string $user;
    public string $pass;
    public string $dbname;

    public function __construct() {
        $this->server = "localhost";
        $this->user = "DBUSER2023";
        $this->pass = "DBPSWD2023";
        $this->dbname = "biblioteca";
    }
    // crear base de datos con tablas
    public function crearBD() {
        $conn = $this->crearConexion();
        if ($conn) {
            // Lee el contenido de creacion.sql
            $sqlFile = file_get_contents('creacion.sql');
            
            // Ejecuta el contenido del archivo SQL
            if ($conn->multi_query($sqlFile)) {
                echo "Base de datos creada exitosamente.";
            } else {
                echo "Error al crear la base de datos: " . $conn->error;
            }
    
            // Cierra la conexión
            $this->cerrarConexion($conn);
        }
    }
    
    // crear conexion
    public function crearConexion() {
        $conn = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
        if ($conn->connect_errno) {
            print("Error de conexión: " . $db->connect_error);
        }
        return $conn;
    }

    // cerrar conexion
    public function cerrarConexion($conn) {
        $conn->close();
    }

    // importar csv
    public function importarCSV($archivo){
        $db = $this->crearConexion();
        $selectedTabla = "";
        if ($archivo !== false) {
            // Leer los datos del archivo CSV e insertarlos en las tablas
            while (($fila = fgetcsv($archivo)) !== false) {
                // Verificar a qué tabla pertenece la fila
                $tabla = $fila[0];
                if ($tabla == 'ID_Autor'){
                    $selectedTabla = "autor";
                }
                else if ($tabla == 'ID_Editorial'){
                    $selectedTabla = "editorial";
                }
                else if ($tabla == 'ID_Libro') {
                    $selectedTabla = "libro";
                }
                else if ($tabla == 'ID_Cliente') {
                    $selectedTabla = "cliente";
                }
                else if ($tabla == 'ID_Prestamo') {
                    $selectedTabla = "prestamo";
                }
                else {
                    // insertar en la tabla los valores que hay en la fila
                    // TODO: quitar el pdo y meter los valores como en crucigrama.php
                    switch ($selectedTabla) {
                        case "autor":
                            $stmt = $db->prepare('INSERT INTO autor (ID_Autor, Nombre, Apellido) VALUES (?, ?, ?)');
                            $stmt->bind_param('sss', $fila[0], $fila[1], $fila[2]);
                            $stmt->execute();
                            $stmt->close();
                            break;
                        case "editorial":
                            $stmt = $db->prepare('INSERT INTO editorial (ID_Editorial, Nombre_Editorial, Direccion) VALUES (?, ?, ?)');
                            $stmt->bind_param('sss', $fila[0], $fila[1], $fila[2]);
                            $stmt->execute();
                            $stmt->close();
                            break;
                        case "libro":
                            $stmt = $db->prepare('INSERT INTO libro (ID_Libro, Titulo, ID_Autor, ID_Editorial, Stock) VALUES (?, ?, ?, ?, ?)');
                            $stmt->bind_param('sssss', $fila[0], $fila[1], $fila[2], $fila[3], $fila[4]);
                            $stmt->execute();
                            $stmt->close();
                            break;
                        case "cliente":
                            $stmt = $db->prepare('INSERT INTO cliente (ID_Cliente, Nombre, Apellido, Direccion) VALUES (?, ?, ?, ?)');
                            $stmt->bind_param('ssss', $fila[0], $fila[1], $fila[2], $fila[3]);
                            $stmt->execute();
                            $stmt->close();
                            break;
                        case "prestamo":
                            $stmt = $db->prepare('INSERT INTO prestamos (ID_Prestamo, ID_Cliente, ID_Libro, Fecha_Prestamo, Fecha_Devolucion) VALUES (?, ?, ?, ?, ?)');
                            $stmt->bind_param('sssss', $fila[0], $fila[1], $fila[2], $fila[3], $fila[4]);
                            $stmt->execute();
                            $stmt->close();
                            break;
                    }
                }
            }
            $db->close();
            // Cerrar el archivo CSV
            fclose($archivo);
        } else {
            echo "Error al abrir el archivo CSV";
        }
    }

    // exportar csv

    // consultar libros en prestamo (con fecha de inicio y fin de prestamo)

    // consultar los libros disponibles
}

if (isset($_POST['importar_csv'])) {
    // Acción para importar el SQL para la creación de la base de datos
    $biblioteca = new Biblioteca();
    // crear la bd
    $biblioteca->crearBD();
    // leer csv y rellenar bd
    $biblioteca->importarCSV($_FILES['importarCSV']['tmp_name']);
}
?>

<!DOCTYPE html>
<html lang="es">
    <head>
        <!-- Datos que describen el documento -->
        <meta charset="UTF-8" />
        <meta name="author" content="Patricia Garcia Fernandez"/>
        <meta name="description" content="Documento con el juego del Sudoku"/>
        <meta name="keywords" content ="Juego, Sudoku"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Escritorio Virtual - Lista de tareas</title>
        <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
        <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
        <link rel="stylesheet" type="text/css" href="estilo/api.css" />
        <link rel="icon" href="multimedia/imagenes/favicon.ico" />
        <script src="js/api.js"></script>
        <script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
    </head>
    <body>
        <!-- Datos con el contenido que aparece en el navegador -->
    <header>
        <h1>Escritorio Virtual</h1>
        <nav>
            <a href="index.html" accesskey="I" tabindex="1">Inicio</a>
            <a href="sobremi.html" accesskey="S" tabindex="2">Sobre mi</a>
            <a href="noticias.html" accesskey="N" tabindex="3">Noticias</a>
            <a href="agenda.html" accesskey="A" tabindex="4">Agenda</a>
            <a href="meteorología.html" accesskey="M" tabindex="5">Meteorología</a>
            <a href="viajes.php" accesskey="V" tabindex="6">Viajes</a>
            <a href="juegos.html" accesskey="J" tabindex="7">Juegos</a>
        </nav>
    </header>
    <article>
        <h2>Salón de juegos</h2>
        <p>Pulsa en los siguientes enlaces para acceder a los juegos especificados</p>
        <ul>
            <li><a href="memoria.html" accesskey="C" tabindex="8">Memorion</a></li>
            <li><a href="sudoku.html" accesskey="K" tabindex="9">Sudoku</a></li>
            <li><a href="crucigrama.php" accesskey="C" tabindex="10">Crucigrama matemático</a></li>
            <li><a href="api.html" accesskey="T" tabindex="11">Lista de tareas</a></li>
        </ul>
    </article>
    <main>
        <h2>Consulta de libros</h2>
        <button onclick="crearBiblioteca()">Crear biblioteca</button>
        <form action="#" method="post">
            <label for="importarCSV">Importar CSV para la carga de datos</label>
            <input id="importarCSV" name="importarCSV" type="file" accept=".csv"/>
            <input type="submit" name="importar_csv" value="Importar">
        </form>
        <button onclick="consultarLibrosEnPrestamo()">Consultar libros en préstamo</button>
        <button onclick="consultarLibrosDisponibles()">Consultar libros disponibles</button>
    </main>
    </body>
</html>