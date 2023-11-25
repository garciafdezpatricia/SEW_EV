class Fondo {
    nombrePais;
    nombreCapital;
    coordenadas;

    constructor(pais, capital, coordenadas) {
        this.nombreCapital = capital;
        this.nombrePais = pais;
        this.coordenadas = coordenadas;
    }

    getPhoto(){
        let flickrAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
        // añado landscape para que no me salgan fotos de conferencias
        $.getJSON(flickrAPI, {
            tags: this.nombrePais + "," + this.nombreCapital + "," + this.coordenadas + ", landscape" ,
            tagmode: "any",
            format: "json"
        })
        .done(function(data) {
            // Verificar si hay al menos una imagen
            if (data.items.length > 0) {
                // Obtener imagen random
                var firstImage = data.items[Math.floor(Math.random() * 10) + 1];
                // Crear un elemento de imagen y agregarlo al cuerpo del documento
                $('body').css('background-image', 'url(' + firstImage.media.m + ')').css('background-size', 'cover');
            }
        });
    }
}

// Metodos de JQuery
// .css('propiedad') -> devuelve el valor del selector css para esa propiedad
// .css('prop', 'valor') -> introducir valor para la propiedad
// .attr('atr') -> devuelve el atributo. si le meto el valor en la llamada es un setter
// $.('<img/>').attr('src', _ ).attr('alt', _ ).appendTo('body') -> crea una imagen, le pone atributos y la mete en el body

// .done(function(data) { data es la respuesta
// seleccion de la foto > $.('body').css('background-image', url(_)).css('background-size', 'cover')

//})


/*
En agenda.html va a haber un boton de obtener. last_api_call y last_api_result van a estar inicializados a nulo. cuando se clica en el boton, mirar en el last_api_call, que con cada peticion vamos a ir refrescandolo. Vamos a hacer que cada 5 minutos se actualice. si no paso el tiempo de last_api no hacemos nada, si no, se actualiza el last_api_result que va a contener el xml de respuesta

<city name='oviedo /> aqui con el atributo
<country>ESP</country> -> aqui se extrae con text
*/

