// Виджет для случайных мемов
class MemesWidget {
    static async fetchData() {
        try {
            // Используем API для мемов который не требует ключа
            const response = await fetch('https://meme-api.com/gimme');
            
            if (!response.ok) {
                throw new Error('Meme API не доступен');
            }
            
            const data = await response.json();
            
            return {
                title: data.title,
                imageUrl: data.url,
                author: data.author || 'Reddit',
                subreddit: data.subreddit,
                upvotes: data.ups || Math.floor(Math.random() * 1000) + 100,
                comments: data.numComments || Math.floor(Math.random() * 100) + 10,
                created: new Date().toLocaleDateString('ru-RU'),
                postUrl: data.postLink || '#'
            };
        } catch (error) {
            console.error('Ошибка загрузки мема:', error);
            return this.getFallbackMeme();
        }
    }

    static getFallbackMeme() {
        const fallbackMemes = [
            {
                title: 'Когда твой код работает с первого раза',
                imageUrl: 'https://i.imgflip.com/1bij.jpg',
                author: 'Programmer',
                subreddit: 'ProgrammerHumor',
                upvotes: 999,
                comments: 42,
                created: new Date().toLocaleDateString('ru-RU')
            },
            {
                title: 'Понедельник быть таким',
                imageUrl: 'https://i.imgflip.com/1g8my4.jpg',
                author: 'OfficeWorker',
                subreddit: 'memes',
                upvotes: 750,
                comments: 35,
                created: new Date().toLocaleDateString('ru-RU')
            },
            {
                title: 'Отладка в 3 утра',
                imageUrl: 'https://i.imgflip.com/1c1uej.jpg',
                author: 'Debugger',
                subreddit: 'ProgrammerHumor',
                upvotes: 1200,
                comments: 78,
                created: new Date().toLocaleDateString('ru-RU')
            }
        ];
        
        return fallbackMemes[Math.floor(Math.random() * fallbackMemes.length)];
    }

    static getContentHTML(data) {
        return `
            <div class="memes-content">
                <div class="meme-header">
                    <h4>${data.title}</h4>
                    <div class="meme-meta">
                        <span>👤 ${data.author}</span>
                        <span>📅 ${data.created}</span>
                    </div>
                </div>
                
                <div class="meme-image-container">
                    <img src="${data.imageUrl}" alt="${data.title}" class="meme-image" 
                         onerror="this.src='https://i.imgflip.com/1bij.jpg'">
                </div>
                
                <div class="meme-stats">
                    <div class="meme-stat">
                        <span style="color: #ff4500;">⬆️</span>
                        <span>${MemesWidget.formatNumber(data.upvotes)}</span>
                    </div>
                    <div class="meme-stat">
                        <span>💬</span>
                        <span>${MemesWidget.formatNumber(data.comments)}</span>
                    </div>
                    <div class="meme-stat">
                        <span>🏷️</span>
                        <span>r/${data.subreddit}</span>
                    </div>
                </div>
                
                <div class="meme-actions">
                    <button class="btn-secondary" onclick="dashboard.loadWidgetData(dashboard.widgets.find(w => w.id == this.closest('.widget').dataset.widgetId))">
                        🔄 Другой мем
                    </button>
                    ${data.postUrl && data.postUrl !== '#' ? `
                        <button class="btn-primary" onclick="MemesWidget.viewPost('${data.postUrl}')">
                            🔗 На Reddit
                        </button>
                    ` : ''}
                    <button class="btn-secondary" onclick="MemesWidget.shareMeme('${data.imageUrl}', '${data.title}')">
                        📤 Поделиться
                    </button>
                </div>
            </div>
        `;
    }

    static formatNumber(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num;
    }

    static viewPost(url) {
        if (url && url !== '#') {
            window.open(url, '_blank');
        }
    }

    static shareMeme(imageUrl, title) {
        if (navigator.share) {
            navigator.share({
                title: title,
                text: 'Посмотри этот мем!',
                url: imageUrl
            });
        } else {
            // Fallback - копируем ссылку
            navigator.clipboard.writeText(imageUrl).then(() => {
                alert('Ссылка на мем скопирована в буфер обмена!');
            });
        }
    }

    static getSettingsHTML(widget) {
        return `
            <div class="setting-group">
                <label class="setting-label">Источник мемов</label>
                <select class="setting-input" id="memeSource">
                    <option value="all">Все сообщества</option>
                    <option value="memes">r/memes</option>
                    <option value="dankmemes">r/dankmemes</option>
                    <option value="programmerhumor">r/ProgrammerHumor</option>
                </select>
            </div>
            <div style="font-size: 0.8rem; color: #666; margin-top: 1rem;">
                Источник: Meme API + Reddit
            </div>
        `;
    }
}