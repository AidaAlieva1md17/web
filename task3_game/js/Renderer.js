export default class Renderer {
    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.background = null;
    }

    // Загрузка фона
    loadBackground(image) {
        this.background = image;
    }

    render(players, platforms) {
        // Очищаем canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Рисуем фон на весь экран
        if (this.background) {
            this.ctx.drawImage(this.background, 0, 0, this.canvas.width, this.canvas.height);
        } else {
            // Запасной фон для файтинга
            const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
            gradient.addColorStop(0, '#2d1b36');
            gradient.addColorStop(1, '#1a1020');
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Рисуем пол для файтинга
            this.ctx.fillStyle = '#333';
            this.ctx.fillRect(0, this.canvas.height - 100, this.canvas.width, 100);
            
            // Линия разделения
            this.ctx.strokeStyle = '#fff';
            this.ctx.setLineDash([5, 5]);
            this.ctx.beginPath();
            this.ctx.moveTo(this.canvas.width / 2, this.canvas.height - 180);
            this.ctx.lineTo(this.canvas.width / 2, this.canvas.height - 100);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
        }
        
        // Рисуем только игроков (платформы убраны)
        players.forEach(player => this.drawPlayer(player));
    }

    drawPlayer(player) {
        if (!player.currentSprite || !player.currentSprite.image) {
            // Запасной вариант: рисуем примитивы если спрайт не загружен
            this.drawFallbackPlayer(player);
            return;
        }

        const sprite = player.currentSprite;
        const frameWidth = sprite.image.width / sprite.frameCount;
        const frameHeight = sprite.image.height;

        this.ctx.save();
        
        // Отражение спрайта если смотрит влево
        if (!player.facingRight) {
            this.ctx.translate(player.x + player.width, player.y);
            this.ctx.scale(-1, 1);
            this.ctx.drawImage(
                sprite.image,
                player.frameIndex * frameWidth, 0, frameWidth, frameHeight,
                0, 0, player.width, player.height
            );
        } else {
            this.ctx.drawImage(
                sprite.image,
                player.frameIndex * frameWidth, 0, frameWidth, frameHeight,
                player.x, player.y, player.width, player.height
            );
        }

        // Рисуем уменьшенный эффект получения урона
        if (player.state === 'hit') {
            this.ctx.fillStyle = 'rgba(255, 0, 0, 0.4)';
            // Уменьшенный квадратик по центру персонажа
            const effectSize = Math.min(player.width, player.height) * 0.3;
            const effectX = player.x + (player.width - effectSize) / 2;
            const effectY = player.y + (player.height - effectSize) / 2;
            this.ctx.fillRect(effectX, effectY, effectSize, effectSize);
        }

        this.ctx.restore();
    }

    drawFallbackPlayer(player) {
        // Рисуем тело игрока
        this.ctx.fillStyle = player.color;
        this.ctx.fillRect(player.x, player.y, player.width, player.height);
        
        // Рисуем голову
        this.ctx.fillStyle = '#ffcc99';
        this.ctx.fillRect(player.x + player.width/4, player.y - 15, player.width/2, 15);
        
        // Рисуем ноги
        this.ctx.fillRect(player.x, player.y + player.height, player.width/3, 15);
        this.ctx.fillRect(player.x + 2*player.width/3, player.y + player.height, player.width/3, 15);
        
        // Рисуем руки
        this.ctx.fillRect(player.x - 5, player.y + 10, 5, 15);
        this.ctx.fillRect(player.x + player.width, player.y + 10, 5, 15);
        
        // Рисуем эффект блока
        if (player.state === 'blocking') {
            this.ctx.fillStyle = 'rgba(0, 150, 255, 0.5)';
            this.ctx.fillRect(player.facingRight ? player.x + player.width : player.x - 20, 
                             player.y, 20, player.height);
        }
        
        // Рисуем эффект получения урона
        if (player.state === 'hit') {
            this.ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
            this.ctx.fillRect(player.x, player.y, player.width, player.height);
        }
    }
}