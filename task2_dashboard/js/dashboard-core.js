// Базовый класс для управления дашбордом
class DashboardCore {
    constructor() {
        this.widgets = [];
        this.nextId = 1;
        this.draggedWidget = null;
        this.currentSettingsWidget = null;
    }

    // Сохранение в локальное хранилище
    saveToLocalStorage() {
        const config = {
            widgets: this.widgets,
            nextId: this.nextId
        };
        localStorage.setItem('dashboardConfig', JSON.stringify(config));
    }

    // Загрузка из локального хранилища
    loadFromLocalStorage() {
        const saved = localStorage.getItem('dashboardConfig');
        if (saved) {
            try {
                const config = JSON.parse(saved);
                this.widgets = config.widgets || [];
                this.nextId = config.nextId || 1;
            } catch (error) {
                console.error('Ошибка загрузки конфигурации:', error);
            }
        }
    }

    // Drag and Drop методы
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

    // Управление состоянием пустого дашборда
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

    // Экспорт/импорт конфигурации
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

    // Управление модальными окнами
    showWidgetModal() {
        document.getElementById('widgetModal').classList.add('show');
    }

    hideModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('show');
        });
    }

    // Базовые методы, которые должны быть реализованы в дочерних классах
    initializeEventListeners() {
        throw new Error('Метод initializeEventListeners должен быть реализован');
    }

    addWidget(type, config = {}) {
        throw new Error('Метод addWidget должен быть реализован');
    }

    renderWidget(widget) {
        throw new Error('Метод renderWidget должен быть реализован');
    }

    loadWidgetData(widget) {
        throw new Error('Метод loadWidgetData должен быть реализован');
    }

    removeWidget(widgetId) {
        throw new Error('Метод removeWidget должен быть реализован');
    }
}