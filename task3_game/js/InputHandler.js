export default class InputHandler {
    constructor() {
        this.keys = {};
    }
    
    init(player) {
        this.player = player;
        
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            this.handleInput();
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
            this.handleInputRelease();
        });
    }
    
    handleInput() {
        if (!this.player) return;
        
        // Управление только для игрока 1
        if (this.keys[this.player.controls.left]) this.player.moveLeft();
        if (this.keys[this.player.controls.right]) this.player.moveRight();
        if (this.keys[this.player.controls.up]) this.player.jump();
        if (this.keys[this.player.controls.attack]) this.player.attack();
        if (this.keys[this.player.controls.heavyAttack]) this.player.heavyAttack();
        if (this.keys[this.player.controls.block]) this.player.block();
    }
    
    handleInputRelease() {
        if (!this.player) return;
        
        // Игрок 1 прекращает блок
        if (!this.keys[this.player.controls.block]) this.player.stopBlock();
        
        // Сбрасываем состояние ходьбы, если не нажаты клавиши движения
        if (!this.keys[this.player.controls.left] && !this.keys[this.player.controls.right] && 
            this.player.state === 'walking' && !this.player.isJumping) {
            this.player.state = 'idle';
        }
    }
}