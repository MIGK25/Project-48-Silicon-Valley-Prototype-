var sky, skyImg;
var plane, planeImg;
var enemy, enemyImg, enemyGroup;
var bird, birdImg;
var smoke, smokeImg;
var thunderImg;
var blastImg;
var gameState = "play";
var restart, restartImg;
var score = 0;
var warzoneImg;
var warzoneenemyplaneImg, warzoneEnemy, warzoneEnemyGroup;
var bullet;
var wzPlaneImg;
var airMineImg;
var bulletImg, missileImg;
var missile, bullet;
var fireImg;
var damage = 0;
var rectangle1, rectangle2, rectangle1Width, rectangle2Width;
var missilecount = 0;
var controls, controlsImg;

function preload() {
  skyImg = loadImage("Imagees/sky2.jpg");
  planeImg = loadImage("Imagees/Plane.png");
  enemyImg = loadImage("Imagees/Plane2.png");
  birdImg = loadImage("Imagees/bird.png");
  smokeImg = loadImage("Imagees/smoke.png");
  thunderImg = loadImage("Imagees/thunder.png");
  blastImg = loadImage("Imagees/blast.png");
  restartImg = loadImage("Imagees/restart.png");
  warzoneImg = loadImage("Imagees/warzone.jpg");
  bullet = loadImage("Imagees/bullet.png");
  wzPlaneImg = loadImage("Imagees/warzoneplane2.png");
  warzoneenemyplaneImg = loadImage("Imagees/fighterEnemy.png");
  airMineImg = loadImage("Imagees/airmine.png");
  bulletImg = loadImage("Imagees/bullet.png");
  missileImg = loadImage("Imagees/missile.png");
  fireImg = loadImage("Imagees/fire2.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  sky = createSprite(width/2, height/2, width, height);
  sky.addImage("sky", skyImg);
  sky.addImage("warzone", warzoneImg);
  sky.scale = 5;

  plane = createSprite(200, 150);
  plane.addImage("plane", planeImg);
  plane.addImage("blast", blastImg);
  plane.addImage("warzoneplane", wzPlaneImg);
  plane.setCollider("rectangle", 0, 0, 500, 200);
  //plane.debug = true;
  plane.scale = 0.3;

  smoke = createSprite(100, 100);
  smoke.addImage("smoke", smokeImg);
  smoke.scale = 0.8;

  restart = createSprite(width - 100, 100);
  restart.addImage("restart", restartImg);
  restart.scale = 0.4;
  restart.visible = false;

  missile = createSprite(plane.x, plane.y);
  missile.addImage("missile", missileImg);
  missile.addImage("fire", fireImg);
  missile.visible = false;

  rectangle2 = createSprite(width/2 - 100, 50, 200, 30);
  rectangle2.shapeColor = "white";
  rectangle1 = createSprite(width/2 - 100, 50, 200, 30);
  rectangle1.shapeColor = "red";
  rectangle1.visible = false;
  rectangle2.visible = false;

  enemyGroup = new Group();
  warzoneEnemyGroup = new Group();
}

function draw() {
  background("blue");

  smoke.x = plane.x - 116;
  smoke.y = plane.y - 3;

  if(gameState === "play") {
    sky.velocityX = -7;

    //Score
    score = score + Math.round(getFrameRate()/60);

     //infinitely Scrolling Screen
    if(sky.x < 100) {
     sky.x = sky.width/2;
    }
  
    if(plane.y <= 85) {
      plane.y = 85;
    }

    if(plane.y >= height - 85) {
      plane.y = height - 85;
    }

    if(plane.x >= width - 135) {
      plane.x = 180;
    }

    if(keyDown(RIGHT_ARROW)) {
      plane.x += 9;
    }

    if(keyDown(UP_ARROW)) {
      plane.y -= 8;
    }

    if(keyDown(DOWN_ARROW)) {
      plane.y += 8;
    }
    Obstacles();

    if(enemyGroup.isTouching(plane)) {
      gameState = "end";
    }
    //Warzone
    if(score >= 80) {
      warzone();  
      
    }
    //Warzone Collision
    if(warzoneEnemyGroup.isTouching(plane)) {
      gameState = "end";
      plane.velocityY = 15;
    }
    //Shooting
    if(keyWentDown("space")) {
      missile.visible = true;
      missile.x = mouseY;
      missile.y = mouseY;
      missile.scale = 0.7;
      missile.velocityX = 18;
      rectangle1Width = rectangle1.width - 50;
    }
    if(keyWentUp("space")) {
      missile.changeImage("missile");
      missile.y = plane.y;
      missile.x = plane.x;
      missile.velocityY = 0;
    }

    if(warzoneEnemyGroup.isTouching(missile)){
      missile.changeImage("fire");
      warzoneEnemyGroup.destroyEach();
      missile.velocityY = 20;
    }

    if(warzoneEnemyGroup.isTouching(plane)) {
      gameOver();
    }

  }
 
  else if(gameState === "end"){
    sky.velocityX = 0;
    plane.velocityX = 0;
    enemyGroup.setVelocityXEach(0);
    plane.changeImage("blast");
    smoke.visible = false;
    restart.visible = true;
    warzoneEnemyGroup.setVelocityXEach(0);
    
  }
  if(mousePressedOver(restart)) {
    reset();
  }

  drawSprites();

  textSize(30);
  fill("yellow");
  text("Score : " + score , 30, 50);

  if(score >= 5 && gameState === "play") { 
    showMissileBar();
  }
  if(keyWentDown("space")) {
    missilecount += 1;
    rectangle1.width = rectangle1.width - 50;
    if(rectangle1.width <= 0) {
      rectangle1.visible = false;
    }
    if(missilecount >= 8) {
      rectangle1.width = 200;
      rectangle1.visible = true;
    }
  }
  
}

function Obstacles() {
  if(frameCount % 60 === 0) {
    enemy = createSprite(width - 160, 150);
    enemy.velocityX = -7;
    enemy.y = Math.round(random(50, height - 100));
    var rand = Math.round(random(1, 3));
    switch(rand) {
      case 1:  
                
                  enemy.addImage("enemy", enemyImg);
                  enemy.scale = 0.4;
                  
                  break;
  
      case 2:    
           
                  enemy.addImage("bird", birdImg);
                  enemy.scale = 0.5;
                  
                  break;
               
      case 3: 
      
                  enemy.addImage("thunder", thunderImg);
                  enemy.scale = 0.4;

                  break;

    }
    enemy.lifetime = width/7;
    enemyGroup.add(enemy);
  }
}

function reset() {
  gameState = "play";
  enemyGroup.destroyEach();
  plane.changeImage("plane", planeImg);
  smoke.visible = true;
  score = 0;  
  plane.x = 200;
  plane.y = 150; 
  sky.changeImage("sky");
  sky.scale = 4.3;
  warzoneEnemyGroup.destroyEach();
  plane.scale = 0.3;   
}

function warzone() {
  sky.changeImage("warzone");
  sky.scale = 3;
  enemyGroup.destroyEach();   
  plane.changeImage("warzoneplane");
  plane.scale = 0.7;
  plane.x = 150;
  plane.y = height/2;
  plane.y = mouseY;
  smoke.visible = false;

  if(frameCount % 100 === 0) {
    warzoneEnemy = createSprite(width, 150);
  
  
    warzoneEnemy.velocityX = -7;
    warzoneEnemy.y = Math.round(random(50, height - 100));
    var rand = Math.round(random(1, 2));
    switch(rand) {
     
      case 1 :   warzoneEnemy.addImage("warzoneEnemy", warzoneenemyplaneImg);
              
                 warzoneEnemy.scale = 0.7;

                 break;

      case 2 :   warzoneEnemy.addImage("airMine", airMineImg);
                
                 warzoneEnemy.scale = 0.7;
                 
                 break;
  
   }
    warzoneEnemy.lifetime = width/7;
    warzoneEnemyGroup.add(warzoneEnemy);

    if(warzoneEnemyGroup.isTouching(missile)) {
      warzoneEnemyGroup.destroyEach();
      missile.changeImage("fire");
    }
  
  }
}

function showMissileBar() {
  image(missileImg, width / 2 - 180, 70, 150, 60);
  rectangle1.visible = true;
  rectangle2.visible = true;  
}

function gameOver() {
  swal({
    title: `Game Over`,
    text: "BETTER LUCK NEXT TIME SOLDIER",
    imageUrl:
      "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
    imageSize: "100x100",
    confirmButtonText: "TRY AGAIN"
  });
}