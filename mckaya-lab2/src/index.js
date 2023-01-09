
const buttons = [];
let player = 1;
let rows = 0;
let cols = 0;
let wins = 0;
let isOver = false;
let isFirstMoveYellow = true;
let isFirstMoveRed = true;
let isDraw = false;

function presentWinner(){
  let winnerText = "";

  if (isDraw === true){
    winnerText = "IT IS A DRAW"
  } else if (player === 1){
    winnerText = "PLAYER 1 WON";
  } else if (player === -1){
    winnerText = "PLAYER 2 WON";
  } 

  const container = document.createElement("div");
  const winnerh2  = document.createElement("h2");
  winnerh2.append(winnerText);
  container.appendChild(winnerh2);
  document.body.appendChild(container);
}


function checkValid(source){
  
  if (isFirstMoveYellow === true || isFirstMoveRed === true){
    return true;
  }  

  let pos = source.id.split(" ");
  pos = [parseInt(pos[0], 10), parseInt(pos[1], 10)];

  const rowIncList = [1, -1, 0, 0, -1, 1, 1, -1];
  const colIncList = [0, 0, 1, -1, -1, 1, -1, 1];

  for (let i = 0; i < rowIncList.length; i+=1){
    try{
      if (buttons[pos[0]+rowIncList[i]][pos[1]+colIncList[i]].getAttribute("EMPTY") === "TRUE"){
        return true;
      }
    }catch (error){
      console.log("reached the edge!");
    }
  }
  return false;

}

function checkDirections(pos){
  let count = 0;
  const rowIncList = [1, -1, 0, 0, 0, 0, -1, 1, 0, 1, -1, 0];
  const colIncList = [0, 0, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0];

  for (let inc = 0; inc < rowIncList.length; inc+=1){
    if (rowIncList[inc] === 0 && colIncList[inc] === 0){
      if ((count-1) === wins){
        return true;
      }
        count = 0;
    }
    for (let i = pos[0], j = pos[1]; (i >= 0 && i < rows) && (j >= 0 && j < cols); i+=rowIncList[inc], j+=colIncList[inc]){
      if (rowIncList[inc] === 0 && colIncList[inc] === 0){
        break
      }
      if ((player === 1 && buttons[i][j].style.backgroundColor === "red") || (player === -1 && buttons[i][j].style.backgroundColor === "yellow")){
        break
      }else if ((player === 1 && buttons[i][j].style.backgroundColor === "yellow") || (player === -1 && buttons[i][j].style.backgroundColor === "red")){
        count+=1;
      }
    }
  }
  return false;
}

function checkWin(source){
  let pos = source.id.split(" ");
  pos = [parseInt(pos[0], 10), parseInt(pos[1], 10)];
  return checkDirections(pos);
}

function checkDraw(){
  let count = 0;
  for (let i = 0; i < rows; i+=1){
    for (let j = 0; j < cols; j+=1){
      if (buttons[i][j].getAttribute("EMPTY") === "TRUE"){
        count+=1
      }
    }
  }
  if (count === (rows*cols)){
    return true;
  }
  return false;
}

function nullifyBoard(){
  for (let i = 0; i < rows; i+=1){
    for (let j = 0; j < cols; j+=1){
      buttons[i][j].setAttribute("EMPTY", "TRUE");
    }
  }
}

function buttonClicked(event){
  const source = event.target || event.srcElement;

  if (player === 1 && checkValid(source) === true && isOver !== true){
    if (isFirstMoveYellow === true){
      isFirstMoveYellow = false;
    }
    source.style.backgroundColor = "yellow";
    source.setAttribute("EMPTY", "TRUE");
    if (checkWin(source) === true){
      presentWinner();
      nullifyBoard();
      isOver = true;
    }
    if (checkDraw() === true && isOver !== true){
      isDraw = true;
      isOver = true;
      presentWinner();
    }
  }else if (player === -1 && checkValid(source) === true && isOver !== true) {
    if (isFirstMoveRed === true){
      isFirstMoveRed = false;
    }
    source.style.backgroundColor = "red";
    source.setAttribute("EMPTY", "TRUE");
    if (checkWin(source) === true){
      presentWinner();
      nullifyBoard();
      isOver = true;
    }
    if (checkDraw() === true  && isOver !== true){
      isDraw = true;
      isOver = true;
      presentWinner();
    }
  }else {
    player *= -1;
  }
  player *= -1;
}

function makeBoard(){
  if (document.getElementById("begin") != null) {
    document.getElementById("begin").remove();
  }
  
  if (document.getElementById("grid-container") != null){
    document.getElementById("grid-container").remove();
  }

  const container = document.createElement("div");
  container.classList.add("grid")
  container.id = "grid-container";

  for (let i = 0; i < rows; i+=1){
    const rowList = [];
    for (let j = 0; j < cols; j+=1 ){
      const div = document.createElement("div");
      div.classList.add("grid-item");
      
      const btn = document.createElement("button");
      btn.id = `${i.toString()  } ${  j.toString()}`;
      btn.classList.add("gridbtn");
      btn.setAttribute("EMPTY", "FALSE");
      btn.addEventListener("click", buttonClicked);
      rowList[j] = btn;
      div.appendChild(btn)
      container.appendChild(div);
    }
    buttons[i] = rowList;
  }
  document.body.appendChild(container)
  const gridColumns = "auto ".repeat(cols);
  document.getElementById("grid-container").style.gridTemplateColumns = gridColumns;
}

function startGame(){
  rows = parseInt(document.getElementById("Rowfield").value, 10);
  cols = parseInt(document.getElementById("Colfield").value, 10);
  wins = parseInt(document.getElementById("Winfield").value, 10);
  makeBoard()
}

function changeSubmit() {
  document.getElementById("submit").addEventListener("click", startGame);
}

window.addEventListener('DOMContentLoaded', changeSubmit);
