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
                let section = $("<section>").attr("data-element", "muro");
                let heading = $("<h3>").text("Muro de noticias");
                section.append(heading);
                $("section[data-element='nuevaNoticia']").before(section);
                for (let noticia of contenidoArchivo.split("\n")){
                    let contenido = noticia.split("_");

                    let article = $("<article>").attr("data-element", "noticia");
                    let title = $("<h3>").text(contenido[0]).attr("data-element", "titulo");
                    article.append(title);
                    let subtitle = $("<p>").text(contenido[1]).attr("data-element", "subtitulo");
                    article.append(subtitle);
                    let text = $("<p>").text(contenido[2]).attr("data-element", "texto");
                    article.append(text);
                    let author = $("<p>").text(contenido[3]).attr("data-element", "autor");
                    article.append(author);

                    section.append(article);
                }
            }      
            lector.readAsText(archivo);
        }
        else {
            errorArchivo.innerText = "Error : ¡¡¡ Archivo no válido !!!";
            }       
    }

    addNoticia() {
        let titulo = $("input[data-element='nuevoTitulo']");
        let subtitulo = $("input[data-element='nuevoSubtitulo']");
        let texto = $("input[data-element='nuevoTexto']");
        let autor = $("input[data-element='nuevoAutor']");

        if (titulo.val() === "" || subtitulo.val() === "" || texto.val() === "" || autor.val() === ""){
            window.alert("Introduce un titulo, subtitulo, texto y autor para la nueva noticia!");
        }
        else {
            let article = $("<article>").attr("data-element", "noticia");
            $("section[data-element='muro'] article:last-child").after(article);
            let title = $("<h3>").text(titulo.val()).attr("data-element", "titulo");
            article.append(title);
            let subtitle = $("<p>").text(subtitulo.val()).attr("data-element", "subtitulo");
            article.append(subtitle);
            let text = $("<p>").text(texto.val()).attr("data-element", "texto");
            article.append(text);
            let author = $("<p>").text(autor.val()).attr("data-element", "autor");
            article.append(author);

            // reiniciar los inputs
            titulo.val("");
            subtitulo.val("");
            texto.val("");
            autor.val("");
        }
    }
}

// http://localhost..../viajes.html -> NO, entrar con el protocolo seguro -> https://..../viajes.html

// darle tamaño al contenedor del mapa (width: 100%; height: 50vw);