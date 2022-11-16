"use strict";

let container, particles, numberOfParticles = 300;
let particleTexture =  PIXI.Texture.from('images/particle-6x6.png');
let lifetime = 0;
let player;
let bgX = 0;

    const app = new PIXI.Application({
        width: 800,
        height: 700
    });
    document.body.appendChild(app.view);
    
    // constants
    const sceneWidth = app.view.width;
    const sceneHeight = app.view.height;	
    let graphics = new PIXI.Graphics();



//need the keys
const keys = [];

//need a board to compare the key codes to see if something is pressed
const keyboard = Object.freeze({
    SHIFT: 16,
    SPACE: 32,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    R: 82
});

// pre-load the images
//load the background
let background;
let oneParallax;
let twoParallax;
let threeParallax;
let fourParallax;
let fiveParallax;
let sixParallax;
let sevenParallax;
let eightParallax;


app.loader
        .add("background", "../images/Sunset/Background.png")
        .add("1", "../images/Sunset/1.png")
        .add("2", "../images/Sunset/2.png")
        .add("3", "../images/Sunset/3.png")
        .add("4", "../images/Sunset/4.png")
        .add("5", "../images/Sunset/5.png")
        .add("6", "../images/Sunset/6.png")
        .add("7", "../images/Sunset/7.png")
        .add("8", "../images/Sunset/8.png")
app.loader.add("idleSprites", "../images/playerAnimations/idle.png");
app.loader.add("runSprites", "../images/playerAnimations/run.png");
app.loader.add("attack1", "../images/playerAnimations/attack1.png");
app.loader.add("attack2", "../images/playerAnimations/attack2.png");
app.loader.add("attack3", "../images/playerAnimations/attack3.png");
app.loader.add("shield", "../images/playerAnimations/shield.png");
app.loader.add("roll", "../images/playerAnimations/roll.png");
app.loader.add("hurt", "../images/playerAnimations/hurt.png");
app.loader.add("death", "../images/playerAnimations/death.png");
app.loader.onProgress.add(e => { console.log(`progress=${e.progress}`) });
app.loader.onComplete.add(setup);
app.loader.load();


let stage;
//scenese
let startScene;
let gameScene;
let endScene;
let enemies = [];

//function for making particles, from the demo
const createParticles = ()=>{
    particles = [];
    container = new PIXI.ParticleContainer();
    container.maxSize = 30000;
    app.stage.addChild(container);
    for (let i = 0; i < numberOfParticles; i++) {
	    let p = new Particle(
      	  Math.random() * 2 + 1,
      	  Math.random() * sceneWidth,
          Math.random() * sceneHeight,
          Math.random() *180-90 ,
          Math.random() * 300,
          sceneWidth,
          sceneHeight);
      	particles.push(p);
     	container.addChild(p);
    }
}


//makes a tile
function createBg(texture) {
    let tiling = new PIXI.TilingSprite(texture, 800, 800);
    tiling.scale.x *= 4;
    tiling.scale.y *= 4;
    tiling.position.set(0,0);
    app.stage.addChild(tiling);
    return tiling;
}

//update background(tiling)
function updateBG(){
    let bGSpeed = -player.dx/2000;
    bgX = bgX + bGSpeed;
    eightParallax.tilePosition.x = bgX;
    sevenParallax.tilePosition.x = bgX/2
    sixParallax.tilePosition.x = bgX/4;
    fiveParallax.tilePosition.x = bgX/6;
    fourParallax.tilePosition.x = bgX/8;
    threeParallax.tilePosition.x = bgX/10;
    twoParallax.tilePosition.x = bgX/12;
    oneParallax.tilePosition.x = bgX/14;
}


function setup(){

    stage = app.stage;
    //make the particles 
    createParticles(); 


    //make the background
    background = createBg(app.loader.resources["background"].texture);
    oneParallax = createBg(app.loader.resources["1"].texture);
    twoParallax = createBg(app.loader.resources["2"].texture);
     threeParallax = createBg(app.loader.resources["3"].texture);
    fourParallax = createBg(app.loader.resources["4"].texture);
    fiveParallax = createBg(app.loader.resources["5"].texture);
    sixParallax = createBg(app.loader.resources["6"].texture);
    sevenParallax = createBg(app.loader.resources["7"].texture);
    eightParallax = createBg(app.loader.resources["8"].texture);


	// #1 - Create the `start` scene
    startScene = new PIXI.Container();
    stage.addChild(startScene);
    startScene.visible = false; //temp
	
	// #2 - Create the main `game` scene and make it invisible
    gameScene = new PIXI.Container();
    gameScene.addChild(container);
    gameScene.addChild(graphics);
   // gameScene.visible = false;
    stage.addChild(gameScene);
	
    // #3 - Create the `gameOver` scene and make it invisible
	endScene = new PIXI.Container();
    endScene.visible = false;
    stage.addChild(endScene);

    //load up the sprites
    let textures = [];
    textures["idle"] = loadSpriteSheet(4, "idle");
    textures["run"] = loadSpriteSheet(6,"run");
    textures["attack1"] = loadSpriteSheet(5, "attack1");
    textures["attack2"] = loadSpriteSheet(7, "attack2");
    textures["attack3"] = loadSpriteSheet(9, "attack3");
    textures["shield"] = loadSpriteSheet(2, "shield");
    textures["roll"] = loadSpriteSheet(4, "roll");
    textures["hurt"] = loadSpriteSheet(4, "hurt");
    textures["death"] = loadSpriteSheet(8, "death");


    //player creation
    player = new Player(textures, sceneWidth/2);
    player.interactive = true;
    player.play();
    gameScene.addChild(player);
    SpawnEnemies(50, textures);
    

    //

    //gameloop
    app.ticker.add(gameLoop);
}

//function to spawn a bunch of enemies
function SpawnEnemies(number, textures){
    for(let i = 0; i < number; i++){
        let enemy= new Enemy(textures, getRandom(sceneWidth, 100000));
        enemy.play();
        enemies.push(enemy);
        gameScene.addChild(enemy);
    }
}

//loads sprites from a sheet
function loadSpriteSheet(numFrames, sprite){
    let spriteSheet;
    //will likely refactor this eventually
    if(sprite == "run"){
        spriteSheet = PIXI.BaseTexture.from(app.loader.resources.runSprites.url);
    }
    else if (sprite == "attack1"){
        spriteSheet = PIXI.BaseTexture.from(app.loader.resources.attack1.url);
    }
    else if (sprite == "attack2"){
        spriteSheet = PIXI.BaseTexture.from(app.loader.resources.attack2.url);
    }
    else if (sprite == "attack3"){
        spriteSheet = PIXI.BaseTexture.from(app.loader.resources.attack3.url);
    }
    else if (sprite == "shield"){
        spriteSheet = PIXI.BaseTexture.from(app.loader.resources.shield.url);
    }
    else if (sprite == "roll"){
        spriteSheet = PIXI.BaseTexture.from(app.loader.resources.roll.url);
    }
    else if (sprite == "hurt"){
        spriteSheet = PIXI.BaseTexture.from(app.loader.resources.hurt.url);
    }
    else if(sprite == "death"){
        spriteSheet = PIXI.BaseTexture.from(app.loader.resources.death.url);
    }
    else{
        spriteSheet = PIXI.BaseTexture.from(app.loader.resources.idleSprites.url);
    }
    let width = 512
    let height  = 512;
    let textures = [];
    for(let i=0;i<numFrames;i++)
    { 
        let frame = new PIXI.Texture(spriteSheet, new PIXI.Rectangle(i*width,0,width,height));
        textures.push(frame);
    }
    return textures;    
}




//check collisions between enemies and player
function CheckCollisions(dt){
    for(let enemy of enemies){
        if(player.state != "hurt" && player.state != "dead" && player.state != "death" && enemy.state != "dead"){

        if(CircleIntersect(player.x,player.y,player.hitBoxRadius,enemy.x,enemy.y,50)){
            //change player state and animation
                enemy.attack();
            if(player.state != "shield" && player.state != "attack"){
                player.hurt();
            }
            else if(enemy.state != "hurt" && enemy.state != "dead" && enemy.state != "death" && enemy.state != "blocked"){
                enemy.hurt2();
            }
        }
        else if(player.x > enemy.x){
            enemy.run();
        }
    }
 
            //check if the player attack hitsd
            if(player.state ==  "attack" && enemy.state != "hurt" && enemy.state != "dead" && enemy.state != "death"&& enemy.state != "attack"){
                if(player.textures == player.animations.attack3){
                    if(CircleIntersect(player.x,player.y,player.attack3Rad ,enemy.x,enemy.y,enemy.radius)){
                        //change enemy state and animation
                       enemy.hurt();
                    }
                }
                else if(CircleIntersect(player.x,player.y,player.attackRadius ,enemy.x,enemy.y,enemy.radius)){
                    //change enemy state and animation
                   enemy.hurt();
                }
            }
    }
}


function gameLoop(){
   
   // #1 - Calculate "delta time"
   let dt = 1/app.ticker.FPS;
   if (dt > 1/12) dt=1/12;
   player.playerUpdate(dt);

   for(let enemy of enemies){
    enemy.enemyUpdate(dt);
   }

   updateBG();

   CheckCollisions(dt);
   let sin = Math.sin(lifetime / 60);
   //let cos = Math.cos(lifetime / 60);
   
   let yForce  = 0; //=  cos * (120 * dt);
   let xForce = sin * (40 * dt);


   for (let p of particles){
     p.update(dt, xForce, yForce);
   }


   //hit box drawing
   /*
   graphics.beginFill(0xe74c3c); // Red
   // Draw a circle
   graphics.drawCircle(player.x, player.y, 300);
   graphics.endFill();

   graphics.beginFill(); // Red
   // Draw a circle
   graphics.drawCircle(player.x, player.y, 200);
   graphics.endFill();

   graphics.beginFill(0xe74c3ca); // Red
   // Draw a circle
   graphics.drawCircle(player.x, player.y, 70);
   graphics.endFill();*/


   
   lifetime++;
   if(lifetime > 1000){
    lifetime = 0;
   }


}



//check inputs
window.onkeyup = (e) => {
    keys[e.keyCode] = false;
    e.preventDefault();

    let c= String.fromCharCode(e.keyCode);//for the letters

    if (c == "a" || c == "A") {
        keys[keyboard.LEFT] = false;
        console.log("stop");
    }
    if (c == "d" || c == "D") {
        keys[keyboard.RIGHT] = false;
        console.log("stop");
    }
    if (e.keyCode == 32) {
        keys[keyboard.SPACE] = false;
        console.log("stopAttack");
    }
    if (c == "r" || c == "R") {
        keys[keyboard.R] = false;
    }
    if(e.keyCode == 16){
        keys[keyboard.SHIFT] = false;
    }
};

//pressed
window.onkeydown = (e) => {
    keys[e.keyCode] = true;
    e.preventDefault();

    let c = String.fromCharCode(e.keyCode);

    if (c == "a" || c == "A") {
        keys[keyboard.LEFT] = true;
        console.log("go");
    }
    if (c == "d" || c == "D") {
        keys[keyboard.RIGHT] = true;
        console.log("go");
    }
    if (e.keyCode == 32) {
        keys[keyboard.SPACE] = true;
    }
    if (c == "r" || c == "R") {
        keys[keyboard.R] = true;
    }
    if(e.keyCode == 16){
        keys[keyboard.SHIFT] = true;
    }

};