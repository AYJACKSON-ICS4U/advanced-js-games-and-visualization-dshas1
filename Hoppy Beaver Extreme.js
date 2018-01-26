//the character object
var Char = function() {
    this.x = width/5;
    this.y = 300;
    this.img = getImage("cute/CharacterHornGirl");
    this.life = 10;
    this.coins = 0;
};

Char.prototype.display = function() {
    this.y = constrain(this.y, 0, height - 100);
    image(this.img, this.x, this.y, 50, 100);
};

//the jump command
Char.prototype.jump = function() {
    this.y -= 5;
};

//the fall command
Char.prototype.fall = function(){
    this. y += 5;
};

var char = new Char();

//the coins
var blueCoins = function(x, y) {
    this.x = x;
    this.y = y;
    this.value = 1;
};

blueCoins.prototype.display = function() {      
    image(getImage("cute/GemBlue"), this.x, this.y, 25, 40);
};

var blueC = [];
for (var i = 0; i < 30; i++) {
    blueC.push(new blueCoins(i * 40  + 300, random(20, 260)));
}

//command to have char gain coins
Char.prototype.grabBCoins = function(blueC) {
    if (blueC.x >= (this.x - 25) && blueC.x <= (this.x + 25) && blueC.y >= (this.y - 25) && blueC.y <= (this.y + 25)) {
        blueC.y = -400;
        this.coins += blueC.value;
    }
};

//command to make enemies hurt char
Char.prototype.enemy = function(enemies) {
    if (enemies.x >= (this.x - 25) && enemies.x <= (this.x + 25) && enemies.y >= (this.y - 25) && enemies.y <= (this.y + 25)) {
        enemies.y = -400;
        this.life -= enemies.life;
    }
};    

//the enemy object
var Enemy = function(x, y) {
    this.x = x;
    this.y = y;
    this.img = getImage("avatars/piceratops-seed");
    this.life = floor(random(1, 4));
};

Enemy.prototype.display = function() {
    image(this.img, this.x, this.y, 50, 50);
};

var enemies = [];
for (var i = 0; i < 15; i++) {
    enemies.push(new Enemy(175 * i + 400, random(20, 260)));
}

//new scrolling objects
var rockXs = [];
var rockYs = [300, 325, 395, 295, 330, 350, 310, 375];
for (var i = 0; i < 50; i+=random(5, 10)) {
    rockXs.push(i * 10);
}

var cloudXs= [];
var cloudYs = [25, 75, 10, 150, 75];
for (var i = 0; i < 50; i+= random(10, 20)) {
    cloudXs.push(i * 10);
}

//scenes
var drawSun = function() {
    stroke(153, 140, 107);
    fill(250, 182, 10);
        for (var i = 0; i < 360; i +=30) {
        pushMatrix();
        rotate(30 + i);
        triangle(75, -30, 200, 0, 75, 30);
        popMatrix();
    }
    ellipse(0, 0, 200, 200);
};

var drawDeathScene = function() {
    background(0, 0, 0);
    fill(255, 0, 0);
    textSize(50);
    for (var i = 0; i < 15; i++) {
    text("YOU DIED!!!", i * 9, i * 30);
    }
    image(getImage("creatures/OhNoes"), -4, 278, 150, 125);
};

var drawLoseScene = function() {
    background(245, 152, 152);
    textSize(40);
    fill(0, 0, 0);
    text("YOU LOSE!!!", 85, 141, 329, 100);
    image(getImage("avatars/marcimus"), 146, 178, 100, 125);
    for (var i = 50; i < 400; i += 125) {
        image(getImage("avatars/mr-pink"), i, 50, 50, 50);
    }
    for (var i = 50; i < 400; i += 125) {
        image(getImage("avatars/mr-pink"), i, 300, 50, 50);
    }
};

var drawWinScene = function() {
    background(195, 153, 247);
    textSize(40);
    fill(255, 0, 0, random(100, 255));
    text("YOU WON!!!", 85, 141, 329, 100);
    image(getImage("cute/ChestClosed"), 146, 152, 100, 125);
    for (var i = 50; i < 400; i += 125) {
        image(getImage("cute/Heart"), i, 25, 50, 75);
    }
    for (var i = 50; i < 400; i += 125) {
        image(getImage("cute/Heart"), i, 300, 50, 75);
    }
};

var drawScene = function () {
    background(204, 219, 245);
    drawSun();
    noStroke();
    fill(237, 184, 138);
    rect(0, 300, width, height);
    for (var i = 0; i < rockXs.length; i++) {
        image(getImage("cute/Rock"), rockXs[i], rockYs[i], 25, 25);
        rockXs[i] -= 1;
        if (rockXs[i] <= -20) {
            rockXs[i] = width;
        }
    }
    for (var i = 0; i < cloudXs.length; i++) {
        fill(255, 255, 255, 150);
        ellipse(cloudXs[i], cloudYs[i], 150, 20);
        ellipse(cloudXs[i] + 30, cloudYs[i] + 5, 200, 10);
        ellipse(cloudXs[i] - 45, cloudYs[i] - 5, 200, 10);
        cloudXs[i]-=0.5;
        if (cloudXs[i] <=-150) {
            cloudXs[i] = width + 150;
        }
    }
    for (var i = 0; i < blueC.length; i++) {
        blueC[i].display();
        char.grabBCoins(blueC[i]);
        blueC[i].x -= 1;
    }
    for (var i = 0; i < enemies.length; i++) {
        enemies[i].display();
        char.enemy(enemies[i]);
        enemies[i].x -= 2; 
    }
    //the key presses
    if (keyIsPressed && keyCode === 0) {
        char.jump();
    } 
    else {
        char.fall();
    }
    char.display();
    
    //scoring 
    fill(3, 3, 3);
    textSize(20);
    text("Score: " + char.coins, 10, 10, 100, 50);
    text("Life: " + char.life, 319, 10, 100, 50);
    
    //winning
    if (blueC[29].x < -10 && char.coins / blueC.length >= 0.9) {
        drawWinScene();
    }
    
    //losing
    if (blueC[29].x < -10 && char.coins / blueC.length <= 0.9) {
        drawLoseScene();
    }
    if (char.life <= 0) {
        drawDeathScene();
    }
}; 

draw = function() {
    drawScene();
};

