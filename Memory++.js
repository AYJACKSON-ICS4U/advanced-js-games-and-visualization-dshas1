var Tile = function(x, y, face) {
    this.x = x;
    this.y = y;
    this.face = face;
    this.width = 70;
};

Tile.prototype.drawFaceDown = function() {
    fill(214, 247, 202);
    strokeWeight(2);
    rect(this.x, this.y, this.width, this.width, 10);
    image(getImage("avatars/leaf-green"), this.x, this.y, this.width, this.width);
    this.isFaceUp = false;
};

Tile.prototype.drawHover = function() {
    fill(235, 137, 99);
    strokeWeight(2);
    rect(this.x, this.y, this.width, this.width, 10);
    image(getImage("avatars/leaf-green"), this.x, this.y, this.width, this.width);
    this.isFaceUp = false;
};

Tile.prototype.drawFaceUp = function() {
    fill(214, 247, 202);
    strokeWeight(2);
    rect(this.x, this.y, this.width, this.width, 10);
    image(this.face, this.x, this.y, this.width, this.width);
    this.isFaceUp = true;
};

Tile.prototype.isUnderMouse = function(x, y) {
    return x >= this.x && x <= this.x + this.width  &&
        y >= this.y && y <= this.y + this.width;
};

// Global config
var NUM_COLS = 5;
var NUM_ROWS = 4;

// Declare an array of all possible faces
var faces = [
    getImage("avatars/leafers-seed"),
    getImage("avatars/leafers-seedling"),
    getImage("avatars/leafers-sapling"),
    getImage("avatars/leafers-tree"),
    getImage("avatars/leafers-ultimate"),
    getImage("avatars/marcimus"),
    getImage("avatars/mr-pants"),
    getImage("avatars/mr-pink"),
    getImage("avatars/old-spice-man"),
    getImage("avatars/robot_female_1")
];

// Make an array which has 2 of each, then randomize it
var possibleFaces = faces.slice(0);
var selected = [];
for (var i = 0; i < (NUM_COLS * NUM_ROWS) / 2; i++) {
    // Randomly pick one from the array of remaining faces
    var randomInd = floor(random(possibleFaces.length));
    var face = possibleFaces[randomInd];
    // Push twice onto array
    selected.push(face);
    selected.push(face);
    // Remove from array
    possibleFaces.splice(randomInd, 1);
}

// Now we need to randomize the array
selected.sort(function() {
    return 0.5 - Math.random();
});

// Create the tiles
var tiles = [];
for (var i = 0; i < NUM_COLS; i++) {
    for (var j = 0; j < NUM_ROWS; j++) {
        tiles.push(new Tile(i * 78 + 10, j * 78 + 40, selected.pop()));
    }
}

background(255, 255, 255);

// Now draw them face down
for (var i = 0; i < tiles.length; i++) {
    tiles[i].drawFaceDown();
}

var flippedTiles = [];
var delayStartFC = null;
var numTries = 0;

mouseOver = function() {
println("here");    
    for (var i = 0; i < tiles.length; i++) {
        if (tiles[i].isUnderMouse(mouseX, mouseY)) {
            tiles[i].drawHover();
        } else {
            tiles[i].drawFaceDown();
        }
    }


};

mouseClicked = function() {
    for (var i = 0; i < tiles.length; i++) {
        if (tiles[i].isUnderMouse(mouseX, mouseY)) {
            if (flippedTiles.length < 2 && !tiles[i].isFaceUp) {
                tiles[i].drawFaceUp();
                flippedTiles.push(tiles[i]);
                if (flippedTiles.length === 2) {
                    numTries++;
                    if (flippedTiles[0].face === flippedTiles[1].face) {
                        flippedTiles[0].isMatch = true;
                        flippedTiles[1].isMatch = true;
                    }
                    delayStartFC = frameCount;
                    loop();
                }
            } 
        }
    }
    var foundAllMatches = true;
    for (var i = 0; i < tiles.length; i++) {
        foundAllMatches = foundAllMatches && tiles[i].isMatch;
    }
    if (foundAllMatches) {
        fill(0, 0, 0);
        textSize(20);
        text("You found them all in " + numTries + " tries!", 20, 375);
    }
};

draw = function() {
    if (delayStartFC && (frameCount - delayStartFC) > 30) {
        for (var i = 0; i < tiles.length; i++) {
            if (!tiles[i].isMatch) {
                tiles[i].drawFaceDown();
            }
        }
        flippedTiles = [];
        delayStartFC = null;
        noLoop();
    }
};
