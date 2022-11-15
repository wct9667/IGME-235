//player class
class Player extends PIXI.AnimatedSprite{
    //constructor
    constructor(animations, x = 300, y = 600){
        super(animations.idle)
        this.anchor.set(.5,.5);
        this.animations = animations;
        this.scale.set(1.5);

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

    playerUpdate(dt){
        
        // Reset x speed each frame
        this.dx = 0;

        //switch for state
        switch(this.state){
            case "idle":


                if(keys[keyboard.SPACE]){
                    this.rng = Math.floor(Math.random() * 3);

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
                this.scale.x = 1.5;

                //breaks out

                if (keys[keyboard.LEFT] && !keys[keyboard.RIGHT]){
                this.state = "runLeft";
                this.textures = this.animations.run;
                }
                else if(!keys[keyboard.RIGHT]){
                    this.state = "idle";
                    this.textures = this.animations.idle;
                }

                break;




            case "runLeft":
                this.scale.x = -1.5;
                this.dx -= 200;

                if(keys[keyboard.RIGHT] && !keys[keyboard.LEFT]){
                    this.state = "runRight";
                    this.textures = this.animations.run;
                }
                else if(!keys[keyboard.LEFT]){
                    this.state = "idle";
                    this.textures = this.animations.idle;
                }

                break;

            case "attack":
                this.attackTime += dt;
                
                if(this.rng == 0){
                    if(this.attackTime >= this.animationSpeed * 4.4){
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
                
        }

        this.play();

      

       this.x += this.dx * dt;
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

