/*recuperation de canvas et definition du contexte 2d */


const canvas = document.getElementById("screenGame");
const context = canvas.getContext("2d");
const rightButton = document.getElementById("cross-right");
const leftButton = document.getElementById("cross-left");

/*Images à placer dans le canvas pour le score et les vies et briques*/


const LIFE_IMG = new Image();
LIFE_IMG.src = "images/logo/life.png";

const BRICK_CHEST = new Image;
BRICK_CHEST.src = "images/logo/chest1.png"

const PADDLE_KNIFE = new Image;
PADDLE_KNIFE .src = "images/logo/Slice 2plank.png"
/*const SCORE_IMG = new Image();
SCORE_IMG.src = "img/logo/score.png";*/

/*Environnement sonore*/


const LIFE_LOST = new Audio();
LIFE_LOST.src = "sounds/life_lost.mp3";

/*const WALL_HIT = new Audio();
WALL_HIT.src = "sounds/wall.mp3"; */

const PADDLE_HIT = new Audio();
PADDLE_HIT.src = "sounds/paddle_hit.mp3";

const WIN = new Audio();
WIN.src = "sounds/win.mp3";

const BRICK_HIT = new Audio();
BRICK_HIT.src = "sounds/brick_hit.mp3";


/*afection des variable necessaire a la creation et aux 
deplacement de la balle, position d'origine de la balle   */

let x = canvas.width/2;
let y = canvas.height -25;
let dx = 2;
let dy = -3;
let start = false;
const ballRadius = 9;
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width-paddleWidth)/2;
let rightPressed = false;
let leftPressed = false;
let score = 0;
let lives = 3 

/*ici on defini les variable pour créer les brique le nombre de ligne de colonne largeur etc...
 on fait aussi en sorte qu'elle ne soit pas dessiner sur le bord du canvas avec les 2 dernier variables */
const brickRowCount = 6;
const brickColumnCount = 10;
const brickWidth = 30;
const brickHeight = 20;
const brickPadding = 3;
const brickOffsetTop = 50;
const brickOffsetLeft = 16;
const color = "#BB473B";

/*evenement d'ecoute pour l'appui sur les fleche droite ou gauche pour gerer le deplacement de la palette */
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
leftButton.addEventListener("mousedown", keyDownHandler,false);
rightButton.addEventListener("mousedown", HandlerMouseDown, false);
leftButton.addEventListener("mouseup", keyUpHandler, false);
rightButton.addEventListener("mouseup", HandlerMouseUp, false);

/* document.addEventListener("mousemove", mouseMoveHandler, false); */

/*fonction qui verifie lorsque les touche droite et gauche sont enfonçé et relaché 
et qui modifie les variable touche présser qui sont initialisé a false et passe a true lorsqu'elle le sont
* le parametre e represente l'evenement (appui)  */
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





/*fonction pour gerer le deplaçement et l'arret de la palette et la colision avec le mur*/
function paddleMove()
{
    if(rightPressed)
     {
        paddleX += 8;
        if (paddleX + paddleWidth > canvas.width){
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
/* function mouseMoveHandler(events) {
    let relativeX = events.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    } if (paddleX + paddleWidth > canvas.width){
        paddleX = canvas.width - paddleWidth;
    } if (paddleX < 0){
        paddleX = 0;
    } 
} */

//creation du tableau et de sa boucle qui contiendra les brique une fois créer
const bricks = [];
for(let column=0; column<brickColumnCount; column++) 
{
    bricks[column] = [];
    for(let row=0; row<brickRowCount; row++) 
    {
        bricks[column][row] = { x: 0, y: 0, statusbar: 1 };
    }
}


/*fonction pour detecter la colision de la balle avec les brique en fonction de la position de chacune d'entre elles */
function collisionDetection() 
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
                    BRICK_HIT.play(); /*************** */
                    dy = -dy;
                    brick.statusbar = 0;
                    score += 5;
                    if(score === brickRowCount*brickColumnCount*5)
                    {
                        WIN.play(); /*********** */
                        alert("C'est gagné, Bravo!");
                        document.location.reload();
                        clearInterval(interval);
                    }
                }
            }    
        }
    }
}

// creation de la fonction de calcule du score
function drawScore() {
    context.font = "20px Arial";
    context.fillStyle = "black";
    context.fillText("Score: "+score, 8, 30);
}

function drawLives() {
    context.font = "24px";
    context.fillStyle = "black";
    context.fillText(lives,canvas.width-30, 30);
    context.drawImage(LIFE_IMG, 305, 15, 20, 20);
}

/*fonction de creation de la raquette */
function drawPaddle() {
    context.drawImage(PADDLE_KNIFE,paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    
}


/*fonction pour créer et definir l'emplacement de creation des briques en fonction des variable defini 
au debut du script on y inclu un tableau multidimensionel dans lequel on va stocker les briques
pour ensuite les repartir dans le canvas */
function drawBricks() {
    for(let column=0; column<brickColumnCount; column++) {
        for(let row=0; row<brickRowCount; row++) {
            if (bricks[column][row].statusbar === 1){
                let brickX = (column*(brickWidth+brickPadding))+brickOffsetLeft;
                let brickY = (row*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[column][row].x = brickX;
                bricks[column][row].y = brickY;
                context.drawImage(BRICK_CHEST,brickX, brickY, brickWidth, brickHeight)
                /* context.beginPath();
                context.rect(brickX, brickY, brickWidth, brickHeight);
                context.fillStyle = color;
                context.fill();
                context.closePath(); */
            }
        }
    }
}




/*fonction de cration de la balle, choix de la forme avec ctx.arc */




function drawBall() {
    context.beginPath();
    context.arc(x, y, ballRadius, 0, Math.PI*2 );/*x/y est la position de depart de la balle,3eme valeur le rayon, les 2 autre definisse le point de depart et le point d'arriver du dessin, la derniere n'est pas specifié il s'agit d'un booleen (true par defaut) qui indique le sens de rotation dans lequel le dessin sera effectuer (sens horaire ici avec la valeur par defaut)  */
    context.fillStyle = color;/*couleur de la balle */
    context.fill();/*appel de la couleur */
    context.closePath();
  }
//fonction pour lancé la balle avec la touche espace
  function startGame(){
      if (start){
          x += dx;
          y += dy;
      } else {
          x = paddleX + 40;
          y = canvas.height -25;
      }

  }
//fonction pour decrementé les vie et renitialisé la balle et le paddle
  function lostLife(){
    if (y + dy > canvas.height-ballRadius){
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

  function gameOver(){
    x += dx;
    y += dy;
/*gestion des collision */
/*ici on verifie si le deplacement + la position de la balle depasse la largeur du canvas
 alors on reafecte la valeur pour l'inverser et gerer la colision a droite et a gauche  */
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
/*idem ici mais pour la hauteur ce qui nous permet de gerer la colision en 
haut et en bas*/ 
    if(y + dy < ballRadius) {
        dy = -dy;
    }  if (y + dy > canvas.height-ballRadius) {
        if(x + ballRadius > paddleX && (x - ballRadius < paddleX + paddleWidth || x < paddleX + paddleWidth)) {
            PADDLE_HIT.play();
            dy = -dy;
   
    } else if (lives===1) {
        alert("GAME OVER");
        document.location.reload();
        clearInterval(interval);  // obligatoire pour arreter le jeux sur chrome
    }  
    }
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    drawBricks();
    collisionDetection();
    paddleMove();
    startGame();
    drawScore();
    drawLives()
    lostLife()
    gameOver()  
}

/*fonction qui appel la fonction draw créer plus haut avec un intervalle regulier (ici 10ms)
 pour gerer les deplacement de la balle */
 const interval = setInterval(draw, 14);
 

 /* Script consacré au boutton qui fait apparaître les règles du jeu */


 const rules = document.getElementById('rules');
 const rulesBtn = document.getElementById('rules-btn');
 const closeBtn = document.getElementById('close-btn');

 rulesBtn.addEventListener("click", function() {
    rules.classList.add('show');
 });

 closeBtn.addEventListener('click', function() {
    rules.classList.remove('show');
});