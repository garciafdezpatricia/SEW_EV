class Crucigrama {
    board;
    columns = 9;
    rows = 11;
    init_time;
    end_time;
    boardInArray;

    constructor() {
        // representa el tablero en dos dimensiones
        this.boardInArray = [];
        // inicializar tablero
        for (let i = 0; i < this.rows; i++){
            this.boardInArray[i] = new Array(this.columns)
        }

        //facil
        this.board = "4,*,.,=,12,#,#,#,5,#,#,*,#,/,#,#,#,*,4,-,.,=,.,#,15,#,.,*,#,=,#,=,#,/,#,=,.,#,3,#,4,*,.,=,20,=,#,#,#,#,#,=,#,#,8,#,9,-,.,=,3,#,.,#,#,-,#,+,#,#,#,*,6,/,.,=,.,#,#,#,.,#,#,=,#,=,#,#,#,=,#,#,6,#,8,*,.,=,16";
        
        //medio
        // this.board = "12,*,.,=,36,#,#,#,15,#,#,*,#,/,#,#,#,*,.,-,.,=,.,#,55,#,.,*,#,=,#,=,#,/,#,=,.,#,15,#,9,*,.,=,45,=,#,#,#,#,#,=,#,#,72,#,20,-,.,=,11,#,.,#,#,-,#,+,#,#,#,*,56,/,.,=,.,#,#,#,.,#,#,=,#,=,#,#,#,=,#,#,12,#,16,*,.,=,32";
        
        // dificil
        // this.board = "4,.,.,=,36,#,#,#,25,#,#,*,#,.,#,#,#,.,.,-,.,=,.,#,15,#,.,*,#,=,#,=,#,.,#,=,.,#,18,#,6,*,.,=,30,=,#,#,#,#,#,=,#,#,56,#,9,-,.,=,3,#,.,#,#,*,#,+,#,#,#,*,20,.,.,=,18,#,#,#,.,#,#,=,#,=,#,#,#,=,#,#,18,#,24,.,.,=,72";
        
        this.start();
    }

    start() {
        for (let i = 0; i < this.rows; i++){
            for (let j = 0; j < this.columns; j++){
                // calcular el indice en la cadena de la posicion del array
                let position = i * this.columns + j;
                // split la cadena de board por comas y coger la de la posicion 
                let value = this.board.split(",")[position];
                // si la cadena contiene un . en la posicion, poner un 0
                if (value === "."){
                    this.boardInArray[i][j] = 0;
                }
                // si contiene un # poner un -1
                else if (value === "#"){
                    this.boardInArray[i][j] = -1;
                }
                // si es numérico poner el número
                else if (!isNaN()){
                    this.boardInArray[i][j] = parseInt(value);
                }
                // si no, es un operador -> poner el operador
                else {
                    this.boardInArray[i][j] = value;
                }
            }
        } 
    }

    createStructure() {
        // crear la estructura del crucigrama poniendole a cada parrafo un data-element con su posicion para manipularlo despues
        for (let i = 0; i < this.rows; i++){
            for (let j = 0; j < this.columns; j++) {
                let position = i + "" + j;
                let celda = $('<p>').attr("data-element", position);
                // añadir la celda (el parrafo) al main
                $("main").append(celda);
            }
            
        }
    }

    paintMathword() {
        // crear estructura del crucigrama
        this.createStructure();
        // pintar el contenido del tablero en 2d en las celdas
        for (let i = 0; i < this.rows; i++){
            for (let j = 0; j < this.columns; j++) {
                let value = this.boardInArray[i][j];
                // coger la celda en la posicion
                let p = $("p[data-element=" + i + j + "]");
                // si el valor es 0 -> añadir evento click
                if (value === 0){
                   p.click(function(){
                    p.attr("data-state", "clicked");
                   });
                }
                else{
                    // si es -1, son las casillas que no se usan 
                    if (value === -1){
                        p.text("").attr("data-state", "empty");
                    }
                    // si el valor es positivo, es un numero ya rellenado al inicio
                    else if (value > 0){
                        p.text(value).attr("data-state", "blocked");
                    }
                    // si no, es un operador
                    else{
                        p.text(value);
                    }
                }
            }
        }
        // comezar a grabar el tiempo de inicio
        this.init_time = new Date();
    }

    check_win_condition() {
        // si hay algun valor que sea 0 no está todo relleno
        for (let i = 0; i < this.rows; i++){
            for (let j = 0; j < this.columns; j++) {
                let value = this.boardInArray[i][j];
                if (value === 0){
                   return false;
                }
            }
        }
        return true;
    }

    calculate_date_difference() {
        // la diferencia esta en milisegundos
        let dif = this.end_time - this.init_time;
        // calcular segundos
        let segundos = Math.floor(dif / 1000);
        // calcular minutos
        let minutos = Math.floor(segundos / 60);
        // calcular horas
        let horas = Math.floor(minutos / 60);
        // retornar el tiempo en horas:minutos:segundos
        return horas + ":" + minutos + ":" + segundos;

    }

    introduceElement(value) {
        // coger la celda que está clicada
        let celda = $("p[data-state='clicked']")
        let fila;
        let columna;
        // si la celda está en una fila > 9, el data-element será del tipo 102 (fila 10 y columna 2)
        if (celda.attr("data-element").length > 2){
            fila = parseInt(celda.attr("data-element").charAt(0) + celda.attr("data-element").charAt(1));
            columna = parseInt(celda.attr("data-element").charAt(2));
        }
        // si no, el data-element será del tipo 12 (fila 1 y columna 2)
        else{
            fila = parseInt(celda.attr("data-element").charAt(0));   
            columna = parseInt(celda.attr("data-element").charAt(1));
        }
        // si el valor que se introdujo es un numero -> parseint, si no (es un operador) poner el propio valor
        this.boardInArray[fila][columna] = isNaN(value) ? value : parseInt(value);
        // inicializar a true
        let expression_row = true;
        let expression_col = true;

        let first_number;
        let second_number;
        let expression;
        let result;

        // si está en la última columna del crucigrama, no hace falta comprobar la vertiente horizontal
        if (columna < this.columns-1){
            // si a la derecha hay celdas con -1, no hay expresion que testear
            if (this.boardInArray[fila][columna+1] === -1){
                ;
            }
            // si no, averiguar la posicion del igual y coger el primer y el segundo numero, el operador y el resultado
            else{
                for (let j = columna + 1; j < this.columns; j++){
                    if (this.boardInArray[fila][j] === "="){
                        first_number = this.boardInArray[fila][j-3];
                        second_number = this.boardInArray[fila][j-1];
                        expression = this.boardInArray[fila][j-2];
                        result = this.boardInArray[fila][j+1];
                        break;
                    }
                }
                // si toda la expresion está rellena, calcular si es correcta
                if (first_number != 0 && second_number != 0 && expression != 0 && result != 0){
                    var expresionmatematica = [first_number, expression, second_number].join("");
                    expression_row = result == eval(expresionmatematica);
                }
            }
        }
        // si está en la última fila del crucigrama, no hace falta comprobar la vertiente vertical
        if (fila < this.rows-1){
            // si debajo hay una celda con -1, no hay expresion que testear
            if (this.boardInArray[fila+1][columna] === -1){
                ;
            }
            // si no, averiguar la posicion del igual y coger el primer y el segundo numero, el operador y el resultado
            else{
                for (let i = fila + 1; i < this.rows; i++){
                    if (this.boardInArray[i][columna] === "="){
                        first_number = this.boardInArray[i-3][columna];
                        second_number = this.boardInArray[i-1][columna];
                        expression = this.boardInArray[i-2][columna];
                        result = this.boardInArray[i+1][columna];
                        break;
                    }
                }
                if (first_number != 0 && second_number != 0 && expression != 0 && result != 0){
                    var expresionmatematica = [first_number, expression, second_number].join("");
                    expression_col = result == eval(expresionmatematica);
                }
            }
        }
        
        // comprobar si es correcto en vertixcal y horizontal
        if (expression_col && expression_row){
            celda.text(value);
            celda.attr("data-state", "correct");
        }
        else{
            this.boardInArray[fila][columna] = 0;
            // TODO: valor inicial de data-state??
        }

        if (this.check_win_condition()){
            this.end_time = new Date();
            let result = this.calculate_date_difference();
            window.alert(`Has completado el crucigrama en un módico tiempo de ${result}`)
        }
    }
}