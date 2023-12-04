class Agenda {

    constructor() {
        this.url = "";
        this.last_api_call = null;
        this.last_api_result = null;
    }

    pintarDatos(datos) {
        let section = $("<section>").attr("data-element", "carreras");
        let heading = $("<h3>").text("Carreras F1");
        section.append(heading);
        const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
        //Extracción de los datos contenidos en el XML
        $('Race', datos).each( (index, carrera) => {
            const carreraXML = $(carrera);

            let article = $("<article>");
            // index+1 para que no empiece en 0
            let numCarrera = $("<p>").text("#" + Number(index+1));
            numCarrera.attr("data-element", "numero");
            article.append(numCarrera);

            let nombreCarrera = $("<h4>").text(carreraXML.find("RaceName").text());
            nombreCarrera.attr("data-element", "nombreCarrera");
            article.append(nombreCarrera)

            let nombreCircuito = $("<p>").text(carreraXML.find("CircuitName").text());
            nombreCircuito.attr("data-element", "nombreCircuito");
            article.append(nombreCircuito);

            let coordenadasCircuito = $("<p>").text(carreraXML.find("Location").attr("lat") + ", " + carreraXML.find("Location").attr("long"));
            coordenadasCircuito.attr("data-element", "coordenadasCircuito");
            article.append(coordenadasCircuito);
            
            let dia = diasSemana[new Date(carreraXML.find("Date").first().text()).getDay()];
            let fecha = $("<p>").text(dia + " " + new Date(carreraXML.find("Date").first().text()).toLocaleDateString() + "\n" + carreraXML.find("Time").first().text());
            fecha.attr("data-element", "fecha");
            article.append(fecha);

            let hora = $("<p>").text(carreraXML.find("Locality").text() + ", " + carreraXML.find("Country").text() );
            hora.attr("data-element", "lugar");
            article.append(hora);

            let enlace = $("<a>").attr("href", carreraXML.find("Circuit").attr("url")).attr("data-element", "enlace").text("+Ver más de este circuito")
            article.append(enlace);
            
            section.append(article);

        });
            
        $("body").append(section);
    }

    callAjax() {
        $.ajax({
            dataType: "xml",
            url: this.url,
            method: 'GET',
            success: (datos) => {
                    // guardar resultado en variable
                    this.last_api_result = datos;
                    this.pintarDatos(datos);
                },
            error:function(){
                $("h3").html("¡Tenemos problemas! No puedo obtener XML de <a href='http://ergast.com' />Ergast</a>"); 
                }
        });
    }

    borrarCarreras(){
        $("section").attr("data-element", "carreras").remove();
    }

    cargarDatos(){
        this.url = "http://ergast.com/api/f1/2023";

        if (this.last_api_call === null){
            this.last_api_call = new Date().getTime();
            this.callAjax();
        }
        else{
            let ahora = new Date().getTime();
            // calcular horas en minutos
            let dif = (ahora - this.last_api_call) / (1000 * 60);
            // si pasaron 5 minutos, hacer llamada ajax
            if (dif >= 5) {
                this.borrarCarreras();
                this.callAjax();                
            }
            // si no, usar datos contenidos en last_api_result
            else {
                this.borrarCarreras();
                this.pintarDatos(this.last_api_result);
            }
        }
    }
}