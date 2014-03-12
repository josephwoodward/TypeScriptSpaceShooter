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
    }
    Game.prototype.step = function () {
        /*this.enemyCollection = this.enemyCollection.filter(function (enemy) {
        var item = <Enemy> enemy;
        if (item.enemyPosY >= 300) {
        
        return false;
        }
        return true;
        });*/
        this.enemyDelay++;
        var randomX = Math.floor(Math.random() * 800) + 1;
        var enemy = new Enemy(randomX, -20);

        if (this.globalData.entities.length <= this.enemyLimit) {
            if (this.enemyDelay >= 40) {
                this.globalData.entities.push(enemy);
                this.enemyDelay = 0;
            }
        }
    };

    Game.prototype.update = function () {
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
        this.context.fillRect(this.posX * 10, this.posY * 10, this.min, this.max);

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
    };
    return Game;
})();

var Enemy = (function () {
    function Enemy(posX, posY) {
        this.enemyPosX = posX;
        this.enemyPosY = posY;
        this.enemyWidth = 20;
        this.enemyHeight = 20;
        this.speed = Math.floor(Math.random() * 4) + 1;
        this.enemyIsDead = false;
    }
    Enemy.prototype.draw = function (context) {
        var image = new Image();
        var descentY = this.enemyPosY++ * this.speed;
        image.src = 'https://mdn.mozillademos.org/files/1429/Canvas_earth.png';
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

window.onload = function () {
    var game = new Game();

    document.onkeydown = checkKey;

    function checkKey(e) {
        e = e || window.event;

        if (e.keyCode == 37)
            game.posX--;
        if (e.keyCode == 38)
            game.posY--;
        if (e.keyCode == 39)
            game.posX++;
        if (e.keyCode == 40)
            game.posY++;
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
