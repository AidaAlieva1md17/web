// Виджет с игрой "Змейка"
class SnakeWidget {
    static games = new Map();

    static async fetchData(widgetId) {
        // Для игрового виджета данные не загружаем из API
        return {
            score: 0,
            highScore: localStorage.getItem(`snake_highscore_${widgetId}`) || 0,
            gameState: 'ready'
        };
    }

    static getContentHTML(data, widgetId) {
        return `
            <div class="snake-content">
                <div class="snake-header">
                    <div class="snake-scores">
                        <div class="score">Очки: <span id="score-${widgetId}">0</span></div>
                        <div class="high-score">Рекорд: <span id="highscore-${widgetId}">${data.highScore}</span></div>
                    </div>
                    <div class="snake-controls">
                        <button class="btn-secondary" onclick="SnakeWidget.startGame('${widgetId}')" id="start-btn-${widgetId}">
                            🎮 Старт
                        </button>
                        <button class="btn-secondary" onclick="SnakeWidget.pauseGame('${widgetId}')" id="pause-btn-${widgetId}" style="display:none;">
                            ⏸️ Пауза
                        </button>
                        <button class="btn-secondary" onclick="SnakeWidget.resetGame('${widgetId}')">
                            🔄 Заново
                        </button>
                    </div>
                </div>
                
                <div class="snake-game-container">
                    <canvas id="snake-canvas-${widgetId}" width="300" height="300"></canvas>
                </div>
                
                <div class="snake-instructions">
                    <small>Управление: Стрелки ←↑→↓ или WASD</small>
                </div>
            </div>
        `;
    }

    static startGame(widgetId) {
        const canvas = document.getElementById(`snake-canvas-${widgetId}`);
        const startBtn = document.getElementById(`start-btn-${widgetId}`);
        const pauseBtn = document.getElementById(`pause-btn-${widgetId}`);
        
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const gridSize = 20;
        const tileCount = canvas.width / gridSize;

        let snake = {
            body: [{x: 10, y: 10}],
            dx: 1,
            dy: 0
        };
        
        let food = {x: 5, y: 5};
        let score = 0;
        let gameRunning = true;
        let gameLoop;

        // Сохраняем состояние игры
        this.games.set(widgetId, {
            snake: snake,
            food: food,
            score: score,
            gameLoop: gameLoop,
            gameRunning: gameRunning
        });

        // Прячем кнопку старта, показываем паузу
        startBtn.style.display = 'none';
        pauseBtn.style.display = 'inline-block';

        const drawGame = () => {
            // Очистка canvas
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Рисуем сетку
            ctx.strokeStyle = '#2a2a2a';
            ctx.lineWidth = 0.5;
            for (let i = 0; i < tileCount; i++) {
                ctx.beginPath();
                ctx.moveTo(i * gridSize, 0);
                ctx.lineTo(i * gridSize, canvas.height);
                ctx.stroke();
                
                ctx.beginPath();
                ctx.moveTo(0, i * gridSize);
                ctx.lineTo(canvas.width, i * gridSize);
                ctx.stroke();
            }

            // Рисуем змейку
            ctx.fillStyle = '#10b981';
            snake.body.forEach((segment, index) => {
                if (index === 0) {
                    // Голова змейки
                    ctx.fillStyle = '#059669';
                } else {
                    ctx.fillStyle = '#10b981';
                }
                ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize-1, gridSize-1);
                
                // Глаза у головы
                if (index === 0) {
                    ctx.fillStyle = '#ffffff';
                    const eyeSize = 3;
                    const offset = 5;
                    
                    // Левый глаз
                    ctx.fillRect(
                        segment.x * gridSize + offset, 
                        segment.y * gridSize + offset, 
                        eyeSize, eyeSize
                    );
                    
                    // Правый глаз
                    ctx.fillRect(
                        (segment.x + 1) * gridSize - offset - eyeSize, 
                        segment.y * gridSize + offset, 
                        eyeSize, eyeSize
                    );
                }
            });

            // Рисуем еду
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            const centerX = food.x * gridSize + gridSize/2;
            const centerY = food.y * gridSize + gridSize/2;
            const radius = gridSize/2 - 2;
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            ctx.fill();

            // Обновляем счет
            document.getElementById(`score-${widgetId}`).textContent = score;
        };

        const updateGame = () => {
            if (!gameRunning) return;

            const head = {x: snake.body[0].x + snake.dx, y: snake.body[0].y + snake.dy};

            // Проверка столкновения со стеной
            if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
                gameOver();
                return;
            }

            // Проверка столкновения с собой
            for (let segment of snake.body) {
                if (head.x === segment.x && head.y === segment.y) {
                    gameOver();
                    return;
                }
            }

            // Добавляем новую голову
            snake.body.unshift(head);

            // Проверка съедания еды
            if (head.x === food.x && head.y === food.y) {
                score += 10;
                
                // Обновляем рекорд
                const highScore = parseInt(document.getElementById(`highscore-${widgetId}`).textContent);
                if (score > highScore) {
                    document.getElementById(`highscore-${widgetId}`).textContent = score;
                    localStorage.setItem(`snake_highscore_${widgetId}`, score);
                }
                
                // Генерируем новую еду
                food = {
                    x: Math.floor(Math.random() * tileCount),
                    y: Math.floor(Math.random() * tileCount)
                };
                
                // Проверяем, что еда не появилась на змейке
                let foodOnSnake = false;
                do {
                    foodOnSnake = false;
                    for (let segment of snake.body) {
                        if (food.x === segment.x && food.y === segment.y) {
                            foodOnSnake = true;
                            food = {
                                x: Math.floor(Math.random() * tileCount),
                                y: Math.floor(Math.random() * tileCount)
                            };
                            break;
                        }
                    }
                } while (foodOnSnake);
            } else {
                // Удаляем хвост, если не съели еду
                snake.body.pop();
            }

            drawGame();
        };

        const gameOver = () => {
            gameRunning = false;
            clearInterval(gameLoop);
            
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#ffffff';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Игра окончена!', canvas.width/2, canvas.height/2 - 20);
            ctx.font = '16px Arial';
            ctx.fillText(`Очки: ${score}`, canvas.width/2, canvas.height/2 + 10);
            
            // Показываем кнопку старта, прячем паузу
            startBtn.style.display = 'inline-block';
            pauseBtn.style.display = 'none';
        };

        // Обработчик клавиш
        const handleKeyDown = (e) => {
            if (!gameRunning) return;

            const key = e.key;
            
            // Стрелки или WASD
            if ((key === 'ArrowUp' || key === 'w' || key === 'ц') && snake.dy === 0) {
                snake.dx = 0;
                snake.dy = -1;
            } else if ((key === 'ArrowDown' || key === 's' || key === 'ы') && snake.dy === 0) {
                snake.dx = 0;
                snake.dy = 1;
            } else if ((key === 'ArrowLeft' || key === 'a' || key === 'ф') && snake.dx === 0) {
                snake.dx = -1;
                snake.dy = 0;
            } else if ((key === 'ArrowRight' || key === 'd' || key === 'в') && snake.dx === 0) {
                snake.dx = 1;
                snake.dy = 0;
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        // Запускаем игровой цикл
        gameLoop = setInterval(updateGame, 150);
        
        // Сохраняем ссылку на игровой цикл
        this.games.get(widgetId).gameLoop = gameLoop;

        // Первая отрисовка
        drawGame();
    }

    static pauseGame(widgetId) {
        const game = this.games.get(widgetId);
        const startBtn = document.getElementById(`start-btn-${widgetId}`);
        const pauseBtn = document.getElementById(`pause-btn-${widgetId}`);
        
        if (game && game.gameRunning) {
            game.gameRunning = false;
            startBtn.style.display = 'inline-block';
            pauseBtn.style.display = 'none';
            startBtn.textContent = '▶️ Продолжить';
        } else if (game) {
            game.gameRunning = true;
            startBtn.style.display = 'none';
            pauseBtn.style.display = 'inline-block';
        }
    }

    static resetGame(widgetId) {
        const game = this.games.get(widgetId);
        const startBtn = document.getElementById(`start-btn-${widgetId}`);
        const pauseBtn = document.getElementById(`pause-btn-${widgetId}`);
        
        if (game && game.gameLoop) {
            clearInterval(game.gameLoop);
        }
        
        // Сбрасываем UI
        startBtn.style.display = 'inline-block';
        pauseBtn.style.display = 'none';
        startBtn.textContent = '🎮 Старт';
        document.getElementById(`score-${widgetId}`).textContent = '0';
        
        // Перезагружаем виджет
        const widget = dashboard.widgets.find(w => w.id == widgetId);
        if (widget) {
            dashboard.loadWidgetData(widget);
        }
    }

    static getSettingsHTML(widget) {
        return `
            <div class="setting-group">
                <label class="setting-label">Скорость игры</label>
                <select class="setting-input" id="gameSpeed">
                    <option value="slow">Медленная</option>
                    <option value="medium" selected>Средняя</option>
                    <option value="fast">Быстрая</option>
                </select>
            </div>
            <div class="setting-group">
                <label class="setting-label">Размер поля</label>
                <select class="setting-input" id="gridSize">
                    <option value="small">15x15</option>
                    <option value="medium" selected>20x20</option>
                    <option value="large">25x25</option>
                </select>
            </div>
            <div style="font-size: 0.8rem; color: #666; margin-top: 1rem;">
                Классическая игра "Змейка"
            </div>
        `;
    }
}