<?php
class Biblioteca {

    public string $server;
    public string $user;
    public string $pass;
    public string $dbname;
    public string $mensaje = "";
    public string $librosPrestados = "";
    public string $librosDisponibles = "";

    public function __construct() {
        $this->server = "localhost";
        $this->user = "DBUSER2023";
        $this->pass = "DBPSWD2023";
        $this->dbname = "biblioteca";
    }
    // crear base de datos con tablas
    public function crearBiblioteca() {
        $conn = new mysqli($this->server, $this->user, $this->pass);
        if ($conn) {
            // Si la base de datos "biblioteca" no existe, la crea
            $sql = "CREATE DATABASE IF NOT EXISTS " . $this->dbname;
            if ($conn->query($sql) === TRUE) {
                $this->mensaje .= "Base de datos creada exitosamente.";
            } else {
                $this->mensaje .= "Error al crear la base de datos: " . $conn->error;
            }    
            // Selecciona la base de datos "biblioteca"
            mysqli_select_db($conn, $this->dbname);
            // Lee el contenido de creacion.sql
            $sqlFile = file_get_contents('creacion.sql');
            
            // Ejecuta el contenido del archivo SQL
            if ($conn->multi_query($sqlFile)) {
                $this->mensaje .= "Tablas creadas exitosamente.";
            } else {
                $this->mensaje .= "Error al crear las tablas: " . $conn->error;
            }
            // Cierra la conexión
            $this->cerrarConexion($conn);
        }
    }
    
    // crear conexion
    public function crearConexion() {
        $conn = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
        if ($conn->connect_errno) {
            $this->mensaje .= "Error de conexión: " . $db->connect_error;
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
        ini_set("auto_detect_line_endings", true);
        if (($handle = fopen($archivo, 'r')) !== false) {
            // Leer los datos del archivo CSV e insertarlos en las tablas
            while ( ($fila = fgetcsv($handle, 2000, ",")) !== false) {
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
            fclose($handle);
        } else {
            $this->mensaje .= "Error al abrir el archivo CSV";
        }
    }

    public function exportarCSV() {
        $conn = $this->crearConexion();
        // Nombre del archivo CSV de salida
        $csvFile = 'bibliotecaExportada.csv';
        // Establecer encabezados para la descarga
        header('Content-Type: text/csv');
        header('Content-Disposition: attachment; filename="' . $csvFile . '"');
        // Abrir el archivo CSV para escritura
        $file = fopen('php://output', 'w');

        // Exportar datos de la tabla autor
        $query_autor = "SELECT * FROM autor";
        $result_autor = $conn->query($query_autor);
        if ($result_autor->num_rows > 0) {
            // Encabezados
            fputcsv($file, array('ID_Autor', 'Nombre', 'Apellido'));
            // Datos
            while ($row = $result_autor->fetch_assoc()) {
                fputcsv($file, $row);
            }
        }
        // Exportar datos de la tabla editorial
        $query_editorial = "SELECT * FROM editorial";
        $result_editorial = $conn->query($query_editorial);
        if ($result_editorial->num_rows > 0) {
            // Encabezados
            fputcsv($file, array('ID_Editorial', 'Nombre_Editorial', 'Direccion'));

            // Datos
            while ($row = $result_editorial->fetch_assoc()) {
                fputcsv($file, $row);
            }
        }
        // Exportar datos de la tabla libro
        $query_libro = "SELECT * FROM libro";
        $result_libro = $conn->query($query_libro);
        if ($result_libro->num_rows > 0) {
            // Encabezados
            fputcsv($file, array('ID_Libro', 'Titulo', 'ID_Autor', 'ID_Editorial', 'Stock'));

            // Datos
            while ($row = $result_libro->fetch_assoc()) {
                fputcsv($file, $row);
            }
        }
        // Exportar datos de la tabla cliente
        $query_cliente = "SELECT * FROM cliente";
        $result_cliente = $conn->query($query_cliente);
        if ($result_cliente->num_rows > 0) {
            // Encabezados
            fputcsv($file, array('ID_Cliente', 'Nombre', 'Apellido', 'Direccion'));

            // Datos
            while ($row = $result_cliente->fetch_assoc()) {
                fputcsv($file, $row);
            }
        }
        // Exportar datos de la tabla prestamos
        $query_prestamos = "SELECT * FROM prestamos";
        $result_prestamos = $conn->query($query_prestamos);
        if ($result_prestamos->num_rows > 0) {
            // Encabezados
            fputcsv($file, array('ID_Prestamo', 'ID_Cliente', 'ID_Libro', 'Fecha_Prestamo', 'Fecha_Devolucion'));

            // Datos
            while ($row = $result_prestamos->fetch_assoc()) {
                fputcsv($file, $row);
            }
        }
        // Cerrar el archivo y la conexión a la base de datos
        fclose($file);
        $conn->close();
    }

    // consultar libros en prestamo (con fecha fin de prestamo)
    public function consultarLibrosEnPrestamo() {
        $db = $this->crearConexion();
        // Consulta 1: Libros en préstamo con fecha de devolución
        $query1 = "SELECT l.Titulo AS Libro, p.Fecha_Devolucion FROM libro l JOIN prestamos p ON l.ID_Libro = p.ID_Libro";
        $result1 = $db->query($query1);
        if ($result1->num_rows > 0) {
            $this->librosPrestados .= "<article data-element='biblioteca'><h3>Libros en préstamo</h3><ul>";
            while ($row = $result1->fetch_assoc()) {
                $this->librosPrestados .= "<li>Libro: " . $row["Libro"] . " - Fecha de Devolución: " . $row["Fecha_Devolucion"] . "</li>";
            }
            $this->librosPrestados .= "</ul></article>";
        } else {
            $this->librosPrestados .= "<p>No hay libros en préstamo.</p>";
        }
        $db->close();
        return $this->librosPrestados;
    }
    // consultar los libros disponibles
    public function consultarLibrosDisponibles() {
        $db = $this->crearConexion();
        // Consulta 1: Libros en préstamo con fecha de devolución
        $query1 = "SELECT l.Titulo AS Libro FROM libro l LEFT JOIN prestamos p ON l.ID_Libro = p.ID_Libro WHERE p.ID_Prestamo IS NULL OR p.Fecha_Devolucion < CURRENT_DATE";
        $result1 = $db->query($query1);
        if ($result1->num_rows > 0) {
            $this->librosDisponibles .= "<article data-element='biblioteca'><h3>Libros disponibles</h3><ul>";
            while ($row = $result1->fetch_assoc()) {
                $this->librosDisponibles .= "<li>Libro: " . $row["Libro"] . "</li>";
            }
            $this->librosDisponibles .= "</ul></article>";
        } else {
            $this->librosDisponibles .= "<p>No hay libros disponibles.</p>";
        }
        $db->close();
        return $this->librosDisponibles;
    }
}

// Acción para importar el SQL para la creación de la base de datos
$biblioteca = new Biblioteca();
if (isset($_POST['importar_csv'])) {
    // crear la bd
    $biblioteca->crearBiblioteca();
    // leer csv y rellenar bd
    $biblioteca->importarCSV($_FILES['importarCSV']['tmp_name']);
    // mostrar disponibilidad de la biblioteca
    $biblioteca->consultarLibrosEnPrestamo();
    $biblioteca->consultarLibrosDisponibles();
    // descargar datos insertados en la bd
    $biblioteca->exportarCSV();
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
        <link rel="stylesheet" type="text/css" href="../estilo/estilo.css" />
        <link rel="stylesheet" type="text/css" href="../estilo/layout.css" />
        <link rel="stylesheet" type="text/css" href="../estilo/biblioteca.css" />
        <link rel="icon" href="../multimedia/imagenes/favicon.ico" />
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
        <h2>Consulta de disponibilidad de libros</h2>
        <form action="#" method="post" enctype="multipart/form-data">
            <label for="importarCSV">Importar CSV para la carga de datos y descargar datos insertados</label>
            <input id="importarCSV" name="importarCSV" type="file" accept=".csv"/>
            <input type="submit" name="importar_csv" value="Importar">
        </form>
        <?php echo $biblioteca->mensaje ?>
        <?php echo $biblioteca->librosPrestados ?>
        <?php echo $biblioteca->librosDisponibles ?>
    </main>
    </body>
</html>