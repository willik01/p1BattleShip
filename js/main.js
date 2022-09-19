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

// const SHIP_LOCATIONS_P1 = [
//     {name: SHIPS[0].name, location: ['r1c1', 'r1c2', 'r1c3', 'r1c4']},
//     {name: SHIPS[1].name, location: ['r3c4', 'r3c5', 'r3c6', 'r3c7', 'r3c8']},
//     {name: SHIPS[2].name, location: ['r4c4', 'r4c5', 'r4c6']},
//     {name: SHIPS[3].name, location: ['r8c1', 'r9c1', 'r10c1']},
//     {name: SHIPS[4].name, location: ['r10c9', 'r10c10']},
// ]
// player object (stores plyer info. Who is x/y, win/lose/tie count)
// win criteria - sum of all boat lengths...?
class  Player {
    constructor(name, shotsAllowed) {
        this.name = name;
        this.shotsAllowed = shotsAllowed;
        //this.shotsFired = 0;
        this.hits = 0;
        this.misses = 0;
        this.wins = 0;
        this.losses = 0;
        this.shipLocations = [
            {name: SHIPS[0].name, location: ['r1c2', 'r1c3', 'r1c4', 'r1c5']},
            {name: SHIPS[1].name, location: ['r3c4', 'r3c5', 'r3c6', 'r3c7', 'r3c8']},
            {name: SHIPS[2].name, location: ['r4c4', 'r4c5', 'r4c6']},
            {name: SHIPS[3].name, location: ['r8c1', 'r9c1', 'r10c1']},
            {name: SHIPS[4].name, location: ['r10c9', 'r10c10']},
        ]
    }
    recordHit() {
        this.hits +=1;
    }
    recordMiss() {
        this.misses +=1;
    }
    recordWin() {
        this.wins +=1;
    }
    recordLoss() {
        this.losses +=1;
    }
    reset() {
        this.hits = 0;
        this.misses = 0;
    }
}

/*----- app's state (variables) -----*/
// let score = 0;
// let shotsFired = 0;
// let hits = 0;
// let misses = 0;
//- board state
//- board = array of 100 or nested array of 10 rows, 10 columns?
//- number of shots/hits/misses
//Instantiate payer 1
let player1 = new Player ("Keith", NUM_SHOTS);
let currentPlayer = player1;

/*----- cached element references -----*/
const shotsLeftEl = document.getElementById('sl');
const hitsEl = document.getElementById('hits');
const missesEl = document.getElementById('misses');
const messageDisplayEl = document.getElementById('messageDisplay');
const resetBtnEl = document.getElementById('resetBtn');
const boardEl = document.getElementById('board');

/*----- event listeners -----*/
resetBtnEl.addEventListener('click', handleResetClick);
boardEl.addEventListener('click', handleBoardClick)

/*----- functions -----*/

function initGame(){
    //first clear board
    if (boardEl.hasChildNodes()) {
        while (boardEl.hasChildNodes()) {
            boardEl.removeChild(boardEl.firstChild);
        }
    }
    createBoard();
    currentPlayer.reset();
    shotsLeftEl.innerText = currentPlayer.shotsAllowed - currentPlayer.hits - currentPlayer.misses;
    hitsEl.innerText = currentPlayer.hits;
    missesEl.innerText = currentPlayer.misses;
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

function randomlyPlaceShips(player, boardWidth) {
        return Math.floor((Math.random() * boardWidth)+1);
        console.log (Math.floor(Math.random() * boardWidth)+1);
}

//Click handlers (board clicks and reset button)
function handleResetClick() {
  initGame();
}

function handleBoardClick(evt) {
     console.log('evt.target: ', evt.target);
    // if (!winner) {return};

    if (evt.target.id !== 'board') {
        //Check for hit
        renderShot(evt.target.id, evt.target);
        // console.log('square id: ', evt.target.id, 'locations',SHIP_LOCATIONS_P1[0].location);
    }
}
//Render DOM and determine if shot was a hit
function renderShot(boardCoordinate, targetSquare) {
    if (currentPlayer.shipLocations[0].location.includes(boardCoordinate) ||
        currentPlayer.shipLocations[1].location.includes(boardCoordinate) ||
        currentPlayer.shipLocations[2].location.includes(boardCoordinate) ||
        currentPlayer.shipLocations[3].location.includes(boardCoordinate) ||
        currentPlayer.shipLocations[4].location.includes(boardCoordinate)
        ) {
        targetSquare.style.backgroundImage = "url('assets/hit.png')";
        currentPlayer.recordHit(); //this has to change with multiPlayer
    } else {
        targetSquare.style.backgroundImage = "url('assets/miss.png')";
        currentPlayer.recordMiss(); //this has to change with multiPlayer
    }
    shotsLeftEl.innerText = currentPlayer.shotsAllowed - currentPlayer.hits - currentPlayer.misses;
    hitsEl.innerText = currentPlayer.hits;
    missesEl.innerText = currentPlayer.misses;
    if (currentPlayer.hits === 17) {
        messageDisplayEl.innerHTML = `<strong>${currentPlayer.name} WINS!!!!</strong>`;
        currentPlayer.recordWin();  //this has to change with multiPlayer
    }
    if ((currentPlayer.hits + currentPlayer.misses) === 50) {
        messageDisplayEl.innerHTML = `<strong>${currentPlayer.name} loses!  BOOOOO!!!</strong>`;
    }
}

// START GAME
initGame();