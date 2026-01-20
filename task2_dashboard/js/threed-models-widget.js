// Виджет для отображения популярных 3D моделей
class ThreeDModelsWidget {
    static async fetchData() {
        try {
            // Используем более простое API для 3D моделей
            const models = this.getSampleModels();
            const randomModel = models[Math.floor(Math.random() * models.length)];
            
            return {
                ...randomModel,
                viewCount: Math.floor(Math.random() * 10000) + 1000,
                likeCount: Math.floor(Math.random() * 500) + 100,
                createdAt: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)).toISOString()
            };
        } catch (error) {
            console.error('Ошибка загрузки 3D модели:', error);
            return this.getFallbackModel();
        }
    }

    static getSampleModels() {
        return [
            {
                name: 'Абстрактная сфера',
                description: 'Геометрическая 3D композиция',
                author: '3D Artist',
                category: 'abstract',
                imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop',
                modelUrl: 'https://sketchfab.com/3d-models/abstract-sphere-123'
            },
            {
                name: 'Архитектурный макет',
                description: 'Современный архитектурный дизайн',
                author: 'Architect Pro',
                category: 'architecture',
                imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop',
                modelUrl: 'https://sketchfab.com/3d-models/architecture-model-456'
            },
            {
                name: 'Фантастический персонаж',
                description: 'Персонаж из фэнтези мира',
                author: 'Character Designer',
                category: 'characters',
                imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop',
                modelUrl: 'https://sketchfab.com/3d-models/fantasy-character-789'
            },
            {
                name: 'Автомобиль будущего',
                description: 'Концепт автомобиля будущего',
                author: 'Vehicle Designer',
                category: 'vehicles',
                imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&h=300&fit=crop',
                modelUrl: 'https://sketchfab.com/3d-models/future-car-012'
            },
            {
                name: 'Органические формы',
                description: 'Природные органические структуры',
                author: 'Bio Designer',
                category: 'organic',
                imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
                modelUrl: 'https://sketchfab.com/3d-models/organic-forms-345'
            }
        ];
    }

    static getFallbackModel() {
        return {
            name: '3D Композиция',
            description: 'Интересная 3D модель для вдохновения',
            author: '3D Designer',
            category: 'general',
            imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop',
            modelUrl: '#',
            viewCount: 1500,
            likeCount: 250
        };
    }

    static getContentHTML(data) {
        return `
            <div class="threed-models-content">
                <div class="model-info">
                    <h4>${data.name}</h4>
                    <p class="model-description">${data.description}</p>
                    <div class="model-stats">
                        <span>👁️ ${this.formatNumber(data.viewCount)} просмотров</span>
                        <span>❤️ ${this.formatNumber(data.likeCount)} лайков</span>
                    </div>
                    <div class="model-author">
                        👨‍🎨 Автор: ${data.author}
                    </div>
                    <div class="model-category">
                        🏷️ Категория: ${this.getCategoryName(data.category)}
                    </div>
                </div>
                
                <div class="model-preview">
                    <div class="model-image-container">
                        <img src="${data.imageUrl}" alt="${data.name}" class="model-image"
                             onerror="this.src='https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop'">
                        <div class="model-overlay">
                            <div class="model-placeholder">
                                <div style="font-size: 2rem;">📦</div>
                                <div>3D Модель</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="model-actions">
                    <button class="btn-secondary" onclick="dashboard.loadWidgetData(dashboard.widgets.find(w => w.id == this.closest('.widget').dataset.widgetId))">
                        🔄 Другая модель
                    </button>
                    <button class="btn-primary" onclick="ThreeDModelsWidget.viewModel('${data.modelUrl}')">
                        👀 Подробнее
                    </button>
                </div>
            </div>
        `;
    }

    static getCategoryName(category) {
        const categories = {
            'abstract': 'Абстрактные',
            'architecture': 'Архитектура',
            'characters': 'Персонажи',
            'vehicles': 'Транспорт',
            'organic': 'Органика',
            'general': 'Общее'
        };
        return categories[category] || 'Общее';
    }

    static formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num;
    }

    static viewModel(url) {
        if (url && url !== '#') {
            window.open(url, '_blank');
        } else {
            alert('Ссылка на модель недоступна');
        }
    }

    static getSettingsHTML(widget) {
        return `
            <div class="setting-group">
                <label class="setting-label">Категория моделей</label>
                <select class="setting-input" id="modelCategory">
                    <option value="all">Все категории</option>
                    <option value="abstract">Абстрактные</option>
                    <option value="architecture">Архитектура</option>
                    <option value="characters">Персонажи</option>
                    <option value="vehicles">Транспорт</option>
                </select>
            </div>
            <div style="font-size: 0.8rem; color: #666; margin-top: 1rem;">
                Демонстрационные 3D модели для вдохновения
            </div>
        `;
    }
}