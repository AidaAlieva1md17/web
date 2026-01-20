class Dashboard {
    constructor() {
        this.widgets = [];
        this.nextId = 1;
        this.draggedWidget = null;
        
        this.initializeEventListeners();
        this.loadFromLocalStorage();
        this.updateEmptyState();
    }

    initializeEventListeners() {
        // Кнопки управления
        document.getElementById('addWidgetBtn').addEventListener('click', () => this.showWidgetModal());
        document.getElementById('addFirstWidget').addEventListener('click', () => this.showWidgetModal());
        
        // Экспорт/импорт
        document.getElementById('exportBtn').addEventListener('click', () => this.exportConfig());
        document.getElementById('importBtn').addEventListener('click', () => document.getElementById('importFile').click());
        document.getElementById('importFile').addEventListener('change', (e) => this.importConfig(e));
        
        // Модальные окна
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => this.hideModals());
        });
        
        document.querySelector('.close-settings').addEventListener('click', () => this.hideModals());
        document.querySelector('.save-settings').addEventListener('click', () => this.saveSettings());
        
        // Список виджетов
        document.querySelectorAll('.widget-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const type = e.currentTarget.dataset.type;
                this.addWidget(type);
                this.hideModals();
            });
        });

        // Drag and Drop
        document.getElementById('widgetsGrid').addEventListener('dragstart', (e) => this.onDragStart(e));
        document.getElementById('widgetsGrid').addEventListener('dragover', (e) => this.onDragOver(e));
        document.getElementById('widgetsGrid').addEventListener('drop', (e) => this.onDrop(e));
        document.getElementById('widgetsGrid').addEventListener('dragend', (e) => this.onDragEnd(e));
    }

    showWidgetModal() {
        document.getElementById('widgetModal').classList.add('show');
    }

    hideModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('show');
        });
    }

    addWidget(type, config = {}) {
        const id = this.nextId++;
        const widget = {
            id,
            type,
            config,
            data: null
        };

        this.widgets.push(widget);
        this.renderWidget(widget);
        this.saveToLocalStorage();
        this.updateEmptyState();
        
        // Загружаем данные для нового виджета
        this.loadWidgetData(widget);
    }

    renderWidget(widget) {
        const grid = document.getElementById('widgetsGrid');
        const widgetElement = document.createElement('div');
        widgetElement.className = 'widget';
        widgetElement.draggable = true;
        widgetElement.dataset.widgetId = widget.id;

        const widgetConfig = this.getWidgetConfig(widget.type);
        
        widgetElement.innerHTML = `
            <div class="widget-header">
                <h3 class="widget-title">${widgetConfig.title}</h3>
                <div class="widget-controls">
                    <button class="widget-control-btn settings-btn" title="Настройки">⚙️</button>
                    <button class="widget-control-btn refresh-btn" title="Обновить">↻</button>
                    <button class="widget-control-btn delete-btn" title="Удалить">✕</button>
                </div>
            </div>
            <div class="widget-content">
                <div class="loading">
                    <div class="spinner"></div>
                    <div>Загрузка...</div>
                </div>
            </div>
        `;

        // Добавляем обработчики событий
        widgetElement.querySelector('.refresh-btn').addEventListener('click', () => {
            this.loadWidgetData(widget);
        });

        widgetElement.querySelector('.delete-btn').addEventListener('click', () => {
            this.removeWidget(widget.id);
        });

        widgetElement.querySelector('.settings-btn').addEventListener('click', () => {
            this.showSettingsModal(widget);
        });

        grid.appendChild(widgetElement);
    }

    getWidgetConfig(type) {
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
            }
        };
        return configs[type] || { title: 'Виджет' };
    }

    async loadWidgetData(widget) {
        const widgetElement = document.querySelector(`[data-widget-id="${widget.id}"]`);
        const contentElement = widgetElement.querySelector('.widget-content');
        
        try {
            contentElement.innerHTML = `
                <div class="loading">
                    <div class="spinner"></div>
                    <div>Загрузка...</div>
                </div>
            `;

            let data;
            switch (widget.type) {
                case 'quote':
                    data = await this.fetchQuote();
                    break;
                case 'weather':
                    data = await this.fetchWeather(widget.config.city || 'Москва');
                    break;
                case 'currency':
                    data = await this.fetchCurrency();
                    break;
                case 'joke':
                    data = await this.fetchJoke();
                    break;
            }

            widget.data = data;
            this.updateWidgetContent(widget, data);
            
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
            contentElement.innerHTML = `
                <div class="error">
                    <div>Ошибка загрузки данных</div>
                    <div style="font-size: 0.8rem; margin: 0.5rem 0; color: #666;">${error.message}</div>
                    <button class="btn-secondary mt-2" onclick="dashboard.loadWidgetData(${JSON.stringify(widget).replace(/\"/g, '&quot;')})">Повторить</button>
                </div>
            `;
        }
    }

    async fetchQuote() {
        try {
            // Используем надежный API для цитат
            const response = await fetch('https://zenquotes.io/api/random');
            if (!response.ok) throw new Error('API не доступен');
            const data = await response.json();
            
            return {
                content: data[0].q,
                author: data[0].a
            };
        } catch (error) {
            // Резервный API
            console.log('Используем резервный API для цитат');
            const fallbackResponse = await fetch('https://api.quotable.io/random');
            const fallbackData = await fallbackResponse.json();
            
            return {
                content: fallbackData.content,
                author: fallbackData.author
            };
        }
    }

    async fetchWeather(city) {
        try {
            // Сначала получаем координаты города
            const geoResponse = await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=ru`
            );
            const geoData = await geoResponse.json();
            
            if (!geoData.results || geoData.results.length === 0) {
                throw new Error('Город не найден');
            }

            const location = geoData.results[0];
            const { latitude, longitude } = location;

            // Затем получаем погоду по координатам
            const weatherResponse = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
            );
            const weatherData = await weatherResponse.json();

            return {
                temperature: weatherData.current_weather.temperature,
                description: this.getWeatherDescription(weatherData.current_weather.weathercode),
                windSpeed: weatherData.current_weather.windspeed,
                location: location.name,
                country: location.country,
                todayMax: weatherData.daily?.temperature_2m_max?.[0],
                todayMin: weatherData.daily?.temperature_2m_min?.[0]
            };
        } catch (error) {
            throw new Error(`Ошибка получения погоды: ${error.message}`);
        }
    }

    getWeatherDescription(code) {
        const descriptions = {
            0: '☀️ Ясно',
            1: '🌤️ Преимущественно ясно',
            2: '⛅ Переменная облачность',
            3: '☁️ Пасмурно',
            45: '🌫️ Туман',
            48: '🌫️ Густой туман',
            51: '🌧️ Легкая морось',
            53: '🌧️ Морось',
            55: '🌧️ Сильная морось',
            61: '🌧️ Небольшой дождь',
            63: '🌧️ Дождь',
            65: '⛈️ Сильный дождь',
            71: '❄️ Небольшой снег',
            73: '❄️ Снег',
            75: '❄️ Сильный снег',
            80: '🌦️ Небольшие ливни',
            81: '🌦️ Ливни',
            82: '⛈️ Сильные ливни'
        };
        return descriptions[code] || '❓ Неизвестно';
    }

    async fetchCurrency() {
        try {
            // Используем API Центробанка России для получения курсов валют
            const response = await fetch('https://www.cbr-xml-daily.ru/daily_json.js');
            if (!response.ok) throw new Error('API не доступен');
            const data = await response.json();
            
            // Форматируем данные для отображения
            const rates = {
                'USD': data.Valute.USD.Value.toFixed(2),
                'EUR': data.Valute.EUR.Value.toFixed(2),
                'GBP': data.Valute.GBP.Value.toFixed(2),
                'CNY': data.Valute.CNY.Value.toFixed(2)
            };
            
            return rates;
        } catch (error) {
            throw new Error(`Ошибка получения курсов валют: ${error.message}`);
        }
    }

    async fetchJoke() {
        try {
            // API для случайных шуток
            const response = await fetch('https://official-joke-api.appspot.com/random_joke');
            if (!response.ok) throw new Error('API не доступен');
            const data = await response.json();
            
            return {
                setup: data.setup,
                punchline: data.punchline,
                type: data.type
            };
        } catch (error) {
            // Резервный API для шуток
            console.log('Используем резервный API для шуток');
            const fallbackResponse = await fetch('https://v2.jokeapi.dev/joke/Any?type=twopart');
            const fallbackData = await fallbackResponse.json();
            
            return {
                setup: fallbackData.setup,
                punchline: fallbackData.delivery,
                type: fallbackData.category
            };
        }
    }

    updateWidgetContent(widget, data) {
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
        }
        
        contentElement.innerHTML = html;
    }

    // Настройки виджетов
    showSettingsModal(widget) {
        this.currentSettingsWidget = widget;
        document.getElementById('settingsTitle').textContent = `Настройки: ${this.getWidgetConfig(widget.type).title}`;
        
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
                
            default:
                settingsHtml = '<p>Для этого виджета нет настроек</p>';
        }
        
        document.getElementById('settingsContent').innerHTML = settingsHtml;
        document.getElementById('settingsModal').classList.add('show');
    }

    saveSettings() {
        if (!this.currentSettingsWidget) return;
        
        const widget = this.currentSettingsWidget;
        
        switch (widget.type) {
            case 'weather':
                widget.config.city = document.getElementById('weatherCity').value;
                break;
        }
        
        this.loadWidgetData(widget);
        this.saveToLocalStorage();
        this.hideModals();
    }

    // Drag and Drop
    onDragStart(e) {
        if (!e.target.classList.contains('widget')) return;
        
        this.draggedWidget = e.target;
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
    }

    onDragOver(e) {
        e.preventDefault();
        const widget = e.target.closest('.widget');
        if (widget && widget !== this.draggedWidget) {
            const rect = widget.getBoundingClientRect();
            const next = (e.clientY - rect.top) / (rect.bottom - rect.top) > 0.5;
            
            const grid = document.getElementById('widgetsGrid');
            if (next && widget.nextSibling) {
                grid.insertBefore(this.draggedWidget, widget.nextSibling);
            } else {
                grid.insertBefore(this.draggedWidget, widget);
            }
        }
    }

    onDrop(e) {
        e.preventDefault();
        this.saveWidgetOrder();
    }

    onDragEnd(e) {
        if (this.draggedWidget) {
            this.draggedWidget.classList.remove('dragging');
            this.draggedWidget = null;
        }
    }

    saveWidgetOrder() {
        const grid = document.getElementById('widgetsGrid');
        const newOrder = Array.from(grid.children).map(child => parseInt(child.dataset.widgetId));
        
        this.widgets.sort((a, b) => newOrder.indexOf(a.id) - newOrder.indexOf(b.id));
        this.saveToLocalStorage();
    }

    removeWidget(widgetId) {
        this.widgets = this.widgets.filter(w => w.id !== widgetId);
        const widgetElement = document.querySelector(`[data-widget-id="${widgetId}"]`);
        if (widgetElement) {
            widgetElement.remove();
        }
        this.saveToLocalStorage();
        this.updateEmptyState();
    }

    updateEmptyState() {
        const emptyState = document.getElementById('emptyState');
        const widgetsGrid = document.getElementById('widgetsGrid');
        
        if (this.widgets.length === 0) {
            emptyState.classList.remove('hidden');
            widgetsGrid.classList.add('hidden');
        } else {
            emptyState.classList.add('hidden');
            widgetsGrid.classList.remove('hidden');
        }
    }

    // Локальное хранилище
    saveToLocalStorage() {
        const config = {
            widgets: this.widgets,
            nextId: this.nextId
        };
        localStorage.setItem('dashboardConfig', JSON.stringify(config));
    }

    loadFromLocalStorage() {
        const saved = localStorage.getItem('dashboardConfig');
        if (saved) {
            try {
                const config = JSON.parse(saved);
                this.widgets = config.widgets || [];
                this.nextId = config.nextId || 1;
                
                // Перерендериваем все виджеты
                this.widgets.forEach(widget => {
                    this.renderWidget(widget);
                    this.loadWidgetData(widget);
                });
                
                this.updateEmptyState();
            } catch (error) {
                console.error('Ошибка загрузки конфигурации:', error);
            }
        }
    }

    // Экспорт/импорт
    exportConfig() {
        const config = {
            widgets: this.widgets,
            nextId: this.nextId,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
        
        const dataStr = JSON.stringify(config, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `dashboard-config-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }

    importConfig(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const config = JSON.parse(e.target.result);
                
                // Очищаем текущие виджеты
                this.widgets = [];
                document.getElementById('widgetsGrid').innerHTML = '';
                
                // Загружаем новые
                this.widgets = config.widgets || [];
                this.nextId = config.nextId || 1;
                
                this.widgets.forEach(widget => {
                    this.renderWidget(widget);
                    this.loadWidgetData(widget);
                });
                
                this.updateEmptyState();
                this.saveToLocalStorage();
                
                event.target.value = ''; // Сбрасываем input file
                
                alert('Конфигурация успешно импортирована!');
                
            } catch (error) {
                console.error('Ошибка импорта конфигурации:', error);
                alert('Ошибка при импорте конфигурации: неверный формат файла');
            }
        };
        reader.readAsText(file);
    }
}

// Инициализация дашборда
let dashboard;
document.addEventListener('DOMContentLoaded', () => {
    dashboard = new Dashboard();
});