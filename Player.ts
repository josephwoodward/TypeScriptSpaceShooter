/// <reference path="Interfaces.ts"/>

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

    private explosionIterator: number = 1;
    private explosionDelay: number = 0;

    public playerWidth: number;
    public playerHeight: number;

    private playerHealth: number;

    /*private sprite: string = "http://www.pixeljoint.com/files/icons/spaceship1_final.png";*/
    private sprite: string = "./sprites/spaceship.png";

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

        if (this.playerIsDead) {
            if (this.explosionIterator <= 9 && this.explosionDelay == 4) {
                this.explosionIterator++;
                this.explosionDelay = 0;
                this.sprite = "./sprites/explode_" + this.explosionIterator + ".png";
            } else {
                this.explosionDelay++;
            }
        }

        image.src = this.sprite;
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

    moveStop() {
        this.movingUp = false;
        this.movingDown = false;
        this.movingRight = false;
        this.movingLeft = false;
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
        this.playerIsDead = (this.playerHealth <= 0);
    }

    getHealth() {
        return this.playerHealth;
    }
} 