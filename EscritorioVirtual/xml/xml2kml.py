import xml.etree.ElementTree as ET


def prologoKML(archivo, nombre):
    """ Escribe en el archivo de salida el prólogo del archivo KML"""

    archivo.write('<?xml version="1.0" encoding="UTF-8"?>\n')
    archivo.write('<kml xmlns="http://www.opengis.net/kml/2.2">\n')
    archivo.write("<Document>\n")
    archivo.write("<Placemark>\n")
    archivo.write("<name>"+nombre+"</name>\n")    
    archivo.write("<LineString>\n")
    #la etiqueta <extrude> extiende la línea hasta el suelo 
    archivo.write("<extrude>1</extrude>\n")
    # La etiqueta <tessellate> descompone la línea en porciones pequeñas
    archivo.write("<tessellate>1</tessellate>\n")
    archivo.write("<coordinates>\n")

def epilogoKML(archivo):
    """ Escribe en el archivo de salida el epílogo del archivo KML"""

    archivo.write("</coordinates>\n")
    archivo.write("<altitudeMode>relativeToGround</altitudeMode>\n")
    archivo.write("</LineString>\n")
    archivo.write("<Style> id='lineaRoja'>\n") 
    archivo.write("<LineStyle>\n") 
    archivo.write("<color>#ff0000ff</color>\n")
    archivo.write("<width>5</width>\n")
    archivo.write("</LineStyle>\n")
    archivo.write("</Style>\n")
    archivo.write("</Placemark>\n")
    archivo.write("</Document>\n")
    archivo.write("</kml>\n")

def main():
    """Procesado de archivos xml con coordenadas y generación de un archivo KML (Keyhole Markup Language)
KML es un formato de archivo que se utiliza para mostrar datos geográficos en un navegador terrestre.
Se utiliza por Google Earth, Google Maps y Google Maps para móviles.
KML utiliza una estructura basada en etiquetas con atributos y elementos anidados y está basado en el estándar XML

Versión 1.0 31/Octubre/2023
Patricia García Fernández. Universidad de Oviedo

    """
    print(main.__doc__)
    nombreArchivo = input("Introduzca el nombre del archivo xml    = ")

    try:
        archivo = open(nombreArchivo,'r')
    except IOError:
        print ('No se encuentra el archivo ', nombreArchivo)
        exit()

    root = ET.parse(nombreArchivo).getroot()

    rutas = root.findall('.//{http://www.uniovi.es}ruta')
    # Procesamiento y generación del archivo kml    
    for ruta in rutas:
        
        nombreSalida  = input("Introduzca el nombre del archivo generado (*.kml) = ")
        try:
            salida = open(nombreSalida + ".kml",'w')
        except IOError:
            print ('No se puede crear el archivo ', nombreSalida + ".kml")
            exit()

        # Escribe la cabecera del archivo de salida
        prologoKML(salida, nombreArchivo)
        # coordenadas de la direccion de inicio de la ruta
        coordenadas = ruta.find('.//{http://www.uniovi.es}coordenadas')
        longitud = coordenadas.get('longitud')
        latitud = coordenadas.get('latitud')
        altitud = coordenadas.get('altitud')
        salida.write(latitud + "," + longitud + "," + altitud + "\n")

        # coordenadas de cada hito de la ruta
        hitos = ruta.findall('.//{http://www.uniovi.es}hitos/{http://www.uniovi.es}hito')
        for hito in hitos:
            coordenadas = hito.find('.//{http://www.uniovi.es}coordenadas')
            longitud = coordenadas.get('longitud')
            latitud = coordenadas.get('latitud')
            altitud = coordenadas.get('altitud')
            salida.write(latitud + "," + longitud + "," + altitud + "\n")

        epilogoKML(salida)
        
        salida.close()
    archivo.close()

    # Esribe el epilogo del archivo de salida

if __name__ == "__main__":
    main()
