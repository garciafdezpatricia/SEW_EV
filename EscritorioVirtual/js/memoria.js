class Memoria {
    elements = [
        {
            "element" : "HTML5",
            "source" : "https://upload.wikimedia.org/wikipedia/commons/3/38/HTML5_Badge.svg"
        },
        {
            "element" : "CSS3",
            "source" : "https://upload.wikimedia.org/wikipedia/commons/6/62/CSS3_logo.svg"
        },
        {
            "element" : "JS",
            "source" : "https://upload.wikimedia.org/wikipedia/commons/b/ba/Javascript_badge.svg"
        },
        {
            "element" : "PHP",
            "source" : "https://upload.wikimedia.org/wikipedia/commons/2/27/PHP-logo.svg"
        },
        {
            "element" : "SVG",
            "source" : "https://upload.wikimedia.org/wikipedia/commons/4/4f/SVG_Logo.svg"
        },
        {
            "element" : "W3C",
            "source" : "https://upload.wikimedia.org/wikipedia/commons/5/5e/W3C_icon.svg"
        },
        {
            "element" : "HTML5",
            "source" : "https://upload.wikimedia.org/wikipedia/commons/3/38/HTML5_Badge.svg"
        },
        {
            "element" : "CSS3",
            "source" : "https://upload.wikimedia.org/wikipedia/commons/6/62/CSS3_logo.svg"
        },
        {
            "element" : "JS",
            "source" : "https://upload.wikimedia.org/wikipedia/commons/b/ba/Javascript_badge.svg"
        },
        {
            "element" : "PHP",
            "source" : "https://upload.wikimedia.org/wikipedia/commons/2/27/PHP-logo.svg"
        },
        {
            "element" : "SVG",
            "source" : "https://upload.wikimedia.org/wikipedia/commons/4/4f/SVG_Logo.svg"
        },
        {
            "element" : "W3C",
            "source" : "https://upload.wikimedia.org/wikipedia/commons/5/5e/W3C_icon.svg"
        }
    ]

    constructor() {
        // indica si ya hay una carta dada la vuelta
        this.hasFlippedCard = false;
        // indica si el tablero se encuentra bloqueado a la interaccion del usuario
        this.lockBoard = false;
        // indica cual es la primera carta a la que se ha dado la vuelta en esta interaccion
        this.firstCard = null;
        // indica cual es la segunda carta a la que se ha dado la vuelta en esta interaccion
        this.secondCard = null;
        this.shuffleElements()
        this.createElements()
        this.addEventListeners()
    }

    createElements() {
        for (let i = 0; i < this.elements.length; i++){
            let item = this.elements[i]
            document.write('<article data-element="' + item.element +
             '" data-state="abajo" >')
            document.write('<h3>Tarjeta de memoria</h3>')
            document.write('<img src="' + item.source + '" alt="' + item.element + '" />')
            document.write('</article>')
        }
    }

    addEventListeners() {
        const tarjetas = document.querySelectorAll("article[data-state]")
        tarjetas.forEach( (article) => {
            article.addEventListener("click", this.flipCard.bind(article, this))
        })
        
    }

    shuffleElements() {
        for (let i = this.elements.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [this.elements[i], this.elements[j]] = [this.elements[j], this.elements[i]]
        }
    }

    flipCard(game) {
        if (game.lockBoard || this.getAttribute('data-state') === 'revealed' || 
        this === game.firstCard) {
            return;
        }
        else {
            this.setAttribute('data-state', 'flip');
            if (!game.hasFlippedCard){
                game.hasFlippedCard = true;
                game.firstCard = this;
            }
            else {
                game.secondCard = this;
                game.checkForMatch()
            }
        }
        
    }

    unflipCards() {
        console.log("cartas no iguales")
        this.lockBoard = true;
        const flippedCards = document.querySelectorAll("article[data-state='flip']");
        setTimeout(() => {
            flippedCards.forEach((card) => {
                card.dataset.state = 'abajo';
            })
            this.resetBoard();
        }, 1000)
    }

    resetBoard() {
        this.firstCard = null;
        this.secondCard = null;
        this.hasFlippedCard = false;
        this.lockBoard = false;
    }

    checkForMatch() {
        console.log("check que sean iguales")
        this.firstCard.getAttribute('data-element') === this.secondCard.getAttribute('data-element') ? 
            this.disableCards() 
            : this.unflipCards();
    }

    disableCards() {
        console.log("cartas iguales")
        // modificar el valor del atributo data-state a revealed en firstCard y secondCard
        this.firstCard.dataset.state = 'revealed';
        this.secondCard.dataset.state = 'revealed';
        this.resetBoard()
    }
}