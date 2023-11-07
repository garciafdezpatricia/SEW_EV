import xml.etree.ElementTree as ET


def prologoSVG(archivo, nombre):
    """ Escribe en el archivo de salida el prólogo del archivo SVG para crear una polilyne"""
    archivo.write('<?xml version="1.0" encoding="UTF-8"?>\n')
    archivo.write('<svg xmlns="http://www.w3.org/2000/svg" version="2.0">\n')
    archivo.write('<polyline points = "')

def epilogoPolilineaSVG(archivo):
    """ Escribe en el archivo de salida el epílogo del archivo SVG que crea una polilyne"""
    archivo.write('"\n')
    archivo.write('style="fill:white;stroke:red;stroke-width=4" />\n')

def epilogoSVG(archivo):
    """ Escribe en el archivo de salida el epílogo de la polilinea"""
    archivo.write("</svg>\n")

def textoSVG(archivo, x, y, texto):
    archivo.write('<text x="' + x + '" y="' + y + '" style="writing-mode: tb; glyph-orientation-vertical: 0;">\n')
    archivo.write(texto + "\n")
    archivo.write('</text>\n')

def main():
    """Procesado de archivos xml con coordenadas y generación de un archivo SVG (Scalable Vector Graphics)

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
        
        nombreSalida  = input("Introduzca el nombre del archivo generado (*.svg) = ")
        try:
            salida = open(nombreSalida + ".svg",'w')
        except IOError:
            print ('No se puede crear el archivo ', nombreSalida + ".kml")
            exit()

        # Escribe la cabecera del archivo de salida
        prologoSVG(salida, nombreArchivo)

        #Escribe la polilinea
        comienzoPoligonoX = 100
        coordenadas = ruta.find('.//{http://www.uniovi.es}coordenadas')
        comienzoAltitud = "150"
        salida.write(str(comienzoPoligonoX) + "," + comienzoAltitud + "\n")
        altitudRuta = coordenadas.get("altitud")
        salida.write(str(comienzoPoligonoX) + "," + str(float(comienzoAltitud) - float(altitudRuta)/10) + "\n")

        hitos = ruta.findall('.//{http://www.uniovi.es}hitos/{http://www.uniovi.es}hito')
        incrementoX = comienzoPoligonoX
        for hito in hitos:
            coordenadas = hito.find('.//{http://www.uniovi.es}coordenadas')
            altitud = coordenadas.get('altitud')
            distancia = hito.find('.//{http://www.uniovi.es}distancia-hito-anterior')
            incrementoX += float(distancia.text)*100 # multiplicar por cien porque la distancia entre un hito y otro esta en 0.1km (no se ve casi)
            salida.write(str(incrementoX) + "," + str(float(comienzoAltitud) - float(altitud)/10) + "\n") # dividir entre 10 porque la altitud a veces es de 1500, no entra
        salida.write(str(incrementoX) + "," + comienzoAltitud + "\n") # poner el ultimo punto final para que la línea sea recta
        salida.write(str(comienzoPoligonoX) + "," + comienzoAltitud)
        epilogoPolilineaSVG(salida)

        comienzoTexto = "155"
        #Escribe el texto de la polilinea de cada hito
        textoSVG(salida, str(comienzoPoligonoX), comienzoTexto, ruta.find('.//{http://www.uniovi.es}direccion-inicio').text)
        incrementoX = comienzoPoligonoX
        for hito in hitos:
            nombre = hito.find('.//{http://www.uniovi.es}nombre')
            distancia = hito.find('.//{http://www.uniovi.es}distancia-hito-anterior')
            incrementoX += float(distancia.text)*100
            textoSVG(salida, str(incrementoX), comienzoTexto, nombre.text)
        # textoSVG(salida, str(incrementoX), comienzoTexto, "Final") #ponerle el texto al último punto final para que la línea sea recta
        # Esribe el epilogo del archivo de salida
        epilogoSVG(salida)
        salida.close()
    archivo.close()


if __name__ == "__main__":
    main()
