var GlobalData = (function () {
    function GlobalData() {
    }
    return GlobalData;
})();

var Game = (function () {
    function Game() {
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

        this.collision = new CollisionDetection();

        // Set player's starting position
        this.playerShip = new PlayerShip((this.canvasWidth / 2), this.canvasHeight - 100);
    }
    Game.prototype.step = function () {
        var enemyFactory = new EnemyFactory();
        this.enemyDelay++;
        if (this.globalData.enemies.length <= this.enemyLimit) {
            if (this.enemyDelay >= 40) {
                this.globalData.enemies.push(enemyFactory.createRandomEnemy());
                this.enemyDelay = 0;
            }
        }
    };

    Game.prototype.update = function () {
    };

    Game.prototype.shoot = function () {
        if (this.playerShip.isDead())
            return;
        var rocket = new PlayerRocket(this.playerShip.getPosX() + 10, this.playerShip.getPosY());
        this.globalData.rockets.push(rocket);
    };

    Game.prototype.draw = function () {
        var appCanvas = document.getElementById('game_canvas');
        this.context = appCanvas.getContext("2d");

        this.context.globalCompositeOperation = 'destination-over';
        this.context.clearRect(0, 0, 900, 500); // clear canvas

        this.context.fillStyle = 'rgba(0,0,0,0.4)';
        this.context.strokeStyle = 'rgba(0,153,255,0.4)';
        this.context.save();

        if (this.playerShip.movingLeft)
            this.playerShip.moveLeft();
        if (this.playerShip.movingRight)
            this.playerShip.moveRight();
        if (this.playerShip.movingUp)
            this.playerShip.moveUp();
        if (this.playerShip.movingDown)
            this.playerShip.moveDown();

        if (!this.playerShip.isDead()) {
            this.playerShip.draw(this.context);
        }

        this.collision.detectCollisions(this.globalData.rockets, this.globalData.enemies);

        this.collision.detectCollisionOnPoint(this.playerShip, this.globalData.enemies);

        var i;

        for (i = this.globalData.enemies.length - 1; i >= 0; i--) {
            if (this.globalData.enemies[i].getPosY() >= 500 || this.globalData.enemies[i].getPosY() <= -100) {
                this.globalData.enemies.splice(i, 1);
            }
        }

        for (i = this.globalData.enemies.length - 1; i >= 0; i--) {
            if (this.globalData.enemies[i].isDead()) {
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
            drawable = this.globalData.enemies[i];
            drawable.draw(this.context);
        }

        for (i = 0; i < this.globalData.rockets.length; i++) {
            drawable = this.globalData.rockets[i];
            if (!drawable.isDead()) {
                drawable.draw(this.context);
            }
        }
    };
    return Game;
})();

var Enemy = (function () {
    function Enemy(posX, posY, enemySize, speed) {
        this.enemyPosX = posX;
        this.enemyPosY = posY;

        this.enemySize = enemySize;
        this.enemyHeight = enemySize;
        this.enemyWidth = enemySize;
        this.enemyHealth = 100;

        this.speed = speed;
    }
    Enemy.prototype.draw = function (context) {
        var image = new Image();
        var descentY = (this.enemyPosY++) + this.speed;
        this.enemyPosY = descentY;
        image.src = 'http://silveiraneto.net/downloads/asteroid.png';
        context.drawImage(image, this.enemyPosX, descentY, this.enemyWidth, this.enemyHeight);
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
    return Enemy;
})();

var PlayerRocket = (function () {
    function PlayerRocket(posX, posY) {
        this.rocketHeight = 20;
        this.rocketWidth = 20;
        this.rocketSpeed = 8;
        this.rocketPosX = posX;
        this.rocketPosY = posY;
        this.rocketHealth = 100;
    }
    PlayerRocket.prototype.draw = function (context) {
        var image = new Image();
        this.rocketPosY = (this.rocketPosY--) - this.rocketSpeed;
        image.src = 'http://findicons.com/files/icons/1520/wallace_gromit/32/rocket.png';
        context.drawImage(image, this.rocketPosX, this.rocketPosY, this.rocketWidth, this.rocketHeight);
    };

    PlayerRocket.prototype.isDead = function () {
        return this.rocketIsDead;
    };

    PlayerRocket.prototype.getPosX = function () {
        return this.rocketPosX;
    };
    PlayerRocket.prototype.getPosY = function () {
        return this.rocketPosY;
    };

    PlayerRocket.prototype.getWidth = function () {
        return this.rocketWidth;
    };

    PlayerRocket.prototype.getHeight = function () {
        return this.rocketHeight;
    };

    PlayerRocket.prototype.takeDamage = function () {
        this.rocketIsDead = true;
    };
    return PlayerRocket;
})();

window.onload = function () {
    var game = new Game();

    document.onkeydown = keyDownCheck;
    document.onkeyup = keyUpCheck;

    //document.onkeypress = keyPressCheck;
    function keyDownCheck(e) {
        e = e || window.event;

        if (e.keyCode == 37)
            game.playerShip.setMoveLeft(true);
        if (e.keyCode == 38)
            game.playerShip.setMoveUp(true);
        if (e.keyCode == 39)
            game.playerShip.setMoveRight(true);
        if (e.keyCode == 40)
            game.playerShip.setMoveDown(true);
    }

    /*function keyPressCheck(e) {
    e = e || window.event;
    //if (e.keyCode == 32) game.shoot();
    }*/
    function keyUpCheck(e) {
        e = e || window.event;

        if (e.keyCode == 37)
            game.playerShip.setMoveLeft(false);
        if (e.keyCode == 38)
            game.playerShip.setMoveUp(false);
        if (e.keyCode == 39)
            game.playerShip.setMoveRight(false);
        if (e.keyCode == 40)
            game.playerShip.setMoveDown(false);

        if (e.keyCode == 32)
            game.shoot();
    }

    (function gameloop() {
        // stats.update();
        game.step();
        game.update();
        game.draw();

        window.requestAnimationFrame(gameloop);
    })();
};
//# sourceMappingURL=app.js.map
