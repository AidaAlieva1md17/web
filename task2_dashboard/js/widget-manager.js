// Менеджер для управления виджетами
class WidgetManager {
    static getWidgetConfig(type) {
        const configs = {
            quote: { 
                title: '📖 Случайная цитата'
            },
            weather: { 
                title: '🌤️ Погода'
            },
            currency: { 
                title: '💱 Курсы валют'
            },
            joke: {
                title: '😄 Случайные шутки'
            },
            inspiration: {
                title: '🎨 Дизайн вдохновение'
            },
            colorpalette: {
                title: '🎨 Палитра цветов'
            },
            threedmodels: {
                title: '📦 3D Модели'
            },
            tarot: {
                title: '🔮 Карты Таро'
            },
            memes: {
                title: '😂 Случайные мемы'
            },
            coloring: {
                title: '🎨 Раскраска'
            },
            snake: {
                title: '🐍 Змейка'
            }
        };
        return configs[type] || { title: 'Виджет' };
    }

    static updateWidgetContent(widget, data) {
        const widgetElement = document.querySelector(`[data-widget-id="${widget.id}"]`);
        const contentElement = widgetElement.querySelector('.widget-content');
        
        let html = '';
        
        switch (widget.type) {
            case 'quote':
                html = `
                    <div class="quote-content">
                        <div class="quote-text">"${data.content}"</div>
                        <div class="quote-author">— ${data.author}</div>
                        <button class="btn-secondary mt-2" onclick="dashboard.loadWidgetData(${JSON.stringify(widget).replace(/\"/g, '&quot;')})">Следующая цитата</button>
                    </div>
                `;
                break;
                
            case 'weather':
                html = `
                    <div class="weather-content">
                        <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">${Math.round(data.temperature)}°C</div>
                        <div class="weather-desc">${data.description}</div>
                        <div style="margin: 0.5rem 0;">
                            <small>💨 Ветер: ${data.windSpeed} км/ч</small>
                        </div>
                        ${data.todayMax && data.todayMin ? `
                            <div style="font-size: 0.8rem; color: #666;">
                                📊 Мин: ${Math.round(data.todayMin)}°C / Макс: ${Math.round(data.todayMax)}°C
                            </div>
                        ` : ''}
                        <div style="margin-top: 0.5rem; font-weight: 500;">
                            📍 ${data.location}, ${data.country}
                        </div>
                    </div>
                `;
                break;
                
            case 'currency':
                html = `
                    <div class="currency-content">
                        ${Object.entries(data).map(([currency, rate]) => `
                            <div class="currency-item">
                                <span>1 ${currency} =</span>
                                <span class="currency-value">${rate} ₽</span>
                            </div>
                        `).join('')}
                        <div style="margin-top: 1rem; text-align: center;">
                            <small>Курс ЦБ РФ • ${new Date().toLocaleDateString('ru-RU')}</small>
                        </div>
                    </div>
                `;
                break;
                
            case 'joke':
                html = `
                    <div class="joke-content">
                        <span class="joke-type">${data.type}</span>
                        <div class="joke-text">${data.setup}</div>
                        <div class="joke-text" style="font-weight: 600; color: var(--primary-color);">${data.punchline}</div>
                        <button class="btn-secondary mt-2" onclick="dashboard.loadWidgetData(${JSON.stringify(widget).replace(/\"/g, '&quot;')})">Другая шутка</button>
                    </div>
                `;
                break;

            case 'inspiration':
                html = InspirationWidget.getContentHTML(data);
                break;

            case 'colorpalette':
                html = ColorPaletteWidget.getContentHTML(data);
                break;

            case 'threedmodels':
                html = ThreeDModelsWidget.getContentHTML(data);
                break;

            case 'tarot':
                html = TarotWidget.getContentHTML(data);
                break;

            case 'memes':
                html = MemesWidget.getContentHTML(data);
                break;

            case 'coloring':
                html = ColoringWidget.getContentHTML(data, widget.id);
                break;

            case 'snake':
                html = SnakeWidget.getContentHTML(data, widget.id);
                break;
        }
        
        contentElement.innerHTML = html;
    }

    static showSettingsModal(widget, dashboardInstance) {
        dashboardInstance.currentSettingsWidget = widget;
        document.getElementById('settingsTitle').textContent = `Настройки: ${WidgetManager.getWidgetConfig(widget.type).title}`;
        
        let settingsHtml = '';
        
        switch (widget.type) {
            case 'weather':
                settingsHtml = `
                    <div class="setting-group">
                        <label class="setting-label">Город</label>
                        <input type="text" class="setting-input" id="weatherCity" 
                               value="${widget.config.city || 'Москва'}" placeholder="Введите город">
                    </div>
                    <div style="font-size: 0.8rem; color: #666; margin-top: 0.5rem;">
                        Примеры: Москва, London, New York, Tokyo
                    </div>
                `;
                break;
                
            case 'currency':
                settingsHtml = `
                    <p>Курсы валют загружаются с официального сайта Центробанка России</p>
                    <div style="font-size: 0.8rem; color: #666; margin-top: 1rem;">
                        Обновляется ежедневно
                    </div>
                `;
                break;
                
            case 'quote':
                settingsHtml = `
                    <p>Цитаты загружаются из открытых источников</p>
                    <div style="font-size: 0.8rem; color: #666; margin-top: 1rem;">
                        Источники: ZenQuotes API, Quotable API
                    </div>
                `;
                break;
                
            case 'joke':
                settingsHtml = `
                    <p>Шутки загружаются из публичных API</p>
                    <div style="font-size: 0.8rem; color: #666; margin-top: 1rem;">
                        Источники: Official Joke API, JokeAPI
                    </div>
                `;
                break;

            case 'inspiration':
                settingsHtml = InspirationWidget.getSettingsHTML(widget);
                break;

            case 'colorpalette':
                settingsHtml = ColorPaletteWidget.getSettingsHTML(widget);
                break;

            case 'threedmodels':
                settingsHtml = ThreeDModelsWidget.getSettingsHTML(widget);
                break;

            case 'tarot':
                settingsHtml = TarotWidget.getSettingsHTML(widget);
                break;

            case 'memes':
                settingsHtml = MemesWidget.getSettingsHTML(widget);
                break;

            case 'coloring':
                settingsHtml = ColoringWidget.getSettingsHTML(widget);
                break;

            case 'snake':
                settingsHtml = SnakeWidget.getSettingsHTML(widget);
                break;
                
            default:
                settingsHtml = '<p>Для этого виджета нет настроек</p>';
        }
        
        document.getElementById('settingsContent').innerHTML = settingsHtml;
        document.getElementById('settingsModal').classList.add('show');
    }

    static saveSettings(dashboardInstance) {
        if (!dashboardInstance.currentSettingsWidget) return;
        
        const widget = dashboardInstance.currentSettingsWidget;
        
        switch (widget.type) {
            case 'weather':
                widget.config.city = document.getElementById('weatherCity').value;
                break;
            // Добавьте сохранение настроек для других виджетов при необходимости
        }
        
        dashboardInstance.loadWidgetData(widget);
        dashboardInstance.saveToLocalStorage();
        dashboardInstance.hideModals();
    }
}