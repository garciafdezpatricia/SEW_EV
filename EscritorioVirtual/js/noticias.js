class Noticias {

    constructor() {
        if (window.File && window.FileReader && window.FileList && window.Blob) {  
            //El navegador soporta el API File
            ;
        }
    }

    readInputFile(files){
        let contenidoArchivo;
        // leer fichero noticias
        var archivo = files[0];
        //Solamente admite archivos de tipo texto
        var tipoTexto = /text.*/;
        if (archivo.type.match(tipoTexto)) {
            var lector = new FileReader();
            lector.onload = function (evento) {
                //El evento "onload" se lleva a cabo cada vez que se completa con éxito una operación de lectura
                //La propiedad "result" es donde se almacena el contenido del archivo
                //Esta propiedad solamente es válida cuando se termina la operación de lectura
                contenidoArchivo = lector.result;
                for (let noticia of contenidoArchivo.split("\n")){
                    let contenido = noticia.split("_");

                    let article = $("<article>")
                    let title = $("<p>").text(contenido[0]).attr("data-element", "titulo");
                    article.append(title);
                    let subtitle = $("<p>").text(contenido[1]).attr("data-element", "subtitulo");
                    article.append(subtitle);
                    let text = $("<p>").text(contenido[2]).attr("data-element", "texto");
                    article.append(text);
                    let author = $("<p>").text(contenido[3]).attr("data-element", "autor");
                    article.append(author);

                    $("main").append(article);
                }
            }      
            lector.readAsText(archivo);
        }
        else {
            errorArchivo.innerText = "Error : ¡¡¡ Archivo no válido !!!";
            }       
    }
}

// un mapa estatico es una imagen. un mapa dinamico es un frame no accesible. puede tener problemas de accesibilidad

// titulo_subtitulo_texto_autor\n

// http://localhost..../viajes.html -> NO, entrar con el protocolo seguro -> https://..../viajes.html

// darle tamaño al contenedor del mapa (width: 100%; height: 50vw);