class EnemyFactory
{
    createRandomEnemy() {
        var randomX = Math.floor(Math.random() * 800) + 1;
        var size = Math.floor(Math.random() * 40) + 20;

        var speed = Math.floor(Math.random() * 2) + 1;
        /*if (size >= 25) {
            speed = Math.floor(Math.random() * 1) + 1;
        }*/

        return new Asteroid(randomX, -40, size, speed);
    }    
}