class Pais {
    nombrePais;
    nombreCapital;
    poblacion;
    gobierno;
    longitud;
    latitud;
    religionMayoritaria;
    apikey = "6e63bf5435f2dbabe37d8b5aa254b5bf";
    url;
    
    constructor(nombrePais, nombreCapital, poblacion) {
        this.nombrePais = nombrePais;
        this.nombreCapital = nombreCapital;
        this.poblacion = poblacion;
    }

    relleno() {
        this.gobierno = "República parlamentaria unitaria";
        this.latitud = "41.3275"
        this.longitud = "19.8199"
        this.religionMayoritaria = "Islamismo"
    }

    getNombrePais() {
        return this.nombrePais;
    }

    getNombreCapital() {
        return this.nombreCapital;
    }

    getInformacionSecundaria() {
        return "<ul><li>" + this.poblacion + "</li><li>" + this.gobierno + "</li><li>" + this.religionMayoritaria + "</li></ul>"
    }

    coordenadasPais() {
        document.write("<p>Las coordenadas de ");
        document.write(this.nombreCapital);
        document.write(" son ");
        document.write(this.longitud + ", " + this.latitud);
        document.write("</p>");
    }


    calcularMediaDiaria(datos){
        let medias = {};

        for (let entrada of datos.list){
            // coger la fecha sin la hora
            const fecha = entrada.dt_txt.split(' ')[0];
            // comprobar si es una nueva fecha
            if (medias[fecha]){
                // sumar valor
                medias[fecha].tempMax += entrada.main.temp_max;
                medias[fecha].tempMin += entrada.main.temp_min;
                medias[fecha].humedad += entrada.main.humidity;
                medias[fecha].viento += entrada.wind.speed;
                medias[fecha].entradas += 1;
            } 
            else {
                // si no hay una entrada para esa fecha, inicializar valores
                medias[fecha] = {
                    tempMax: entrada.main.temp_max,
                    tempMin: entrada.main.temp_min,
                    humedad: entrada.main.humidity,
                    viento: entrada.wind.speed,
                    icono: entrada.weather[0].icon,
                    tiempo: entrada.weather[0].main,
                    descripcion: entrada.weather[0].description,
                    entradas: 1
                };
            }
        }
        // calcular las medias
        for (const fecha in medias) {
            medias[fecha].tempMax =  (medias[fecha].tempMax / medias[fecha].entradas).toFixed(2);
            medias[fecha].tempMin = (medias[fecha].tempMin /  medias[fecha].entradas).toFixed(2);
            medias[fecha].humedad = (medias[fecha].humedad / medias[fecha].entradas).toFixed(2);
            medias[fecha].viento = (medias[fecha].viento / medias[fecha].entradas).toFixed(2);
        }
        // devolver las medias de cada dia
        return medias;
    }


    cargarDatos(){
        // crear url
        this.url = "http://api.openweathermap.org/data/2.5/forecast?lat=" + this.latitud + "&lon=" + this.longitud + "&units=metric&lang=es&appid=" + this.apikey;

        // la llamada a la api devuelve el tiempo cada 3 horas -> de momento vamos a hacer la media y sacar solo una prediccion por dia

        $.ajax({
            dataType: "json",
            url: this.url,
            method: 'GET',
            success: (datos) => {       
                    const medias = this.calcularMediaDiaria(datos);

                    // pintar medias diarias
                    let seccion = $("<section>").attr("data-element", "meteoPrediction");
                    Object.keys(medias).forEach((fecha) => {
                        let article = $("<article>");

                        let icono = $("<img>").attr("src", "https://openweathermap.org/img/wn/" + medias[fecha].icono + "@2x.png")
                        article.append(icono);

                        let temperaturaMin = $("<p>").text(medias[fecha].tempMin);
                        let temperaturaMax = $("<p>").text(medias[fecha].tempMax);
                        article.append(temperaturaMin);
                        article.append(temperaturaMax);

                        let humedad = $("<p>").text("Humedad: " + medias[fecha].humedad);
                        article.append(humedad);

                        let viento = $("<p>").text("Viento: " + medias[fecha].viento);
                        article.append(viento);
                        
                        let date = $("<p>").text(fecha);
                        article.append(date);                     
                        
                        seccion.append(article);
                    })
                    $("body").append(seccion);
                },
            error:function(){
                $("h3").html("¡Tenemos problemas! No puedo obtener JSON de <a href='http://openweathermap.org'>OpenWeatherMap</a>"); 
                }
        });
    }
}