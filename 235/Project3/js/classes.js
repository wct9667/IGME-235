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
    }

    dx = 0;
    attackTime = 0;
    blockTime = 0;
    rollTime = 0;
    rollDirection = 0;
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
                else if (keys[keyboard.LEFT]){
                    this.state = "runLeft";
                    this.textures = this.animations.run;
                    }
                else if(keys[keyboard.RIGHT]){
                    this.state = "runRight";
                    this.textures = this.animations.run;
                }
                break;



            case "runRight":
                this.dx += 200;
                this.scale.x = 2.5;

                //breaks out

                if (keys[keyboard.LEFT] && !keys[keyboard.RIGHT]){
                this.state = "runLeft";
                this.textures = this.animations.run;
                }
                else if(!keys[keyboard.RIGHT]){
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
        if(this.y < 0){
            this.y = 0;
        }
        else if (this.y > this.screenHeight){
            this.y = 0;
        }

        /*if(this.x < this.radius || this.x > (window.innerWidth - this.radius)) {
			this.xSpeed *= -1;
        }
        
        if(this.y < this.radius || this.y > (window.innerHeight - this.radius)) {
			this.ySpeed *= -1;
        }*/

	}
  }

