/*----- constants -----*/
const NUM_SHOTS = 50;
const BOARD_HEIGHT = 10;
const BOARD_WIDTH = 10; 
const SHIPS = [
    {name: 'Battleship', length:4},
    {name: 'Carrier', length:5},
    {name: 'Destroyer', length:3},
    {name: 'Submarine', length:3},
    {name: 'Patrol Boat', length:2},
]

const SHIP_LOCATIONS_P1 = [
    {name: SHIPS[0].name, location: ['r1c1', 'r1c2', 'r1c3', 'r1c4']},
    {name: SHIPS[1].name, location: ['r3c4', 'r3c5', 'r3c6', 'r3c7', 'r3c8']},
    {name: SHIPS[2].name, location: ['r4c4', 'r4c5', 'r4c6']},
    {name: SHIPS[3].name, location: ['r8c1', 'r9c1', 'r10c1']},
    {name: SHIPS[4].name, location: ['r10c9', 'r10c10']},
]
console.log (SHIP_LOCATIONS_P1[0].location);

const player = {}
// player object (stores plyer info. Who is x/y, win/lose/tie count)
// win criteria - sum of all boat lengths...?

/*----- app's state (variables) -----*/
let score = 0
//- board state
//- board = array of 100 or nested array of 10 rows, 10 columns?
//- number of shots/hits/misses

/*----- cached element references -----*/
const messageDisplayEl = document.getElementById('messageDisplay');
const resetBtnEl = document.getElementById('resetBtn');
const boardEl = document.getElementById('board');

/*----- event listeners -----*/
resetBtnEl.addEventListener('click', handleResetClick);
boardEl.addEventListener('click', handleBoardClick)

/*----- functions -----*/
// 
function initGame(){
    createBoard();
}

function createBoard() {
    for (i=1; i<=BOARD_HEIGHT; i++) {
        for (i2=1; i2<=BOARD_WIDTH; i2++) {
            const divEl = document.createElement("div");
            divEl.classList.add(`square`);
            divEl.id = `r${i}c${i2}`;
            boardEl.appendChild(divEl);
        }
    }
}

function handleResetClick() {

}

function handleBoardClick(evt) {
     console.log('evt.target: ', evt.target);
    // if (!winner) {return};

    if (evt.target.id !== 'board') {
        //Check for hit
        didItHit(evt.target.id, evt.target);
        // console.log('square id: ', evt.target.id, 'locations',SHIP_LOCATIONS_P1[0].location);
    }
}

function didItHit(boardCoordinate, targetSquare) {
    if (SHIP_LOCATIONS_P1[0].location.includes(boardCoordinate) ||
        SHIP_LOCATIONS_P1[1].location.includes(boardCoordinate) ||
        SHIP_LOCATIONS_P1[2].location.includes(boardCoordinate) ||
        SHIP_LOCATIONS_P1[3].location.includes(boardCoordinate) ||
        SHIP_LOCATIONS_P1[4].location.includes(boardCoordinate)
        ) {
        targetSquare.style.backgroundImage = "url('assets/hit.png')";
    } else {
        targetSquare.style.backgroundImage = "url('assets/miss.png')";
    }
}

// START GAME
initGame();