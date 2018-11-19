$(document).ready(function(){

  let board;
  let flagsLeft;
  let active;
  let timerVar;
  let seconds;
  let highScore = 0;
  let start;
  $('div.highscore').append(highScore);

  $('button.setBoard').click(function() {
    active = true;
    start = true;
    seconds = 0;
    $('div.timer').empty();
    $('div.timer').append(seconds);
    stoptimer(timerVar);
    // timerVar = setInterval(timer, 1000);


    let w = document.getElementById('width').value;
    let h = document.getElementById('height').value;
    let b = document.getElementById('bombs').value;
    let s = w*h;
    let bombsList = [];

    $('div.numbombsleft').empty();
    $('div.numbombsleft').append(b);

    flagsLeft = b;
    spacesLeft = s-b;

    board = new Array();
    for (let i = 0; i < h; i++) {
      board[i] = new Array();
    }


    if (w > 40 || h > 30) {
      alert("Width must be less than 40\nHeight must be less than 30");
    } else if (b > (s-1)) {
      alert("Too many bombs! The maximum is " + (s-1));
    } else {
      makeBoard(h,w,b,s,bombsList,board);
    }

    for (let r = 0; r < h; r++) {
      for (let c = 0; c < w; c++) {
        let tile = board[r][c];

        let sbombs = 0;

        let w = document.getElementById('width').value;
        let h = document.getElementById('height').value;

        let neighbors = [];
        if (r == 0 && c == 0) {
          let right = board[r][c+1];
          neighbors.push(right);
          let bottomright = board[r+1][c+1];
          neighbors.push(bottomright);
          let bottom = board[r+1][c];
          neighbors.push(bottom);
        } else if (r == 0 && c == w-1) {
          let bottom = board[r+1][c];
          neighbors.push(bottom);
          let bottomleft = board[r+1][c-1];
          neighbors.push(bottomleft);
          let left = board[r][c-1];
          neighbors.push(left);
        } else if (r == h-1 && c == 0) {
          let top = board[r-1][c];
          neighbors.push(top);
          let topright = board[r-1][c+1];
          neighbors.push(topright);
          let right = board[r][c+1];
          neighbors.push(right);
        } else if (r == h-1 && c == h-1) {
          let left = board[r][c-1];
          neighbors.push(left);
          let topleft = board[r-1][c-1];
          neighbors.push(topleft);
          let top = board[r-1][c];
          neighbors.push(top);
        } else if (r == 0) {
          let right = board[r][c+1];
          neighbors.push(right);
          let bottomright = board[r+1][c+1];
          neighbors.push(bottomright);
          let bottom = board[r+1][c];
          neighbors.push(bottom);
          let bottomleft = board[r+1][c-1];
          neighbors.push(bottomleft);
          let left = board[r][c-1];
          neighbors.push(left);
        } else if(r == h-1) {
          let left = board[r][c-1];
          neighbors.push(left);
          let topleft = board[r-1][c-1];
          neighbors.push(topleft);
          let top = board[r-1][c];
          neighbors.push(top);
          let topright = board[r-1][c+1];
          neighbors.push(topright);
          let right = board[r][c+1];
          neighbors.push(right);
        } else if(c == 0) {
          let top = board[r-1][c];
          neighbors.push(top);
          let topright = board[r-1][c+1];
          neighbors.push(topright);
          let right = board[r][c+1];
          neighbors.push(right);
          let bottomright = board[r+1][c+1];
          neighbors.push(bottomright);
          let bottom = board[r+1][c];
          neighbors.push(bottom);
        } else if(c == w-1) {
          let left = board[r][c-1];
          neighbors.push(left);
          let bottomleft = board[r+1][c-1];
          neighbors.push(bottomleft);
          let bottom = board[r+1][c];
          neighbors.push(bottom);
          let topleft = board[r-1][c-1];
          neighbors.push(topleft);
          let top = board[r-1][c];
          neighbors.push(top);
        } else {
          let topleft = board[r-1][c-1];
          neighbors.push(topleft);
          let top = board[r-1][c];
          neighbors.push(top);
          let topright = board[r-1][c+1];
          neighbors.push(topright);
          let right = board[r][c+1];
          neighbors.push(right);
          let bottomright = board[r+1][c+1];
          neighbors.push(bottomright);
          let bottom = board[r+1][c];
          neighbors.push(bottom);
          let bottomleft = board[r+1][c-1];
          neighbors.push(bottomleft);
          let left = board[r][c-1];
          neighbors.push(left);
        }

        for (let z = 0; z < neighbors.length; z++) {
          let neighborbc = $(neighbors[z]).data('hasbomb');
          if (neighborbc == true) {
            sbombs++;
          }
        }
        $(tile).data('bombcount', sbombs);
      }
    }
  });

  $('div.board').on('click', '#tile', function(e) {
    if (start == true) {
      start = false;
      timerVar = setInterval(timer, 1000);
    }
    if (active == true) {
      let row = $(this).data('row');
      let column = $(this).data('column');
      let opened = $(this).data('opened');
      let w= document.getElementById('width').value;
      let h = document.getElementById('height').value;
      let b = document.getElementById('bombs').value;
      let s = w*h;


      if (e.shiftKey) {
        if (opened == false) {
          let flagged = $(this).data('flagged');
          let updatedFlags = flagBomb(this, flagged, flagsLeft);
          flagsLeft = updatedFlags;
        }
      } else {
        let newActive = revealSquare(this,board,spacesLeft,timerVar);
        if (newActive == false) {
          active = false;
        }
      }


      let spaces = 0;
      for (let r = 0; r < h; r++) {
        for (let c = 0; c < w; c++) {
          let tile = board[r][c];
          let hasABomb = $(tile).data('hasbomb');
          let num = $(tile).data('bombcount');
          let curval = $(tile).text();
          //alert("r: "+r+" c: "+c+" hasabomb: "+hasABomb+" active: "+active);
          if (active == false) {
            if (hasABomb == true) {
              $(tile).text('B');
            } else if (curval == '?') {
              if (num != 0) {
              $(tile).text(num);
            } else {
              $(tile).text('-');
              $(tile).css('color', '#666666');
            }
            }
          }


          let isOpened = $(tile).data('opened');
          if (hasABomb == false && isOpened == true) {
            spaces++;
          }
        }
      }

      if (flagsLeft ==0 && spaces == (s-b)) {
        let newHigh = endGame(1,active,timerVar,highScore,seconds);
        active = false;
        highScore = newHigh;
      }
    }
  });

  function timer() {
    seconds = seconds + 1;
    $('div.timer').empty();
    $('div.timer').append(seconds);
  }

});

function makeBoard(height,width,bombs,size,bombsList,board) {
  $('div.board').empty();

  for (let i = 0; i < bombs; i++) {
    addBomb(size,bombsList);
  }

  let id = 0;

  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      if (bombsList.includes(id)) {
        $('div.board').append('<button type="button" class="square" id="tile">?</button>');
        let addButton = $('div.board button:last-child');
        $(addButton).data('hasbomb', true);
        $(addButton).data('row', r);
        $(addButton).data('column', c);
        $(addButton).data('flagged', false);
        $(addButton).data('opened', false);
        //$(addButton).css('color', 'red');

        board[r][c] = $(addButton);
        id++;
      } else {
        $('div.board').append('<button type="button" class="square" id="tile">?</button>');
        let addButton = $('div.board button:last-child');

        $(addButton).data('hasbomb', false);
        $(addButton).data('row', r);
        $(addButton).data('column', c);
        $(addButton).data('flagged', false);
        $(addButton).data('opened', false);

        board[r][c] = $(addButton);
        id++;
      }
    }
    $('div.board').append('<br>');
  }
}

function addBomb(size,bombsList) {
  let n = Math.floor((Math.random() * size) + 0);
  if (bombsList.includes(n)) {
    addBomb(size, bombsList);
  } else {
    bombsList.push(n);
    return;
  }
}

function revealSquare(tile,board,spacesLeft,timerVar) {
  let flagged = $(tile).data('flagged');
  let hasbomb = $(tile).data('hasbomb');
  let opened = $(tile).data('opened');
  let bombcount = $(tile).data('bombcount');
  let r = $(tile).data('row');
  let c = $(tile).data('column');
  let w = document.getElementById('width').value;
  let h = document.getElementById('height').value;

  if (flagged == true) {
    alert('you flagged this tile, if you want to reveal it, unflag it first');
    return;
  } else if (hasbomb == true) {
    alert('you clicked a bomb, you lost');
    endGame(0,0,timerVar);
    return false;
  } else if (opened == true && bombcount != 0){



    let neighbors = [];
    if (r == 0 && c == 0) {
      let right = board[r][c+1];
      neighbors.push(right);
      let bottomright = board[r+1][c+1];
      neighbors.push(bottomright);
      let bottom = board[r+1][c];
      neighbors.push(bottom);
    } else if (r == 0 && c == w-1) {
      let bottom = board[r+1][c];
      neighbors.push(bottom);
      let bottomleft = board[r+1][c-1];
      neighbors.push(bottomleft);
      let left = board[r][c-1];
      neighbors.push(left);
    } else if (r == h-1 && c == 0) {
      let top = board[r-1][c];
      neighbors.push(top);
      let topright = board[r-1][c+1];
      neighbors.push(topright);
      let right = board[r][c+1];
      neighbors.push(right);
    } else if (r == h-1 && c == h-1) {
      let left = board[r][c-1];
      neighbors.push(left);
      let topleft = board[r-1][c-1];
      neighbors.push(topleft);
      let top = board[r-1][c];
      neighbors.push(top);
    } else if (r == 0) {
      let right = board[r][c+1];
      neighbors.push(right);
      let bottomright = board[r+1][c+1];
      neighbors.push(bottomright);
      let bottom = board[r+1][c];
      neighbors.push(bottom);
      let bottomleft = board[r+1][c-1];
      neighbors.push(bottomleft);
      let left = board[r][c-1];
      neighbors.push(left);
    } else if(r == h-1) {
      let left = board[r][c-1];
      neighbors.push(left);
      let topleft = board[r-1][c-1];
      neighbors.push(topleft);
      let top = board[r-1][c];
      neighbors.push(top);
      let topright = board[r-1][c+1];
      neighbors.push(topright);
      let right = board[r][c+1];
      neighbors.push(right);
    } else if(c == 0) {
      let top = board[r-1][c];
      neighbors.push(top);
      let topright = board[r-1][c+1];
      neighbors.push(topright);
      let right = board[r][c+1];
      neighbors.push(right);
      let bottomright = board[r+1][c+1];
      neighbors.push(bottomright);
      let bottom = board[r+1][c];
      neighbors.push(bottom);
    } else if(c == w-1) {
      let left = board[r][c-1];
      neighbors.push(left);
      let bottomleft = board[r+1][c-1];
      neighbors.push(bottomleft);
      let bottom = board[r+1][c];
      neighbors.push(bottom);
      let topleft = board[r-1][c-1];
      neighbors.push(topleft);
      let top = board[r-1][c];
      neighbors.push(top);
    } else {
      let topleft = board[r-1][c-1];
      neighbors.push(topleft);
      let top = board[r-1][c];
      neighbors.push(top);
      let topright = board[r-1][c+1];
      neighbors.push(topright);
      let right = board[r][c+1];
      neighbors.push(right);
      let bottomright = board[r+1][c+1];
      neighbors.push(bottomright);
      let bottom = board[r+1][c];
      neighbors.push(bottom);
      let bottomleft = board[r+1][c-1];
      neighbors.push(bottomleft);
      let left = board[r][c-1];
      neighbors.push(left);
    }
    let flags = 0;
    for (let z = 0; z < neighbors.length; z++) {
      let neighborsflagged = $(neighbors[z]).text();
      if (neighborsflagged == 'F') {
        flags++;
      }
    }
    let text = $(tile).text();

    //same number of flags as tile says there are bombs
    if (text == flags) {
      for (let k = 0; k < neighbors.length; k++) {
        let nextdoor = $(neighbors[k]);

        let temp = $(nextdoor).data('bombcount');
        let opened = $(nextdoor).data('opened');
        let containsbomb = $(nextdoor).text();
        let isabomb = $(nextdoor).data('hasbomb');
        if (isabomb == true && containsbomb != 'F') {
          //alert("timerVar: "+timerVar);
          endGame(0,timerVar);
          stoptimer(timerVar);
          alert('you clicked a bomb, you lost');
          return false;
        } else if (temp != 0 && opened == false && containsbomb != 'F') {
          revealData(nextdoor,temp);
        } else if (opened == false && containsbomb != 'F'){
          revealBlank(nextdoor);
        } else {
        }
      }
    }
  }



  else {



    let temp = $(tile).data('bombcount');
    let opened = $(tile).data('opened');

    if (temp != 0 && opened == false) {
      revealData(tile,temp,spacesLeft);
    } else if (opened == false){
      revealBlank(tile);
      recursiveCheck(tile,board);
    }
  }
}

function flagBomb(toFlag, flagged, flagsLeft) {
  if (flagged == true) {
    $(toFlag).data('flagged', false);
    $(toFlag).text('?');
    flagsLeft = flagsLeft + 1;

  } else {
    if (flagsLeft == 0) {
      alert("no flags left");
    } else {
      $(toFlag).data('flagged', true);
      $(toFlag).text('F');
      flagsLeft = flagsLeft - 1;
    }
  }
  $('div.numbombsleft').empty();
  $('div.numbombsleft').append(flagsLeft);
  return flagsLeft;

}

function endGame(result,active,timerVar,highScore,seconds) {
  if (result == 1) {
    alert('the game is over, you won!');
    stoptimer(timerVar);

    if (highScore == 0) {
      highScore = seconds;
      $('div.highscore').empty();
      $('div.highscore').append(highScore);
    } else if (seconds < highScore) {
      highScore = seconds;
      $('div.highscore').empty();
      $('div.highscore').append(highScore);
    }

  } else {
    //alert("you lost :(");
    stoptimer(timerVar);

  }

  return highScore;
}

function revealBlank(tile) {
  $(tile).text('-');
  $(tile).data('opened', true);
  $(tile).css('color', '#666666');
}

function recursiveCheck(tile,board) {
  let neighbors = [];
  let r = $(tile).data('row');
  let c = $(tile).data('column');
  let w = document.getElementById('width').value;
  let h = document.getElementById('height').value;

  if (r != 0 && c != 0) {
    let topleft = board[r-1][c-1];
    neighbors.push(topleft);
  }
  if (r != 0) {
    let top = board[r-1][c];
    neighbors.push(top);
  }
  if (r != 0 && c != w-1) {
    let topright = board[r-1][c+1];
    neighbors.push(topright);
  }
  if (c != w-1) {
    let right = board[r][c+1];
    neighbors.push(right);
  }
  if (r != h-1 && c != w-1) {
    let bottomright = board[r+1][c+1];
    neighbors.push(bottomright);
  }
  if (r != h-1) {
    let bottom = board[r+1][c];
    neighbors.push(bottom);
  }
  if (r != h-1 && c != 0) {
    let bottomleft = board[r+1][c-1];
    neighbors.push(bottomleft);
  }
  if (c != 0) {
    let left = board[r][c-1];
    neighbors.push(left);
  }

  for (let z = 0; z < neighbors.length; z++) {
    let bc = $(neighbors[z]).data('bombcount');
    let o = $(neighbors[z]).data('opened');
    if ($(neighbors[z]).data('bombcount') == 0 && $(neighbors[z]).data('opened') == false) {
      revealBlank(neighbors[z]);
      recursiveCheck(neighbors[z],board);
    } else {
      revealData(neighbors[z],bc);
    }
  }
}

function revealData(tile,temp) {
  if (temp == 0) {
    $(tile).text('-');
  } else {
    $(tile).text(temp);
  }
  $(tile).data('opened', true);
}

function stoptimer(timerVar) {
  clearInterval(timerVar);
}
