<?php
    class Carrusel {
        public string $capital = "";
        public string $pais = "";

        public function __construct($nombreCapital, $nombrePais) {
            $this->capital = $nombreCapital;
            $this->pais = $nombrePais;
        }

        function getPhotos() {
            $api_key = '15798ae3eba24c5bbfe6c3352288b483';
            $tag = $this->capital;
            $perPage = 10;
            // Fotos públicas recientes
            $url = 'http://api.flickr.com/services/feeds/photos_public.gne?';
            $url.= '&api_key='.$api_key;
            $url.= '&tags='.$tag;
            $url.= '&per_page='.$perPage;
            $url.= '&format=json';
            $url.= '&nojsoncallback=1';

            $respuesta = file_get_contents($url);
            $json = json_decode($respuesta);

            $carrusel = "<article data-element='carrusel'><h3>Carrusel de imágenes</h3>";
            for($i=0;$i<$perPage;$i++) {
                $titulo = $json->items[$i]->title;
                $URLfoto = str_replace("_m.jpg", "_b.jpg", $json->items[$i]->media->m);
                $img = "<img data-element='carruselImg' alt='".$titulo."' src='".$URLfoto."' />";
                $carrusel .= $img;
            }
            $carrusel .= "<button onclick='viajes.carruselSiguiente()' data-action='next'> > </button>
            <button data-action='prev' onclick='viajes.carruselAnterior()'> < </button></article>";
            return $carrusel;
        }
    }

    class Moneda {
        public string $monedaPropia = "ALL";
        public string $monedaCambio = "EUR";
        private string $app_id = "15798ae3eba24c5bbfe6c3352288b483";

        public function __construct($moneda, $cambio) {
            $this->monedaPropia = $moneda;
            $this->monedaCambio = $cambio;
        }

        public function consultaCambio() {
            // no se puede cambiar la base (USD) porque se necesita suscripcion. Cojo las dos monedas y con factores de conversión consigo el equivalente a 1€ lek albanés
            $url = "https://openexchangerates.org/api/latest.json?app_id=" . $this->app_id . "&symbols=" . $this->monedaCambio . "," . $this->monedaPropia;
            $respuesta = file_get_contents($url);
            $json = json_decode($respuesta);
            $ALL = $json->rates->ALL;
            $EUR = $json->rates->EUR;
            $equivalencia = round($ALL/$EUR, 3);
            $resultado = "<p>1€=" . $equivalencia . " Leks albaneses</p>";
            return $resultado;
        }
    }
?>

<!DOCTYPE HTML>
<html lang="es">
<head>
    <!-- Datos que describen el documento -->
    <meta charset="UTF-8" />
    <meta name="author" content="Patricia Garcia Fernandez"/>
    <meta name="description" content="Documento con información sobre Albania"/>
    <meta name="keywords" content ="Viajes, Albania"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Escritorio Virtual - Viajes</title>
    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
    <link rel="stylesheet" type="text/css" href="estilo/viajes.css" />
    <link rel="stylesheet" type="text/css" href="estilo/carrusel.css" />
    <link rel="icon" href="multimedia/imagenes/favicon.ico" />
    <script src="js/viajes.js"></script>
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
    <main>
        <h2>Viajes</h2>
        <?php 
            $cambio = new Moneda('ALL', 'EUR');
            echo $cambio->consultaCambio();
            $carrusel = new Carrusel('Tirana', 'Albania');
            echo $carrusel->getPhotos();
        ?>
        <button onclick="viajes.getMapaEstaticoGoogle('estatico')">Obtener mapa estático</button>
        <figure id="estatico"></figure>
        <figure data-element="dinamico" id="dinamico"></figure>
        <section data-element="fileUpload">
            <h3>Carga de archivos</h3>
            <p>Carga el archivo rutasEsquema.xml para ver su contenido: </p>
            <input type="file" accept=".xml" onchange="viajes.leerArchivoXML(this.files)">
            <p>Carga archivos KML para representarlos en el mapa dinámico</p>
            <input type="file" accept=".kml"  onchange="viajes.leerArchivoKML(this.files)" multiple>
            <p>Carga archivos SVG para representarlos en el documento</p>
            <input type="file" accept=".svg"  onchange="viajes.leerArchivoSVG(this.files)" multiple>
        </section>
    </main>
    <script>
        let viajes = new Viajes();
        
        function initMap() {
            viajes.getMapaDinamicoGoogle();
        }

        $("button[data-action='next']").on("click", viajes.carruselSiguiente());
        $("button[data-action='prev']").on("click", viajes.carruselAnterior());

    </script>
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBOHT5uUmRE7AYHojYkyoz8xALNtuLMAF4&callback=initMap">
    </script>
</body>
</html>