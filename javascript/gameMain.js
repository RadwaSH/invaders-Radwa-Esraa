
var canvas;  
var ctx;
var x = 350;   //initial x and y will be used to draw the player
var y = 500;
var dx = 4;    //used to update position of x coordinate (when d or a is pressed)
var dy = 4;    //used to update position of y coordinate (when w or s is pressed)
var WIDTH = 800;    //width of the canvas
var HEIGHT = 600;   //height of the canvas

var img = new Image();
img.src = "images/bg.jpg";
var ybg = 0;       //used to update the position of the background

var health = 100;
var score = 0;

var bullets = [];   //bullets[i][0] (first col of the array) has the x coordinates, bullets[i][1] (first row) has the y coordinates of the bullets

var pointMult =25;  //25 point per asteroid explosion

var asteroids = []; //bullets[x][y]
newAsteroid();  //create 3 asteroid as a start
newAsteroid();
newAsteroid();

var paused = false;

//var audiobg = new Audio("sounds/promise.wav");

var w=0;  //move up
var a=0;  //move left
var s=0;  //move down
var d=0;  //move right
var f=0; //fire


//the first function that will be called
function init() {  
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");	
  //audiobg.play();
  return setInterval(draw, 15);     //setInterval() method calls a function or evaluates an expression at specified intervals (in milliseconds)
}

//play the sound of Explosion
function sndExplosion(){ 
    
	var audio = new Audio("sounds/explosion.wav");	
	audio.play();	
}
//play the sound of breaking rock
function sndRockBreak(){ 
	
	var audio = new Audio("sounds/rock_breaking.wav");
	audio.play();	
}
	

//This method returns a pseudorandom double greater than or equal to 0.0 and less than 1.0 then multiply it by max then get the floor.
function random(max){
	return Math.floor(Math.random()*max);
}


//draw any image
function drawImage(x,y,file){
	var img=new Image();
	img.src=file;
	ctx.drawImage(img,x,y);   //x,y are the starting coordinates of the image inside the canvas
}
	
function drawText(x,y,text,size){
	var font = "bold " + size + "px sans-serif";
	ctx.font=font;
	ctx.textBaseLine = 'top';	
	ctx.fillText(text,x,y);   //x,y are the starting coordinates of the image inside the canvas
}

/*
function circle(x,y,r) {
  ctx.beginPath();   //The beginPath() method begins a path
  ctx.arc(x, y, r, 0, Math.PI*2, true);  //The arc() method creates an arc/curve. 
										 //x,y are the x,y coordinates of the center of the arc. r is the radius.
										 //To create a circle with arc(): Set start angle to 0 and end angle to 2*Math.PI. true=counter-clockwise
  ctx.fill();   //the default fill color is black
}
*/

function rect(x,y,w,h) {
  ctx.beginPath();
  ctx.rect(x,y,w,h);  //x is the the x-coordinate of the upper-left corner of the rectangle
                      //y is the the y-coordinate of the upper-left corner of the rectangle
					  //w,h is the width and height of the rectangle, in pixels
  ctx.closePath();
  ctx.fill();
}

 //clear a rectangle within the canvas
function clear() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
}




//drawing here
function draw(){
	clear();  //to clear the precious canvas (and hence the contents)
	checkControls();	
	ctx.fillStyle = "#444444";
	rect(0,0,WIDTH,HEIGHT);    //draw the canvas with width and height of the canvas 800,600
	//drawImage(0,0,"images/bg.jpg");   //the image on the canvas (the space)
	
	/*trying
	ybg1 +=5;
	ybg2 +=5;
	if (ybg1 >= 600)
	{
	    ybg1=0;
	}	
	else if(ybg2 >= 600)
	{
	    ybg2=0;
	}
	if
	drawImage(0,ybg1,"images/bg.jpg");
	drawImage(0,ybg2,"images/bg.jpg");
	*/	
	
	ctx.drawImage(img, 0, ybg);
    ctx.drawImage(img, 0, Math.abs(ybg)-img.height);
 
    if (Math.abs(ybg) > img.height) {
        ybg = 0;
    } 
    ybg += 0.5;
 

	
	
	ctx.fillStyle = "#FAF7F8";
	drawImage(x,y,"images/spartanm.png");   //draw the player with the initial x and y (then the x and y of the current state)	
	
	//draw the bullets	
	for(var i = 0; i < bullets.length; i++){
		drawImage(bullets[i][0],bullets[i][1],"images/lazer.png");	
						
		//update the bullet position (go up which means decrease y coordinate)
		bullets[i][1]-=10;
	}
	
	//draw asteroids
	for(var i = 0; i < asteroids.length;i++){
	    drawImage(asteroids[i][0], asteroids[i][1], asteroids[i][6]);  //[i][6] is the texture of the ast.
		//because we started from -32
	    var x2 = asteroids[i][0] + 32;
	    var y2 = asteroids[i][1] + 32;
	    if (!paused) {
	        for (var j = 0; j < bullets.length; j++) {
	           
			   //check if bullets should be removed (got out off the screen)
	            if (bullets[j][1] < -100 && bullets.length > 5 || bullets[j][2] <=0) {
	                bullets = bullets.splice(j);
	            }
				
	            //check for bullet-asteroid collision     				
				var a = (bullets[j][0]+8)-x2;
				var b = (bullets[j][1]+32)-y2;				
				
				/*Use Euclidean distance to calculate distance 
				between the centers of the two objects*/
				if (Math.sqrt((a*a)+(b*b)) <= 32) {               
					
	                //draw explostion
	                drawImage(bullets[j][0] -30, bullets[j][1] -30, "images/explosion.png");
	                //explosion sound					
					sndExplosion();
	                //damage the asteroid from the array
	                asteroids[i][5] -= (48-Math.sqrt((a*a)+(b*b)))/2;
					bullets[2] -= (48-Math.sqrt((a*a)+(b*b)))/2;

	                if (asteroids[i][5] < 0) {
	                   
	                    bullets.splice(j);  //remove the pullet because it hit the ast.
						 //play rock break sound
	                    sndRockBreak();
	                    asteroids.splice(i, 1);	                    
	                    newAsteroid();    //create a new one
	                    score += pointMult;   //raise the score by 25
	                }
	            }
	        }
	        //move asteroid
	        asteroids[i][1] += asteroids[i][4];   //add y coordinates to speedy
	        if (asteroids[i][2] > WIDTH / 2 || asteroids[i][0] > WIDTH)    //subtract speedx in order not to go out off the screen
	            asteroids[i][0] -= asteroids[i][3];
	        else 
	            asteroids[i][0] += asteroids[i][3];  //add ranx to speedx

	        //check if asteroid should be regenetated (if nothing had happened to it, neither distroiyed nor hit)
	        if (asteroids[i][1] > HEIGHT && health >= 0) {  //hadn't been hit by the player
	            asteroids.splice(i, 1);  //remove it
	            newAsteroid();    //generate a new one
	        }

	        //check if asteroid has hit player
			//calculate the distance using Euclidean distance
	        if ((Math.sqrt((x-x2)*(x-x2))+((y-y2)*(y-y2))) < 64) {  //
	            drawImage(x, y, "images/explosion.png");
	            sndRockBreak();
	            health -= 20;
	            if (health <= 0)
	                paused = true;
	        }
	    }	
	}
	
	
	////always show the Health and the score while playing
	drawText(5,HEIGHT-30,"Health: "+health,12);
	drawText(5,HEIGHT-20,"Score: "+score,12);
	
	
    //Game Over
	if (health <= 0) {
	    drawText(200, HEIGHT / 2, "Game Over!", 72);
	    drawText(210, HEIGHT / 2 + 60, "Score: " + score, 26);
	    drawText(210, HEIGHT / 2 + 120, "Health: " + health, 26);
	}
	else if (paused && health >= 0) {
	    drawText(260, (HEIGHT / 2) + 20, "Paused", 72);
    }    			
}

//create a new asteroid
function newAsteroid(){
	var textures = ["images/ast.png","images/ast3.png","images/ast2.png"];
	
	var ranx = random(750);   //random x position (the width of the canvas = 800)
	var speedx = random(2);   //random speed in x
	var speedy = 0           //speed y
	var texture = textures[random(3)];   //randomly choose any one of the 3 asteroids
	//speedy must be more than 1         //in order not to move horizontally or to stop moving at all if speedx=0
	while(speedy < 1){
		speedy = random(3);
	}
	asteroids.push(new Array(ranx,-32,ranx,speedx,speedy,100,texture));	//health=100, texture= one of the 3 textures
}

function fireBullet() {
    if (bullets.length < 36) {
        bullets.push(new Array(x + 26, y - 60,100));
    }
}

function fireDouble() {
    if (bullets.length < 34) {
        bullets.push(new Array(x + 20, y - 60,100));
        bullets.push(new Array(x + 32, y - 60,100));
    }
}

//the following functions are related to input
document.onkeypress = function (e) {
    var key = String.fromCharCode(e.charCode);
    var kc = e.keyCode;
    if (health > 0 && !paused) {
        //move right	
        if (key == "d") {
            d = 1;
            a = 0;
        }
		//move left
        else if (key == "a") {
            d = 0;
            a = 1;
        }
        //move up
        if (key == "w") {
            w = 1;
            s = 0;
        }
		//move down
        else if (key == "s") {
            s = 1;
            w = 0;
        }
        //fire once
        if (key == "f" || kc == 32)
            fireBullet();
        //fire triple
        if (key == "q") {
            fireDouble();
            fireBullet();
        }
        //fire twice
        if (key == "e")
            fireDouble();
    }
    if (key == "p")
        paused = !paused;
		/*
		if(paused==true)
		{
		   audiobg.pause();
		}
		*/
}
function checkControls()
{
	if(w && y > 0)   //if w=1 and there is a space to go up, then go up by dy=4
		y-=dy;
	if(s && y+64 < HEIGHT)   //if s=1 and there is a space to go down, then go down by dy=4
	                         //why 64? because all asteroids are 64*64 pixels. and x,y are the upper left positions so we need to add 64 before
							 //comparing with HEIGHT or WIDTH
		y+=dy;
	if(a && x > 0)   //if a=1 and there is a space to go left, then go left by dx=4
		x-=dx;
	if(d && x+64 < WIDTH)    //if d=1 and there is a space to go right, then go right by dx=4
	                         //same
		x+=dx;
	
}
document.onkeyup=function(ev){	
		w=0;a=0;s=0;d=0;

}
//start the game timer and set up the game
init();