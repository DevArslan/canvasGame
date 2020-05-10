
var canvas = document.querySelector('#myCanvas')
var ctx = canvas.getContext("2d");


// СПРАЙТЫ

var heavyTank = new Image();
var lightTank = new Image();   
var bulletSprite = new Image();   
heavyTank.src = 'images/HeavyTank.png'; 
lightTank.src = 'images/LightTank.png'; 
bulletSprite.src = 'images/bullet.png';

// кнопки
var pressedLeft = false; // лево
var pressedRight = false; // право
var pressedSpace = false; // пробел

var pressedLeftForSecondPlayer = false
var pressedRightForSecondPlayer = false; 
var pressedLeftShift = false; 
// параметры игрока
var playerWidth = 20;
var playerHeight = 20;

var playerX = (canvas.width - playerWidth)/2;
var playerY = canvas.height - 25;

//параметры пули
var bulletWidth = 5;
var bulletHeight = 5;

var bulletX = playerX;
var bulletY = playerY;

var speedAttack = 20
var speedAttackCost = 400/speedAttack
var speedAttackCostDisplay = document.querySelector('.speedAttackCost')

// МАГАЗИН
var moneyCount = document.querySelector('.moneyCount')
var money = 0
var health = 1
var healthCost = 400


document.addEventListener("keydown", keyDown, false);
document.addEventListener("keyup", keyUp, false);

document.addEventListener("keydown", keyDownSecondPlayer, false)
document.addEventListener("keyup", keyUpSecondPlayer, false);


function keyDownSecondPlayer(e) {
	if(e.keyCode == 71) {
		pressedLeftShift = true;
	}
	else if(e.keyCode == 68) {
		pressedRightForSecondPlayer = true;
	}
	else if(e.keyCode == 65) {
		pressedLeftForSecondPlayer = true;
	}
}

function keyUpSecondPlayer(e) {
	if(e.keyCode == 71) {
		pressedLeftShift = false;
	}
	else if(e.keyCode == 68) {
		pressedRightForSecondPlayer = false;
	}
	else if(e.keyCode == 65) {
		pressedLeftForSecondPlayer = false;
	}
}


function keyDown(e) {
	if(e.keyCode == 101) {
		pressedSpace = true;
	}
	else if(e.keyCode == 37) {
		pressedRight = true;
	}
	else if(e.keyCode == 39) {
		pressedLeft = true;
	}
}

function keyUp(e) {
	if(e.keyCode == 101) {
		pressedSpace = false;
	}
	else if(e.keyCode == 37) {
		pressedRight = false;
	}
	else if(e.keyCode == 39) {
		pressedLeft = false;
	}
}

var bullet = [];

var player = {
	x: (canvas.width-20)/2,
	y: canvas.height - 50,
	pW: 50,
	pH: 50,
	timer: 0,
	bullets: 0,
	draw: function() {
		ctx.beginPath();
		// ctx.rect(this.x, this.y, this.pW, this.pH);
		// ctx.fillStyle = "black";
		// ctx.fill();
		ctx.drawImage(lightTank, this.x, this.y, this.pW, this.pH)
		ctx.closePath();
	}
}

var player2 = {
	x: (canvas.width-20)/2,
	y:  canvas.height - 50,
	pW: 50,
	pH: 50,
	timer: 0,
	bullets: 0,
	
	draw: function() {
		ctx.beginPath();
		// ctx.rect(this.x, this.y, this.pW, this.pH);
		// ctx.fillStyle = "red";
		// ctx.fill();
		ctx.drawImage(heavyTank, this.x, this.y, this.pW, this.pH)
		ctx.closePath();
		
	}
}

var dBullet = {
	draw: function() {
		ctx.beginPath();
		// ctx.arc(bullet[i].x, bullet[i].y, 5, 0, 2 * Math.PI);
		// ctx.fillStyle = "red";
		// ctx.fill();
		ctx.drawImage(bulletSprite,bullet[i].x, bullet[i].y, 13, 30)
		
		ctx.closePath();
	}
}

var enemy = {
	width: 20,
	height: 20,
}
var reverseEnemiesArray = []
var enemies = []
var column = 0
var columns = 0
var rows = 0
var offSet = 0
var delay = 80
function createEnemies(columnCount,rowCount){

	enemyY = rowCount*(enemy.height+20)
	enemies[rowCount] = { y: enemyY}
	if(columnCount < 6){
		offSet = Math.ceil(Math.random()*500)
	}else{
		offSet = Math.ceil(Math.random()*500)
	}
	
	for(let column = 0; column <= columnCount; column++){
		enemyX = column*(enemy.width+20)
		enemyY = rowCount*(enemy.height+20)
		enemies[rowCount][column] = { x: enemyX, y: enemyY, offSetLeft: offSet, status:1};
	}
}

function drawEnemies() {
	for(let column = 1; column < enemies.length; column++){
		for(item in enemies[column]){
			if(enemies[column][item].status === 1){
				let enemyX = enemies[column][item].x + enemies[column][item].offSetLeft
				let enemyY = enemies[column][item].y/column*(enemies.length-column)
				ctx.beginPath();
				ctx.rect(enemyX, enemyY, enemy.width, enemy.height);
				ctx.fillStyle = "black";
				ctx.fill();
				ctx.closePath();
				if(enemies[column][item].y/column*(enemies.length-column) > canvas.height){
					health -= 1;
					if(health == 0){
						alert("Game OVER")
					}
					
				}
			}
		}
	}
}

function collision(x,y) {
	for(let column = 1; column < enemies.length; column++){
		for(item in enemies[column]){
			if(enemies[column][item].status === 1){
				if(x > enemies[column][item].x+enemies[column][item].offSetLeft && x < enemies[column][item].x+enemy.width+enemies[column][item].offSetLeft && y > enemies[column][item].y/column*(enemies.length-column) && y < enemies[column][item].y/column*(enemies.length-column)+enemy.height){
					enemies[column][item].status = 0
					money += 0.1
				}
			}
		}
	}
}

function moneyMake(){
	money++
	moneyCount.innerHTML = 'Money:' + money.toFixed(1)
}
function buySpeedAtack(){
	if(money > speedAttackCost){
		speedAttack -= 4;
		console.log(speedAttack)
		money -= speedAttackCost;
		speedAttackCost = Math.round(speedAttackCost*2)
	}else{
		console.log("не хватает денег")
	}
	speedAttackCostDisplay.innerHTML = 'Стоимость скорости атаки:' + speedAttackCost
}

function buyHealth() {
	if(money > healthCost){
		health += 1;
		money -= healthCost;
	}else{
		console.log("не хватает денег")
	}
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	for (i = 0; i < bullet.length; i++) {
		
		bullet[i].x += bullet[i].vx;
		bullet[i].y -= bullet[i].vy
		dBullet.draw();
		if(bullet[i].y < 0){
			bullet.splice(0,1)
		}
	}
	player.timer++;
	
	
	if(player.timer % speedAttack == 0) {
		player.bullets = 0;
	}
	
	if(player.timer % 50 == 0){
		moneyMake()
	}

	if(pressedSpace) {
		if(player.bullets < 1) {
			bullet.push
			( {
				x: player.x + player.pW/2 - 5/2,
				y: player.y,
				vx: 0,
				vy: 10,
			} );
		player.bullets++;
		}
	}
 	
	player.draw();
    
	if(pressedRight && 0 < player.x) {
		player.x -= 3;
	}
    
	if(pressedLeft && player.x < canvas.width - player.pW) {
		player.x += 3;
	}

// player 2 //

	player2.timer++;
  
	if(player2.timer % speedAttack == 0) {
		player2.bullets = 0;
	}
	

	if(player2.timer % 1000 == 0) {
		delay -=5
		
	}
	if(player2.timer % delay == 0) {
		console.log(delay)
		columns =(Math.ceil(Math.random()*10))
		rows+=1
		let columnCount = columns
		let rowCount = rows
		createEnemies(columnCount,rowCount)
	}
	
	drawEnemies()
	// drawEnemies(columnCount,rowCount)

	
	if(pressedLeftShift) {
		if(player2.bullets < 1) {
			bullet.push
			( {
				x: player2.x + player2.pW/2 - 5/2,
				y: player2.y,
				vx: 0,
				vy: 10,
			} );
			player2.bullets++;
		}
	}
 	
	player2.draw();
    
	if(pressedLeftForSecondPlayer && 0 < player2.x) {
		player2.x -= 3;
	}
	 
	if(pressedRightForSecondPlayer && player2.x < canvas.width - player2.pW) {
		player2.x += 3;
	}
	try {
		for(let i = 0; i < bullet.length; i++){
			collision(bullet[i].x,bullet[i].y)
		}
	} catch (error) {
		
	}
}
setInterval(draw, 1000/60);
// вешает на все пули, а надо на последнюю
