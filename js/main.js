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
];

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
            {name: SHIPS[0].name, location: []},
            {name: SHIPS[1].name, location: []},
            {name: SHIPS[2].name, location: []},
            {name: SHIPS[3].name, location: []},
            {name: SHIPS[4].name, location: []},
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
let player2 = new Player ("Zev", NUM_SHOTS);
let currentPlayer = player1;
randomlyPlaceShips(currentPlayer);

/*----- cached element references -----*/
let shotsLeftEl = document.getElementById('sl');
let hitsEl = document.getElementById('hits');
let missesEl = document.getElementById('misses');
const messageDisplayEl = document.getElementById('messageDisplay');
const resetBtnEl = document.getElementById('resetBtn');
const boardEl = document.getElementById('board');
const showShipsBtnEl = document.getElementById('showShips');

/*----- event listeners -----*/
resetBtnEl.addEventListener('click', handleResetClick);
boardEl.addEventListener('click', handleBoardClick);
showShipsBtnEl.addEventListener('click', (handleShowShips));
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
    messageDisplayEl.innerHTML = 'Shots Left: <span id="sl">0</span>&nbsp;Hits: <span id="hits">0</span>&nbsp;Misses: <span id="misses">0</span>'
    //reset element references
    shotsLeftEl = document.getElementById('sl');
    hitsEl = document.getElementById('hits');
    missesEl = document.getElementById('misses');
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

function randomlyPlaceShips(player) {
    let shipIdx = 0;  
    let doNotIncrement = null;
    let startPositionX = null;
    let startPositionY = null;
    let tempShipLocationArr = [];
    //for each player's ship locations
    while (shipIdx < player.shipLocations.length) {
        doNotIncrement = false;
        //generate random start/direction
        const directionOfShip = getShipDirection(); // zero = start->down, 1=start->right
        //generate start position - decrement by length of ship for the direction of ship
        if (directionOfShip) {
            startPositionX = getShipStartPositionX(BOARD_WIDTH - SHIPS[shipIdx].length);
            startPositionY = getShipStartPositionY(BOARD_HEIGHT);
        } else {
            startPositionX = getShipStartPositionX(BOARD_WIDTH);
            startPositionY = getShipStartPositionY(BOARD_HEIGHT - SHIPS[shipIdx].length);
        }

// record the new location based on a random start point and direction (down or right)
        //loop through length of ship to record locations for whole ship and build temp location array
        tempShipLocationArr.length = 0;
        for (let locationIdx=0; locationIdx<SHIPS[shipIdx].length; locationIdx++) {
            if (directionOfShip) {
                tempShipLocationArr.push(`r${startPositionX + locationIdx}c${startPositionY}`)
                //check if new locaiton conflicts with other boats. If so, start over. 
                if (checkHit(`r${startPositionX + locationIdx}c${startPositionY}`)){
                    doNotIncrement = true;
                }
            } else {
                tempShipLocationArr.push(`r${startPositionX}c${startPositionY + locationIdx}`)
                //check if new locaiton conflicts with other boats. If so, start over. 
                if (checkHit(`r${startPositionX}c${startPositionY + locationIdx}`)){
                    doNotIncrement = true;
                }
            }    
        };
        //if no conflicts, move to next ship
        if (!doNotIncrement) {
            player.shipLocations[shipIdx].location.length = 0;
            tempShipLocationArr.forEach(coordinate => {
               player.shipLocations[shipIdx].location.push(coordinate);
            });
            shipIdx++;
        }
    };
}

function getShipStartPositionX(boardWidth) {
    return Math.floor((Math.random() * boardWidth)+1);
}

function getShipStartPositionY(boardHeight) {
    return Math.floor((Math.random() * boardHeight)+1);
}

function getShipDirection() {
    console.log('getting direction')
    return Math.floor(Math.random() * 2); // zero = start->right, 1=start->down
}

//Click handler functions (board clicks, reset button, reveal ship locations)
function handleResetClick() {
  initGame();
}

function handleBoardClick(evt) {
     console.log('evt.target: ', evt.target);
    // if (!winner) {return};

    if (evt.target.id !== 'board') {
        //Check for hit
        renderShot(evt.target.id, evt.target);
    }
}

function handleShowShips(){
// *************************************************
// NEED TO FIGURE OUT HOW TO determine which player. 
// *************************************************
// cheat mode to display ship locations
    currentPlayer.shipLocations.forEach(ships => {
        ships.location.forEach(squareId => {
            console.log(squareId);
            console.log(document.getElementById(squareId));
            document.getElementById(squareId).style.backgroundImage = "url('assets/water.png')";
        })
    });
}
//check to see if clicked square is in the player's ship list
function checkHit (boardCoordinate) {
    let foundShip = false;
    currentPlayer.shipLocations.forEach((shipObj, idx) => {
        if(shipObj.location.includes(boardCoordinate)) {
            foundShip = true;
        } 
    });
    return foundShip;
}

//Render DOM and determine if shot was a hit
function renderShot(boardCoordinate, targetSquare) {
    if (checkHit(boardCoordinate)) {
        targetSquare.style.backgroundImage = "url('assets/hit.png')";
        targetSquare.style.pointerEvents = 'none';
        currentPlayer.recordHit(); 
    } else {
        targetSquare.style.backgroundImage = "url('assets/miss.png')";
        targetSquare.style.pointerEvents = 'none';
        currentPlayer.recordMiss(); 
    }
    
    //update message bar
    shotsLeftEl.innerText = currentPlayer.shotsAllowed - currentPlayer.hits - currentPlayer.misses;
    hitsEl.innerText = currentPlayer.hits;
    missesEl.innerText = currentPlayer.misses;
    
    //determine if there is a win or loss
    if (currentPlayer.hits === 17) {
        messageDisplayEl.innerHTML = `<strong>${currentPlayer.name} WINS!!!!</strong>`;
        currentPlayer.recordWin();  
    }
    if ((currentPlayer.hits + currentPlayer.misses) === 50) {
        messageDisplayEl.innerHTML = `<strong>${currentPlayer.name} loses!  BOOOOO!!!</strong>`;
    }
}

// START GAME
initGame();