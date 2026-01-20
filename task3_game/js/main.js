import Game from './Game.js';

document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    game.init().catch(error => {
        console.error('Ошибка при инициализации игры:', error);
        const gameMessage = document.getElementById('gameMessage');
        const messageTitle = document.getElementById('messageTitle');
        const messageText = document.getElementById('messageText');
        const messageButton = document.getElementById('messageButton');
        
        messageTitle.textContent = 'ОШИБКА';
        messageText.textContent = 'Не удалось загрузить ресурсы игры. Проверьте подключение.';
        messageButton.textContent = 'ПОВТОРИТЬ';
        messageButton.onclick = () => window.location.reload();
        gameMessage.style.display = 'block';
    });
});