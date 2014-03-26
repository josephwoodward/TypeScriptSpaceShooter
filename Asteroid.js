var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Asteroid = (function (_super) {
    __extends(Asteroid, _super);
    function Asteroid(posX, posY, enemySize, speed, sprite) {
        _super.call(this, posX, posY, enemySize, speed, sprite);
        this.damageDelivered = 20;
    }
    Asteroid.prototype.getDamageDelivered = function () {
        return this.damageDelivered;
    };
    return Asteroid;
})(Enemy);
//# sourceMappingURL=Asteroid.js.map
