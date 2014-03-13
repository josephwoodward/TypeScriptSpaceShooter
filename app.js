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
        this.enemyLimit = 20;
        this.enemyDelay = 0;

        this.globalData = new GlobalData();
        this.globalData.entities = [];
        this.globalData.newEntities = [];
        this.globalData.rocketEntites = [];
    }
    Game.prototype.step = function () {
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
                this.globalData.entities.push(enemyFactory.createRandomEnemy());
                this.enemyDelay = 0;
            }
        }
    };

    Game.prototype.update = function () {
    };

    Game.prototype.shoot = function () {
        var rocket = new PlayerRocket(this.posX, this.posY);
        this.globalData.rocketEntites.push(rocket);
        //this.globalData.entities.push(rocket);
    };

    Game.prototype.draw = function () {
        var appCanvas = document.getElementById('game_canvas');
        this.context = appCanvas.getContext("2d");

        this.context.globalCompositeOperation = 'destination-over';
        this.context.clearRect(0, 0, 900, 500); // clear canvas

        this.context.fillStyle = 'rgba(0,0,0,0.4)';
        this.context.strokeStyle = 'rgba(0,153,255,0.4)';
        this.context.save();

        this.context.fillStyle = "rgb(200,0,0)";

        //console.log("Draw player at: x = " + this.posX + " - y = " + this.posY);
        this.context.fillRect(this.posX, this.posY, this.min, this.max);

        for (i = this.globalData.entities.length - 1; i >= 0; i--) {
            if (this.globalData.entities[i].getPosY() >= 500) {
                this.globalData.entities.splice(i, 1);
                //console.log(this.globalData.entities[i].getPosY());
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

        for (var i = 0; i < this.globalData.rocketEntites.length; i++) {
            var drawable = this.globalData.rocketEntites[i];
            drawable.draw(this.context);
        }
    };
    return Game;
})();

var Enemy = (function () {
    function Enemy(posX, posY, enemySize, speed) {
        this.enemyPosX = posX;
        this.enemyPosY = posY;

        this.enemyHeight = enemySize;
        this.enemyWidth = enemySize;

        this.speed = speed;
        this.enemyIsDead = false;
    }
    Enemy.prototype.draw = function (context) {
        var image = new Image();
        var descentY = this.enemyPosY++ * this.speed;
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
    return Enemy;
})();

var PlayerRocket = (function () {
    function PlayerRocket(posX, posY) {
        this.rocketHeight = 20;
        this.rocketWidth = 20;
        this.rocketSpeed = 3;
        this.rocketIsDead = false;
        this.rocketPosX = posX;
        this.rocketPosY = posY;
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
    return PlayerRocket;
})();

var EnemyFactory = (function () {
    function EnemyFactory() {
    }
    EnemyFactory.prototype.createRandomEnemy = function () {
        var randomX = Math.floor(Math.random() * 800) + 1;
        var size = Math.floor(Math.random() * 40) + 20;

        var speed = Math.floor(Math.random() * 3) + 1;

        /*if (size >= 25) {
        speed = Math.floor(Math.random() * 1) + 1;
        }*/
        return new Enemy(randomX, -40, size, speed);
    };
    return EnemyFactory;
})();

window.onload = function () {
    var game = new Game();

    document.onkeydown = checkKey;

    function checkKey(e) {
        e = e || window.event;

        if (e.keyCode == 37)
            game.posX = (game.posX--) - 8;
        if (e.keyCode == 38)
            game.posY = (game.posY--) - 8;
        if (e.keyCode == 39)
            game.posX = (game.posX++) + 8;
        if (e.keyCode == 40)
            game.posY = (game.posY++) + 8;

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