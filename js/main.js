/*----- constants -----*/
const numShots = 50;
const boardSize = 100; //Is this needed? 
const ships = [
    {name: 'Battleship', lenght:4},
    {name: 'Carrier', lenght:5},
    {name: 'Destroyer', lenght:3},
    {name: 'Submarine', lenght:3},
    {name: 'Patrol Boat', lenght:2},
]
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
function createBoard(width, height) {

}

function handleResetClick() {

}

function handleBoardClick(evt) {
     console.log('evt.target: ', evt.target);
    // if (!winner) {return};

    if (evt.target.id !== 'board') {
        // console.log('this is a square not border');
                //get 3rd character of the ID for a square
                //const idx = evt.target.id[2];
        const idx = evt.target;
         console.log('idx: ', idx);
         evt.target.style.backgroundImage = "url('assets/hit.png')";
        if(!board[idx]) {
            // board[idx] = turn;
            console.log('board idx..: ',board[idx]);
            // checkWin()
            // changeTurn();
            // render();
        } 
    }
}

