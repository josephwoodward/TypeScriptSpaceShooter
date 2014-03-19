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
    Game.prototype.step = function () {
        var enemyFactory = new EnemyFactory();
        this.enemyDelay++;
        if (this.globalData.entities.length <= this.enemyLimit) {
            if (this.enemyDelay >= 40) {
                this.globalData.entities.push(enemyFactory.createRandomEnemy());
                this.enemyDelay = 0;
            }
        }
    };

    Game.prototype.update = function () {
    };

    Game.prototype.shoot = function () {
        var rocket = new PlayerRocket(this.playerShip.getPosX() + 6, this.playerShip.getPosY());
        this.globalData.entities.push(rocket);
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

        //this.playerShip.draw(this.context);
        this.collision.detectCollisions(this.globalData.entities);

        for (i = this.globalData.entities.length - 1; i >= 0; i--) {
            if (this.globalData.entities[i].getPosY() >= 500 || this.globalData.entities[i].getPosY() <= -100) {
                this.globalData.entities.splice(i, 1);
            }
        }

        for (i = this.globalData.entities.length - 1; i >= 0; i--) {
            if (this.globalData.entities[i].isDead()) {
                this.globalData.entities.splice(i, 1);
            }
        }

        for (var i = 0; i < this.globalData.entities.length; i++) {
            var drawable = this.globalData.entities[i];
            drawable.draw(this.context);
        }

        for (var i = 0; i < this.globalData.entities.length; i++) {
            var drawable = this.globalData.entities[i];
            drawable.draw(this.context);
        }
    };
    return Game;
})();

var CollisionDetection = (function () {
    function CollisionDetection() {
    }
    //collidables: ICollidable[];
    CollisionDetection.prototype.detectCollisions = function (collidables) {
        for (var i = 0; i < collidables.length; i++) {
            var entityA = collidables[i];

            for (var j = i + 1; j < collidables.length; j++) {
                var entityB = collidables[j];

                /*if (!entityB.canCollide() || entityB.isDead()) {
                continue;
                }*/
                if (this.isColliding(entityA, entityB)) {
                    //console.log(entityA + " and " + entityB);
                    entityA.takeDamage();
                    entityB.takeDamage();
                    //CallCollisionFunction(entityA, entityB);
                }
            }
        }
    };

    CollisionDetection.prototype.isColliding = function (entityA, entityB) {
        var widthA = entityA.getWidth();
        var heightA = entityA.getHeight();
        var widthB = entityB.getWidth();
        var heightB = entityB.getHeight();

        var leftA = entityA.getPosX() - (widthA / 2);
        var topA = entityA.getPosY() - (heightA / 2);
        var leftB = entityB.getPosX() - (widthB / 2);
        var topB = entityB.getPosY() - (heightB / 2);

        if (leftA < leftB + widthB && leftA + widthA > leftB && topA < topB + heightB && topA + heightA > topB) {
            return true;
        }
        return false;
    };
    return CollisionDetection;
})();

var PlayerShip = (function () {
    function PlayerShip(posX, posY) {
        this.playerPosX = posX;
        this.playerPosY = posY;

        this.playerWidth = 40;
        this.playerHeight = 40;

        this.playerSpeed = 5;
        this.playerIsDead = false;
        this.playerHealth = 100;
    }
    PlayerShip.prototype.draw = function (context) {
        var image = new Image();
        image.src = 'http://www.pixeljoint.com/files/icons/spaceship1_final.png';
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
        } else {
            this.playerPosX -= this.playerSpeed;
        }
    };

    PlayerShip.prototype.moveRight = function () {
        if (this.playerPosX >= 890) {
            this.playerPosX = -(this.playerWidth);
        } else {
            this.playerPosX += this.playerSpeed;
        }
    };

    PlayerShip.prototype.moveUp = function () {
        if (this.playerPosY <= -(this.playerHeight)) {
            this.playerPosY = 500;
        } else {
            this.playerPosY -= this.playerSpeed;
        }
    };

    PlayerShip.prototype.moveDown = function () {
        if (this.playerPosY >= (500 + (this.playerHeight / 2))) {
            this.playerPosY = -(this.playerHeight - 5);
        } else {
            this.playerPosY += this.playerSpeed;
        }
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
        console.log("here" + this.playerHealth);
        this.playerIsDead = (this.playerHealth <= 0);
    };
    return PlayerShip;
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
        this.rocketSpeed = 4;
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

var EnemyFactory = (function () {
    function EnemyFactory() {
    }
    EnemyFactory.prototype.createRandomEnemy = function () {
        var randomX = Math.floor(Math.random() * 800) + 1;
        var size = Math.floor(Math.random() * 40) + 20;

        var speed = Math.floor(Math.random() * 2) + 1;

        /*if (size >= 25) {
        speed = Math.floor(Math.random() * 1) + 1;
        }*/
        return new Enemy(randomX, -40, size, speed);
    };
    return EnemyFactory;
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
