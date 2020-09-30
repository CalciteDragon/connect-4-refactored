/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const h1 = document.querySelector('h1'); // the title to be changed on win
const turnSpan = document.getElementById('turn');
const turnDiv = document.getElementById('turn-notifier');
let win = false;

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

// Looks for information on player wins
let p1Wins = localStorage.getItem(`p1Wins`) || 0;
let p2Wins = localStorage.getItem(`p2Wins`) || 0;

// 
function initializeScoreboard() {
  updateScoreBoard(1);
  updateScoreBoard(2);
}

// inserts win data into HTML
function updateScoreBoard(num) {
  const score = document.getElementById(`p${num}Wins`);
  let p = num === 1 ? p1Wins : p2Wins;
  score.innerText = p;
}


/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

// Use two for loops using the HEIGHT and WIDTH variables to make a
// variable size game board filled with null
function makeBoard() {
  for (let i = 0; i < HEIGHT; i++) {
    const innerArr = [];
    for (let i = 0; i < WIDTH; i++) {
        innerArr.push(null);
    }
    board.push(innerArr);
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  const htmlBoard = document.querySelector('#board');
  // creates top row that is used to place pieces
  let top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // creates board, creating new boxes according to height and width of board
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // Create an array of the picked x column, check through the array from the
  // bottom up to check if each spot is null or not. If null, return that array.
  const yArr = [];
  for (let i = 0; i < board.length; i++) {
    yArr[i] = board[i][x];
  }
  for (let i = yArr.length-1; i >= 0; i--) {
    if (yArr[i] === null) {
      return i;
    }
    return null;
  }
}

/** placeInTable: update DOM to place piece into HTML table of board */

// Create a new div element that will be added to the HTML board. Add classes
// .piece and either .player1 or .player2 depending on whose turn it is.
// Last, check if cell is empty. If empty, append the new piece, otherwise nothing happens.
function placeInTable(y, x) {
  const newPiece = document.createElement('div');
  newPiece.className = 'piece';
  currPlayer === 1 ? newPiece.classList.add('player1') : newPiece.classList.add('player2');
  const piecePlace = document.getElementById(`${y}-${x}`);
  if (piecePlace.childElementCount === 0) piecePlace.append(newPiece);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  if (win) return; // Stops allowing clicks after someone wins
  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // Using the found y array and x value of array, change x value to number of current player
  board[y][x] = currPlayer;
  placeInTable(y, x);

  
  // check for win
  if (checkForWin()) {
    onWin();
    //return endGame(`Player ${currPlayer} won!`);
  }
  
  // check for tie
  // check if every array has every value !== null, if so (there are no more
  // null values), end the game in a tie using endGame();
  if (checkForTie()) {
    h1.innerText = 'Tie!';
  }
  
  // switch players
  // if current player is 1, switch to 2, otherwise current player must
  // be 2, so switch to 1
  currPlayer = currPlayer === 1 ? 2 : 1;
  turnChecker();
}

function checkForTie() {
  return (board.every((arr) => {
    return arr.every((space) => {
      return space !== null;
    })
  }
  ))
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // Creates arrays of 4 consecutive points on the board. checks them against _win function until 
  // all 4 points are the same player's pieces and ends game when true
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

// Restart button simply reloads the page
const restarter = document.getElementById('restart-button');
restarter.addEventListener('click', () => location.reload())

// Reset button resets the scoreboard to 0 - 0
const resetter = document.getElementById('reset-button');
resetter.addEventListener('click', () => {
  localStorage.clear();
  p1Wins = 0;
  p2Wins = 0;
  initializeScoreboard();
})

// Checks what color's turn it currently is and updates HTML
function turnChecker() {
  if (currPlayer === 1) {
    turnSpan.innerText = "Red's";
    turnDiv.style.backgroundColor = 'red';
  } else {
    turnSpan.innerText = "Blue's";
    turnDiv.style.backgroundColor = 'blue';
  }
}

// Updates localStorage on new wins, and changes text on screen to 
// represent winner
function onWin() {
  if (currPlayer === 1) {
    p1Wins++;
    localStorage.setItem('p1Wins', p1Wins);
  } else {
    p2Wins++;
    localStorage.setItem('p2Wins', p2Wins)
  }
  win = true;
  updateScoreBoard(currPlayer);
  h1.innerText = `Player ${currPlayer} Wins!`;
}


makeBoard();
makeHtmlBoard();
initializeScoreboard();
turnChecker();