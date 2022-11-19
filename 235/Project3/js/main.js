"use strict";
let container, particles, numberOfParticles = 900;
let particleTexture =  PIXI.Texture.from('images/particle-6x6.png');
let lifetime = 0;
let player;
let bgX = 0;
let paused = true;

    const app = new PIXI.Application({
        width: 1000,
        height: 675,
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
    S: 83,
    A:65

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
        .add("background", "images/Sunset/Background.png")
        .add("1", "images/Sunset/1.png")
        .add("2", "images/Sunset/2.png")
        .add("3", "images/Sunset/3.png")
        .add("4", "images/Sunset/4.png")
        .add("5", "images/Sunset/5.png")
        .add("6", "images/Sunset/6.png")
        .add("7", "images/Sunset/7.png")
        .add("8", "images/Sunset/8.png")
app.loader.add("idleSprites", "images/playerAnimations/idle.png");
app.loader.add("runSprites", "images/playerAnimations/run.png");
app.loader.add("attack1", "images/playerAnimations/attack1.png");
app.loader.add("attack2", "images/playerAnimations/attack2.png");
app.loader.add("attack3", "images/playerAnimations/attack3.png");
app.loader.add("shield", "images/playerAnimations/shield.png");
app.loader.add("roll", "images/playerAnimations/roll.png");
app.loader.add("hurt", "images/playerAnimations/hurt.png");
app.loader.add("death", "images/playerAnimations/death.png");
app.loader.add("heal", "images/playerAnimations/heal.png");
app.loader.add("campfire", "images/otherAnim/campire.png");


/////////////////////load sounds
//app.loader.add("idle",  "../sounds/playerAnimations/hurtEnemy.wav");
//app.loader.add("run",  "../sounds/playerAnimations/hurtEnemy.wav");
app.loader.add("attack1S",  "sounds/attack1.wav");
app.loader.add("attack2S",  "sounds/attack2.wav");
app.loader.add("attack3S",  "sounds/attack3.wav");
app.loader.add("blockS",  "sounds/block.wav");
app.loader.add("deathS",  "sounds/death.wav");
app.loader.add("hurtS", "sounds/hurt.wav" );
app.loader.add("hurtEnemyS", "sounds/hurtEnemy.wav");
app.loader.add("foot1S", "sounds/foot1.wav" );
app.loader.add("foot2S", "sounds/foot2.wav");
app.loader.add("rollS", "sounds/roll.wav");
app.loader.add("healS", "sounds/heal.wav");
app.loader.add("guitar", "sounds/Guitar_instrumental.mp3");
app.loader.add("outdoorWinter", "sounds/outdoorWinter.mp3");
/////////////////////////////ui
app.loader.add("swordUI", "images/ui/Sword.png");
app.loader.add("directionsUI", "images/ui/directions.png");
app.loader.add("shieldUI", "images/ui/Shield.png");
app.loader.add("healthUI", "images/ui/health/tile000.png");
app.loader.add("healthUI2", "images/ui/health/tile001.png");
app.loader.add("healthUI3", "images/ui/health/tile002.png");
app.loader.add("healthUI4", "images/ui/health/tile003.png");
app.loader.add("healthUI5", "images/ui/health/tile004.png");

app.loader.onProgress.add(e => { console.log(`progress=${e.progress}`) });
app.loader.onComplete.add(setup);
app.loader.load();


let stage;
//scenese
let startScene;
let gameScene;
let endScene;
let gameSceneUpdate
let enemies = [];
let healthKits = [];
let bgMusic;
let ambience;
let score = 0;
let scoreText;


function startGame(){
    startScene.visible = false;
    endScene.visible = false;
    player.resetAttack();
    gameSceneUpdate.visible = true;
    player.charges = 3;
    player.health = 5;
    player.shieldCharge = 6;
    paused = false;
    for(let enemy of enemies){
        enemy.reset();
        enemy.diff = 0;
    }
    score = 0;
}
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
function updateBG(dt){
    let bGSpeed = -player.dx * dt;
    bgX = bgX + bGSpeed;
    eightParallax.tilePosition.x = bgX;
    sevenParallax.tilePosition.x = bgX/2
    sixParallax.tilePosition.x = bgX/4;
    fiveParallax.tilePosition.x = bgX/6;
    fourParallax.tilePosition.x = bgX/8;
    threeParallax.tilePosition.x = bgX/10;
    twoParallax.tilePosition.x = bgX/12;
    oneParallax.tilePosition.x = bgX/14;

    if(player.health <= 2){
        eightParallax.tint =  0xFF0000;
        sevenParallax.tint =  0xFF0000;
        sixParallax.tint =  0xFF0000;
        fiveParallax.tint =  0xFF0000;
        fourParallax.tint =  0xFF0000;
        threeParallax.tint =  0xFF0000;
        twoParallax.tint =  0xFF0000;;
        oneParallax.tint = 0xFF0000;
        background.tint = 0xFF0000;
    }
    else{
        eightParallax.tint =  0xFFFFFF;
        sevenParallax.tint =  0xFFFFFF;
        sixParallax.tint =  0xFFFFFF;
        fiveParallax.tint =  0xFFFFFF;
        fourParallax.tint =  0xFFFFFF;
        threeParallax.tint =  0xFFFFFF;
        twoParallax.tint =  0xFFFFFF;
        oneParallax.tint = 0xFFFFFF;
        background.tint = 0xFFFFFF;
    }
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



	// #2 - Create the main `game` scene and make it invisible
    gameScene = new PIXI.Container();
    gameScene.addChild(container);
    gameScene.addChild(graphics);
    gameScene.visible = true;
    stage.addChild(gameScene);

        //Create the endScene scene and make it invisible
	endScene = new PIXI.Container();
    endScene.visible = false;   
    stage.addChild(endScene);

    	//Create the start scene
        startScene = new PIXI.Container();
        stage.addChild(startScene);
        startScene.visible = true;

    //gameUpdate scene-invisible
    gameSceneUpdate = new PIXI.Container();
    gameSceneUpdate.addChild(graphics);
    gameSceneUpdate.visible = false;
    stage.addChild(gameSceneUpdate);


    createButtonsAndText();

    //load up the sounds
    let sounds = [];
    sounds["attack1"] = new Howl({
        src: [app.loader.resources.attack1S.url],
        volume: 0.25
    });
    sounds["attack2"] = new Howl({
        src: [app.loader.resources.attack2S.url],
        volume: 0.25
    });
    sounds["attack3"] = new Howl({
        src: [app.loader.resources.attack3S.url],
        volume: 0.25
    });
    sounds["block"] = new Howl({
        src: [app.loader.resources.blockS.url],
        volume: 0.25
    });
    sounds["death"] = new Howl({
        src: [app.loader.resources.deathS.url],
        volume: 0.25
    });
    sounds["hurt"] = new Howl({
        src: [app.loader.resources.hurtS.url],
        volume: 0.25
    });
    sounds["hurtEnemy"] = new Howl({
        src: [app.loader.resources.hurtEnemyS.url],
        volume: 0.25
    });
    sounds["roll"] = new Howl({
        src: [app.loader.resources.rollS.url],
        volume: 0.25
    });
    sounds["foot1"] = new Howl({
        src: [app.loader.resources.foot1S.url],
        volume: 0.25
    });
    sounds["foot2"] = new Howl({
        src: [app.loader.resources.foot2S.url],
        volume: 0.25
    });
    sounds["heal"] = new Howl({
        src: [app.loader.resources.healS.url],
        volume: 0.25
    });
    bgMusic = new Howl({
        src: [app.loader.resources.guitar.url],
        html5: true,
        volume: .1
    })
    ambience = new Howl({
        src: [app.loader.resources.outdoorWinter.url],
        html5: true,
        volume: .8
    })

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
    textures["heal"] = loadSpriteSheet(8, "heal");

    let healthTexture = []
    healthTexture["idle"] = loadSpriteSheet(11, "health");

    //SpawnHealth(300, healthTexture);
    //player creation
    player = new Player(textures, sceneWidth/2, 600, sounds);
    player.interactive = true;
    player.play();
    gameScene.addChild(player);



    SpawnEnemies(40, textures, sounds);
    


    //gameloop
    app.ticker.add(gameLoop);
}

//function to spawn a bunch of enemies
function SpawnEnemies(number, textures, sounds){
    for(let i = 0; i < number; i++){
        let enemy= new Enemy(textures, getRandom(sceneWidth + 100, 100000), 600, sounds);
        enemy.play();
        enemies.push(enemy);
        gameScene.addChild(enemy);
    }
}

function SpawnHealth(number, texture){
    for(let i = 0; i < number; i++){
        let healthKit= new HealthKit(texture, getRandom(sceneWidth + 100, 100000), 600);
        healthKit.play();
        healthKits.push(healthKit);
        gameScene.addChild(healthKit);
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
    else if (sprite == "heal"){
       spriteSheet = PIXI.BaseTexture.from(app.loader.resources.heal.url);
   }
    else if (sprite == "health"){
        spriteSheet = PIXI.BaseTexture.from(app.loader.resources.campfire.url);
    }
    else{
        spriteSheet = PIXI.BaseTexture.from(app.loader.resources.idleSprites.url);
    }
    let width = 512
    let height  = 512;
    if(sprite == "health"){
        width = 1122/numFrames;
        height = 102;
    }

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
    console.log(player.state);
    for(let enemy of enemies){
        if(player.state != "hurt" && player.state != "dead" && player.state != "death" && enemy.state != "dead"&& enemy.state != "death" && enemy.state != "hurt"){

        if(CircleIntersect(player.x,player.y,player.hitBoxRadius,enemy.x,enemy.y,50)){
            //change player state and animation
            if((player.state == "shield" || player.state == "roll")){
                //change enemy state to blocked
                if(enemy.state != "blocked"){
                   enemy.blocked(false);
                   enemy.ToIdleAnim();
                }
            }
            else if(enemy.state != "blocked"){     
                enemy.attack();          
                enemy.AttackSound();
                if(player.state != "attack"){
                    player.hurt();
                }
            }
        }
        else if(player.x > enemy.x){
            enemy.run();
        }
    }
 
            //check if the player attack hitsd
            if(player.state ==  "attack" && enemy.state != "hurt" && enemy.state != "dead" && enemy.state != "death"){
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

           /* for(let hk of healthKits){
                if(!player.hasHealed){
                    if(CircleIntersect(player.x,player.y,player.hitBoxRadius ,hk.x,hk.y,20)){
                        player.heal();
                    }
                }
            }*/
    }
}


function gameLoop(){
 // #1 - Calculate "delta time"
 let dt = 1/app.ticker.FPS;
 if (dt > 1/12) dt=1/12;

 if (!ambience.playing()) ambience.play();
 
 //update player and projectiles
 let sin = Math.sin(lifetime / 60);
 //let cos = Math.cos(lifetime / 60);
 
 let yForce  = 0; //=  cos * (120 * dt);
 let xForce = sin * (30 * dt);

 for (let p of particles){
    p.update(dt, xForce, yForce);
  }
  lifetime++;
  if(lifetime > 1000){
   lifetime = 0;
  }

 player.playerUpdate(dt);
 updateBG(dt);

 if(paused) return;

updateButtonsAndText();
 if (!bgMusic.playing())  bgMusic.play();
 for(let enemy of enemies){
  enemy.enemyUpdate(dt);
 }
 for (let hk of healthKits){
    hk.healthUpdate(dt);
 }


 CheckCollisions(dt);

 if(player.state =="dead") endSceneSwap();

}
//change to gameover scene
function endSceneSwap(){
    endScene.visible = true;
    gameSceneUpdate.visible = false;
}
let sword3;
let sword1;
let sword2;
let shield1, shield2,shield3;
let health1, health2, health3, health4, health5;
function createButtonsAndText(){

    //save style 
    let style = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 40,
        fontFamily: 'Arial',
        fontStyle: 'bold'
        
    });
     // 1 - set up startscene
     let title = new PIXI.Text("Winter's Dawn");
     title.style = style;
     title.x = sceneWidth / 2 - title.width / 2;
     title.y = 125;
     startScene.addChild(title);

     let instructions = new PIXI.Text("Click here to begin!");
     instructions.style = style;
     instructions.x = sceneWidth / 2 - instructions.width / 2;
     instructions.y = 100 + title.y;
     instructions.interactive = true;
     instructions.buttonMode = true;
     instructions.on("pointerup",startGame);
     instructions.on('pointerover', e=>e.target.alpha =.7);
     instructions.on('pointerout', e=>e.currentTarget.alpha = 1.0);
     startScene.addChild(instructions);


     
     let directions = new PIXI.Sprite.from(app.loader.resources.directionsUI.url);
     directions.x = sceneWidth / 2 - instructions.width * 5/8;
     directions.y = 200 + title.y;
     directions.scale.set(.25);
     startScene.addChild(directions);


         //shields
    shield1=  PIXI.Sprite.from(app.loader.resources.shieldUI.url);
    shield1.x = sceneWidth/20;
    shield1.y = sceneHeight/10;
    shield1.scale.set(1.5);
    gameSceneUpdate.addChild(shield1);

    shield2 =  PIXI.Sprite.from(app.loader.resources.shieldUI.url);
    shield2.x = shield1.x + sceneWidth/20;
    shield2.y = sceneHeight/10;
    shield2.scale.set(1.5);
    gameSceneUpdate.addChild(shield2);

    shield3 =  PIXI.Sprite.from(app.loader.resources.shieldUI.url);
    shield3.x = shield2.x + sceneWidth/20;
    shield3.y = sceneHeight/10;
    shield3.scale.set(1.5);
    gameSceneUpdate.addChild(shield3);
 
 
    
    //swords 
     sword1=  PIXI.Sprite.from(app.loader.resources.swordUI.url);
     sword1.x = sceneWidth/20;
     sword1.y = sceneHeight/10;
     sword1.scale.set(2);
     gameSceneUpdate.addChild(sword1);

     sword2 =  PIXI.Sprite.from(app.loader.resources.swordUI.url);
     sword2.x = sword1.x + sceneWidth/20;
     sword2.y = sceneHeight/10;
     sword2.scale.set(2);
     gameSceneUpdate.addChild(sword2);

     sword3 =  PIXI.Sprite.from(app.loader.resources.swordUI.url);
     sword3.x = sword2.x + sceneWidth/20;
     sword3.y = sceneHeight/10;
     sword3.scale.set(2);
     gameSceneUpdate.addChild(sword3);

        //health 
        health1=  PIXI.Sprite.from(app.loader.resources.healthUI.url);
        health1.x = sword2.x
        health1.y = sword1.y + sceneHeight/10;
        health1.scale.set(3);
        gameSceneUpdate.addChild(health1);

        health2=  PIXI.Sprite.from(app.loader.resources.healthUI2.url);
        health2.x = sword2.x
        health2.y = sword1.y + sceneHeight/10;
        health2.scale.set(3);
        gameSceneUpdate.addChild(health2);

        health3=  PIXI.Sprite.from(app.loader.resources.healthUI3.url);
        health3.x = sword2.x
        health3.y = sword1.y + sceneHeight/10;
        health3.scale.set(3);
        gameSceneUpdate.addChild(health3);

        health4=  PIXI.Sprite.from(app.loader.resources.healthUI4.url);
        health4.x = sword2.x
        health4.y = sword1.y + sceneHeight/10;
        health4.scale.set(3);
        gameSceneUpdate.addChild(health4);

        health5=  PIXI.Sprite.from(app.loader.resources.healthUI5.url);
        health5.x = sword2.x
        health5.y = sword1.y + sceneHeight/10;
        health5.scale.set(3);
        gameSceneUpdate.addChild(health5);

   

     //make score label
    scoreText= new PIXI.Text();
    scoreText.style.fill = 0xADD8E6;
    scoreText.style = style;
    scoreText.x = sword1.x;
    scoreText.y = 5;
    gameSceneUpdate.addChild(scoreText);
    increaseScoreBy(0);


    //game over
    let endMessage = new PIXI.Text("YOU DIED!");
     endMessage.style = style;
     endMessage.x = sceneWidth / 2 - endMessage.width / 2;
     endMessage.y = 125;
     endScene.addChild(endMessage);

     let instructionsEnd = new PIXI.Text("Click Here to Begin Anew!");
     instructionsEnd.style = style
     instructionsEnd.x = sceneWidth / 2 - instructionsEnd.width / 2;
     instructionsEnd.y = 100 + endMessage.y;
     instructionsEnd.interactive = true;
     instructions.buttonMode = true;
     instructionsEnd.on("pointerup",startGame);
     instructionsEnd.on('pointerover', e=>e.target.alpha =.7);
     instructionsEnd.on('pointerout', e=>e.currentTarget.alpha = 1.0);

     endScene.addChild(instructionsEnd);


}

//adds to the score
function increaseScoreBy(value){
    score += value;
    scoreText.text = `Score:${Math.floor(score)}`;
}




//update the labels
function updateButtonsAndText(){
    //this is not as complicated as it seems
    sword1.visible = false;
    if(player.charges >= 1){
        sword1.visible = true;
        sword2.visible = false;
        sword3.visible = false;
        if(player.charges >=2){
            sword1.visible = true;
            sword2.visible = true;
            if(player.charges >= 3){
               sword3.visible = true;

            }
        }
    }
    //update shield visibility
    shield1.visible = false;
    if(player.shieldCharge >= 2){
        shield1.visible = true;
        shield2.visible = false;
        shield3.visible = false;
        if(player.shieldCharge >=4){
            shield1.visible = true;
            shield2.visible = true;
            if(player.shieldCharge >= 6){
               shield3.visible = true;
            }
        }
    }

    //update health sprite
    if(player.health == 5){
        health1.visible = true;
        health2.visible = false;
        health3.visible = false;
        health4.visible = false;
        health5.visible = false;
    }
    else if (player.health == 4){
        health1.visible = false;
        health2.visible = true;
        health3.visible = false;
        health4.visible = false;
        health5.visible = false;
    }
    else if (player.health == 3){
        health1.visible = false;
        health2.visible = false;
        health3.visible = true;
        health4.visible = false;
        health5.visible = false;
    }
    else if (player.health == 2){
        health1.visible = false;
        health2.visible = false;
        health3.visible = false;
        health4.visible = true;
        health5.visible = false;
    }
    else if (player.health == 1){
        health1.visible = false;
        health2.visible = false;
        health3.visible = false;
        health4.visible = false;
        health5.visible = true;
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
    if (c == "s" || c == "S") {
        keys[keyboard.S] = false;
    }
    if(e.keyCode == 16){
        keys[keyboard.SHIFT] = false;
    }
    if(c == "A" || c == "a"){
        keys[keyboard.A] = false;
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
    if (c == "s" || c == "S") {
        keys[keyboard.S] = true;
    }
    if(e.keyCode == 16){
        keys[keyboard.SHIFT] = true;
    }
    if(c == "A" || c == "a"){
        keys[keyboard.A] = true;
    }

};