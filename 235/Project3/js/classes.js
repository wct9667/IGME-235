//player class
class Player extends PIXI.AnimatedSprite{
    //constructor
    constructor(animations, x = 400, y = 600){
        super(animations.idle)
        this.anchor.set(.5,.5);
        this.animations = animations;
        this.scale.set(2.5);

        this.animationSpeed = 0.15;
        this.loop = true;
        this.x = x;
        this.y = y;
        this.frameNumber = 1;
        this.state = "idle";
        this.rng =  Math.floor(Math.random() * 3);
        this.hitBoxRadius = 70;
        this.attack3Rad = 300;
        this.attackRadius = 100;
        this.health = 2;



    }

    dx = 0;
    attackTime = 0;
    blockTime = 0;
    rollTime = 0;
    immunity = 0;
    rollDirection = 0;

    hurt(){
        this.health--;
        if(this.health <= 0){
            this.textures = this.animations.hurt;
            this.state = "hurt";
        }
        else{
            this.state = "death";
            this.textures = this.animations.death;
        }
    }
    playerUpdate(dt){

        // Reset x speed each frame
        this.dx = 0;

        //switch for state machine, lots of states
        switch(this.state){
            case "idle":


                if(keys[keyboard.SPACE]){
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

                    console.log(this.rng);

                    this.state = "attack";

                    if(this.rng == 0){
                        this.textures = this.animations.attack1;
                    }
                    else if(this.rng == 1){
                        this.textures = this.animations.attack2;
                    }
                    else{
                        this.textures = this.animations.attack3;
                    }
                    
                }
                else if (keys[keyboard.SHIFT]){
                    this.state = "shield";
                    this.textures = this.animations.shield;
                }
                /*
                else if (keys[keyboard.LEFT]){
                    this.state = "runLeft";
                    this.textures = this.animations.run;
                    }*/
                else if(keys[keyboard.RIGHT]){
                    this.state = "runRight";
                    this.textures = this.animations.run;
                }
                break;



            case "runRight":
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
                else if (keys[keyboard.R]){
                    this.state = "roll";
                    this.textures = this.animations.roll;
                    this.rollDirection = 200;
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
                else if (keys[keyboard.R]){
                    this.state = "roll";
                    this.textures = this.animations.roll;
                    this.rollDirection = -200;
                }


                break;

            case "attack":
                this.attackTime += dt;
                 
                if(this.rng == 0){
                    if(this.attackTime >= this.animationSpeed * 4.3){
                        this.attackTime = 0;
                        this.textures = this.animations.idle;
                        this.state = "idle"; 
                    } 
                }
                else if (this.rng == 1){
                    if(this.attackTime >= this.animationSpeed * 6  ){
                        this.attackTime = 0;
                        this.textures = this.animations.idle;
                        this.state = "idle"; 
                    } 
                }
                else{
                    if(this.attackTime >= this.animationSpeed * 7){
                        this.attackTime = 0;
                        this.textures = this.animations.idle;
                        this.state = "idle";                
                }
                }
                break;

            case "shield":

                this.blockTime += dt;

                this.loop = false;
                if(!keys[keyboard.SHIFT]){
                    this.blockTime = 0; 
                    this.textures = this.animations.idle;
                    this.state = "idle"; 
                    this.loop = true;
                }
                break;
            case "roll":
                this.loop = false;
                this.rollTime += dt;
                this.dx += this.rollDirection;

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
                if(this.immunity > 3 * this.animationSpeed){
                    this.loop = true;
                    if(this.textures != this.animations.idle)
                    this.textures = this.animations.idle;
                    if(this.immunity >= 10 * this.animationSpeed){
                        this.immunity = 0;

                        this.state = "idle";
                    }
                }
                break;


        }

        this.play();
      // this.x += this.dx * dt;
       // this.y += this.dy * dt;
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
	
	update(dt, xForce, yForce){
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
    constructor(animations, x = 400, y = 600){
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
        this.health =2;
    }

    hurt(){
        this.health--;
        if(this.health >  0){
            this.textures = this.animations.hurt;
            this.state = "hurt";
        }
        else{
            this.state = "death";
            this.textures = this.animations.hurt;
        }
    }

    dx = 0;
    immunity = 0;
    deathTime = 0;
    enemyUpdate(dt){  
        
        // Reset x speed each frame
        this.dx = 0;

        //switch for state machine, lots of states
        switch(this.state){
 
            case "runLeft":
                this.dx += -200;
                this.scale.x = -2.5;
                break;

            case "hurt":
                                         
                this.dx += this.dxs;                             
                this.loop = false;
                this.dxs += .2  ;
                this.immunity += dt;
                if(this.immunity > 4  * this.animationSpeed){


                    this.loop = true;
                    if(this.textures != this.animations.idle){
                        this.textures = this.animations.idle;
                    }
                    if(this.immunity >= 6 * this.animationSpeed){
                        this.immunity = 0;
                        this.dxs=1;
                        this.textures = this.animations.run;
                        this.state = "runLeft";
                    }
                    
                }
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
                    this.dx += -player.dx;
                    break;

        }
        // move enemy back to the right
        if(this.x < -1000){
            this.x = 1000;
            this.state = "runLeft";
            this.textures = this.animations.run;
            this.loop = true;
            this.health = 2; 
            this.deathTime = 0;
        }

        this.play();
       this.x += this.dx * dt;
    }
}

 