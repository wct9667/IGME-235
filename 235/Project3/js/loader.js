WebFont.load({
    google: {
        families: ['MedievalSharp']
    },
    active: e => {
//load a bunch of assets
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
app.loader.add("runSpritesReverse", "images/playerAnimations/runLeft.png");
app.loader.add("attack1", "images/playerAnimations/attack1.png");
app.loader.add("attack2", "images/playerAnimations/attack2.png");
app.loader.add("attack3", "images/playerAnimations/attack3.png");
app.loader.add("shield", "images/playerAnimations/shield.png");
app.loader.add("roll", "images/playerAnimations/roll.png");
app.loader.add("hurt", "images/playerAnimations/hurt.png");
app.loader.add("death", "images/playerAnimations/death.png");
app.loader.add("heal", "images/playerAnimations/heal.png");

/////////////////////load sounds
//app.loader.add("idle",  "../sounds/playerAnimations/hurtEnemy.wav");
//app.loader.add("run",  "../sounds/playerAnimations/hurtEnemy.wav");
app.loader.add("attack1S",  "sounds/attack1.wav");
app.loader.add("attack2S",  "sounds/attack2.wav");
app.loader.add("attack3S",  "sounds/attack3.wav");
app.loader.add("deathS",  "sounds/death.wav");
app.loader.add("hurtS", "sounds/hurt.wav" );
app.loader.add("hurtEnemyS", "sounds/hurtEnemy.wav");
app.loader.add("foot1S", "sounds/foot1.wav" );
app.loader.add("foot2S", "sounds/foot2.wav");
app.loader.add("rollS", "sounds/roll.wav");
app.loader.add("healS", "sounds/heal.wav");
app.loader.add("blockS", "sounds/block.mp3");
app.loader.add("blockS3", "sounds/block3.mp3")
app.loader.add("guitar", "sounds/Guitar_instrumental.mp3");
app.loader.add("outdoorWinter", "sounds/outdoorWinter.mp3");
app.loader.add("deathTrack", "sounds/deathMusic.mp3");
/////////////////////////////ui
app.loader.add("swordUI", "images/ui/Sword.png");
app.loader.add("directionsUI", "images/ui/directions.png");
app.loader.add("shieldUI", "images/ui/Shield.png");
app.loader.add("healthUI", "images/ui/health/tile000.png");
app.loader.add("healthUI2", "images/ui/health/tile001.png");
app.loader.add("healthUI3", "images/ui/health/tile002.png");
app.loader.add("healthUI4", "images/ui/health/tile003.png");
app.loader.add("healthUI5", "images/ui/health/tile004.png");
app.loader.add("healthC", "images/ui/health/hCharge0.png");
app.loader.add("healthC1", "images/ui/health/hCharge1.png");
app.loader.add("healthC2", "images/ui/health/hCharge2.png");
app.loader.add("healthC3", "images/ui/health/hCharge3.png");
app.loader.add("healthC4", "images/ui/health/hCharge4.png");

app.loader.onComplete.add(setup);
app.loader.load();

    }
});