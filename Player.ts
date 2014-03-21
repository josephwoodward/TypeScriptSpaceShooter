class PlayerShip implements IDrawable, ICollidable {

    public playerPosX: number;
    public playerPosY: number;
    public playerCenter: number;
    public playerSpeed: number;
    public playerIsDead: boolean;

    public movingLeft: boolean;
    public movingRight: boolean;
    public movingUp: boolean;
    public movingDown: boolean;

    public playerWidth: number;
    public playerHeight: number;

    private playerHealth: number;

    constructor(posX: number, posY: number) {
        this.playerPosX = posX;
        this.playerPosY = posY;

        this.playerWidth = 40;
        this.playerHeight = 40;

        this.playerSpeed = 6;
        this.playerIsDead = false;
        this.playerHealth = 100;
    }

    draw(context: CanvasRenderingContext2D) {
        var image = new Image();
        image.src = 'http://www.pixeljoint.com/files/icons/spaceship1_final.png';
        context.drawImage(image, this.playerPosX, this.playerPosY, this.playerWidth, this.playerHeight);
    }

    isDead() {
        return this.playerIsDead;
    }

    getPosX() {
        return this.playerPosX;
    }

    getPosY() {
        return this.playerPosY;
    }

    moveLeft() {
        if (this.playerPosX < -(this.playerWidth)) {
            this.playerPosX = 900;
        } else {
            this.playerPosX -= this.playerSpeed;
        }
    }

    moveRight() {
        if (this.playerPosX >= 890) {
            this.playerPosX = -(this.playerWidth);
        } else {
            this.playerPosX += this.playerSpeed;
        }
    }

    moveUp() {
        if (this.playerPosY <= -(this.playerHeight)) {
            this.playerPosY = 500;
        } else {
            this.playerPosY -= this.playerSpeed;
        }
    }

    moveDown() {
        if (this.playerPosY >= (500 + (this.playerHeight / 2))) {
            this.playerPosY = -(this.playerHeight - 5);
        } else {
            this.playerPosY += this.playerSpeed;
        }
    }

    setMoveLeft(moveLeft: boolean) {
        this.movingLeft = moveLeft;
    }

    setMoveRight(moveRight: boolean) {
        this.movingRight = moveRight;
    }

    setMoveUp(moveUp: boolean) {
        this.movingUp = moveUp;
    }

    setMoveDown(moveDown: boolean) {
        this.movingDown = moveDown;
    }

    getWidth() {
        return this.playerWidth;
    }

    getHeight() {
        return this.playerHeight;
    }

    takeDamage() {
        this.playerHealth -= 20;
        console.log("here" + this.playerHealth);
        this.playerIsDead = (this.playerHealth <= 0);
    }
} 