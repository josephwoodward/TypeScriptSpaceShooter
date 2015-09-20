/// <reference path="Interfaces.ts"/>
var PlayerShip = (function () {
    function PlayerShip(posX, posY) {
        this.explosionIterator = 1;
        this.explosionDelay = 0;
        this.sprite = "./sprites/spaceship.png";
        this.playerPosX = posX;
        this.playerPosY = posY;
        this.playerWidth = 40;
        this.playerHeight = 40;
        this.playerSpeed = 6;
        this.playerIsDead = false;
        this.playerHealth = 100;
    }
    PlayerShip.prototype.draw = function (context) {
        var image = new Image();
        if (this.playerIsDead) {
            if (this.explosionIterator <= 9 && this.explosionDelay == 4) {
                this.explosionIterator++;
                this.explosionDelay = 0;
                this.sprite = "./sprites/explode_" + this.explosionIterator + ".png";
            }
            else {
                this.explosionDelay++;
            }
        }
        image.src = this.sprite;
        context.drawImage(image, this.playerPosX, this.playerPosY, this.playerWidth, this.playerHeight);
    };
    PlayerShip.prototype.isDead = function () {
        return this.playerIsDead;
    };
    PlayerShip.prototype.getPosX = function () {
        return this.playerPosX;
    };
    PlayerShip.prototype.getPosY = function () {
        return this.playerPosY;
    };
    PlayerShip.prototype.moveLeft = function () {
        if (this.playerPosX < -(this.playerWidth)) {
            this.playerPosX = 900;
        }
        else {
            this.playerPosX -= this.playerSpeed;
        }
    };
    PlayerShip.prototype.moveRight = function () {
        if (this.playerPosX >= 890) {
            this.playerPosX = -(this.playerWidth);
        }
        else {
            this.playerPosX += this.playerSpeed;
        }
    };
    PlayerShip.prototype.moveUp = function () {
        if (this.playerPosY <= -(this.playerHeight)) {
            this.playerPosY = 500;
        }
        else {
            this.playerPosY -= this.playerSpeed;
        }
    };
    PlayerShip.prototype.moveDown = function () {
        if (this.playerPosY >= (500 + (this.playerHeight / 2))) {
            this.playerPosY = -(this.playerHeight - 5);
        }
        else {
            this.playerPosY += this.playerSpeed;
        }
    };
    PlayerShip.prototype.moveStop = function () {
        this.movingUp = false;
        this.movingDown = false;
        this.movingRight = false;
        this.movingLeft = false;
    };
    PlayerShip.prototype.setMoveLeft = function (moveLeft) {
        this.movingLeft = moveLeft;
    };
    PlayerShip.prototype.setMoveRight = function (moveRight) {
        this.movingRight = moveRight;
    };
    PlayerShip.prototype.setMoveUp = function (moveUp) {
        this.movingUp = moveUp;
    };
    PlayerShip.prototype.setMoveDown = function (moveDown) {
        this.movingDown = moveDown;
    };
    PlayerShip.prototype.getWidth = function () {
        return this.playerWidth;
    };
    PlayerShip.prototype.getHeight = function () {
        return this.playerHeight;
    };
    PlayerShip.prototype.takeDamage = function () {
        this.playerHealth -= 20;
        this.playerIsDead = (this.playerHealth <= 0);
    };
    PlayerShip.prototype.getHealth = function () {
        return this.playerHealth;
    };
    return PlayerShip;
})();
//# sourceMappingURL=Player.js.map