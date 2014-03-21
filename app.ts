class GlobalData {
    enemies: IDrawable[];
    newEntities: IDrawable[];
    rockets: IDrawable[];
    expiring: IDrawable[];
}

class Game {

    context: CanvasRenderingContext2D;
    image: HTMLImageElement;
    canvasId: string;
    min: number;
    max: number;
    posX: number;
    posY: number;

    canvasWidth: number;
    canvasHeight: number;

    enemyDelay: number;
    private enemyLimit: number;
    enemy: IEnemey;
    enemyCollection: IEnemey[];
    globalData: GlobalData;
    playerShip: PlayerShip;
    collision: CollisionDetection;

    constructor() {
        this.posX = 0;
        this.posY = 0;
        this.min = 20;
        this.max = 20;

        this.enemyLimit = 2; //number of enemies allowed
        this.enemyDelay = 0; //iterations between generating new enemy

        this.canvasWidth = 900;
        this.canvasHeight = 500;

        this.globalData = new GlobalData();
        this.globalData.enemies = [];
        this.globalData.rockets = [];
        this.globalData.expiring = [];

        this.collision = new CollisionDetection();

        // Set player's starting position
        this.playerShip = new PlayerShip((this.canvasWidth / 2), this.canvasHeight - 100);
    }

    public step() {
        var enemyFactory = new EnemyFactory();
        this.enemyDelay++;
        if (this.globalData.enemies.length <= this.enemyLimit) {
            if (this.enemyDelay >= 40) {
                this.globalData.enemies.push(enemyFactory.createRandomEnemy());
                this.enemyDelay = 0;
            }
        }
    }

    public update() {

    }

    public shoot() {
        if (this.playerShip.isDead()) return;
        var rocket = new PlayerRocket(this.playerShip.getPosX() + 10, this.playerShip.getPosY());
        this.globalData.rockets.push(rocket);
    }

    public draw() {

        var appCanvas = <HTMLCanvasElement> document.getElementById('game_canvas');
        this.context = appCanvas.getContext("2d");

        this.context.globalCompositeOperation = 'destination-over';
        this.context.clearRect(0, 0, 900, 500); // clear canvas

        this.context.fillStyle = 'rgba(0,0,0,0.4)';
        this.context.strokeStyle = 'rgba(0,153,255,0.4)';
        this.context.save();

        if (this.playerShip.movingLeft) this.playerShip.moveLeft();
        if (this.playerShip.movingRight) this.playerShip.moveRight();
        if (this.playerShip.movingUp) this.playerShip.moveUp();
        if (this.playerShip.movingDown) this.playerShip.moveDown();

        if (!this.playerShip.isDead()) {
            this.playerShip.draw(this.context);    
        }

        this.collision.detectCollisions(this.globalData.rockets, this.globalData.enemies);

        this.collision.detectCollisionOnPoint(this.playerShip, this.globalData.enemies);

        var i;

        // Check expired
        for (i = this.globalData.enemies.length - 1; i >= 0; i--) {
            if (this.globalData.enemies[i].getPosY() >= 500 || this.globalData.enemies[i].getPosY() <= -100) {
                this.globalData.enemies.splice(i, 1);
            }
        }

        // Remove dead entities
        for (i = this.globalData.enemies.length - 1; i >= 0; i--) {
            if (this.globalData.enemies[i].isDead()) {
                this.globalData.expiring.push(this.globalData.enemies[i]);
                this.globalData.enemies.splice(i, 1);
            }
        }
        for (i = this.globalData.rockets.length - 1; i >= 0; i--) {
            if (this.globalData.rockets[i].isDead()) {
                this.globalData.rockets.splice(i, 1);
            }
        }

        // Draw enemies
        var drawable;
        for (i = 0; i < this.globalData.enemies.length; i++) {
            drawable = <IDrawable> this.globalData.enemies[i];
            drawable.draw(this.context);
        }

        // Draw rockets
        for (i = 0; i < this.globalData.rockets.length; i++) {
            drawable = <PlayerRocket> this.globalData.rockets[i];
            if (!drawable.isDead()) {
                drawable.draw(this.context);                
            }
        }

        // Draw expiring
        for (i = 0; i < this.globalData.expiring.length; i++) {
            drawable = <IDrawable> this.globalData.expiring[i];
            drawable.draw(this.context);
        }

    }
}

class Enemy implements IEnemey, IDrawable, ICollidable {

    private enemyWidth: number;
    private enemyHeight: number;
    private speed: number;
    private enemyPosX: number;
    public enemyPosY: number;
    public enemyIsDead: boolean;
    public enemySize: number;
    public enemyHealth: number;
    private sprite: string;
    private transpareny: number;

    constructor(posX: number, posY: number, enemySize: number, speed: number) {
        this.enemyPosX = posX;
        this.enemyPosY = posY;

        this.enemySize = enemySize;
        this.enemyHeight = enemySize;
        this.enemyWidth = enemySize;
        this.enemyHealth = 100;
        this.transpareny = 0.9;
        
        this.speed = speed;
        this.sprite = 'http://opengameart.org/sites/default/files/explosion2.png';
    }

    draw(context: CanvasRenderingContext2D) {
        var image = <HTMLImageElement> new Image();
        var descentY = (this.enemyPosY++) + this.speed;
        this.enemyPosY = descentY;

        image.src = (this.enemyIsDead) ? this.sprite : 'http://silveiraneto.net/downloads/asteroid.png';

        if (this.enemyIsDead) {
            context.save();
            context.globalAlpha = this.transpareny--;
            context.drawImage(image, this.enemyPosX, descentY, this.enemyWidth, this.enemyHeight);
            context.restore();
        } else {
            context.drawImage(image, this.enemyPosX, descentY, this.enemyWidth, this.enemyHeight);    
        }


        
    }

    isDead() {
        return this.enemyIsDead;
    }

    getPosX() {
        return this.enemyPosX;
    }

    getPosY() {
        return this.enemyPosY;
    }
    
    getWidth() {
        return this.enemyWidth;
    }

    getHeight() {
        return this.enemyHeight;
    }

    takeDamage() {
        if (this.enemySize < 40) {
            this.enemyHealth = 0;
        } else {
            this.enemyHealth -= 50;
        }
        this.enemyIsDead = (this.enemyHealth <= 0);
    }

}

class PlayerRocket implements IDrawable, ICollidable {

    private rocketPosX: number;
    private rocketPosY: number;
    private rocketSpeed: number;
    private rocketWidth: number;
    private rocketHeight: number;
    private rocketHealth: number;
    private rocketIsDead: boolean;

    constructor(posX: number, posY: number) {
        this.rocketHeight = 20;
        this.rocketWidth = 20;
        this.rocketSpeed = 8;
        this.rocketPosX = posX;
        this.rocketPosY = posY;
        this.rocketHealth = 100;
    }

    draw(context: CanvasRenderingContext2D) {
        var image = new Image();
        this.rocketPosY = (this.rocketPosY--) - this.rocketSpeed;
        image.src = 'http://findicons.com/files/icons/1520/wallace_gromit/32/rocket.png';
        context.drawImage(image, this.rocketPosX, this.rocketPosY, this.rocketWidth, this.rocketHeight);
    }

    isDead() {
        return this.rocketIsDead;
    }

    getPosX() {
        return this.rocketPosX;
    }
    getPosY() {
        return this.rocketPosY;
    }

    getWidth() {
        return this.rocketWidth;
    }

    getHeight() {
        return this.rocketHeight;
    }
    
    takeDamage() {
        this.rocketIsDead = true;
    }

}

window.onload = () => {

    var game = new Game();

    document.onkeydown = keyDownCheck;
    document.onkeyup = keyUpCheck;
    //document.onkeypress = keyPressCheck;

    function keyDownCheck(e) {
        e = e || window.event;

        if (e.keyCode == 37) game.playerShip.setMoveLeft(true);
        if (e.keyCode == 38) game.playerShip.setMoveUp(true);
        if (e.keyCode == 39) game.playerShip.setMoveRight(true);
        if (e.keyCode == 40) game.playerShip.setMoveDown(true);
    }

    /*function keyPressCheck(e) {
        e = e || window.event;
        //if (e.keyCode == 32) game.shoot();
    }*/

    function keyUpCheck(e) {
        e = e || window.event;
        
        if (e.keyCode == 37) game.playerShip.setMoveLeft(false);
        if (e.keyCode == 38) game.playerShip.setMoveUp(false);
        if (e.keyCode == 39) game.playerShip.setMoveRight(false);
        if (e.keyCode == 40) game.playerShip.setMoveDown(false);

        if (e.keyCode == 32) game.shoot();
    }


    (function gameloop() {

        // stats.update();
        game.step();
        game.update();
        game.draw();

        window.requestAnimationFrame(gameloop);
    })();

};

/// <reference path="Collision.ts"/>
/// <reference path="Player.ts"/>
/// <reference path="EnemyFactory.ts"/>
/// <reference path="Interfaces.ts"/>