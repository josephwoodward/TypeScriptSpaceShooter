var Enemy = (function () {
    function Enemy(posX, posY, enemySize, speed, sprite) {
        this.enemyHealth = 100;
        this.explosionIterator = 1;
        this.explosionDelay = 0;
        this.enemyPosX = posX;
        this.enemyPosY = posY;

        this.enemySize = enemySize;
        this.enemyHeight = enemySize;
        this.enemyWidth = enemySize;

        this.sprite = sprite;
        this.speed = speed;
    }
    Enemy.prototype.draw = function (context) {
        var image = new Image();
        var descentY = (this.enemyPosY++) + this.speed;
        this.enemyPosY = descentY;

        if (this.enemyIsDead) {
            if (this.explosionIterator <= 9 && this.explosionDelay == 4) {
                this.explosionIterator++;
                this.explosionDelay = 0;
                this.sprite = "/sprites/explode_" + this.explosionIterator + ".png";
            } else {
                this.explosionDelay++;
            }
        }

        image.src = this.sprite;
        context.drawImage(image, this.enemyPosX, descentY, this.enemyWidth, this.enemyHeight);
    };

    Enemy.prototype.getSpeed = function () {
        return this.speed;
    };

    Enemy.prototype.isDead = function () {
        return this.enemyIsDead;
    };

    Enemy.prototype.getPosX = function () {
        return this.enemyPosX;
    };

    Enemy.prototype.getPosY = function () {
        return this.enemyPosY;
    };

    Enemy.prototype.getWidth = function () {
        return this.enemyWidth;
    };

    Enemy.prototype.getHeight = function () {
        return this.enemyHeight;
    };

    Enemy.prototype.takeDamage = function () {
        if (this.enemySize < 40) {
            this.enemyHealth = 0;
        } else {
            this.enemyHealth -= 50;
        }
        this.enemyIsDead = (this.enemyHealth <= 0);
    };

    Enemy.prototype.getDamageDelivered = function () {
        return 100;
    };
    return Enemy;
})();
//# sourceMappingURL=Enemy.js.map
