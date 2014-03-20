class GlobalData {
    entities: IDrawable[];
    newEntities: IDrawable[];
    rocketEntites: IDrawable[];
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

        this.enemyCollection = [];
        this.enemyLimit = 20; //number of enemies allowed
        this.enemyDelay = 0; //iterations between generating new enemy

        this.canvasWidth = 900;
        this.canvasHeight = 500;

        this.globalData = new GlobalData();
        this.globalData.entities = [];
        this.globalData.newEntities = [];
        this.globalData.rocketEntites = [];

        // Set player's starting position
        this.playerShip = new PlayerShip((this.canvasWidth / 2), this.canvasHeight - 100);
        this.globalData.entities.push(this.playerShip);

        this.collision = new CollisionDetection();
    }

    public step() {
        var enemyFactory = new EnemyFactory();
        this.enemyDelay++;
        if (this.globalData.entities.length <= this.enemyLimit) {
            if (this.enemyDelay >= 40) {
                this.globalData.entities.push(enemyFactory.createRandomEnemy());
                this.enemyDelay = 0;
            }
        }
    }

    public update() {

    }

    public shoot() {
        if (this.playerShip.isDead()) return;
        var rocket = new PlayerRocket(this.playerShip.getPosX() + 6, this.playerShip.getPosY() - 30);
        this.globalData.entities.push(rocket);
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

        //this.playerShip.draw(this.context);

        this.collision.detectCollisions(this.globalData.entities);

        //this.collision.rocketCollision(this.globalData.rocketEntites);

        /*for (var i = 0; i < this.globalData.rocketEntites.length; i++) {
            var rocket = this.globalData.rocketEntites[i];
            
        }*/



        // Check expired
        for (i = this.globalData.entities.length - 1; i >= 0; i--) {
            if (this.globalData.entities[i].getPosY() >= 500 || this.globalData.entities[i].getPosY() <= -100) {
                this.globalData.entities.splice(i, 1);
            }
        }

        // Remove dead entities
        for (i = this.globalData.entities.length - 1; i >= 0; i--) {
            if (this.globalData.entities[i].isDead()) {
                this.globalData.entities.splice(i, 1);
            }
        }

        // Draw entities
        for (var i = 0; i < this.globalData.entities.length; i++) {
            var drawable = <IDrawable> this.globalData.entities[i];
            drawable.draw(this.context);
        }

        // Draw rockets
        for (var i = 0; i < this.globalData.rocketEntites.length; i++) {
            var drawable = <IDrawable> this.globalData.rocketEntites[i];
            drawable.draw(this.context);
        }

    }

}

class CollisionDetection
{
    //collidables: ICollidable[];

    detectCollisions(collidables) {

        for (var i = 0; i < collidables.length; i++) {
            var entityA = <ICollidable> collidables[i];

            for (var j = i + 1; j < collidables.length; j++) {
                var entityB = <ICollidable> collidables[j];
                /*if (!entityB.canCollide() || entityB.isDead()) {
                    continue;
                }*/

                if (this.isColliding(entityA, entityB)) {
                    //console.log(entityA + " and " + entityB);
                    entityA.takeDamage();
                    entityB.takeDamage();
                }
            }
        }
    }

    isColliding(entityA: ICollidable, entityB: ICollidable) {
        var widthA = entityA.getWidth();
        var heightA = entityA.getHeight();
        var widthB = entityB.getWidth();
        var heightB = entityB.getHeight();

        var leftA = entityA.getPosX() - (widthA / 2);
        var topA = entityA.getPosY() - (heightA / 2);
        var leftB = entityB.getPosX() - (widthB / 2);
        var topB = entityB.getPosY() - (heightB / 2);

        if (leftA < leftB + widthB &&
            leftA + widthA > leftB &&
            topA < topB + heightB &&
            topA + heightA > topB) {
            return true;
        }
        return false;

    }

}

class PlayerShip implements IDrawable, ICollidable {
    
    public playerPosX: number;
    public playerPosY: number;
    public playerCenter: number;
    public playerSpeed: number;
    public playerIsDead: boolean;

    public movingLeft: boolean;
    public movingRight: boolean;
    public movingUp: boolean;
    public movingDown: boolean;

    public playerWidth: number;
    public playerHeight: number;

    private playerHealth: number;

    constructor(posX: number, posY: number) {
        this.playerPosX = posX;
        this.playerPosY = posY;

        this.playerWidth = 40;
        this.playerHeight = 40;

        this.playerSpeed = 6;
        this.playerIsDead = false;
        this.playerHealth = 100;
    }

    draw(context: CanvasRenderingContext2D) {
        var image = new Image();
        image.src = 'http://www.pixeljoint.com/files/icons/spaceship1_final.png';
        context.drawImage(image, this.playerPosX, this.playerPosY, this.playerWidth, this.playerHeight);
    }

    isDead() {
        return this.playerIsDead;
    }

    getPosX() {
        return this.playerPosX;
    }

    getPosY() {
        return this.playerPosY;
    }

    moveLeft() {
        if (this.playerPosX < -(this.playerWidth)) {
            this.playerPosX = 900;
        } else {
            this.playerPosX -= this.playerSpeed;
        }
    }

    moveRight() {
        if (this.playerPosX >= 890) {
            this.playerPosX = -(this.playerWidth);
        } else {
            this.playerPosX += this.playerSpeed;
        }
    }

    moveUp() {
        if (this.playerPosY <= -(this.playerHeight)) {
            this.playerPosY = 500;
        } else {
            this.playerPosY -= this.playerSpeed;
        }
    }

    moveDown() {
        if (this.playerPosY >= (500 + (this.playerHeight / 2))) {
            this.playerPosY = -(this.playerHeight - 5);
        } else {
            this.playerPosY += this.playerSpeed;
        }
    }

    setMoveLeft(moveLeft: boolean) {
        this.movingLeft = moveLeft;
    }

    setMoveRight(moveRight: boolean) {
        this.movingRight = moveRight;
    }

    setMoveUp(moveUp: boolean) {
        this.movingUp = moveUp;
    }

    setMoveDown(moveDown: boolean) {
        this.movingDown = moveDown;
    }

    getWidth() {
        return this.playerWidth;
    }

    getHeight() {
        return this.playerHeight;
    }

    takeDamage() {
        this.playerHealth -= 20;
        console.log("here" + this.playerHealth);
        this.playerIsDead = (this.playerHealth <= 0);
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

    constructor(posX: number, posY: number, enemySize: number, speed: number) {
        this.enemyPosX = posX;
        this.enemyPosY = posY;

        this.enemySize = enemySize;
        this.enemyHeight = enemySize;
        this.enemyWidth = enemySize;
        this.enemyHealth = 100;
        
        this.speed = speed;
    }

    draw(context: CanvasRenderingContext2D) {
        var image = new Image();
        var descentY = (this.enemyPosY++) + this.speed;
        this.enemyPosY = descentY;
        image.src = 'http://silveiraneto.net/downloads/asteroid.png';
        context.drawImage(image, this.enemyPosX, descentY, this.enemyWidth, this.enemyHeight);
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

class EnemyFactory
{
    createRandomEnemy() {
        var randomX = Math.floor(Math.random() * 800) + 1;
        var size = Math.floor(Math.random() * 40) + 20;

        var speed = Math.floor(Math.random() * 2) + 1;
        /*if (size >= 25) {
            speed = Math.floor(Math.random() * 1) + 1;
        }*/

        return new Enemy(randomX, -40, size, speed);
    }    
}
 
interface IEnemey {

}

interface IDrawable {
    isDead(): boolean;
    getPosX(): number;
    getPosY(): number;
    draw(context: CanvasRenderingContext2D);
}

interface ICollidable {
    getWidth();
    getHeight();
    getPosX();
    getPosY();
    takeDamage();
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