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
    }

    shuffleElements() {
        for (let i = this.elements.length - 1; i > 0; i--) {
            let j = Math.floor(MAth.random() * (i + 1));
            [this.elements[i], this.elements[j]] = [this.elements[j], this.elements[i]]
        }
    }

    unflipCards() {
        this.lockBoard = true;
        // para voltear las que esten boca arriba hay que hacer un queryselector pa los articles que tengan el data-state flipped (mirar los estados por si acaso)
    }

    resetBoard() {
        this.firstCard = null;
        this.secondCard = null;
        this.hasFlippedCard = false;
        this.lockBoard = false;
    }
}