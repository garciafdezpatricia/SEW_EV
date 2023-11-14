class Pais {
    nombrePais;
    nombreCapital;
    poblacion;
    gobierno;
    coordenadasCapital;
    religionMayoritaria;
    
    constructor(nombrePais, nombreCapital, poblacion) {
        this.nombrePais = nombrePais;
        this.nombreCapital = nombreCapital;
        this.poblacion = poblacion;
    }

    relleno() {
        this.gobierno = "República parlamentaria unitaria";
        this.coordenadasCapital = "41.3275, 19.81889"
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
        document.write(this.coordenadasCapital);
        document.write("</p>");
    }
}