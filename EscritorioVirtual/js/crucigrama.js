class Crucigrama {
    board;
    columns = 9;
    rows = 11;
    init_time;
    end_time;
    boardInArray;

    constructor() {
        this.boardInArray = [];
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
                let value = this.board.split(",")[position];

                if (value === "."){
                    this.boardInArray[i][j] = 0;
                }
                else if (value === "#"){
                    this.boardInArray[i][j] = -1;
                }
                else if (!isNaN()){
                    this.boardInArray[i][j] = parseInt(value);
                }
                else {
                    this.boardInArray[i][j] = value;
                }
            }
        } 
    }

    createStructure() {
        for (let i = 0; i < this.rows; i++){
            for (let j = 0; j < this.columns; j++) {
                let position = i + "" + j;
                let celda = $('<p>').attr("data-element", position); 
                $("main").append(celda);
            }
            
        }
    }

    paintMathword() {
        this.createStructure();
        for (let i = 0; i < this.rows; i++){
            for (let j = 0; j < this.columns; j++) {
                let value = this.boardInArray[i][j];
                let p = $("p[data-element=" + i + j + "]");
                if (value === 0){
                   p.click(function(){
                    p.attr("data-state", "clicked");
                   });
                }
                else{
                    if (value === -1){
                        p.text("").attr("data-state", "empty");
                    }
                    else if (value > 0){
                        p.text(value).attr("data-state", "blocked");
                    }
                    else{
                        p.text(value);
                    }
                }
            }
        }
        this.init_time = new Date();
    }

    check_win_condition() {
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
        let dif = this.end_time - this.init_time;
        let segundos = Math.floor(dif / 1000);
        let minutos = Math.floor(segundos / 60);
        let horas = Math.floor(minutos / 60);
        return horas + ":" + minutos + ":" + segundos;

    }

    introduceElement(value) {
        let celda = $("p[data-state='clicked']")
        let fila;
        let columna;
        if (celda.attr("data-element").length > 2){
            fila = parseInt(celda.attr("data-element").charAt(0) + celda.attr("data-element").charAt(1));
            columna = parseInt(celda.attr("data-element").charAt(2));
        }
        else{
            fila = parseInt(celda.attr("data-element").charAt(0));   
            columna = parseInt(celda.attr("data-element").charAt(1));
        }
        this.boardInArray[fila][columna] = isNaN(value) ? value : parseInt(value);
        let expression_row = true;
        let expression_col = true;
        let first_number;
        let second_number;
        let expression;
        let result;

        if (columna < this.columns-1){
            // vertiente horizontal
            if (this.boardInArray[fila][columna+1] === -1){
                ;
            }
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
                if (first_number != 0 && second_number != 0 && expression != 0 && result != 0){
                    var expresionmatematica = [first_number, expression, second_number].join("");
                    expression_row = result == eval(expresionmatematica);
                }
            }
        }

        if (fila < this.rows-1){
            // vertiente vertical
            if (this.boardInArray[fila+1][columna] === -1){
                ;
            }
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
        
        // comprobar si es correcto
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