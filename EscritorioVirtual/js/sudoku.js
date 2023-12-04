class Sudoku {
    board = "";
    rows = 9;
    columns = 9;
    boardInArray;

    constructor() {
        this.board = "3.4.69.5....27...49.2..4....2..85.198.9...2.551.39..6....8..5.32...46....4.75.9.6";
        this.boardInArray = [];
        for (let i = 0; i < this.rows; i++){
            this.boardInArray[i] = new Array(this.columns)
        }
        this.start()
    }

    start() {
        for (let i = 0; i < this.rows; i++){
            for (let j = 0; j < this.columns; j++){
                // calcular el indice en la cadena de la posicion del array
                let position = i * this.columns + j;
                let value = this.board[position];

                if (value === "."){
                    this.boardInArray[i][j] = 0;
                }
                else{
                    this.boardInArray[i][j] = parseInt(value)
                }
            }
        } 
    }

    createStructure() {
        let main = document.querySelector('section');
        for (let i = 0; i < this.rows; i++){
            for (let j = 0; j < this.columns; j++) {
                let celda = document.createElement('p')
                let position = i + "" + j;
                celda.setAttribute("data-element", position);
                main.appendChild(celda);
            }
            
        }
    }

    paintSudoku() {
        this.createStructure();
        const main = document.querySelector('section');
        const celdas = main.getElementsByTagName('p');
        for (let i = 0; i < this.rows; i++){
            for (let j = 0; j < this.columns; j++) {

                let position = i * this.columns + j;
                let value = this.boardInArray[i][j];
                let p = celdas[position];
                if (value === 0){
                   p.addEventListener("click", this.clickListener)
                }
                else{
                    p.textContent = value;
                    p.dataset.state = "blocked";
                }
            }
        }
    }

    clickListener() {
        // el this hace referencia al evento (el parrafo)
        this.dataset.state = "clicked";
    }

    introduceNumber(value) {
        let celda = document.querySelector("p[data-state='clicked']")
        let fila = celda.getAttribute("data-element").charAt(0);
        let columna = celda.getAttribute("data-element").charAt(1);

        if (this.checkColumn(columna, value) && this.checkRow(fila, value) && this.checkSquare(fila, columna, value)) {
                celda.removeEventListener("click", this.clickListener)
                   celda.textContent = value;
                celda.setAttribute("data-state", "correct");
                this.boardInArray[parseInt(fila)][parseInt(columna)] = parseInt(value)
                if (this.isSudokuCompleted()){
                    window.alert("¡Bien hecho! ¡Sudoku completado!")
                }
            }
    }

    checkColumn(column, value){
        for (let i = 0; i < this.rows; i++){
            if (this.boardInArray[i][column] === parseInt(value)) {
                return false;
            }
        }
        return true;
    }

    checkRow(row, value){
        for (let j = 0; j < this.columns; j++){
            if (this.boardInArray[row][j] === parseInt(value)) {
                return false;
            }
        }
        return true;
    }

    checkSquare(row, column, value){
        let initSquareCol = column - column % 3;
        let initSquareRow = row - row % 3;
        for (let i = initSquareRow; i < initSquareRow+3; i++){
            for (let j = initSquareCol; j < initSquareCol+3; j++) {

                if (this.boardInArray[i][j] === parseInt(value)) {
                    return false;
                }
            }
        }
        return true;
    }

    isSudokuCompleted(){
        for (let i = 0; i < this.rows; i++){
            for (let j = 0; j < this.columns; j++) {

                if (this.boardInArray[i][j] === 0){
                   return false;
                }
            }
        }
        return true;
    }
}