//player class
class Player extends PIXI.AnimatedSprite{
    //constructor
    constructor(animations, x = 400, y = 600, sounds){
        super(animations.idle)
        this.anchor.set(.5,.5);
        this.animations = animations;
        this.scale.set(2.5);
        this.sounds = sounds;
        this.animationSpeed = 0.15;
        this.loop = true;
        this.x = x;
        this.y = y;
        this.frameNumber = 1;
        this.state = "idle";
        this.rng =  Math.floor(Math.random() * 3);
        this.hitBoxRadius = 70;
        this.attack3Rad = 150;
        this.attackRadius = 125;
        this.health =5;


                                                    
    }

    chargeTime = 0;
    charges = 3;
    dx = 0;
    attackTime = 0;
    deathTime = 0;
    rollTime = 0;
    immunity = 0;
    runTime = 0;
    prevSound = 0;
    rollDirection = 0;
    shieldCharge = 6;

    //checks if the player can attack before attackinh
    attackCharge(){
        if(this.charges > 0){
            this.attack();
            this.charges -= 1;
            if(this,this.charges < 0){
                this.charges = 0;
            }
        }
    }

    //plays sounds and sets animations based on the player health
    hurt(){
        if(this.state != "roll"){
            this.health--;
            if(this.health > 0){
                this.sounds["hurt"].play();
                this.state = "hurt";
            }
            else{
                this.state = "death";
                this.sounds["death"].play();
            }
            this.textures = this.animations.hurt;
        }
    }
    //function that radnomizes the attack animation and sets a sound
    attack(){
        let x = Math.floor(Math.random() * 3);
        if(x == this.rng){
            this.rng += 1;
            if(this.rng > 2){
                this.rng = 0;
            }
        }
        else{
            this.rng = x;
        }
        this.state = "attack";

        if(this.rng == 0){
            this.sounds["attack1"].play();
            this.textures = this.animations.attack1;
        }
        else if(this.rng == 1){
            this.sounds["attack2"].play();
            this.textures = this.animations.attack2;
        }
        else{
            this.sounds["attack3"].play();
            this.textures = this.animations.attack3;
        }
        
    }
    //resets the player back to idle
    resetAttack(){
        this.attackTime = 0;
        this.animationSpeed = .15;
        this.loop = true;
        this.textures = this.animations.idle;
        this.state = "idle"; 
    }
    //set the player to a shield state if their charge is high enough
    shield(){

        if(this.shieldCharge >= 2){
            this.state = "shield";
            this.textures = this.animations.shield;
        }
    }
    //set the player to a roll state
    roll(){

        this.state = "roll";
        this.textures = this.animations.roll;
        this.rollDirection = 200;
        this.sounds["roll"].play();
    }
    //sets the player to a roll right state
    runRight(){
        this.state = "runRight";
        this.textures = this.animations.run;
    }
    //call in gameloop
    playerUpdate(dt){

        // Reset x speed each frame
        this.dx = 0;

        //add to the attack charge
        this.chargeTime += dt;
        if(this.chargeTime > 5){
            this.charges++;
            if(this.charges > 3) this.charges = 3;

            this.chargeTime = 0;
        }
        if(this.state != "shield") this.shieldCharge += .25 * dt;
        if(this.shieldCharge > 6) this.shieldCharge = 6;

        //switch for state machine, lots of states
        switch(this.state){
            case "idle":

 
                if(keys[keyboard.SPACE]){
                    this.attackCharge();
                }
                else if (keys[keyboard.SHIFT]){
                    this.shield();
                }
                /*
                else if (keys[keyboard.LEFT]){
                    this.state = "runLeft";
                    this.textures = this.animations.run;
                    }*/
                else if(keys[keyboard.RIGHT]){
                    this.runRight();
                }
                else if (keys[keyboard.S]){
                this.roll();
                }
                break;



            case "runRight":
                this.runTime += dt;
                if(this.runTime > .35){

                    if(this.prevSound == 0){
                        this.sounds["foot1"].play();
                        this.prevSound = 1;
                    }
                    else{
                        this.sounds["foot2"].play();
                        this.prevSound = 0;
                    }
                    this.runTime = 0;
                }
                this.dx += 200;
                this.scale.x = 2.5;

                //breaks out

                /*if (keys[keyboard.LEFT] && !keys[keyboard.RIGHT]){
                this.state = "runLeft";
                this.textures = this.animations.run;
                }*/
                 if(!keys[keyboard.RIGHT]){
                    this.state = "idle";
                    this.textures = this.animations.idle;
                }
                else if (keys[keyboard.S]){
                    this.roll();
                }
                else if(keys[keyboard.SPACE]){
                    this.attackCharge();
                }

                break;

            case "runLeft":
                this.scale.x = -2.5;
                this.dx -= 200;

                if(keys[keyboard.RIGHT] && !keys[keyboard.LEFT]){
                    this.state = "runRight";
                    this.textures = this.animations.run;
                }
                else if(!keys[keyboard.LEFT]){
                    this.state = "idle";
                    this.textures = this.animations.idle;
                }
                else if (keys[keyboard.S]){
                    this.state = "roll";
                    this.textures = this.animations.roll;
                    this.rollDirection = -200;
                }


                break;

            case "attack":
                this.attackTime += dt;
                 this.animationSpeed = .15;
                if(this.rng == 0){
                    if(this.attackTime >= this.animationSpeed * 4.3){
                        this.resetAttack();
                    } 
                }
                else if (this.rng == 1){
                    if(this.attackTime >= this.animationSpeed * 6  ){
                        this.resetAttack();
                    } 
                }
                else{
                    if(this.attackTime >= this.animationSpeed * 6.5){
                        this.resetAttack();              
                }
                }
                break;

            case "shield":

                this.shieldCharge -= dt;
                if(this.shieldCharge < 0) this.shieldCharge = 0;

                this.loop = false;
                if(!keys[keyboard.SHIFT] || this.shieldCharge <= 0){
                    this.textures = this.animations.idle;
                    this.state = "idle"; 
                    this.loop = true;
                }
                if (keys[keyboard.SPACE]){
                    this.attackCharge();
                }

                
                break;
            case "roll":
                this.loop = false;
                this.rollTime += dt;
                this.dx += this.rollDirection * 1.5;

                if(this.rollTime > 3.5 * this.animationSpeed){
                    this.rollTime = 0; 
                    this.textures = this.animations.idle;
                    this.state = "idle"; 
                    this.loop = true;
                }
            break;
            case "hurt":
                this.loop = false;
                this.immunity += dt;
                if (keys[keyboard.S]){
                    this.roll();
                }
                else if(this.immunity > 3 * this.animationSpeed){
                    this.loop = true;
                     if(keys[keyboard.SPACE]){
                        this.attackCharge();
                    }
                    else if(keys[keyboard.SHIFT]){
                        this.shield();
                    }
                    else if(this.textures != this.animations.idle)this.textures = this.animations.idle;
                    
                    if(this.immunity >= 5   * this.animationSpeed){
                        this.immunity = 0;

                        this.state = "idle";
                    }
                }
                break;
            case "death":
                this.deathTime += dt;
                this.loop = false;
                if(this.deathTime > 3  * this.animationSpeed){ 
                    this.textures = this.animations.death;
                    this.state = "dead";
                }
                break;
            case "dead":
                    break;




        }

        this.play();
        increaseScoreBy(this.dx/10000);
      // this.x += this.dx * dt;
    }
}



 // ES6 Particle Class, similar to the demo, but I changed it to add screenwrapping
 class Particle extends PIXI.Sprite{
	constructor(radius, x, y, xSpeed, ySpeed, screenWidth, screenHeight){
		super(particleTexture);
		this.x = x;
		this.y = y;
		this.anchor.set(.5,.5);
		this.width = radius*2;
 		this.height = radius*2;
		this.radius = radius;
		this.xSpeed = xSpeed;
		this.ySpeed = ySpeed;
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
	}
	time = 0;
    wind = 1;
	update(dt, xForce, yForce){
        this.time += dt;

        if(this.time >= 4){
            this.x +=   this.wind * this.xSpeed * dt;
            
            if(this.time > 6){
                this.wind -= 2 * dt;
            }
            else{
                this.wind += 2 * dt;
            }
            if(this.time > 8 ){
                this.time = 0;
                this.wind = 1;
            }
        }
		this.x += this.xSpeed * dt;
		this.y += this.ySpeed * dt;
        
        this.x += xForce;
        this.y += yForce;

        


        //wrap around the screen
        if(this.x > this.screenWidth){
            this.x = 0;
        }
        else if (this.x < 0){
            this.x = this.screenWidth;
        }
        if(this.y < 0 ||this.y > this.screenHeight ){
            this.y = 0;
        }
	}
  }


  
  class Enemy extends PIXI.AnimatedSprite{
    //constructor
    constructor(animations, x = 400, y = 600, sounds){
        super(animations.run)
        this.anchor.set(.5,.5);
        this.animations = animations;
        this.scale.set(2.5);
        this.animationSpeed = 0.15;
        this.loop = true;
        this.x = x;
        this.y = y;
        this.frameNumber = 1;
        this.state = "runLeft";
        this.radius = 70;
        this.dxs = 0;
        this.health = getRandom(0,2);
        console.log(this.health);
        this.sounds = sounds;
    }

    //sets the hurt state/check for death
    hurt(){
        this.health--;
        if(this.health >  0){
            this.textures = this.animations.hurt;
            this.state = "hurt";
            this.sounds["hurtEnemy"].play();
        }
        else{
            increaseScoreBy(100);
            this.state = "death";
            this.textures = this.animations.hurt;
            this.diff += .25;
            this.sounds["death"].play();
        }
    }

    //sets the blocked state
    blocked(move){
        if(move)
        this.x += 3;
            this.state = "blocked"
    }
    //sets the run state
    run(){
        if(this.textures != this.animations.run){
            this.loop = true;
            this.state = "runLeft";
            this.textures = this.animations.run;   
        }    
    }
    //sets the attack sound
    AttackSound(){
        if(!this.sounds["attack1"].isPlaying)
        this.sounds["attack1"].play();
    }

    dx = 0;
    immunity = 0;
    deathTime = 0;
    blockTime = 0;
    attackTime = 0;
    diff = 0;

    //sets attack state
    attack(){
        if(this.state != "attack"){
            this.state = "attack";
            this.textures = this.animations.attack1;
        }
    }
    //goes to idle animation but not state
    ToIdleAnim(){
        this.loop = true;
        this.textures = this.animations.idle;   
    }
    //does to idle state
    Idle(){

        this.loop = true;
        this.textures = this.animations.idle;   
        this.state = "idle"
    }
    enemyUpdate(dt){  
        
 
        // Reset x speed each frame
        this.dx = 0;
        this.attackTime += dt;

        //switch for state machine, lots of states
        switch(this.state){
 
            case "runLeft":
                this.dx += -200;
                this.dx -= player.dx;
                this.scale.x = -2.5;
                break;

            case "hurt":        
            this.dx -= player.dx;                
                this.loop = false;
                this.immunity += dt;
                if(this.immunity > 3 * this.animationSpeed){
                    this.loop = false;
                    if(this.textures != this.animations.idle)
                    this.textures = this.animations.idle;
                    if(this.immunity > 7  * this.animationSpeed){ 
                       this.run();
                        this.immunity = 0;
                    }
                }
                break; 
            case "temp":
                break
            case "attack":  
            this.loop = false;
            if(player.state == "roll"){
                this.dx -=  player.dx;
                this.loop = true;
            } 
            if(this.attackTime > 5* this.animationSpeed){               
                this.attackTime = 0; 
                this.loop = false;
                this.textures = this.animations.attack2;               
            }
            break;
        
            case "blocked":
                if(player.state == "roll"){
                    this.dx -= player.dx;
                    if(this.textures != this.animations.attack1) this.textures = this.animations.attack1, this.AttackSound();
                }                                               
                if(player.state != "roll" && player.state != "shield"){
                    this.run();
                }
                break; 

            case "idle":
        
                break;
            

            case "death":
                this.deathTime += dt;
                this.loop = false;
                if(this.deathTime > 3  * this.animationSpeed && this.deathTime < 4 * this.animationSpeed){ 
                    this.textures = this.animations.death;
                    this.state = "dead";
                }
                break;
                case "dead":
                    this.dx += - player.dx;
                    break;

        }
        // move enemy back to the right
        if(this.x < -1000){
            this.reset();
        }

        this.play();
       this.x += this.dx * dt;
    }
    reset(){
        this.x = getRandom(sceneWidth + 100, 100000);
        this.state = "runLeft";
        this.textures = this.animations.run;
        this.loop = true;
        this.health = getRandom(0,2 + this.diff)
        this.deathTime = 0;
    }
}

//health powerup class
class HealthKit extends PIXI.AnimatedSprite{
    constructor(animations,x,y){

        super(animations.idle)
        this.anchor.set(.5,.5);
        this.animations = animations;
        this.scale.set(2.5);
        this.animationSpeed = 0.15;
        this.loop = true;
        this.x = x;
        this.y = y;
        this.frameNumber = 1;
    }
}

 