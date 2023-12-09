<?php
    class Record {
        public string $server;
        public string $user;
        public string $pass;
        public string $dbname;

        public string $nombrePersona;
        public string $apellidosPersona;
        public string $nivel;
        public string $tiempo;
        public string $clasificacion = "";

        public function __construct() {
            $this->server = "localhost";
            $this->user = "DBUSER2023";
            $this->pass = "DBPSWD2023";
            $this->dbname = "records";
        }

        function connectDB() {
            $db = new mysqli($this->server, $this->user, $this->pass, $this->dbname);

            if ($db->connect_errno) {
                echo "Error de conexión: " . $db->connect_error;
            } else {
                $consultapre = $db->prepare("INSERT INTO registro (nombre, apellidos, nivel, tiempo) VALUES (?,?,?,?);");
                $consultapre->bind_param('ssss', $this->nombrePersona, $this->apellidosPersona, $this->nivel, $this->tiempo);
                //ejecutar sentencia
                $consultapre->execute();
                // mostrar mensaje
                if ($consultapre->affected_rows > 0) {
                    echo "<p>Resultado añadido!</p>";
                }
                $consultapre->close();
                $db->close();
            }
        }

        function cogerResultados() {
            $db = new mysqli($this->server, $this->user, $this->pass, $this->dbname);

            if ($db->connect_errno) {
                echo "Error de conexión: " . $db->connect_error;
            } else {
                $consultapre = $db->prepare("SELECT * FROM registro WHERE nivel LIKE ?;");
                $consultapre->bind_param('s', $this->nivel);
                //ejecutar sentencia
                $consultapre->execute();
                $resultado = $consultapre->get_result();
                if ($resultado->fetch_assoc() != NULL) {
                    $resultado->data_seek(0); // se posiciona al inicio del resultado de la búsqueda
                    $this->clasificacion .= "<ul>";
                    $this->clasificacion .= "<li>". 'Nombre' ." - ". 'Apellidos' . " - " . 'Nivel'. " - ". 'Tiempo' . "</li>";
                    while ($fila = $resultado->fetch_assoc()){
                        $this->clasificacion .= "<li>". $fila['nombre'] . " - " . $fila['apellidos']." - ". $fila['nivel']." - ". $fila['tiempo'] ."</li>";
                    }
                    $this->clasificacion .= "</ul>";
                }
                else {
                    $this->clasificacion .= "<p>Tabla vacía. Número de filas = " . $resultado->num_rows . "</p>";
                }
                $consultapre->close();
                $db->close();
            }
        }

        function mostrarClasificacion() {
            if ($this->clasificacion != "") {
                echo $this->clasificacion;
            }
        }
    }
    $registro = new Record();

    if (count($_POST) > 0) {
            $registro->nombrePersona = $_POST["nombre"];
            $registro->apellidosPersona = $_POST["apellidos"];
            $registro->nivel = $_POST["nivel"];
            $registro->tiempo = $_POST["tiempo"];
            $registro->connectDB();
            $registro->cogerResultados();
    }
?>
<!DOCTYPE html>
<html lang="es">
    <head>
        <!-- Datos que describen el documento -->
        <meta charset="UTF-8" />
        <meta name="author" content="Patricia Garcia Fernandez"/>
        <meta name="description" content="Documento con el juego Crucigrama matemático"/>
        <meta name="keywords" content ="Juego, Crucigrama"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Escritorio Virtual - Crucigrama</title>
        <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
        <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
        <link rel="stylesheet" type="text/css" href="estilo/crucigrama.css" />
        <link rel="icon" href="multimedia/imagenes/favicon.ico" />
        <script src="js/crucigrama.js"></script>
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
            <a href="viajes.html" accesskey="V" tabindex="6">Viajes</a>
            <a href="juegos.html" accesskey="J" tabindex="7">Juegos</a>
        </nav>
    </header>
    <article>
        <h3>Salón de juegos</h3>
        <p>Pulsa en los siguientes enlaces para acceder a los juegos especificados</p>
        <ul>
            <li><a href="memoria.html" accesskey="C" tabindex="8">Memorion</a></li>
            <li><a href="sudoku.html" accesskey="K" tabindex="9">Sudoku</a></li>
            <li><a href="crucigrama.php" accesskey="C" tabindex="10">Crucigrama matemático</a></li>
            <li><a href="api.html" accesskey="T" tabindex="11">Lista de tareas</a></li>
        </ul>
    </article>
    <main>
        <h2>Crucigrama matemático</h2>
        <section data-type="botonera">
            <h2>Botonera</h2>
            <button onclick="crucigrama.introduceElement(1)">1</button>
            <button onclick="crucigrama.introduceElement(2)">2</button>
            <button onclick="crucigrama.introduceElement(3)">3</button>
            <button onclick="crucigrama.introduceElement(4)">4</button>
            <button onclick="crucigrama.introduceElement(5)">5</button>
            <button onclick="crucigrama.introduceElement(6)">6</button>
            <button onclick="crucigrama.introduceElement(7)">7</button>
            <button onclick="crucigrama.introduceElement(8)">8</button>
            <button onclick="crucigrama.introduceElement(9)">9</button>
            <button onclick="crucigrama.introduceElement('*')">*</button>
            <button onclick="crucigrama.introduceElement('+')">+</button>
            <button onclick="crucigrama.introduceElement('-')">-</button>
            <button onclick="crucigrama.introduceElement('/')">/</button>
        </section>
        <article data-element="crucigrama">
            <h3>Crucigrama</h3>
        </article>
        <?php $registro->mostrarClasificacion() ?>
    </main>
    <script>
        let crucigrama = new Crucigrama();
        crucigrama.paintMathword();
        addEventListener("keydown", crucigrama.boundHandleKeydown)
    </script>
    </body>
</html>