/// <reference path="Enemy.ts"/>

class Asteroid extends Enemy {

    private damageDelivered: number = 20;

    constructor(posX: number, posY: number, enemySize: number, speed: number, sprite: string) {
        super(posX, posY, enemySize, speed, sprite);

    }

    getDamageDelivered() {
        return this.damageDelivered;
    }

}