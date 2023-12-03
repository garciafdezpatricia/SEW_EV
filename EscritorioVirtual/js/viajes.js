class Viajes {

    apikey = "AIzaSyBOHT5uUmRE7AYHojYkyoz8xALNtuLMAF4";
    mapaGeoposicionado;
    colorIndex = 0;

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
        this.mapaGeoposicionado = new google.maps.Map(document.getElementById('dinamico'), {
            zoom: 10,
            center: posicion,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        let infoWindow = new google.maps.InfoWindow;
        infoWindow.setPosition(posicion);
        infoWindow.setContent('Ubicación actual');
        infoWindow.open(this.mapaGeoposicionado);
    }

    leerArchivoKML(files) {
        for (let i = 0; i < files.length; i++){
            let file = files[i];
            let lector = new FileReader();
            lector.onload = this.onFileLoad.bind(this, this.mapaGeoposicionado);
            lector.readAsText(file);
        }
    }

    onFileLoad(mapa, evento){
        const colores = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'];
        let kml = $(evento.target.result);
        let coordinates = kml.find('coordinates').text().trim().split('\n');
        let coordinatesArray = []
        let nuevoCentro;
        for (let i = 0; i < coordinates.length; i++){
            let coord = coordinates[i];
            let [lng, lat, alt] = coord.split(",").map(parseFloat);
            coordinatesArray.push({lat, lng, alt});
            nuevoCentro = {lat: lat, lng: lng};
        }
        let color = colores[this.colorIndex % colores.length];
        this.colorIndex += 1;
        let ruta = new google.maps.Polyline({
            path: coordinatesArray,
            geodesic: true,
            strokeColor: color,
            strokeOpacity: 1.0,
            strokeWeight: 5
        })
        ruta.setMap(this.mapaGeoposicionado);
        mapa.setCenter(nuevoCentro);
    }


    leerArchivoSVG(files) {
        for (let i = 0; i < files.length; i++){
            let file = files[i];
            let lector = new FileReader();
            lector.onload = function (evento) {
                let svg = $(lector.result);
                $("section[data-element='archivosSVG']").append(svg);
            }
            lector.readAsText(file);
        }
    }

    leerArchivoXML(files) {
        if (window.File && window.FileReader && window.FileList && window.Blob) 
        {  
            //El navegador soporta el API File
            let archivo = files[0];    
            if (archivo) {
                let lector = new FileReader();
                lector.readAsText(archivo);
                lector.onload = function(evento) {
                    let xml = $(lector.result);
                    if ($('ruta', xml).length > 0){
                        let titleRutas = $("<h3>").text("Rutas");
                        $("section[data-element='rutas']").append(titleRutas);
                    }
                    $('ruta', xml).each( (index, ruta) => {
                        const rutaXML = $(ruta);
            
                        let article = $("<article>").attr("data-element", "infoRuta");
        
                        let nombre = $("<h4>").text(`Ruta ${index+1}: ${rutaXML.find('nombre').first().text()}`).attr("data-element", "nombre-ruta");
                        article.append(nombre);

                        let tipo = $("<p>").text(`Tipo: ${rutaXML.attr("tipo")}`).attr("data-element", "tipo-ruta");
                        article.append(tipo);

                        let descripcion = $("<p>").text(rutaXML.find('descripcion').first().text()).attr("data-element", "descripcion-ruta");
                        article.append(descripcion);

                        let tiempo_duracion = $("<p>").text(`Duración: ${rutaXML.find('tiempo-duracion').text()}`).attr("data-element", "tiempo-duracion-ruta");
                        article.append(tiempo_duracion);

                        let personas_adecuadas = $("<p>").text(`Personas adecuadas: ${rutaXML.find('personas-adecuadas').text()}`).attr("data-element", "personas-ruta");
                        article.append(personas_adecuadas);

                        let lugar_inicio = $("<p>").text(`Lugar de inicio: ${rutaXML.find('lugar-inicio').text()}`).attr("data-element", "lugar-inicio-ruta");
                        article.append(lugar_inicio);

                        let fecha_inicio = $("<p>").text(`Fecha inicio: ${rutaXML.find('fecha-inicio').text()}`).attr("data-element", "fecha-inicio-ruta");
                        article.append(fecha_inicio);

                        let hora_inicio = $("<p>").text(`Hora inicio: ${rutaXML.find('hora-inicio').text()}`).attr("data-element", "hora-inicio-ruta");
                        article.append(hora_inicio);

                        let medio_transporte = $("<p>").text(`Medio transporte: ${rutaXML.find('medio-transporte').text()}`).attr("data-element", "medio-transporte-ruta");
                        article.append(medio_transporte);

                        let agencia = $("<p>").text(`Agencia: ${rutaXML.find('agencia').text()}`).attr("data-element", "agencia-ruta");
                        article.append(agencia);

                        let coordenadas = $("<p>").text(`Coordenadas: ${rutaXML.find('coordenadas').attr('longitud')}, ${rutaXML.find('coordenadas').attr('latitud')}`).attr("data-element", "coordenadas-ruta"); 
                        article.append(coordenadas);

                        let altitud = $("<p>").text(`Altitud: ${rutaXML.find('coordenadas').attr('altitud')}m`).attr("data-element", "altitud-ruta"); 
                        article.append(altitud);

                        let recomendacion = $("<p>").text(`Recomendación: ${rutaXML.find('recomendacion').text()}/10`).attr("data-element", "recomendacion-ruta");
                        article.append(recomendacion);

                        article.append($("<p>").text("Referencias:"));
                        let referencias = $("<ul>").attr("data-element", "referencias");
                        let listaReferencias =  rutaXML.find('referencias');
                        listaReferencias.find('referencia').each((index, ref) => {
                            const referencia = $(ref);
                            let enlace = $("<a>").text(`Referencia ${index+1}`).attr("href", referencia.text());
                            let item = $("<li>").append(enlace);
                            referencias.append(item);
                        })
                        article.append(referencias);

                        let galeria = $("<section>").attr("data-element", "galeria");
                        let title = $("<h4>").text("Galería de fotos");
                        galeria.append(title);

                        let seccionHitos = $("<section>").attr("data-element", "hitos");
                        let titleHitos = $("<h4>").text("Hitos");
                        seccionHitos.append(titleHitos);
                        let hitos = $("<ul>").attr("data-element", "listaHitos");
                        seccionHitos.append(hitos);
                        let listaHitos = rutaXML.find('hitos');
                        listaHitos.find('hito').each((index, hito) => {
                            const hitoXML = $(hito);
                            let nombreHito = $("<li>").text(hitoXML.find('nombre').text());
        
                            let caracteristicasHito = $("<ul>");
                            let descripcion = $("<li>").text(hitoXML.find('descripcion').text());
                            caracteristicasHito.append(descripcion);
        
                            let coordenadas = $("<li>").text(`Coordenadas: ${hitoXML.find('coordenadas').attr('latitud')}, ${hitoXML.find('coordenadas').attr('longitud')}`);
                            caracteristicasHito.append(coordenadas);
        
                            let altitud = $("<li>").text(`Altitud: ${hitoXML.find('coordenadas').attr('altitud')}m`);
                            caracteristicasHito.append(altitud);
        
                            let distanciaHitoAnterior = $("<li>").text(`Distancia al hito anterior: ${hitoXML.find('distancia-hito-anterior').text()}${hitoXML.find('distancia-hito-anterior').attr('unidad')}`);
                            caracteristicasHito.append(distanciaHitoAnterior);
        
                            nombreHito.append(caracteristicasHito);
                            hitos.append(nombreHito);

                            let listaFotos = hitoXML.find('galeria-fotos');
                            listaFotos.find('foto').each((index, foto) => {
                                const fotoXML = $(foto);
                                let img = $("<img>").attr("src", `xml/${fotoXML.text()}`).attr("alt", `Foto de ${hitoXML.find('nombre').text()}`);
                                galeria.append(img);
                            })
                            article.append(galeria);
                        })
                        article.append(seccionHitos);

                        $("section[data-element='rutas']").append(article);
                    });
                }
            }
        }
    }
}