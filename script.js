class Area {
    #matrix;
    #sizeDeck;

    // handlers
    #clickHandle;
    #mouseOverHandle

    // figure
    #target

    constructor() {
        this.#matrix = new Array(10).fill().map(() => new Array(10).fill(0));

        this.#mouseOverHandle = (e) => {
            let current = e.target;
            const coordinates = current.id.split(" ").map(el => parseInt(el));


            if (coordinates.every(el => !isNaN(el))) {
                const div = document.querySelector(".area");
                if (this.#check(coordinates)) {

                    if (div.classList.contains("forbid-to-click")) {
                        div.classList.replace("forbid-to-click", "let-to-click");
                    } else {
                        div.classList.add("let-to-click");
                    }

                    this.#letToClick();
                } else {

                    if (div.classList.contains("let-to-click")) {
                        div.classList.replace("let-to-click", "forbid-to-click");
                    } else {
                        div.classList.add("forbid-to-click");
                    }
                }
            }
        };

        this.#clickHandle = (e) => {
            let current = e.target;
            const coordinates = current.id.split(" ").map(el => parseInt(el));



            if (coordinates.every(el => !isNaN(el))) {
                this.#process(coordinates);
                this.#updateUI(coordinates);
                this.#turnOff();
            }
        };
    }

    echo(sizeDeck, target) {
        this.#sizeDeck = sizeDeck;
        this.#target = target;


        this.#turnOn();
    }

    #updateUI(coordinates) {
        this.#target.className = "disposable";

        const [y, x] = coordinates;
        for (let i = y === 0 ? 0 : y - 1; i <= y + 1 && i < this.#matrix.length; i++) {
            for (let j = x === 0 ? 0 : x - 1; j <= x + this.#sizeDeck && j < this.#matrix.length; j++) {
                const cell = document.getElementById(i + " " + j);
                if (i === y && (j >= x && j < x + this.#sizeDeck)) {
                    // ship

                    //center 
                    cell.className = "center-side-ship";

                    // left
                    if (j === x) {
                        cell.classList.add("left-side-ship");
                    }

                    // right
                    if (j === (x + this.#sizeDeck - 1)) {
                        cell.classList.add("right-side-ship");
                    }

                } else {
                    //red
                    cell.className = "space-cell";
                }
            }
        }
    }

    #check(coordinates) {
        const [y, x] = coordinates;
        console.log('i = ', y, "j = ", x);

        if (x + this.#sizeDeck > this.#matrix.length) {
            return false; 
        }

        // якщо близько до лівого або\і верхнього краю 
        // i & j


        // перевірка
        for (let i = y === 0 ? 0 : y - 1; i <= y + 1 && i < this.#matrix.length; i++) {
            for (let j = x === 0 ? 0 : x - 1; j <= x + this.#sizeDeck && j < this.#matrix.length; j++) {

                if (this.#matrix[i][j] !== 0) { 
                    if ((j >= x - 1) && (j <= x + this.#sizeDeck)) {
                        if (this.#matrix[i][j] !== "X") {
                            return false;
                        }
                    }
                }
            }
        }

        return true;
    }

    #process(coordinates) {
        const [y, x] = coordinates;
        
        for (let i = y === 0 ? 0 : y - 1; i <= y + 1 && i < this.#matrix.length; i++) {
            for (let j = x === 0 ? 0 : x - 1; j <= x + this.#sizeDeck && j < this.#matrix.length; j++) {
                if (i === y && (j >= x && j < x + this.#sizeDeck)) {
                    this.#matrix[i][j] = this.#sizeDeck;
                } else {
                    this.#matrix[i][j] = "X";
                }
            }
        }
    }


    #letToClick() {
        const div = document.querySelector(".area");
        div.addEventListener("click", this.#clickHandle);
    }


    #turnOn() {
        const div = document.querySelector(".area");
        div.addEventListener("mouseover", this.#mouseOverHandle);
    }

    #turnOff() {
        const div = document.querySelector(".area");
        div.removeEventListener("click", this.#clickHandle);
        div.removeEventListener("mouseover", this.#mouseOverHandle);
    }


}

class Game {
    #area

    constructor(area) {
        this.#area = area;
    }

    start() {
        this.#initFigures();
    }

    #initFigures() {
        const container = document.querySelector(".figure_container table");
        if (container) {
            container.addEventListener("click", (e) => {
                const target = e.target;
                let className = target.classList[0];
                if (className && className.includes("deck")) {
                    let sizeDeck = parseInt(className.replace("deck", ""));
                    console.log("figure’s size", sizeDeck);
                    this.#area.echo(sizeDeck, target);
                }
            });
        }
    }
}


const game = new Game(new Area());
game.start();


