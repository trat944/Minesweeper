window.addEventListener('DOMContentLoaded', setUpGame);

/////////Generate the divs in a grid
function setUpGame() {
  const container = document.querySelector('.grid_container');
  const elementNumber = 100;
  for (let i = 0; i < elementNumber; i++) {
    const item = document.createElement('div');
    item.classList.add('box', `box${i}`);
    container.appendChild(item);
  }
  displayBeginning();
}

//////////selecting all divs and executing getBigger function for the first click
function displayBeginning() {
  let isFirstClick = true;
  let boxes = document.querySelectorAll('.box');
  boxes.forEach((box) => {
    box.addEventListener('click', () => {
      if (isFirstClick) {
        getBigger(boxes, box);
        isFirstClick = false;
      }
    });
  })
}

function getBigger(boxes, box) {
  let number = Number(box.classList[1].substring(3));
  let numbersToRight = number + (Math.floor(Math.random() * 3) + 1);
  let numbersToLeft = number - (Math.floor(Math.random() * 3) + 1);
  let randomHeightTop = (Math.floor(Math.random() * 2) + 1) * 10;
  let randomHeightBottom = (Math.floor(Math.random() * 2) + 1) * 10;
  let numbersBottomRight = numbersToRight + randomHeightBottom;
  let numbersBottomLeft = numbersToLeft + randomHeightBottom;
  let numbersTopRight = numbersToRight - randomHeightTop;
  let numbersTopLeft = numbersToLeft - randomHeightTop;
  const collectionOfNumbers = [];
  const collectionOfLimitNumbers = [];

  ////////// UPPER ROW OF THE BOX
  if (numbersTopRight > - 1 && numbersTopRight < 10 && numbersTopRight !== 9) collectionOfLimitNumbers.push(numbersTopRight);
  if (numbersTopLeft > - 1 && numbersTopLeft < 10 && numbersTopLeft !== 0) collectionOfLimitNumbers.push(numbersTopLeft);
  for (let i = numbersTopLeft; i <= numbersTopRight; i++) {
    if (i > -1) collectionOfNumbers.push(i);
    if (i > 9) collectionOfLimitNumbers.push(i);
  }

  //////////////SECOND UPPER ROW IF THERE IS ANY
  if (randomHeightTop > 10) {
    if (numbersTopLeft + 10 > - 1 && !String(numbersTopLeft).endsWith('0')) collectionOfLimitNumbers.push(numbersTopLeft + 10);
    if (numbersTopRight + 10 > - 1 && !String(numbersTopRight).endsWith('9')) collectionOfLimitNumbers.push(numbersTopRight + 10);
    for (let i = numbersTopLeft + 10; i <= numbersTopRight + 10; i++) {
      if (i > -1) collectionOfNumbers.push(i);
    }
  }

  /////////////MIDDLE ROW (ORIGINAL ROW WITHOUT HEIGHT)
  if (numbersToLeft > - 1 && numbersToLeft < 100 && !String(numbersToLeft).endsWith('0')) collectionOfLimitNumbers.push(numbersToLeft);
  if (numbersToRight > - 1 && numbersToRight < 100 && !String(numbersToRight).endsWith('9')) collectionOfLimitNumbers.push(numbersToRight);
  for (let i = numbersToLeft; i <= numbersToRight; i++) {
    if (i > - 1 && i < 100) collectionOfNumbers.push(i);
  }

  /////////////BOTTOM ROW OF THE BOX
  if (numbersBottomRight < 100 && numbersBottomRight >= 90 && numbersBottomRight !== 99) collectionOfLimitNumbers.push(numbersBottomRight);
  if (numbersBottomLeft < 100 && numbersBottomLeft >= 90 && numbersBottomLeft !== 90) collectionOfLimitNumbers.push(numbersBottomLeft);
  for (let i = numbersBottomLeft; i <= numbersBottomRight; i++) {
    if (i < 100) collectionOfNumbers.push(i);
    if (i < 90) collectionOfLimitNumbers.push(i);
  }

  //////////SECOND BOTTOM ROW IF THERE IS ANY
  if (randomHeightBottom > 10) {
    if (numbersBottomLeft - 10 < 100 && !String(numbersBottomLeft).endsWith('0')) collectionOfLimitNumbers.push(numbersBottomLeft - 10);
    if (numbersBottomRight - 10 < 100 && !String(numbersBottomRight).endsWith('9')) collectionOfLimitNumbers.push(numbersBottomRight - 10);
    for (let i = numbersBottomLeft - 10; i <= numbersBottomRight - 10; i++) {
      if (i < 100) collectionOfNumbers.push(i);
    }
  }

  ///////////CREATION OF THE BIG RANDOM BOX
  boxes.forEach((box) => {
    for (let i = 0; i < collectionOfNumbers.length; i++) {
      if (box.classList.contains(`box${collectionOfNumbers[i]}`)) {
        box.classList.add('empty');
      }
    }
  })

  plantBombs(boxes);
  
  ////////////lookForBombs IN THE BIG RANDOM BOX NUMBERS
  boxes.forEach((box) => {
    for (let i = 0; i < collectionOfLimitNumbers.length; i++) {
      if (box.classList.contains(`box${collectionOfLimitNumbers[i]}`)) {
        box.classList.add('borderNumber');
        let number = collectionOfLimitNumbers[i];
        if (box.classList[1].endsWith('0')) leftNumbers(boxes, box, number);
        else if (box.classList[1].endsWith('9')) rightNumbers(boxes, box, number);
        else elseNumbers(boxes, box, number);
      }
    }
  })

  lookforBombs(boxes);
}

function plantBombs(boxes) {
  const bombNumber = 30;
  for (let i = 0; i < bombNumber; i++) {
    let randomNumber;
    do {
      randomNumber = Math.floor(Math.random() * 100);
    } while (boxes[randomNumber].classList.contains('empty') || boxes[randomNumber].classList.contains('loser'));

    boxes[randomNumber].classList.add('loser');
  }
}

//////////Click handling for adding and removing the event after click
function lookforBombs(boxes) {
  function clickHandler() {
    playGame(boxes, this);
    this.removeEventListener('click', clickHandler);
  }

  boxes.forEach((box) => {
    box.addEventListener('click', clickHandler);
  });
}

////////////Same process of looking for bombs as in the big box
function playGame(boxes, box) {
  let number = Number(box.classList[1].substring(3));

  if (box.classList.contains('loser')) loseGame(box);
  else if (box.classList.contains('empty')) return;
  else if (box.classList[1].endsWith('0')) leftNumbers(boxes, box, number);
  else if (box.classList[1].endsWith('9')) rightNumbers(boxes, box, number);
  else elseNumbers(boxes, box, number);
  winGame(boxes, box);
}

function loseGame(box) {
  alert('You lost');
}

///////////if all boxes have 3 or more classes it means all have been checked succesfully!
function winGame(boxes) {
  let count = 0;
  boxes.forEach((box) => {
    if (box.classList.length > 2) count++;
  });
  if (count === 100) alert('You win!');
}

function leftNumbers(boxes, box, number) {
  let count = 0;
  const posibilities = [number + 1, number + 10, number - 10, number + 11, number - 9];
  for (let i = 0; i < posibilities.length; i++) {
    if (boxes[posibilities[i]] && boxes[posibilities[i]].classList.contains('loser')) count++;
  }
  box.textContent = count;
  box.classList.add('safe');
}

function rightNumbers(boxes, box, number) {
  let count = 0;
  const posibilities = [number - 1, number + 10, number - 10, number - 11, number + 9];
  for (let i = 0; i < posibilities.length; i++) {
    if (boxes[posibilities[i]] && boxes[posibilities[i]].classList.contains('loser')) count++;
  }
  box.textContent = count;
  box.classList.add('safe');
}

function elseNumbers(boxes, box, number) {
  let count = 0;
  const posibilities = [number + 1, number - 1, number + 10, number - 10, number + 11, number - 11, number + 9, number - 9];
  for (let i = 0; i < posibilities.length; i++) {
    if (boxes[posibilities[i]] && boxes[posibilities[i]].classList.contains('loser')) count++;
  }
  box.textContent = count;
  box.classList.add('safe');
}