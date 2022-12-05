"use strict";
let container, particles, numberOfParticles = 1000;
let particleTexture =  PIXI.Texture.from('images/particle-6x6.png');
let lifetime = 0;
let player;
let bgX = 0;
let paused = true;

    const app = new PIXI.Application({
        width: 1200,
        height: 720,
        
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
    A:65,
    W:87
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



let stage;
//scenese
let startScene;
let gameScene;
let endScene;
let gameSceneUpdate
let enemies = [];
let bgMusic;
let ambience;
let deathMusic;
let score = 0;
let endScore;
let scoreText;


//this will get called at avery point the game resets, resets charges, health, score, and respawns enemies
function startGame(){
    if(deathMusic.playing) deathMusic.stop();
    startScene.visible = false;
    endScene.visible = false;
    player.resetAttack();
    gameSceneUpdate.visible = true;
    player.charges = 4;
    player.health = 5;
    player.shieldCharge = 8;
    player.healTimetoNext = 40;
    paused = false;
    for(let enemy of enemies){
        enemy.reset();
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
    if(player.state == "roll"){
        bGSpeed = -(player.dx/3) * dt;
    }
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

//sets up everything(sounds, textures, other assets and scenes)
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
    sounds["death"] = new Howl({
        src: [app.loader.resources.deathS.url],
        volume: 0.25
    });
    sounds["hurt"] = new Howl({
        src: [app.loader.resources.hurtS.url],
        volume: 0.15
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
        volume: 0.2
    });
    sounds["block"] = new Howl({
        src: [app.loader.resources.blockS.url],
        volume: 0.03
    });
    sounds["block3"] = new Howl({
        src: [app.loader.resources.blockS3.url],
        volume: 0.03
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
    deathMusic = new Howl({
        src: [app.loader.resources.deathTrack.url],
        html5: true,
        volume: .2    })

    //load up the sprites
    let textures = [];
    textures["idle"] = loadSpriteSheet(4, "idle");
    textures["run"] = loadSpriteSheet(6,"run");
    textures["runLeft"] = loadSpriteSheet(6,"runLeft");
    textures["attack1"] = loadSpriteSheet(5, "attack1");
    textures["attack2"] = loadSpriteSheet(7, "attack2");
    textures["attack3"] = loadSpriteSheet(9, "attack3");
    textures["shield"] = loadSpriteSheet(2, "shield");
    textures["roll"] = loadSpriteSheet(4, "roll");
    textures["hurt"] = loadSpriteSheet(4, "hurt");
    textures["death"] = loadSpriteSheet(8, "death");
    textures["heal"] = loadSpriteSheet(8, "heal");

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
        let enemy= new Enemy(textures, getRandom(sceneWidth + 100, 90000), 600, sounds);
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
    else if(sprite == "runLeft"){
        spriteSheet = PIXI.BaseTexture.from(app.loader.resources.runSpritesReverse.url);
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
        if(player.state != "hurt" && player.state != "dead" && player.state != "death" && enemy.state != "dead"&& enemy.state != "death" && enemy.state != "hurt"){

        if(CircleIntersect(player.x,player.y,player.hitBoxRadius,enemy.x,enemy.y,50)){
            //change player state and animation
            if((player.state == "roll")){
                //change enemy state to blocked
                if(enemy.state != "blocked"){
                   enemy.blocked(false);
                   enemy.ToIdleAnim();
                }
            }
            else if(enemy.state != "blocked"){     
                enemy.attack();          
                if(player.state != "attack" && player.state != "shield"){
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
 

 CheckCollisions(dt);

 if(player.state =="dead") endSceneSwap();

}
//change to gameover scene
function endSceneSwap(){
    endScene.visible = true;
    paused = true;
    bgMusic.stop();
    deathMusic.play();
    gameSceneUpdate.visible = false;
}

//made the fields here, idk
let sword3;
let sword1;
let sword2, sword4;
let shield1, shield2,shield3, shield4;
let health1, health2, health3, health4, health5;
let healthC1,healthC2,healthC3,healthC4,healthC5;
//sets up all of the iu, will be called in setup
function createButtonsAndText(){

    //save style 
    let style = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 40,
        fontFamily: 'MedievalSharp',
        fontStyle: 'bold'
        
    });

    let headStyle = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 60,
        fontFamily: 'MedievalSharp',
        fontStyle: 'bold'
        
    });
     // 1 - set up startscene
     let title = new PIXI.Text("Winter's Dawn");
     title.style = headStyle;
     title.x = sceneWidth / 2 - title.width / 2;
     title.y = 125;
     startScene.addChild(title);

     //button to start
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


     //image for directions
     let directions = new PIXI.Sprite.from(app.loader.resources.directionsUI.url);
     directions.x = sceneWidth / 2 - directions.width/9;
     directions.y = 175 + title.y;
     directions.scale.set(.25);
     startScene.addChild(directions);


         //shield charge ui
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

    shield4 =  PIXI.Sprite.from(app.loader.resources.shieldUI.url);
    shield4.x = shield3.x + sceneWidth/20;
    shield4.y = sceneHeight/10;
    shield4.scale.set(1.5);
    gameSceneUpdate.addChild(shield4);
 
 
    
    //sword charge ui
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

     sword4 =  PIXI.Sprite.from(app.loader.resources.swordUI.url);
     sword4.x = sword3.x + sceneWidth/20;
     sword4.y = sceneHeight/10;
     sword4.scale.set(2);
     gameSceneUpdate.addChild(sword4);


             //health charge to heal ui
             healthC1=  PIXI.Sprite.from(app.loader.resources.healthC.url);
             healthC1.x =sword1.x+ sword1.width/2;
             healthC1.y = sword1.y + sceneHeight/9;
             healthC1.width = healthC1.width * 2/3;
             gameSceneUpdate.addChild(healthC1);
     
             healthC2=  PIXI.Sprite.from(app.loader.resources.healthC1.url);
             healthC2.x = sword1.x+ sword1.width/2;
             healthC2.y = sword1.y + sceneHeight/9;
             healthC2.width = healthC2.width * 2/3;
             gameSceneUpdate.addChild(healthC2);
     
             healthC3=  PIXI.Sprite.from(app.loader.resources.healthC2.url);
             healthC3.x = sword1.x+ sword1.width/2;
             healthC3.y = sword1.y + sceneHeight/9;
             healthC3.width = healthC3.width * 2/3;
             gameSceneUpdate.addChild(healthC3);
     
             healthC4=  PIXI.Sprite.from(app.loader.resources.healthC3.url);
             healthC4.x = sword1.x + sword1.width/2;
             healthC4.y = sword1.y + sceneHeight/9;
             healthC4.width = healthC4.width * 2/3;
             gameSceneUpdate.addChild(healthC4);
     
             healthC5=  PIXI.Sprite.from(app.loader.resources.healthC4.url);
             healthC5.x = sword1.x+ sword1.width/2;
             healthC5.y = sword1.y + sceneHeight/9;
             healthC5.width = healthC5.width * 2/3;
             gameSceneUpdate.addChild(healthC5);
       
             //health  ui
        health1=  PIXI.Sprite.from(app.loader.resources.healthUI.url);
        health1.x = sword1.x
        health1.y = sword1.y + sceneHeight/10;
        health1.scale.set(3);
        gameSceneUpdate.addChild(health1);

        health2=  PIXI.Sprite.from(app.loader.resources.healthUI2.url);
        health2.x = sword1.x
        health2.y = sword1.y + sceneHeight/10;
        health2.scale.set(3);
        gameSceneUpdate.addChild(health2);

        health3=  PIXI.Sprite.from(app.loader.resources.healthUI3.url);
        health3.x = sword1.x
        health3.y = sword1.y + sceneHeight/10;
        health3.scale.set(3);
        gameSceneUpdate.addChild(health3);

        health4=  PIXI.Sprite.from(app.loader.resources.healthUI4.url);
        health4.x = sword1.x
        health4.y = sword1.y + sceneHeight/10;
        health4.scale.set(3);
        gameSceneUpdate.addChild(health4);

        health5=  PIXI.Sprite.from(app.loader.resources.healthUI5.url);
        health5.x = sword1.x
        health5.y = sword1.y + sceneHeight/10;
        health5.scale.set(3);
        gameSceneUpdate.addChild(health5);


        //score
        endScore = new PIXI.Text();
        endScore.style = style;
        endScore.x = sceneWidth / 2;
        endScore.y =  240;
        endScene.addChild(endScore);
   

   

     //make score label
    scoreText= new PIXI.Text();
    scoreText.style.fill = 0xADD8E6;
    scoreText.style = style;
    scoreText.x = sword1.x;
    scoreText.y = 10;
    gameSceneUpdate.addChild(scoreText);
    increaseScoreBy(0);


    //game over
    let endMessage = new PIXI.Text("YOU DIED!");
     endMessage.style = headStyle;
     endMessage.x = sceneWidth / 2 - endMessage.width / 2;
     endMessage.y = 125;
     endScene.addChild(endMessage);

     let instructionsEnd = new PIXI.Text("Click Here to Begin Anew!");
     instructionsEnd.style = style
     instructionsEnd.x = sceneWidth / 2 - instructionsEnd.width / 2;
     instructionsEnd.y = 200 + endMessage.y;
     instructionsEnd.interactive = true;
     instructions.buttonMode = true;
     instructionsEnd.on("pointerup",startGame);
     instructionsEnd.on('pointerover', e=>e.target.alpha =.7);
     instructionsEnd.on('pointerout', e=>e.currentTarget.alpha = .9);

     endScene.addChild(instructionsEnd);


}

//adds to the score
function increaseScoreBy(value){
    score += value;
    scoreText.text = `Score:${Math.floor(score)}`;
    endScore.text = `Final Score: ${Math.floor(score)}`;
    endScore.x = sceneWidth / 2 - endScore.width/2;

}




//update the labels and ui elements per player action and health
function updateButtonsAndText(){
    //this is not as complicated as it seems
    sword1.visible = false;
    if(player.charges >= 1){
        sword1.visible = true;
        sword2.visible = false;
        sword3.visible = false;
        sword4.visible = false;
        if(player.charges >=2){
            sword1.visible = true;
            sword2.visible = true;
            if(player.charges >= 3){
               sword3.visible = true;
               if(player.charges >= 4){
                sword4.visible = true;
             }
            }
        }
    }
    //update shield visibility
    shield1.visible = false;
    if(player.shieldCharge >= 2){
        shield1.visible = true;
        shield2.visible = false;
        shield3.visible = false;
        shield4.visible = false;
        if(player.shieldCharge >=4){
            shield2.visible = true;
            if(player.shieldCharge >= 6){
               shield3.visible = true;
               if(player.shieldCharge >=8){
                shield4.visible = true;
               }
            }
        }
    }

    //update health sprite
    if(player.healTimetoNext >40){
        health1.visible = true;
        health2.visible = false;
        health3.visible = false;
        health4.visible = false;
        health5.visible = false;
    }
    else if (player.healTimetoNext >30){
        health1.visible = false;
        health2.visible = true;
        health3.visible = false;
        health4.visible = false;
        health5.visible = false;
    }
    else if (player.healTimetoNext >20){
        health1.visible = false;
        health2.visible = false;
        health3.visible = true;
        health4.visible = false;
        health5.visible = false;
    }
    else if (player.healTimetoNext >10){
        health1.visible = false;
        health2.visible = false;
        health3.visible = false;
        health4.visible = true;
        health5.visible = false;
    }
    else if (player.healTimetoNext >0){
        health1.visible = false;
        health2.visible = false;
        health3.visible = false;
        health4.visible = false;
        health5.visible = true;
    }

    //update the healing charge sprite
  
    if (player.health == 5){
        healthC1.visible = false;
        healthC2.visible = false;
        healthC3.visible = false;
        healthC4.visible = false;
        healthC5.visible = true;
    }
    else if(player.health == 4){
        healthC1.visible = true;
        healthC2.visible = false;
        healthC3.visible = false;
        healthC4.visible = true;
        healthC5.visible = false;
    }
    else if (player.health == 3){
        healthC1.visible = false;
        healthC2.visible = false;
        healthC3.visible = true;
        healthC4.visible = false;
        healthC5.visible = false;
    }
    else if (player.health == 2){
        healthC1.visible = false;
        healthC2.visible = true;
        healthC3.visible = false;
        healthC4.visible = false;
        healthC5.visible = false;
    }
    else if (player.health == 1){
        healthC1.visible = true;
        healthC2.visible = false;
        healthC3.visible = false;
        healthC4.visible = false;
        healthC5.visible = false;
    }
}

//check inputs
window.onkeyup = (e) => {
    keys[e.keyCode] = false;
    e.preventDefault();

    let c= String.fromCharCode(e.keyCode);//for the letters

    if (c == "a" || c == "A") {
        keys[keyboard.LEFT] = false;
    }
    if (c == "d" || c == "D") {
        keys[keyboard.RIGHT] = false;
    }
    if (e.keyCode == 32) {
        keys[keyboard.SPACE] = false;
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
    if(c == "W" || c == "w"){
        keys[keyboard.W] = false;
    }
};

//pressed
window.onkeydown = (e) => {
    keys[e.keyCode] = true;
    e.preventDefault();

    let c = String.fromCharCode(e.keyCode);

    if (c == "a" || c == "A") {
        keys[keyboard.LEFT] = true;
    }
    if (c == "d" || c == "D") {
        keys[keyboard.RIGHT] = true;
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
    if(c == "W" || c == "w"){
        keys[keyboard.W] = true;
    }

};
