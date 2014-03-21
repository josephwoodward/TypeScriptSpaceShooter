interface ICollidable {
    getWidth();
    getHeight();
    getPosX();
    getPosY();
    takeDamage();
}
 
interface IEnemey {

}

interface IDrawable {
    isDead(): boolean;
    getPosX(): number;
    getPosY(): number;
    draw(context: CanvasRenderingContext2D);
}