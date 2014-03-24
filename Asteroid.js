var Asteroid = (function () {
    function Asteroid(posX, posY, enemySize, speed) {
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
    Asteroid.prototype.draw = function (context) {
        var image = new Image();
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
    };

    Asteroid.prototype.isDead = function () {
        return this.enemyIsDead;
    };

    Asteroid.prototype.getPosX = function () {
        return this.enemyPosX;
    };

    Asteroid.prototype.getPosY = function () {
        return this.enemyPosY;
    };

    Asteroid.prototype.getWidth = function () {
        return this.enemyWidth;
    };

    Asteroid.prototype.getHeight = function () {
        return this.enemyHeight;
    };

    Asteroid.prototype.takeDamage = function () {
        if (this.enemySize < 40) {
            this.enemyHealth = 0;
        } else {
            this.enemyHealth -= 50;
        }
        this.enemyIsDead = (this.enemyHealth <= 0);
    };
    return Asteroid;
})();
//# sourceMappingURL=Asteroid.js.map
