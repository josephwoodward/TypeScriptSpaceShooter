class Enemy implements IEnemy, IDrawable, ICollidable {
    
    /* http://www.developer.com/lang/top-10-things-to-know-about-typescript.html */

    private enemyWidth: number;
    private enemyHeight: number;
    private speed: number;
    private enemyPosX: number;
    private enemyPosY: number;
    private enemyIsDead: boolean;
    private enemySize: number;
    private sprite: string;
    private enemyHealth: number = 100;
    private explosionIterator: number = 1;
    private explosionDelay: number = 0;

    constructor(posX: number, posY: number, enemySize: number, speed: number, sprite: string) {
        this.enemyPosX = posX;
        this.enemyPosY = posY;

        this.enemySize = enemySize;
        this.enemyHeight = enemySize;
        this.enemyWidth = enemySize;

        this.sprite = sprite;
        this.speed = speed;
    }

    draw(context: CanvasRenderingContext2D) {
        var image = <HTMLImageElement> new Image();
        var descentY = (this.enemyPosY++) + this.speed;
        this.enemyPosY = descentY;

        if (this.enemyIsDead) {
            if (this.explosionIterator <= 9 && this.explosionDelay == 4) {
                this.explosionIterator++;
                this.explosionDelay = 0;
                this.sprite = "sprites/explode_" + this.explosionIterator + ".png";
            } else {
                this.explosionDelay++;
            }
        }

        image.src = this.sprite;
        context.drawImage(image, this.enemyPosX, descentY, this.enemyWidth, this.enemyHeight);
    }

    getSpeed() {
        return this.speed;
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

    getDamageDelivered() {
        return 100;
    }

} 