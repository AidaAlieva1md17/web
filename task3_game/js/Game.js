import Player from './Player.js';
import InputHandler from './InputHandler.js';
import Collision from './Collision.js';
import Renderer from './Renderer.js';

export default class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gameMessage = document.getElementById('gameMessage');
        this.messageTitle = document.getElementById('messageTitle');
        this.messageText = document.getElementById('messageText');
        this.messageButton = document.getElementById('messageButton');
        this.player1Health = document.getElementById('player1Health');
        this.player2Health = document.getElementById('player2Health');
        this.currentRoundElement = document.getElementById('currentRound');
        this.timerElement = document.getElementById('timer');
        
        // Установка размера canvas на весь экран
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        this.state = {
            currentRound: 1,
            maxRounds: 3,
            roundTime: 99,
            timer: 99,
            isRunning: false,
            isPaused: false,
            players: [],
            platforms: [],
            gameOver: false,
            winner: null,
            assetsLoaded: false,
            player1Wins: 0,
            player2Wins: 0,
            roundEnding: false
        };
        
        this.inputHandler = new InputHandler();
        this.collision = new Collision();
        this.renderer = new Renderer(this.ctx, this.canvas);
        
        // Аудио элементы - ДОБАВЛЕН track4 для победы Kenshi
        this.audio = {
            track1: new Audio('assets/audio/track1.mp3'),
            track2: new Audio('assets/audio/track2.mp3'),
            track3: new Audio('assets/audio/track3.mp3'),
            track4: new Audio('assets/audio/track4.mp3')
        };
        
        // Настройка аудио
        for (let key in this.audio) {
            this.audio[key].volume = 0.5;
            this.audio[key].preload = 'auto';
        }
        
        this.lastTime = 0;
        this.accumulator = 0;
        this.deltaTime = 1000/60;
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
    }
    
    async init() {
        // Загружаем ресурсы
        await this.loadAssets();
        
        // Создаем игроков с ОДИНАКОВЫМИ размерами (оба 400x400)
        const player1 = new Player(this.width * 0.25, this.height - 450, 400, 400, '#ff3300', 
            { left: 'KeyA', right: 'KeyD', up: 'KeyW', down: 'KeyS', 
              attack: 'KeyJ', heavyAttack: 'KeyK', block: 'KeyL' }, true, false);
        
        const player2 = new Player(this.width * 0.75, this.height - 450, 400, 400, '#0099ff', 
            { left: 'ArrowLeft', right: 'ArrowRight', up: 'ArrowUp', down: 'ArrowDown', 
              attack: 'Digit1', heavyAttack: 'Digit2', block: 'Digit3' }, false, true);
        
        // Устанавливаем здоровье 100 HP
        player1.health = 100;
        player2.health = 100;
        player1.maxHealth = 100;
        player2.maxHealth = 100;
        
        // Загружаем спрайты для игроков
        player1.loadSprites(this.assets.player1);
        player2.loadSprites(this.assets.player2);
        
        this.state.players = [player1, player2];
        
        // Пустой массив платформ
        this.state.platforms = [];
        
        // Настраиваем обработчики ввода только для первого игрока
        this.inputHandler.init(this.state.players[0]);
        
        // Настраиваем обработчик кнопки сообщения
        this.messageButton.addEventListener('click', () => {
            this.handleMessageButtonClick();
        });
        
        // Включаем музыку для начала
        this.playAudio('track1');
        
        // Показываем начальное сообщение
        this.showRoundMessage();
        
        // Запускаем игровой цикл
        this.gameLoop(0);
    }
    
    playAudio(trackName) {
        // Останавливаем все треки
        for (let key in this.audio) {
            this.audio[key].pause();
            this.audio[key].currentTime = 0;
        }
        
        // Воспроизводим нужный трек
        if (this.audio[trackName]) {
            this.audio[trackName].play().catch(e => {
                console.log('Audio play error:', e);
            });
        }
    }
    
    stopAudio() {
        for (let key in this.audio) {
            this.audio[key].pause();
            this.audio[key].currentTime = 0;
        }
    }
    
    async loadAssets() {
        this.assets = {
            background: await this.loadImage('assets/images/Background.png'),
            player1: await this.loadPlayer1Sprites(),
            player2: await this.loadPlayer2Sprites()
        };
        
        // Устанавливаем фон
        this.renderer.loadBackground(this.assets.background);
        
        this.state.assetsLoaded = true;
    }
    
    loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => {
                console.warn(`Не удалось загрузить изображение: ${src}`);
                resolve(null);
            };
            img.src = src;
        });
    }
    
    async loadPlayer1Sprites() {
        const sprites = {};
        
        const spriteConfig = {
            'idle': { file: 'yellowNinja - idle.png', frameCount: 8 },
            'walk': { file: 'yellowNinja - walk.png', frameCount: 10 },
            'attack': { file: 'yellowNinja - attack.png', frameCount: 20 },
            'hit': { file: 'yellowNinja - hit.png', frameCount: 4 },
            'death': { file: 'yellowNinja - death.png', frameCount: 14 },
            'whitehit': { file: 'yellowNinja - whitehit.png', frameCount: 4 }
        };
        
        for (const [state, config] of Object.entries(spriteConfig)) {
            const image = await this.loadImage(`assets/images/player1/${config.file}`);
            if (image) {
                sprites[state] = {
                    image: image,
                    frameCount: config.frameCount
                };
            }
        }
        
        return sprites;
    }
    
    async loadPlayer2Sprites() {
        const sprites = {};
        
        const spriteConfig = {
            'idle': { file: 'spirit - idle.png', frameCount: 10 },
            'run': { file: 'spirit - run.png', frameCount: 16 },
            'attack': { file: 'spirit - attack 1.png', frameCount: 7 },
            'hurt': { file: 'spirit - hurt.png', frameCount: 4 }
        };
        
        for (const [state, config] of Object.entries(spriteConfig)) {
            const image = await this.loadImage(`assets/images/player2/${config.file}`);
            if (image) {
                sprites[state] = {
                    image: image,
                    frameCount: config.frameCount
                };
            }
        }
        
        return sprites;
    }
    
    gameLoop(timestamp) {
        if (!this.lastTime) this.lastTime = timestamp;
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;
        
        this.accumulator += deltaTime;
        
        while (this.accumulator >= this.deltaTime) {
            this.update(this.deltaTime);
            this.accumulator -= this.deltaTime;
        }
        
        this.render();
        
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }
    
    update(deltaTime) {
        if (!this.state.isRunning || this.state.isPaused) return;
        
        // Обновляем таймер
        if (this.state.timer > 0) {
            this.state.timer -= deltaTime / 1000;
            this.timerElement.textContent = Math.ceil(this.state.timer);
        } else {
            this.handleRoundEndByTime();
        }
        
        const player1 = this.state.players[0];
        const player2 = this.state.players[1];
        
        // Обновляем игроков
        player1.update([], player2, deltaTime);
        this.updateAI(player2, player1, deltaTime);
        
        // Проверяем коллизии между игроками
        this.collision.checkPlayerCollision(player1, player2, this);
        this.collision.checkPlayerCollision(player2, player1, this);
        
        // Обновляем UI здоровья
        this.updateHealthBars();
        
        // Проверяем условия завершения раунда с задержкой для анимации смерти
        if ((player1.health <= 0 || player2.health <= 0) && !this.state.roundEnding) {
            this.state.roundEnding = true;
            setTimeout(() => {
                this.endRound();
                this.state.roundEnding = false;
            }, 1500); // 1.5 секунды на анимацию смерти
        }
    }
    
    updateAI(aiPlayer, targetPlayer, deltaTime) {
        const distance = Math.abs(aiPlayer.x - targetPlayer.x);
        
        // Случайные прыжки
        if (Math.random() < 0.01 && !aiPlayer.isJumping && aiPlayer.state !== 'attacking' && aiPlayer.state !== 'hit') {
            aiPlayer.jump();
        }
        
        // Определяем поведение в зависимости от расстояния
        if (distance > 300) {
            // Дальняя дистанция - приближаемся к игроку
            if (aiPlayer.x > targetPlayer.x) {
                aiPlayer.moveLeft();
            } else {
                aiPlayer.moveRight();
            }
        } else if (distance > 150) {
            // Средняя дистанция - перемещаемся и готовимся к атаке
            if (Math.random() < 0.7) {
                if (aiPlayer.x > targetPlayer.x) {
                    aiPlayer.moveLeft();
                } else {
                    aiPlayer.moveRight();
                }
            }
            
            // Случайные атаки на средней дистанции с таким же КД как у игрока
            if (Math.random() < 0.04 && !aiPlayer.isJumping && aiPlayer.attackCooldown <= 0) {
                // AI теперь может использовать и обычную и тяжелую атаку
                if (Math.random() < 0.7) {
                    aiPlayer.attack();
                } else {
                    aiPlayer.heavyAttack();
                }
            }
        } else {
            // Ближняя дистанция - атакуем и защищаемся
            if (Math.random() < 0.06 && !aiPlayer.isJumping && aiPlayer.attackCooldown <= 0) {
                // AI теперь может использовать и обычную и тяжелую атаку
                if (Math.random() < 0.7) {
                    aiPlayer.attack();
                } else {
                    aiPlayer.heavyAttack();
                }
            }
            
            // Иногда блокируем
            if (Math.random() < 0.1 && !aiPlayer.isJumping) {
                aiPlayer.block();
            } else {
                aiPlayer.stopBlock();
            }
            
            // Случайно отступаем
            if (Math.random() < 0.05) {
                if (aiPlayer.x > targetPlayer.x) {
                    aiPlayer.moveRight();
                } else {
                    aiPlayer.moveLeft();
                }
            }
        }
        
        // Случайно прекращаем блокировку
        if (aiPlayer.state === 'blocking' && Math.random() < 0.1) {
            aiPlayer.stopBlock();
        }
        
        // Обновляем AI игрока
        aiPlayer.update([], targetPlayer, deltaTime);
    }
    
    render() {
        this.renderer.render(this.state.players, this.state.platforms);
    }
    
    updateHealthBars() {
        const player1 = this.state.players[0];
        const player2 = this.state.players[1];
        
        this.player1Health.style.width = `${player1.health}%`;
        this.player2Health.style.width = `${player2.health}%`;
        
        // Обновляем текстовое отображение HP
        const player1HealthText = document.getElementById('player1HealthText');
        const player2HealthText = document.getElementById('player2HealthText');
        
        if (player1HealthText) player1HealthText.textContent = `${Math.max(0, Math.round(player1.health))} HP`;
        if (player2HealthText) player2HealthText.textContent = `${Math.max(0, Math.round(player2.health))} HP`;
    }
    
    handleRoundEndByTime() {
        const player1 = this.state.players[0];
        const player2 = this.state.players[1];
        
        if (player1.health > player2.health) {
            this.state.winner = 'SCORPION';
            this.state.player1Wins++;
        } else if (player2.health > player1.health) {
            this.state.winner = 'KENSHI';
            this.state.player2Wins++;
        } else {
            this.state.winner = 'НИЧЬЯ';
        }
        
        if (!this.state.roundEnding) {
            this.state.roundEnding = true;
            setTimeout(() => {
                this.endRound();
                this.state.roundEnding = false;
            }, 1500);
        }
    }
    
    showRoundMessage() {
        if (this.state.gameOver) {
            this.messageTitle.textContent = 'ИГРА ОКОНЧЕНА';
            this.messageText.innerHTML = `ПОБЕДИТЕЛЬ: ${this.state.winner}<br>
                                         Счет: SCORPION ${this.state.player1Wins} - ${this.state.player2Wins} KENSHI`;
            this.messageButton.textContent = 'ИГРАТЬ СНОВА';
        } else {
            this.messageTitle.textContent = `РАУНД ${this.state.currentRound}`;
            this.messageText.innerHTML = `Счет: SCORPION ${this.state.player1Wins} - ${this.state.player2Wins} KENSHI<br>
                                         Готовы к битве?`;
            this.messageButton.textContent = 'НАЧАТЬ';
        }
        
        this.gameMessage.style.display = 'block';
    }
    
    handleMessageButtonClick() {
        this.gameMessage.style.display = 'none';
        
        if (this.state.gameOver) {
            this.resetGame();
        } else {
            this.state.isRunning = true;
            this.state.timer = this.state.roundTime;
            this.timerElement.textContent = this.state.timer;
            
            // Включаем боевую музыку
            this.playAudio('track2');
        }
    }
    
    endRound() {
        this.state.isRunning = false;
        
        // Определяем победителя раунда
        const player1 = this.state.players[0];
        const player2 = this.state.players[1];
        
        if (player1.health <= 0) {
            this.state.winner = 'KENSHI';
            this.state.player2Wins++;
            // Воспроизводим track4 при победе Kenshi
            this.playAudio('track4');
        } else if (player2.health <= 0) {
            this.state.winner = 'SCORPION';
            this.state.player1Wins++;
            // Воспроизводим track3 при победе Scorpion
            this.playAudio('track3');
        }
        
        if (this.state.gameOver) {
            this.showRoundMessage();
        } else {
            this.state.currentRound++;
            if (this.state.currentRound <= this.state.maxRounds && 
                this.state.player1Wins < 2 && this.state.player2Wins < 2) {
                this.currentRoundElement.textContent = this.state.currentRound;
                this.resetRound();
                this.showRoundMessage();
            } else {
                // Определяем победителя игры
                if (this.state.player1Wins > this.state.player2Wins) {
                    this.state.winner = 'SCORPION';
                    this.playAudio('track3'); // Победа Scorpion в игре
                } else if (this.state.player2Wins > this.state.player1Wins) {
                    this.state.winner = 'KENSHI';
                    this.playAudio('track4'); // Победа Kenshi в игре
                } else {
                    this.state.winner = 'НИЧЬЯ';
                }
                this.state.gameOver = true;
                this.showRoundMessage();
            }
        }
    }
    
    resetRound() {
        const player1 = this.state.players[0];
        const player2 = this.state.players[1];
        
        player1.health = 100;
        player2.health = 100;
        this.updateHealthBars();
        
        player1.resetPosition(this.width * 0.25, this.height - 450);
        player2.resetPosition(this.width * 0.75, this.height - 450); // Теперь одинаковый Y
        
        this.state.timer = this.state.roundTime;
        this.timerElement.textContent = this.state.timer;
        
        // Включаем музыку между раундами
        this.playAudio('track1');
    }
    
    resetGame() {
        this.state.currentRound = 1;
        this.state.player1Wins = 0;
        this.state.player2Wins = 0;
        this.currentRoundElement.textContent = this.state.currentRound;
        this.state.gameOver = false;
        this.state.winner = null;
        this.resetRound();
        this.showRoundMessage();
    }
}