// Основной класс дашборда, объединяющий все компоненты
class Dashboard extends DashboardCore {
    constructor() {
        super();
        
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
        document.querySelector('.save-settings').addEventListener('click', () => WidgetManager.saveSettings(this));
        
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

        const widgetConfig = WidgetManager.getWidgetConfig(widget.type);
        
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
            WidgetManager.showSettingsModal(widget, this);
        });

        grid.appendChild(widgetElement);
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

            const data = await ApiService.fetchWidgetData(widget.type, widget.config);
            widget.data = data;
            WidgetManager.updateWidgetContent(widget, data);
            
            // Инициализация интерактивных виджетов после загрузки
            if (widget.type === 'coloring') {
                setTimeout(() => ColoringWidget.initColoring(widget.id), 100);
            } else if (widget.type === 'snake') {
                setTimeout(() => {
                    const widgetData = this.widgets.find(w => w.id === widget.id);
                    if (widgetData) {
                        SnakeWidget.initGame(widget.id, widgetData.data);
                    }
                }, 100);
            }
            
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

    removeWidget(widgetId) {
        this.widgets = this.widgets.filter(w => w.id !== widgetId);
        const widgetElement = document.querySelector(`[data-widget-id="${widgetId}"]`);
        if (widgetElement) {
            widgetElement.remove();
        }
        this.saveToLocalStorage();
        this.updateEmptyState();
    }

    // Переопределяем метод загрузки для инициализации всех виджетов
    loadFromLocalStorage() {
        super.loadFromLocalStorage();
        
        // Перерендериваем все виджеты
        this.widgets.forEach(widget => {
            this.renderWidget(widget);
            this.loadWidgetData(widget);
        });
    }
}

// Инициализация дашборда
let dashboard;
document.addEventListener('DOMContentLoaded', () => {
    dashboard = new Dashboard();
});