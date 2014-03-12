class GlobalData {
    entities: IDrawable[];
    newEntities: IDrawable[];
}

class Game {

    context: CanvasRenderingContext2D;
    image: HTMLImageElement;
    canvasId: string;
    min: number;
    max: number;
    posX: number;
    posY: number;
    enemyDelay: number;
    private enemyLimit: number;
    enemy: IEnemey;
    enemyCollection: IEnemey[];
    globalData: GlobalData;

    constructor() {
        this.posX = 0;
        this.posY = 0;
        this.min = 20;
        this.max = 20;

        this.enemyCollection = [];
        this.enemyLimit = 20;
        this.enemyDelay = 0;

        this.globalData = new GlobalData();
        this.globalData.entities = [];
        this.globalData.newEntities = [];
    }

    public step() {

        /*this.enemyCollection = this.enemyCollection.filter(function (enemy) {
            var item = <Enemy> enemy;
            if (item.enemyPosY >= 300) {

                return false;
            }
            return true;
        });*/


        var enemyFactory = new EnemyFactory();

        this.enemyDelay++;
        if (this.globalData.entities.length <= this.enemyLimit) {
            if (this.enemyDelay >= 40) {
                this.globalData.entities.push(enemyFactory.createEnemy());
                this.enemyDelay = 0;
            }
        }
    }

    public update() {

    }

    public draw() {

        var appCanvas = <HTMLCanvasElement> document.getElementById('game_canvas');
        this.context = appCanvas.getContext("2d");

        this.context.globalCompositeOperation = 'destination-over';
        this.context.clearRect(0, 0, 900, 500); // clear canvas

        this.context.fillStyle = 'rgba(0,0,0,0.4)';
        this.context.strokeStyle = 'rgba(0,153,255,0.4)';
        this.context.save();

        this.context.fillStyle = "rgb(200,0,0)";
        this.context.fillRect(this.posX * 10, this.posY * 10, this.min, this.max);

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
    }

}

class Enemy implements IEnemey, IDrawable {

    private enemyWidth: number;
    private enemyHeight: number;
    private speed: number;
    private enemyPosX: number;
    public enemyPosY: number;
    public enemyIsDead: boolean;

    constructor(posX: number, posY: number, enemySize: number) {
        this.enemyPosX = posX;
        this.enemyPosY = posY;

        this.enemyHeight = enemySize;
        this.enemyWidth = enemySize;
        
        this.speed = Math.floor(Math.random() * 4) + 1;
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

class EnemyFactory
{
    createEnemy() {
        var randomX = Math.floor(Math.random() * 800) + 1;
        var size = Math.floor(Math.random() * 40) + 20;
        return new Enemy(randomX, -40, size);
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

    function checkKey(e) {
        e = e || window.event;

        if (e.keyCode == 37) game.posX--;
        if (e.keyCode == 38) game.posY--;
        if (e.keyCode == 39) game.posX++;
        if (e.keyCode == 40) game.posY++;
    }

    (function gameloop() {

        // stats.update();
        game.step();
        game.update();
        game.draw();

        window.requestAnimationFrame(gameloop);
    })();

};