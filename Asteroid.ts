class Asteroid implements IEnemey, IDrawable, ICollidable {

    private enemyWidth: number;
    private enemyHeight: number;
    private speed: number;
    private enemyPosX: number;
    public enemyPosY: number;
    public enemyIsDead: boolean;
    public enemySize: number;
    public enemyHealth: number;
    private sprite: string;
    private iterate: number;
    private explosionSpeed: number;

    constructor(posX: number, posY: number, enemySize: number, speed: number) {
        this.enemyPosX = posX;
        this.enemyPosY = posY;

        this.enemySize = enemySize;
        this.enemyHeight = enemySize;
        this.enemyWidth = enemySize;
        this.enemyHealth = 100;

        this.speed = speed;
        this.sprite = 'http://silveiraneto.net/downloads/asteroid.png';
        this.iterate = 1;
        this.explosionSpeed = 0;
    }

    draw(context: CanvasRenderingContext2D) {
        var image = <HTMLImageElement> new Image();
        var descentY = (this.enemyPosY++) + this.speed;
        this.enemyPosY = descentY;

        if (this.enemyIsDead) {
            if (this.iterate <= 9 && this.explosionSpeed == 4) {
                this.iterate++;
                this.explosionSpeed = 0;
                this.sprite = "sprites/explode_" + this.iterate + ".png";
            } else {
                this.explosionSpeed++;
            }
        }

        image.src = this.sprite;

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
