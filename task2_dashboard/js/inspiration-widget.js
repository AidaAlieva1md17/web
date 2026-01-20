// Виджет для случайных красивых изображений
class InspirationWidget {
    static async fetchData() {
        try {
            // Используем Picsum Photos API который работает без ключа
            const imageId = Math.floor(Math.random() * 1000);
            const imageUrl = `https://picsum.photos/id/${imageId}/600/400`;
            
            // Проверяем что изображение существует
            const img = new Image();
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                img.src = imageUrl;
            });

            return {
                imageUrl: imageUrl,
                photographer: 'Picsum Photos',
                description: this.getImageDescription(imageId)
            };
        } catch (error) {
            console.error('Ошибка загрузки изображения:', error);
            return this.getFallbackImages();
        }
    }

    static getImageDescription(id) {
        const descriptions = [
            'Вдохновляющий пейзаж для творчества',
            'Красивый вид для релаксации',
            'Архитектурная композиция',
            'Природная гармония',
            'Абстрактная композиция',
            'Городской пейзаж',
            'Морской вид',
            'Горный ландшафт'
        ];
        return descriptions[id % descriptions.length];
    }

    static getFallbackImages() {
        const fallbackImages = [
            {
                imageUrl: 'https://picsum.photos/id/1015/600/400',
                photographer: 'Picsum Photos',
                description: 'Горный пейзаж'
            },
            {
                imageUrl: 'https://picsum.photos/id/1018/600/400',
                photographer: 'Picsum Photos',
                description: 'Лесной водопад'
            },
            {
                imageUrl: 'https://picsum.photos/id/1025/600/400',
                photographer: 'Picsum Photos',
                description: 'Природная красота'
            }
        ];
        
        return fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
    }

    static getContentHTML(data) {
        return `
            <div class="inspiration-content">
                <div class="inspiration-image-container">
                    <img src="${data.imageUrl}" alt="${data.description}" class="inspiration-image" 
                         onerror="this.src='https://picsum.photos/id/103${Math.floor(Math.random() * 9)}/600/400'">
                    <div class="image-overlay">
                        <div class="image-info">
                            <div class="image-description">${data.description}</div>
                            <div class="photographer">
                                📸 ${data.photographer}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="inspiration-actions">
                    <button class="btn-secondary" onclick="dashboard.loadWidgetData(dashboard.widgets.find(w => w.id == this.closest('.widget').dataset.widgetId))">
                        🎨 Другое изображение
                    </button>
                </div>
            </div>
        `;
    }

    static downloadImage(imageUrl) {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = 'inspiration-' + Date.now() + '.jpg';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    static getSettingsHTML(widget) {
        return `
            <div class="setting-group">
                <label class="setting-label">Категория изображений</label>
                <select class="setting-input" id="imageCategory">
                    <option value="any">Любая</option>
                    <option value="nature">Природа</option>
                    <option value="architecture">Архитектура</option>
                    <option value="people">Люди</option>
                </select>
            </div>
            <div style="font-size: 0.8rem; color: #666; margin-top: 1rem;">
                Источник: Picsum Photos API
            </div>
        `;
    }
}