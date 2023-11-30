class Viajes {

    apikey = "AIzaSyBOHT5uUmRE7AYHojYkyoz8xALNtuLMAF4";

    constructor() {
        navigator.geolocation.getCurrentPosition(this.procesarPosicion.bind(this), this.verErrores.bind(this));
    }

    procesarPosicion(posicion) {
        this.mensaje = "Se ha realizado correctamente la petición de geolocalización";
        this.longitud         = posicion.coords.longitude; 
        this.latitud          = posicion.coords.latitude;  
        this.precision        = posicion.coords.accuracy;
        this.altitud          = posicion.coords.altitude;
        this.precisionAltitud = posicion.coords.altitudeAccuracy;
        this.rumbo            = posicion.coords.heading;
        this.velocidad        = posicion.coords.speed;
    }

    verErrores(error){
        switch(error.code) {
        case error.PERMISSION_DENIED:
            this.mensaje = "El usuario no permite la petición de geolocalización"
            break;
        case error.POSITION_UNAVAILABLE:
            this.mensaje = "Información de geolocalización no disponible"
            break;
        case error.TIMEOUT:
            this.mensaje = "La petición de geolocalización ha caducado"
            break;
        case error.UNKNOWN_ERROR:
            this.mensaje = "Se ha producido un error desconocido"
            break;
        }
    }

    getMapaEstaticoGoogle(dondeVerlo){
        var ubicacion=document.getElementById(dondeVerlo);
        //URL: obligatoriamente https
        var url = "https://maps.googleapis.com/maps/api/staticmap?";
        //Parámetros
        // centro del mapa (obligatorio si no hay marcadores)
        var centro = "center=" + this.latitud + "," + this.longitud;
        //zoom (obligatorio si no hay marcadores)
        //zoom: 1 (el mundo), 5 (continentes), 10 (ciudad), 15 (calles), 20 (edificios)
        var zoom ="&zoom=10";
        //Tamaño del mapa en pixeles (obligatorio)
        var tamaño= "&size=800x600";
        //Escala (opcional)
        //Formato (opcional): PNG,JPEG,GIF
        //Tipo de mapa (opcional)
        //Idioma (opcional)
        //region (opcional)
        //marcadores (opcional)
        var marcador = "&markers=color:red%7Clabel:S%7C" + this.latitud + "," + this.longitud;
        //rutas. path (opcional)
        //visible (optional)
        //style (opcional)
        var sensor = "&sensor=false"; 
        this.imagenMapa = url + centro + zoom + tamaño + marcador + sensor + "&key=" + this.apikey;
        ubicacion.innerHTML = "<img src='"+this.imagenMapa+"' alt='mapa estático google' />";
    }

    getMapaDinamicoGoogle(){    
        // las coordenadas son fijas porque si se ponen las del objeto igual no estan cargadas todavia
        let posicion = { lat: 43.3634472, lng: -5.8459444}
        var mapaGeoposicionado = new google.maps.Map(document.getElementById('dinamico'), {
            zoom: 10,
            center: posicion,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        let infoWindow = new google.maps.InfoWindow;
        infoWindow.setPosition(posicion);
        infoWindow.setContent('Ubicación actual');
        infoWindow.open(mapaGeoposicionado);
    }

    leerArchivoXML(files) {
        if (window.File && window.FileReader && window.FileList && window.Blob) 
        {  
            //El navegador soporta el API File
            let archivo = files[0];    


            $('ruta', archivo).each( (index, ruta) => {
                const rutaXML = $(ruta);
    
                let article = $("<article>");

                let tipo = $("<p>").text(rutaXML.attr("tipo").text());
                let nombre = $("<p>").text(rutaXML.find('nombre').first().text());
                let fecha_inicio = $("<p>").text(rutaXML.find('fecha-inicio').text());
                let hora_inicio = $("<p>").text(rutaXML.find('hora-inicio').text());
                let medio_transporte = $("<p>").text(rutaXML.find('medio-transporte').text());
                let tiempo_duracion = $("<p>").text(rutaXML.find('tiempo-duracion').text());
                let agencia = $("<p>").text(rutaXML.find('agencia').text());
                let descripcion = $("<p>").text(rutaXML.find('descripcion').text());
                let personas_adecuadas = $("<p>").text(rutaXML.find('personas-adecuadas').text());
                let lugar_inicio = $("<p>").text(rutaXML.find('lugar-inicio').text());
                let longitud = $("<p>").text(rutaXML.find('coordenadas').attr('longitud')); 
                let latitud = $("<p>").text(rutaXML.find('coordenadas').attr('latitud'));
                let altitud = $("<p>").text(rutaXML.find('coordenadas').attr('altitud'));  
                let referencias = [];
                let recomendacion = $("<p>").text(rutaXML.find('recomendacion').text());
                let hitos = [];

                rutaXML.find('referencias').find('referencia').each((index, ref) => {
                    const referencia = $(ref);
                    referencias[index] = referencia.text();
                })

                rutaXML.find('hitos').find('hito').each((index, hito) => {
                    const hito = $(hito);
                    // como almaceno todo? -> ul?
                })
    
            });
        }
    }
}