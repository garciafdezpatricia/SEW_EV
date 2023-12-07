class ListaTareas {

    constructor() {
        this.tasks = [];
        this.tareaAMover = null;
        this.loadFromStorage()
    }

    // para cargar desde el web storage
    loadFromStorage() {
        if (localStorage.getItem('tasks')){
            this.tasks = JSON.parse(localStorage.getItem('tasks'));
            for (let i = 0; i < this.tasks.length; i++) {
                let contenido = this.tasks[i];
                let article = $("<article>").attr("data-element", "tarea").attr('draggable', 'true');
                let title = $("<h6>").text(contenido[0]).attr("data-element", "titulo");
                article.append(title);
                let text = $("<p>").text(contenido[1]).attr("data-element", "texto");
                article.append(text);
                let tipo = contenido[2];
                if (tipo.toUpperCase() === "TO-DO"){
                    article.attr("data-state", "to-do");
                    $('section[data-element="to-do"]').append(article);
                }
                else if (tipo.toUpperCase() === "IN-PROGRESS"){
                    article.attr("data-state", "in-progress");
                    $('section[data-element="in-progress"]').append(article);
                }
                else {
                    article.attr("data-state", "done");
                    $('section[data-element="done"]').append(article);
                }
            }
            this.addListeners();
        }
    }

    loadTasks(file) {
        let archivo = file[0];
        var tipoTexto = /text.*/;
        if (archivo.type.match(tipoTexto)) {
            var lector = new FileReader();
            lector.onload = this.onFileLoad.bind(this, this.tasks);
            lector.readAsText(archivo);            
        }
        else {
            errorArchivo.innerText = "Error : ¡¡¡ Archivo no válido !!!";
        }       
    }

    onFileLoad(tasks, evento) {
        let contenidoArchivo = evento.target.result;
        let counter = 1;
        for (let tarea of contenidoArchivo.split("\n")){
            tarea = tarea.trim();
            let article = $("<article>").attr("data-element", "tarea").attr('draggable', 'true');
            let contenido = tarea.split("_");
            let title = $("<h6>").text(contenido[0]).attr("data-element", "titulo");
            article.append(title);
            let text = $("<p>").text(contenido[1]).attr("data-element", "texto");
            article.append(text);
            let tipo = contenido[2];
            if (tipo === "TO-DO"){
                article.attr("data-state", "to-do");
                $('section[data-element="to-do"]').append(article);
            }
            else if (tipo === "IN-PROGRESS"){
                article.attr("data-state", "in-progress");
                $('section[data-element="in-progress"]').append(article);
            }
            else {
                article.attr("data-state", "done");
                $('section[data-element="done"]').append(article);
            }
            let t = [contenido[0], contenido[1], contenido[2]]
            this.tasks.push(t);
            counter += 1;
        }
        // añadir listeners para el drag and drop
        this.addListeners();
        // guardar las tareas en el web storage
        this.saveTasks();
    }

    addListeners() {
        let tareas = $('article[data-element="tarea"]');
        tareas.each((index, article) => {
            $(article).on('dragstart', this.dragStart.bind(this));
        });

        let todo = $('section[data-element="to-do"]');
        $(todo).on('dragover', this.allowDrop.bind(this))
        $(todo).on('drop', this.drop.bind(this));

        let progress = $('section[data-element="in-progress"]');
        $(progress).on('dragover', this.allowDrop.bind(this))
        $(progress).on('drop', this.drop.bind(this));

        let done = $('section[data-element="done"]');
        $(done).on('dragover', this.allowDrop.bind(this));
        $(done).on('drop', this.drop.bind(this));
    }

    saveTasks() {
        // API de Web Storage
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    allowDrop(event) {
        event.preventDefault();
    }

    dragStart(event) {
        // datos que se transferirán durante la operación de arrastrar
        const estado = event.target.dataset.state;
        this.tareaAMover = event.target;

        event.originalEvent.dataTransfer.setData("text/plain", JSON.stringify({
            state: estado
        }));
    }

    drop(event) {
        event.preventDefault();
        
        const nuevaSeccion = $(event.target);
        // Cambiar el estado de la tarea
        $(this.tareaAMover).attr("data-state", nuevaSeccion.attr("data-element"))

        // Mueve la tarea a la sección correspondiente
        nuevaSeccion.append(this.tareaAMover);

        // Actualiza la información en el almacenamiento local
        this.updateTasks();
        
    }

    updateTasks() {
        this.tasks = [];

        let tareas = $('article[data-element="tarea"]');
        tareas.each((index, tarea ) => {
            let nodoTarea = $(tarea);
            const taskInfo = [
                nodoTarea.find('h6[data-element="titulo"]').text(),
                nodoTarea.find('p[data-element="texto"]').text(),
                nodoTarea.attr('data-state')
            ];
            this.tasks.push(taskInfo);
        })

        // Guarda las tareas actualizadas
        this.saveTasks();
    }
}
