var CollisionDetection = (function () {
    function CollisionDetection() {
    }
    CollisionDetection.prototype.detectCollisions = function (collidables1, collidables2) {
        for (var i = 0; i < collidables1.length; i++) {
            var entityA = collidables1[i];

            for (var j = 0; j < collidables2.length; j++) {
                var entityB = collidables2[j];

                if (this.isColliding(entityA, entityB)) {
                    console.log(entityA);
                    console.log(entityB);
                    entityA.takeDamage();
                    entityB.takeDamage();
                }
            }
        }
    };

    CollisionDetection.prototype.detectCollisionOnPoint = function (entityA, entitites) {
        for (var i = 0; i < entitites.length; i++) {
            var entityB = entitites[i];
            if (this.isColliding(entityA, entityB)) {
                entityA.takeDamage();
                entityB.takeDamage();
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
//# sourceMappingURL=Collision.js.map
