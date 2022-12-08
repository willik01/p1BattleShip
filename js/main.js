/*----- constants -----*/
const NUM_SHOTS = 50;
const BOARD_HEIGHT = 10;
const BOARD_WIDTH = 10; 
const SHIPS = [
    {name: 'Battleship', length:4},
    {name: 'Carrier', length:5},
    {name: 'Destroyer', length:3},
    {name: 'Submarine', length:3},
    {name: 'PatrolBoat', length:2},
];

// player object (stores plyer info. Who is x/y, win/lose/tie count)
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
        this.shipDirection = [
            {name: SHIPS[0].name, direction: null},
            {name: SHIPS[1].name, direction: null},
            {name: SHIPS[2].name, direction: null},
            {name: SHIPS[3].name, direction: null},
            {name: SHIPS[4].name, direction: null},
        ]
        this.shipHits = [
            {name: SHIPS[0].name, numHits: null},
            {name: SHIPS[1].name, numHits: null},
            {name: SHIPS[2].name, numHits: null},
            {name: SHIPS[3].name, numHits: null},
            {name: SHIPS[4].name, numHits: null},
        ]
    }
    recordHit() {
        this.hits +=1;
    }

    recordMiss() {
        this.misses +=1;
    }

    recordShipHit(shipIdx) {
        this.shipHits[shipIdx].numHits +=1;
    }
    
    isShipSunk(shipIdx){
        if (SHIPS[shipIdx].length === this.shipHits[shipIdx].numHits) {
            return true;
        }
    }
    
    recordWin() {  //Display this
        this.wins +=1; 
    }
    
    recordLoss() { //Display this
        this.losses +=1;
    }
    
    reset() {
        this.hits = 0;
        this.misses = 0;
        this.shipHits.forEach(element => {
            element.numHits = null;
        });
    }
}

/*----- app's state (variables) -----*/
//Instantiate payers
let player1 = new Player ("Player One", NUM_SHOTS);
let player2 = new Player ("Player Two", NUM_SHOTS);
let currentPlayer = player1;
let playingTwoPlayerGame = false;

/*----- cached element references -----*/
const resetBtnEl = document.getElementById('resetBtn');
const numPlayerBtnEl = document.getElementById('numPlayer');
const playerTurnNotifyEl = document.getElementById('playersTurn')

//Board 1
let shotsLeftEl = document.getElementById('sl');
let hitsEl = document.getElementById('hits');
let missesEl = document.getElementById('misses');
const messageDisplayEl = document.getElementById('messageDisplay');
const boardEl = document.getElementById('board'); 
const boardOneContainerEl = document.querySelector('.boardOneContainer');

//Board 2
let shotsLeftEl2 = document.getElementById('sl2');
let hitsEl2 = document.getElementById('hits2');
let missesEl2 = document.getElementById('misses2');
const messageDisplayEl2 = document.getElementById('messageDisplay2');
const boardTwoEl = document.getElementById('board2') 
const boardTwoContainerEl = document.querySelector('.boardTwoContainer')

const twoPlayerBoardEL = document.querySelector('.flexContainer') //Needed?

/*----- event listeners -----*/
resetBtnEl.addEventListener('click', handleResetClick);
// boardEl.addEventListener('click', handleBoardClick);  //Not needed because eventListner set at parent of both boards
numPlayerBtnEl.addEventListener('click', handleNumPlayerClick);
twoPlayerBoardEL.addEventListener('click', handleBoardClick);
/*----- functions -----*/

function initGame(){ 
    // clear boards, create boards, place
    clearBoard(boardEl);
    clearBoard(boardTwoEl);
    createBoard(boardEl, 1);
    createBoard(boardTwoEl, 2);
    randomlyPlaceShips(player1, "b1"); 
    randomlyPlaceShips(player2, "b2"); 
    player1.reset(); 
    player2.reset();
    boardOneContainerEl.style.pointerEvents = 'auto';
    boardTwoContainerEl.style.pointerEvents = 'none';
    messageDisplayEl.innerHTML = `${player1.name} Shots Left: <span id="sl">0</span>&nbsp;Hits: <span id="hits">0</span>&nbsp;Misses: <span id="misses">0</span>`
    messageDisplayEl2.innerHTML = `${player2.name} Shots Left: <span id="sl2">0</span>&nbsp;Hits: <span id="hits2">0</span>&nbsp;Misses: <span id="misses2">0</span>`
    playerTurnNotifyEl.innerHTML = ``
    
    //reset element references for board refresh
    shotsLeftEl = document.getElementById('sl'); 
    hitsEl = document.getElementById('hits');
    missesEl = document.getElementById('misses');
    shotsLeftEl2 = document.getElementById('sl2'); 
    hitsEl2 = document.getElementById('hits2');
    missesEl2 = document.getElementById('misses2');
    // boardEl.style.pointerEvents = 'auto';
}

// Switch between one & two player board
function handleNumPlayerClick(){
    numPlayerBtnEl.innerText = (numPlayerBtnEl.innerText === "Change to two player game")? 
    setTwoPlayerBoard():setOnePlayerBoard(); 
    initGame();
}

function setTwoPlayerBoard(){
    console.log('setting TWO player board') //actions need to happen before returning text
    boardTwoContainerEl.style.display = 'inline'; 
    boardTwoContainerEl.style.pointerEvents = 'none';
    playingTwoPlayerGame = true;
    return "Change to one player game"
}
function setOnePlayerBoard(){
    console.log('setting ONE player board') //actions need to happen before returning text
    boardTwoContainerEl.style.display = 'none';
    playingTwoPlayerGame = true;
    return "Change to two player game"
}
function clearBoard(boardNameEl) { //this should use the same input parameter as create board
    if (boardNameEl.hasChildNodes()) {
        while (boardNameEl.hasChildNodes()) {
            boardNameEl.removeChild(boardNameEl.firstChild);
        }
    }
}

function createBoard(boardElement, boardNumber) { //this should use the same input parameter as clear board
    for (i=1; i<=BOARD_HEIGHT; i++) {
        for (i2=1; i2<=BOARD_WIDTH; i2++) {
            const divEl = document.createElement("div");
            divEl.classList.add(`square`);
            divEl.classList.add(`delete`);
            if (boardElement === boardEl) {
                divEl.id = `b${boardNumber}r${i}c${i2}`;
            } else {
                divEl.id = `b${boardNumber}r${i}c${i2}`;
            }
            boardElement.appendChild(divEl);
        }
    }
}

function randomlyPlaceShips(player, playerBoard) {
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
        player.shipDirection[shipIdx].direction = directionOfShip;
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
                tempShipLocationArr.push(`${playerBoard}r${startPositionX + locationIdx}c${startPositionY}`)
                //check if new locaiton conflicts with other boats. If so, start over. 
                if (checkOverlappingShips(player, `${playerBoard}r${startPositionX + locationIdx}c${startPositionY}`)){
                    doNotIncrement = true;
                }
            } else {
                tempShipLocationArr.push(`${playerBoard}r${startPositionX}c${startPositionY + locationIdx}`)
                //check if new locaiton conflicts with other boats. If so, start over. 
                if (checkOverlappingShips(player, `${playerBoard}r${startPositionX}c${startPositionY + locationIdx}`)){
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
//check to see if randomly chosen ship location conflicts with other placed ships
function checkOverlappingShips (player, boardCoordinate) {
    let foundShip = false;
    player.shipLocations.forEach((shipObj) => {
        if(shipObj.location.includes(boardCoordinate)) {
            foundShip = true;
        } 
    });
    return foundShip;
}

function getShipStartPositionX(boardWidth) {
    return Math.floor((Math.random() * boardWidth)+1);
}

function getShipStartPositionY(boardHeight) {
    return Math.floor((Math.random() * boardHeight)+1);
}

function getShipDirection() {
    return Math.floor(Math.random() * 2); // zero = start->right, 1=start->down
}

//Click handler functions (board clicks, reset button, reveal ship locations)
function handleResetClick() {
  initGame();
}

function handleBoardClick(evt) {
//handle clicks on the playing board
    if (evt.target.className.indexOf('square') > -1) {
        //Check for hit
        renderShot(evt.target.id, evt.target);
        console.log(evt.target.id, evt.target)
        if (playingTwoPlayerGame === true) {
            changePlayer();
        }
    }
}
/// hightlight play borad and disable non-play board. 
function changePlayer() {
    currentPlayer = (currentPlayer === player1)? 
    player2:player1; 

    if (currentPlayer === player1) {
        boardTwoContainerEl.style.pointerEvents = 'none';
        boardOneContainerEl.style.pointerEvents = 'auto';
    
    } else {
        boardTwoContainerEl.style.pointerEvents = 'auto';
        boardOneContainerEl.style.pointerEvents = 'none';
    }
    playerTurnNotifyEl.innerHTML = `It is now ${currentPlayer.name}'s Turn`
}

function showShips(player){
// end of game reveal of ships & cheat mode to display ship locations
// let shipToAdd = null;  //REMOVE: I think this is errant and should be removed. Commented out nov 16
player.shipLocations.forEach((ships, idx) => {
    placeShip (ships.location[0], idx)
    });
}

//check to see if clicked square is in the player's ship list
function checkHit (boardCoordinate) {
    let foundShip = false;
    currentPlayer.shipLocations.forEach((shipObj, idx) => {
        if(shipObj.location.includes(boardCoordinate)) {
            foundShip = true;
            currentPlayer.recordShipHit(idx);
            if (currentPlayer.isShipSunk(idx)) {
                placeShip (currentPlayer.shipLocations[idx].location[0], idx)
            }
        } 
    });
    return foundShip;
}

function placeShip (boardLocation, shipLocationsIdx) {
    shipToAdd = document.createElement('img');
    shipToAdd.src = `assets/s_${SHIPS[shipLocationsIdx].name}.png`;
    shipToAdd.width = `${(SHIPS[shipLocationsIdx].length * 36)}`;
    shipToAdd.classList.add('shipsImage');   
    
    //check if there is a ship already there (for end of game ship display).
    const boardSquareEl = document.getElementById(boardLocation); 
    // Does this outer if need to exist? Both sides are exactly the same. 
    // if (currentPlayer === player1) {
        if (boardSquareEl.querySelectorAll('img.shipsImage').length === 0){ //if no ships images, go ahead and append one
            boardSquareEl.appendChild(shipToAdd);
            if ( currentPlayer.shipDirection[shipLocationsIdx].direction === 1 ) {
                boardSquareEl.style.transform = 'rotate(90deg)';
            }
        }
    // } 
    // else {
    //     if (boardSquareEl.querySelectorAll('img.shipsImage').length === 0){ //if no ships images, go ahead and append one
    //         boardSquareEl.appendChild(shipToAdd);
    //         if ( currentPlayer.shipDirection[shipLocationsIdx].direction === 1 ) {
    //             boardSquareEl.style.transform = 'rotate(90deg)';
    //         }
    //     }
    // }
}


function showExplosion(imageURL, targetEl){
    let showExplosion = document.createElement('img');
    showExplosion.src = imageURL;
    showExplosion.style.width = '100%';
    showExplosion.style.height = '100%';
    showExplosion.classList.add('explosion');
    targetEl.appendChild(showExplosion);
}

//Render DOM and determine if shot was a hit
function renderShot(boardCoordinate, targetSquareEl) {
    // let showExplosion = null;
    if (checkHit(boardCoordinate)) {
        showExplosion('assets/hit.png', targetSquareEl);
        //show ship if it is sunk
        targetSquareEl.style.pointerEvents = 'none';
        currentPlayer.recordHit(); 
    } else {
        showExplosion('assets/miss.png', targetSquareEl);
        targetSquareEl.style.pointerEvents = 'none';
        currentPlayer.recordMiss(); 
    }
    //update message bar 
    if (currentPlayer === player1) {
        shotsLeftEl.innerText = currentPlayer.shotsAllowed - currentPlayer.hits - currentPlayer.misses;
        hitsEl.innerText = currentPlayer.hits;
        missesEl.innerText = currentPlayer.misses;
    } else {
        shotsLeftEl2.innerText = currentPlayer.shotsAllowed - currentPlayer.hits - currentPlayer.misses;
        hitsEl2.innerText = currentPlayer.hits;
        missesEl2.innerText = currentPlayer.misses;
    }
    
    //determine if there is a win or loss
    if (currentPlayer.hits === 17) {
        messageDisplayEl.innerHTML = `<strong>Player WINS!!!!</strong>`;
        currentPlayer.recordWin();  
        //show opponents ships. Winner's ships already displayed. 
        showShips((currentPlayer === player1) ? player2:player1);
        // boardEl.style.pointerEvents = 'none';
        boardOneContainerEl.style.pointerEvents = 'none';
        boardTwoContainerEl.style.pointerEvents = 'none';    
    }else if ((currentPlayer.hits + currentPlayer.misses) === 50) {
        //FIXXXXX: Player1 will always lose before player2 playes their 50th shot...
        messageDisplayEl.innerHTML = `<strong>Player loses!  BOOOOO!!!</strong>`;
        currentPlayer.recordLoss();
        showShips(player1);
        showShips(player2);
        // boardEl.style.pointerEvents = 'none';
        boardOneContainerEl.style.pointerEvents = 'none';
        boardTwoContainerEl.style.pointerEvents = 'none';
    
    }
}

// START GAME
initGame();