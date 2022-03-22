const canvas = document.getElementById("screenGame");
const context = canvas.getContext("2d");
const rightButton = document.getElementById("cross-right")
const leftButton = document.getElementById("cross-left");

/*Images à placer dans le canvas pour le score et les vies et briques*/
const LIFE_IMG = new Image();
LIFE_IMG.src = "images/logo/life.png";

const BRICK_CHEST = new Image;
BRICK_CHEST.src = "images/brique/chest.png"

const PADDLE_KNIFE = new Image;
PADDLE_KNIFE .src = "images/logo/Slice 2plank.png"

const SCORE_IMG = new Image();
SCORE_IMG.src = "images/logo/score.png";

/*Environnement sonore*/
const LIFE_LOST = new Audio();
LIFE_LOST.src = "sounds/life_lost.mp3";

const WALL_HIT = new Audio();
WALL_HIT.src = "sounds/wall.mp3";

const PADDLE_HIT = new Audio();
PADDLE_HIT.src = "sounds/paddle_hit.mp3";

const WIN = new Audio();
WIN.src = "sounds/win.mp3";

const BRICK_HIT = new Audio();
BRICK_HIT.src = "sounds/brick_hit.mp3";

const GAME_OVER = new Audio();
GAME_OVER.src = "sounds/game_over.mp3";


/*afection des variable */
let x = canvas.width/2;
let y = canvas.height -25;
let dx = 2;
let dy = -3;
let start = false;
const ballRadius = 9;
const paddleHeight = 10;
const paddleWidth = 85;
let paddleX = (canvas.width-paddleWidth)/2;
let rightPressed = false;
let leftPressed = false;
let score = 0;
let lives = 3 
const brickRowCount = 5;
const brickColumnCount = 15;
const brickWidth = 30;
const brickHeight = 20;
const brickPadding = 3;
const brickOffsetTop = 50;
const brickOffsetLeft = 16;

/*evenement d'ecoute */
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
leftButton.addEventListener("mousedown", keyDownHandler,false);
rightButton.addEventListener("mousedown", HandlerMouseDown, false);
leftButton.addEventListener("mouseup", keyUpHandler, false);
rightButton.addEventListener("mouseup", HandlerMouseUp, false);
/* document.addEventListener("mousemove", mouseMoveHandler, false); */
 /* pop up regle */
 const rules = document.getElementById('rules');
 const rulesBtn = document.getElementById('rules-btn');
 const closeBtn = document.getElementById('close-btn');

 rulesBtn.addEventListener("click", function() 
 {
    rules.classList.add('show');
 });

 closeBtn.addEventListener('click', function() 
{
    rules.classList.remove('show');
});
/*detection appui touche/bouton */
function keyDownHandler(events) 
{
    if(events.keyCode === 32)
    {
        start = true;
    }
    if(events.keyCode === 39 )
    {
        rightPressed = true;
    }
    if(events.keyCode === 37)
    {
        leftPressed = true;
    }
    if (events.button === 0)
    {
        leftPressed = true;
    }    
}

function keyUpHandler(events) {
    
    if(events.keyCode === 39 ) 
    {
        rightPressed = false;
    }
    if(events.keyCode === 37) 
    {
        leftPressed = false;
    }
    if (events.button === 0)
    {
        leftPressed = false;
    }
}

function HandlerMouseDown(events)
{
    if (events.button === 0)
    {
        rightPressed = true;
    }  
}

function HandlerMouseUp(events)
{
    if (events.button === 0)
    {
        
        rightPressed = false;
    }
}
/*deplacement paddle + colision paddle*/
function paddleMove()
{
    if(rightPressed)
    {
        paddleX += 8;
        if (paddleX + paddleWidth > canvas.width)
        {
            paddleX = canvas.width - paddleWidth;
        }
    }
    else if(leftPressed)
    {
        paddleX -= 8;
        if (paddleX < 0)
        {
            paddleX = 0;
        }
    }
}
// fonction de detectin de la position de la souris pour deplacer la raquette avec la souris
/* function mouseMoveHandler(events)
{
    let relativeX = events.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width)
    {
        paddleX = relativeX - paddleWidth/2;
    } if (paddleX + paddleWidth > canvas.width)
    {
        paddleX = canvas.width - paddleWidth;
    } if (paddleX < 0){
        paddleX = 0;
    } 
} */

/* tableau briques */
const bricks = [];
for(let column=0; column<brickColumnCount; column++) 
{
    bricks[column] = [];
    for(let row=0; row<brickRowCount; row++) 
    {
        bricks[column][row] = { x: 0, y: 0, statusbar: 1 };
    }
}
/* detection colision briques */
function collisionDetectionBricks() 
{
    for(let column=0; column<brickColumnCount; column++)
    {
        for(let row=0; row<brickRowCount; row++)
        {
            let brick = bricks[column][row];
            if (brick.statusbar === 1)
            {
                if(x + ballRadius > brick.x && (x - ballRadius < brick.x + brickWidth || x < brick.x + brickWidth )   && y + ballRadius > brick.y && (y - ballRadius < brick.y+brickHeight ||y < brick.y+brickHeight))
                {
                    BRICK_HIT.play();
                    dy = -dy;
                    brick.statusbar = 0;
                    score += 5;
                    if(score === brickRowCount*brickColumnCount*5)
                    {
                        WIN.play();
                        alert("C'est gagné, Bravo!");
                        document.location.reload();
                        clearInterval(interval);
                    }
                }
            }    
        }
    }
}

/*affichage img score */
function drawScore()
{
    context.font = "24px Arial";
    context.fillStyle = "black";
    context.fillText(+score, 48, 30);
    context.drawImage(SCORE_IMG,20, 13, 20, 20);
}
/* affichage img vie*/
function drawLives()
{
    context.font = "24px";
    context.fillStyle = "black";
    context.fillText(lives,canvas.width-30, 30);
    context.drawImage(LIFE_IMG, 465, 13, 20, 20);
}

/*creation paddle */
function drawPaddle()
{
    context.drawImage(PADDLE_KNIFE,paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    
}


/*creation et repartition des briques*/
function drawBricks()
{
    for(let column=0; column<brickColumnCount; column++)
    {
        for(let row=0; row<brickRowCount; row++)
        {
            if (bricks[column][row].statusbar === 1)
            {
                let brickX = (column*(brickWidth+brickPadding))+brickOffsetLeft;
                let brickY = (row*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[column][row].x = brickX;
                bricks[column][row].y = brickY;
                context.drawImage(BRICK_CHEST,brickX, brickY, brickWidth, brickHeight)
            }
        }
    }
}
/*creation de la balle */
function drawBall() 
{
    context.beginPath();
    context.arc(x, y, ballRadius, 0, Math.PI*2 );
    context.fillStyle =  "#b2babb";
    context.fill();
    context.closePath();
}
/*lançé le jeu */
function startGame()
{
      if (start)
      {
          x += dx;
          y += dy;
      }
      else 
      {
          x = paddleX + 40;
          y = canvas.height -20;
      }

}
/*perte de vie + pop up */
  function lostLife()
  {
    if (y + dy > canvas.height-ballRadius)
    {
        lives--;
        start = false
        rightPressed = false;
        leftPressed = false;
        paddleX = (canvas.width-paddleWidth)/2;
        dx = 2;
        dy = -3;
        LIFE_LOST.play();
        startGame();
        alert("vous avez perdu une vie");        
    }
  }
/*dtection colision mur et paddle */
function colisionDetectionWall()
{
    x += dx;
    y += dy;
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius)
    {
        dx = -dx;
        WALL_HIT.play()
    }
    if(y + dy < ballRadius) 
    {
        dy = -dy;
        WALL_HIT.play()
    }
    if (y + dy > canvas.height-ballRadius)
    {
        if(x + ballRadius > paddleX && (x - ballRadius < paddleX + paddleWidth || x < paddleX + paddleWidth))
        {
            PADDLE_HIT.play();
            dy = -dy;
        }
    }
}
/*pop up game over */
function gameOver()
{
    if (lives === 0)
    {   
        GAME_OVER.play();
        alert("GAME OVER");
        document.location.reload();
        clearInterval(interval);
    }  
}
/*appel de toutes les fonctions */
function draw()
{
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    drawBricks();
    collisionDetectionBricks();
    colisionDetectionWall()
    gameOver()
    paddleMove();
    startGame();
    drawScore();
    drawLives()
    lostLife()
}

/* appel fonction draw intervalle regulier */
 const interval = setInterval(draw, 14);
 
