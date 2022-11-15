"use strict";

let container, particles, numberOfParticles = 1000;
let particleTexture =  PIXI.Texture.from('images/particle-6x6.png');
let lifetime = 0;
let player;

    const app = new PIXI.Application({
        width: 800,
        height: 800
    });
    document.body.appendChild(app.view);
    
    // constants
    const sceneWidth = app.view.width;
    const sceneHeight = app.view.height;	



//need the keys
const keys = [];

//need a board to compare the key codes to see if something is pressed
const keyboard = Object.freeze({
    SHIFT: 16,
    SPACE: 32,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40
});

// pre-load the images
app.loader.add("idleSprites", "../images/playerAnimations/idle.png");
app.loader.add("runSprites", "../images/playerAnimations/run.png");
app.loader.add("attack1", "../images/playerAnimations/attack1.png");
app.loader.add("attack2", "../images/playerAnimations/attack2.png");
app.loader.add("attack3", "../images/playerAnimations/attack3.png");
app.loader.onProgress.add(e => { console.log(`progress=${e.progress}`) });
app.loader.onComplete.add(setup);
app.loader.load();


let stage;
//scenese
let startScene;
let gameScene;
let endScene;


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


function setup(){

    //make the particles 
    createParticles(); 


    stage = app.stage;
	// #1 - Create the `start` scene
    startScene = new PIXI.Container();
    stage.addChild(startScene);
    startScene.visible = false; //temp
	
	// #2 - Create the main `game` scene and make it invisible
    gameScene = new PIXI.Container();
    gameScene.addChild(container);
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

    textures["attack1"] = loadSpriteSheet(5, "attack1")
    textures["attack2"] = loadSpriteSheet(7, "attack2")
    textures["attack3"] = loadSpriteSheet(9, "attack3")
    //player creation
    player = new Player(textures);
    player.interactive = true;
    player.play();
    gameScene.addChild(player)
    

    //

    //gameloop
    app.ticker.add(gameLoop);
}



//loads sprites from a sheet
function loadSpriteSheet(numFrames, sprite){
    let spriteSheet;
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








function gameLoop(){
   
   // #1 - Calculate "delta time"
   let dt = 1/app.ticker.FPS;
   if (dt > 1/12) dt=1/12;
   player.playerUpdate(dt);

   let sin = Math.sin(lifetime / 60);
   let cos = Math.cos(lifetime / 60);
   
   let yForce  = 0; //=  cos * (120 * dt);
   let xForce = sin * (40 * dt);


   for (let p of particles){
     p.update(dt, xForce, yForce);
   }
   
   lifetime++;


}



//check inputs
window.onkeyup = (e) => {
    keys[e.keyCode] = false;
    e.preventDefault();

    let c= String.fromCharCode(e.keyCode);

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

};