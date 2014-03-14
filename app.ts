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

    constructor() {
        this.posX = 0;
        this.posY = 0;
        this.min = 20;
        this.max = 20;

        this.enemyCollection = [];
        this.enemyLimit = 30; //number of enemies allowed
        this.enemyDelay = 0; //iterations between generating new enemy

        this.canvasWidth = 900;
        this.canvasHeight = 500;

        this.globalData = new GlobalData();
        this.globalData.entities = [];
        this.globalData.newEntities = [];
        this.globalData.rocketEntites = [];

        this.playerShip = new PlayerShip(0, 0);
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
        var rocket = new PlayerRocket(this.playerShip.getPosX() + 10, this.playerShip.getPosY());
        this.globalData.rocketEntites.push(rocket);
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

        this.playerShip.draw(this.context);

        // Check expired
        for (i = this.globalData.entities.length - 1; i >= 0; i--) {
            if (this.globalData.entities[i].getPosY() >= 500) {
                this.globalData.entities.splice(i, 1);
                //console.log(this.globalData.entities[i].getPosY());
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

class PlayerShip implements IDrawable {
    
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

    constructor(posX: number, posY: number) {
        this.playerPosX = posX;
        this.playerPosY = posY;

        this.playerWidth = 40;
        this.playerHeight = 40;

        this.playerSpeed = 5;
        this.playerIsDead = false;
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

}

class Enemy implements IEnemey, IDrawable {

    private enemyWidth: number;
    private enemyHeight: number;
    private speed: number;
    private enemyPosX: number;
    public enemyPosY: number;
    public enemyIsDead: boolean;

    constructor(posX: number, posY: number, enemySize: number, speed: number) {
        this.enemyPosX = posX;
        this.enemyPosY = posY;

        this.enemyHeight = enemySize;
        this.enemyWidth = enemySize;
        
        this.speed = speed;
        this.enemyIsDead = false;
    }

    draw(context: CanvasRenderingContext2D) {
        var image = new Image();
        var descentY = this.enemyPosY++ * this.speed;
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

}

class PlayerRocket implements IDrawable {

    private rocketPosX: number;
    private rocketPosY: number;
    private rocketSpeed: number;
    private rocketWidth: number;
    private rocketHeight: number;
    private rocketIsDead: boolean;

    constructor(posX: number, posY: number) {
        this.rocketHeight = 20;
        this.rocketWidth = 20;
        this.rocketSpeed = 4;
        this.rocketIsDead = false;
        this.rocketPosX = posX;
        this.rocketPosY = posY;
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

}

class EnemyFactory
{
    createRandomEnemy() {
        var randomX = Math.floor(Math.random() * 800) + 1;
        var size = Math.floor(Math.random() * 40) + 20;

        var speed = Math.floor(Math.random() * 3) + 1;
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

window.onload = () => {

    var game = new Game();

    document.onkeydown = checkKey;
    document.onkeyup = checkUpKey;

    function checkKey(e) {
        e = e || window.event;

        if (e.keyCode == 37) game.playerShip.setMoveLeft(true);
        if (e.keyCode == 38) game.playerShip.setMoveUp(true);
        if (e.keyCode == 39) game.playerShip.setMoveRight(true);
        if (e.keyCode == 40) game.playerShip.setMoveDown(true);

        if (e.keyCode == 32) game.shoot();
    }


    function checkUpKey(e) {
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