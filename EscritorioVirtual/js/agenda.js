class Agenda {

    constructor() {
        this.url = "";
        this.last_api_call = null;
        this.last_api_result = null;
    }

    cargarDatos(){
        this.url = "http://ergast.com/api/f1/2023";

        $.ajax({
            dataType: "xml",
            url: this.url,
            method: 'GET',
            success: (datos) => {
                    let section = $("<section>");
                    //Extracción de los datos contenidos en el XML
                    $('Race', datos).each( (index, carrera) => {
                        const carreraXML = $(carrera);

                        let article = $("<article>");
                        // index+1 para que no empiece en 0
                        let numCarrera = $("<p>").text("#" + Number(index+1));
                        numCarrera.attr("data-element", "numero");
                        article.append(numCarrera);

                        let nombreCarrera = $("<p>").text(carreraXML.find("RaceName").text());
                        nombreCarrera.attr("data-element", "nombreCarrera");
                        article.append(nombreCarrera)

                        let nombreCircuito = $("<p>").text(carreraXML.find("CircuitName").text());
                        nombreCircuito.attr("data-element", "nombreCircuito");
                        article.append(nombreCircuito);

                        let coordenadasCircuito = $("<p>").text("Coordenadas: " + carreraXML.find("Location").attr("lat") + ", " + carreraXML.find("Location").attr("long"));
                        coordenadasCircuito.attr("data-element", "coordenadasCircuito");
                        article.append(coordenadasCircuito);
                        
                        let fecha = $("<p>").text(new Date(carreraXML.find("Date").first().text()).toLocaleDateString());
                        fecha.attr("data-element", "fecha");
                        article.append(fecha);

                        let hora = $("<p>").text(carreraXML.find("Time").first().text());
                        hora.attr("data-element", "hora");
                        article.append(hora);
                        section.append(article);

                    });
                      
                    $("body").append(section);
                },
            error:function(){
                $("h3").html("¡Tenemos problemas! No puedo obtener XML de <a href='http://ergast.com' />Ergast</a>"); 
                }
        });
    }
}