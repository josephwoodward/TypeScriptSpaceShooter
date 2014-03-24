class Asteroid extends Enemy implements IEnemey, IDrawable, ICollidable {

    constructor(posX: number, posY: number, enemySize: number, speed: number, sprite: string) {
        super(posX, posY, enemySize, speed, sprite);
    }

}