class Fondo {   

    constructor(pais, capital, latitud, longitud) {
        this.nombreCapital = capital;
        this.nombrePais = pais;
        this.latitud = latitud;
        this.longitud = longitud;
    }

    getPhoto(){
        let flickrurl = "https://www.flickr.com/services/rest/";
        // añado landscape para que no me salgan fotos de conferencias
        $.getJSON(flickrurl, {
            method: "flickr.photos.search",
            api_key: "dcebf8e1da5d2b00e287a241dcdb285a",
            tags: this.nombrePais + "," + this.nombreCapital + ", landscape" ,
            tagmode: "any",
            lat: this.latitud,
            lon: this.longitud,
            format: "json",
            nojsoncallback: 1
        })
        .done(function(data) {
            // Verificar si hay al menos una imagen
            if (data.photos.photo.length > 0) {
                // Obtener imagen random
                var firstImage = data.photos.photo[Math.floor(Math.random() * 10) + 1];
                // Crear un elemento de imagen y agregarlo al cuerpo del documento
                $('body').css('background-image', 'url("https://live.staticflickr.com/' + firstImage.server + "/" + firstImage.id + "_" + firstImage.secret + "_b.jpg" + ')')
                .css('background-size', 'cover').css('background-repeat', 'no-repeat');
            }
        });
    }
}