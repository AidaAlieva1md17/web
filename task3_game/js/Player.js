export default class Player {
    constructor(x, y, width, height, color, controls, isPlayer1, isAI = false) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.velocityX = 0;
        this.velocityY = 0;
        this.health = 100;
        this.maxHealth = 100;
        this.controls = controls;
        this.isPlayer1 = isPlayer1;
        this.isAI = isAI;
        this.facingRight = isPlayer1;
        this.state = 'idle';
        this.attackPower = 20; // Урон 20 HP за удар
        this.heavyAttackPower = 30; // Тяжелая атака 30 HP
        this.blocking = false;
        this.attackCooldown = 0;
        this.hitCooldown = 0;
        
        // Прыжок и гравитация - УВЕЛИЧЕННЫЕ значения для лучшего прыжка
        this.jumpPower = 20;
        this.gravity = 0.9;
        this.isJumping = false;
        this.groundY = y;
        
        // Спрайтовая анимация
        this.sprites = {};
        this.currentSprite = null;
        this.frameIndex = 0;
        this.frameCounter = 0;
        this.frameDelay = 6;
        this.animationComplete = false;
        
        // Для отслеживания нанесения урона
        this.hasDealtDamage = false;
        
        // Для анимации смерти
        this.deathAnimationPlayed = false;
        
        // Для отслеживания типа атаки
        this.currentAttackType = null; // 'light' или 'heavy'
    }

    // Загрузка спрайтов
    loadSprites(sprites) {
        this.sprites = sprites;
        this.currentSprite = this.sprites.idle;
    }

    update(platforms, otherPlayer, deltaTime) {
        // Обновляем позицию по Y (гравитация и прыжок)
        this.velocityY += this.gravity;
        this.y += this.velocityY;

        // Проверяем, достигли ли земли
        if (this.y >= this.groundY) {
            this.y = this.groundY;
            this.velocityY = 0;
            this.isJumping = false;
            if (this.state === 'jumping') {
                this.state = 'idle';
            }
        }

        // Обновляем позицию по X
        this.x += this.velocityX * (deltaTime / 16.67);

        // Ограничиваем игрока в пределах canvas
        const margin = 50;
        if (this.x < margin) this.x = margin;
        if (this.x + this.width > (window.innerWidth || 800) - margin) {
            this.x = (window.innerWidth || 800) - margin - this.width;
        }

        // Обновляем состояние атаки и получения урона
        if (this.attackCooldown > 0) this.attackCooldown -= deltaTime / 16.67;
        if (this.hitCooldown > 0) this.hitCooldown -= deltaTime / 16.67;

        // Замедляем игрока (трение)
        this.velocityX *= 0.8;

        // Автоматически возвращаемся в idle состояние
        if (this.state === 'walking' && this.velocityX === 0 && !this.isJumping) {
            this.state = 'idle';
        }

        // Не меняем состояние если игрок умер и анимация смерти еще не завершена
        if (this.state !== 'death' || (this.state === 'death' && !this.animationComplete)) {
            if (this.state === 'attacking' && this.attackCooldown <= 0) {
                this.state = 'idle';
                this.hasDealtDamage = false;
                this.currentAttackType = null;
            }

            if (this.state === 'hit' && this.hitCooldown <= 0) {
                this.state = 'idle';
            }
        }

        // Обновляем направление взгляда для AI
        if (this.isAI && otherPlayer) {
            this.facingRight = (this.x < otherPlayer.x);
        }

        // Обновляем анимацию
        this.updateAnimation();
    }

    updateAnimation() {
        let targetSprite = this.sprites.idle;
        this.animationComplete = false;
        
        switch(this.state) {
            case 'walking':
                if (this.isPlayer1) {
                    targetSprite = this.sprites.walk || this.sprites.idle;
                } else {
                    targetSprite = this.sprites.run || this.sprites.idle;
                }
                this.frameDelay = this.isPlayer1 ? 6 : 4;
                break;
            case 'attacking':
                targetSprite = this.sprites.attack || this.sprites.idle;
                // Разная скорость анимации для разных типов атак
                if (this.currentAttackType === 'heavy') {
                    this.frameDelay = this.isPlayer1 ? 4 : 6; // Медленнее для тяжелой атаки
                } else {
                    this.frameDelay = this.isPlayer1 ? 3 : 5;
                }
                break;
            case 'blocking':
                targetSprite = this.sprites.idle;
                break;
            case 'hit':
                // Для player1 используем whitehit при получении удара
                if (this.isPlayer1) {
                    targetSprite = this.sprites.whitehit || this.sprites.hit || this.sprites.idle;
                } else {
                    targetSprite = this.sprites.hurt || this.sprites.idle;
                }
                this.frameDelay = 8;
                break;
            case 'death':
                if (this.isPlayer1) {
                    targetSprite = this.sprites.death || this.sprites.idle;
                    this.frameDelay = 5; // Быстрее проигрываем анимацию смерти
                } else {
                    targetSprite = this.sprites.hurt || this.sprites.idle;
                    this.frameDelay = 8;
                }
                break;
            case 'jumping':
                targetSprite = this.sprites.idle;
                break;
            default:
                targetSprite = this.sprites.idle;
                this.frameDelay = this.isPlayer1 ? 8 : 6;
        }

        if (this.currentSprite !== targetSprite) {
            this.currentSprite = targetSprite;
            this.frameIndex = 0;
            this.frameCounter = 0;
            this.animationComplete = false;
            this.deathAnimationPlayed = false;
        }

        // Обновляем кадры анимации
        if (this.currentSprite && this.currentSprite.frameCount > 1) {
            this.frameCounter++;
            if (this.frameCounter >= this.frameDelay) {
                this.frameCounter = 0;
                
                // Проверяем, достигли ли последнего кадра
                if (this.frameIndex >= this.currentSprite.frameCount - 1) {
                    this.animationComplete = true;
                    
                    // Для атаки сбрасываем флаг нанесения урона при завершении анимации
                    if (this.state === 'attacking') {
                        this.hasDealtDamage = false;
                        this.currentAttackType = null;
                    }
                    
                    // Для смерти остаемся на последнем кадре
                    if (this.state === 'death') {
                        this.frameIndex = this.currentSprite.frameCount - 1;
                        this.deathAnimationPlayed = true;
                    } else {
                        this.frameIndex = 0;
                    }
                } else {
                    this.frameIndex++;
                }
            }
        }
    }

    checkPlayerCollision(player) {
        // ОДИНАКОВЫЙ хитбокс для обоих игроков (50px отступ)
        const hitboxReduce = 50;
        return this.x + hitboxReduce < player.x + player.width - hitboxReduce &&
               this.x + this.width - hitboxReduce > player.x + hitboxReduce &&
               this.y + hitboxReduce < player.y + player.height - hitboxReduce &&
               this.y + this.height - hitboxReduce > player.y + hitboxReduce;
    }

    moveLeft() {
        if (this.state !== 'attacking' && this.state !== 'hit' && this.state !== 'death') {
            this.velocityX = -8; // Увеличена скорость движения
            if (!this.isAI) this.facingRight = false;
            if (!this.isJumping) {
                this.state = 'walking';
            }
        }
    }

    moveRight() {
        if (this.state !== 'attacking' && this.state !== 'hit' && this.state !== 'death') {
            this.velocityX = 8; // Увеличена скорость движения
            if (!this.isAI) this.facingRight = true;
            if (!this.isJumping) {
                this.state = 'walking';
            }
        }
    }

    jump() {
        if (!this.isJumping && this.state !== 'attacking' && this.state !== 'hit' && this.state !== 'death') {
            this.velocityY = -this.jumpPower;
            this.isJumping = true;
            this.state = 'jumping';
        }
    }

    attack() {
        if (this.state !== 'attacking' && this.state !== 'hit' && this.state !== 'death' && 
            this.attackCooldown <= 0 && !this.isJumping) {
            this.state = 'attacking';
            this.attackCooldown = 30; // Уменьшенное КД для более частых атак
            this.frameIndex = 0;
            this.frameCounter = 0;
            this.hasDealtDamage = false;
            this.currentAttackType = 'light';
        }
    }

    heavyAttack() {
        if (this.state !== 'attacking' && this.state !== 'hit' && this.state !== 'death' && 
            this.attackCooldown <= 0 && !this.isJumping) {
            this.state = 'attacking';
            this.attackCooldown = 50; // Большее КД для тяжелой атаки
            this.frameIndex = 0;
            this.frameCounter = 0;
            this.hasDealtDamage = false;
            this.currentAttackType = 'heavy';
        }
    }

    block() {
        if (this.state !== 'attacking' && this.state !== 'hit' && this.state !== 'death' && !this.isJumping) {
            this.state = 'blocking';
            this.blocking = true;
        }
    }

    stopBlock() {
        if (this.state === 'blocking') {
            this.state = 'idle';
            this.blocking = false;
        }
    }

    takeDamage(damage) {
        if (this.state === 'death') return; // Не получаем урон если уже мертвы
        
        if (!this.blocking) {
            this.health = Math.max(0, this.health - damage);
            this.state = 'hit';
            this.hitCooldown = 20;
            this.frameIndex = 0;
            this.frameCounter = 0;
            
            // Отталкивание при получении урона
            this.velocityX = this.facingRight ? -8 : 8;
            this.velocityY = -5; // Легкое отталкивание вверх
            
            // Анимация смерти при нулевом здоровье
            if (this.health <= 0) {
                this.state = 'death';
                this.frameIndex = 0;
                this.frameCounter = 0;
                this.deathAnimationPlayed = false;
            }
        } else {
            // При блоке уменьшаем урон
            const blockedDamage = damage * 0.3;
            this.health = Math.max(0, this.health - blockedDamage);
        }
    }

    resetPosition(x, y) {
        this.x = x;
        this.y = y;
        this.groundY = y;
        this.velocityX = 0;
        this.velocityY = 0;
        this.state = 'idle';
        this.attackCooldown = 0;
        this.hitCooldown = 0;
        this.blocking = false;
        this.isJumping = false;
        this.frameIndex = 0;
        this.frameCounter = 0;
        this.animationComplete = false;
        this.hasDealtDamage = false;
        this.deathAnimationPlayed = false;
        this.currentAttackType = null;
    }
}