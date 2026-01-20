// Виджет для раскрашивания изображений
class ColoringWidget {
    static async fetchData() {
        // Возвращаем данные для раскраски
        return {
            currentImage: this.getRandomImage(),
            colors: this.generateColorPalette(),
            lastSave: null
        };
    }

    static getRandomImage() {
        const images = [
            {
                id: 1,
                name: "Мандала",
                svg: this.generateMandala(),
                category: "mandala"
            },
            {
                id: 2, 
                name: "Животные",
                svg: this.generateAnimal(),
                category: "animals"
            },
            {
                id: 3,
                name: "Природа",
                svg: this.generateNature(),
                category: "nature"
            },
            {
                id: 4,
                name: "Геометрия",
                svg: this.generateGeometry(),
                category: "geometry"
            }
        ];
        
        return images[Math.floor(Math.random() * images.length)];
    }

    static generateMandala() {
        return `
            <svg width="200" height="200" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="90" fill="none" stroke="#333" stroke-width="2" class="colorable" data-id="bg"/>
                <circle cx="100" cy="100" r="70" fill="none" stroke="#333" stroke-width="1" class="colorable" data-id="circle1"/>
                <circle cx="100" cy="100" r="50" fill="none" stroke="#333" stroke-width="1" class="colorable" data-id="circle2"/>
                <circle cx="100" cy="100" r="30" fill="none" stroke="#333" stroke-width="1" class="colorable" data-id="circle3"/>
                
                <!-- Лепестки -->
                ${Array.from({length: 8}, (_, i) => {
                    const angle = (i * 45) * Math.PI / 180;
                    const x1 = 100 + 70 * Math.cos(angle);
                    const y1 = 100 + 70 * Math.sin(angle);
                    const x2 = 100 + 90 * Math.cos(angle);
                    const y2 = 100 + 90 * Math.sin(angle);
                    return `<path d="M${x1},${y1} L${x2},${y2}" stroke="#333" stroke-width="2" class="colorable" data-id="petal-${i}"/>`;
                }).join('')}
                
                <!-- Украшения -->
                ${Array.from({length: 12}, (_, i) => {
                    const angle = (i * 30) * Math.PI / 180;
                    const x = 100 + 40 * Math.cos(angle);
                    const y = 100 + 40 * Math.sin(angle);
                    return `<circle cx="${x}" cy="${y}" r="8" fill="none" stroke="#333" stroke-width="1" class="colorable" data-id="decoration-${i}"/>`;
                }).join('')}
            </svg>
        `;
    }

    static generateAnimal() {
        return `
            <svg width="200" height="200" viewBox="0 0 200 200">
                <!-- Тело -->
                <ellipse cx="100" cy="120" rx="40" ry="30" fill="none" stroke="#333" stroke-width="2" class="colorable" data-id="body"/>
                
                <!-- Голова -->
                <circle cx="100" cy="80" r="25" fill="none" stroke="#333" stroke-width="2" class="colorable" data-id="head"/>
                
                <!-- Уши -->
                <circle cx="85" cy="65" r="8" fill="none" stroke="#333" stroke-width="1" class="colorable" data-id="ear1"/>
                <circle cx="115" cy="65" r="8" fill="none" stroke="#333" stroke-width="1" class="colorable" data-id="ear2"/>
                
                <!-- Глаза -->
                <circle cx="92" cy="78" r="3" fill="#333" class="colorable" data-id="eye1"/>
                <circle cx="108" cy="78" r="3" fill="#333" class="colorable" data-id="eye2"/>
                
                <!-- Нос -->
                <circle cx="100" cy="85" r="4" fill="#333" class="colorable" data-id="nose"/>
                
                <!-- Усы -->
                <path d="M100,87 L80,82" stroke="#333" stroke-width="1" class="colorable" data-id="whisker1"/>
                <path d="M100,87 L120,82" stroke="#333" stroke-width="1" class="colorable" data-id="whisker2"/>
                <path d="M100,89 L80,94" stroke="#333" stroke-width="1" class="colorable" data-id="whisker3"/>
                <path d="M100,89 L120,94" stroke="#333" stroke-width="1" class="colorable" data-id="whisker4"/>
                
                <!-- Хвост -->
                <path d="M140,120 Q160,100 140,80" stroke="#333" stroke-width="2" fill="none" class="colorable" data-id="tail"/>
            </svg>
        `;
    }

    static generateNature() {
        return `
            <svg width="200" height="200" viewBox="0 0 200 200">
                <!-- Земля -->
                <rect x="0" y="160" width="200" height="40" fill="none" stroke="#333" stroke-width="1" class="colorable" data-id="ground"/>
                
                <!-- Ствол -->
                <rect x="95" y="100" width="10" height="60" fill="none" stroke="#333" stroke-width="2" class="colorable" data-id="trunk"/>
                
                <!-- Крона -->
                <circle cx="100" cy="90" r="30" fill="none" stroke="#333" stroke-width="2" class="colorable" data-id="tree-top"/>
                
                <!-- Солнце -->
                <circle cx="160" cy="40" r="15" fill="none" stroke="#333" stroke-width="2" class="colorable" data-id="sun"/>
                
                <!-- Облака -->
                <ellipse cx="50" cy="50" rx="20" ry="12" fill="none" stroke="#333" stroke-width="1" class="colorable" data-id="cloud1"/>
                <ellipse cx="65" cy="45" rx="15" ry="10" fill="none" stroke="#333" stroke-width="1" class="colorable" data-id="cloud2"/>
                
                <!-- Цветы -->
                ${Array.from({length: 5}, (_, i) => {
                    const x = 30 + i * 35;
                    return `
                        <circle cx="${x}" cy="150" r="8" fill="none" stroke="#333" stroke-width="1" class="colorable" data-id="flower-${i}"/>
                        <circle cx="${x}" cy="150" r="3" fill="#333" class="colorable" data-id="flower-center-${i}"/>
                    `;
                }).join('')}
            </svg>
        `;
    }

    static generateGeometry() {
        return `
            <svg width="200" height="200" viewBox="0 0 200 200">
                <!-- Основные фигуры -->
                <rect x="30" y="30" width="60" height="60" fill="none" stroke="#333" stroke-width="2" class="colorable" data-id="square"/>
                <circle cx="150" cy="60" r="30" fill="none" stroke="#333" stroke-width="2" class="colorable" data-id="circle"/>
                <polygon points="100,150 70,90 130,90" fill="none" stroke="#333" stroke-width="2" class="colorable" data-id="triangle"/>
                
                <!-- Внутренние элементы -->
                <circle cx="60" cy="60" r="15" fill="none" stroke="#333" stroke-width="1" class="colorable" data-id="inner-circle"/>
                <rect x="135" y="45" width="20" height="20" fill="none" stroke="#333" stroke-width="1" class="colorable" data-id="inner-square"/>
                
                <!-- Декоративные линии -->
                <path d="M30,30 L170,170" stroke="#333" stroke-width="1" class="colorable" data-id="diagonal1"/>
                <path d="M170,30 L30,170" stroke="#333" stroke-width="1" class="colorable" data-id="diagonal2"/>
                
                <!-- Точки -->
                ${Array.from({length: 6}, (_, i) => {
                    const x = 40 + i * 25;
                    const y = 180;
                    return `<circle cx="${x}" cy="${y}" r="3" fill="#333" class="colorable" data-id="dot-${i}"/>`;
                }).join('')}
            </svg>
        `;
    }

    static generateColorPalette() {
        const palettes = [
            ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'], // Яркие
            ['#DDA0DD', '#98FB98', '#87CEEB', '#FFD700', '#FFA07A'], // Пастельные
            ['#2C3E50', '#E74C3C', '#ECF0F1', '#3498DB', '#F1C40F'], // Контрастные
            ['#8B4513', '#228B22', '#1E90FF', '#FFD700', '#DC143C']  // Натуральные
        ];
        
        return palettes[Math.floor(Math.random() * palettes.length)];
    }

    static getContentHTML(data, widgetId) {
        return `
            <div class="coloring-content">
                <div class="coloring-header">
                    <h4>${data.currentImage.name}</h4>
                    <div class="coloring-controls">
                        <button class="btn-secondary" onclick="ColoringWidget.newImage('${widgetId}')">
                            🎨 Новая раскраска
                        </button>
                        <button class="btn-secondary" onclick="ColoringWidget.saveColoring('${widgetId}')">
                            💾 Сохранить
                        </button>
                        <button class="btn-secondary" onclick="ColoringWidget.resetColoring('${widgetId}')">
                            🔄 Сбросить
                        </button>
                    </div>
                </div>
                
                <div class="coloring-workspace">
                    <div class="coloring-canvas" id="coloring-canvas-${widgetId}">
                        ${data.currentImage.svg}
                    </div>
                    
                    <div class="color-palette" id="color-palette-${widgetId}">
                        ${data.colors.map((color, index) => `
                            <div class="color-option" style="background-color: ${color};" 
                                 onclick="ColoringWidget.selectColor('${widgetId}', '${color}')"
                                 data-color="${color}">
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="coloring-tools">
                    <div class="selected-color" id="selected-color-${widgetId}">
                        Выбранный цвет: <span class="color-preview" style="background-color: ${data.colors[0]}"></span>
                    </div>
                    <div class="tool-info">
                        <small>🎯 Кликните на область для раскрашивания</small>
                    </div>
                </div>
            </div>
        `;
    }

    static selectColor(widgetId, color) {
        // Обновляем выбранный цвет
        const selectedColorElement = document.getElementById(`selected-color-${widgetId}`);
        selectedColorElement.innerHTML = `Выбранный цвет: <span class="color-preview" style="background-color: ${color}"></span>`;
        
        // Сохраняем выбранный цвет в данных виджета
        const widget = dashboard.widgets.find(w => w.id == widgetId);
        if (widget) {
            widget.selectedColor = color;
        }
        
        // Подсвечиваем выбранный цвет в палитре
        document.querySelectorAll(`#color-palette-${widgetId} .color-option`).forEach(option => {
            option.classList.remove('selected');
            if (option.dataset.color === color) {
                option.classList.add('selected');
            }
        });
    }

    static initColoring(widgetId) {
        const canvas = document.getElementById(`coloring-canvas-${widgetId}`);
        if (!canvas) return;

        const colorableElements = canvas.querySelectorAll('.colorable');
        
        colorableElements.forEach(element => {
            element.addEventListener('click', function() {
                const widget = dashboard.widgets.find(w => w.id == widgetId);
                if (widget && widget.selectedColor) {
                    if (this.tagName === 'path' || this.tagName === 'line') {
                        this.style.stroke = widget.selectedColor;
                    } else if (this.tagName === 'circle' || this.tagName === 'ellipse' || this.tagName === 'rect' || this.tagName === 'polygon') {
                        if (this.getAttribute('fill') === 'none') {
                            this.style.fill = widget.selectedColor;
                        } else {
                            this.style.fill = widget.selectedColor;
                        }
                    }
                }
            });
            
            // Добавляем hover эффект
            element.addEventListener('mouseenter', function() {
                this.style.cursor = 'pointer';
                const widget = dashboard.widgets.find(w => w.id == widgetId);
                if (widget && widget.selectedColor) {
                    this.style.opacity = '0.7';
                }
            });
            
            element.addEventListener('mouseleave', function() {
                this.style.opacity = '1';
            });
        });
        
        // Выбираем первый цвет по умолчанию
        const widget = dashboard.widgets.find(w => w.id == widgetId);
        if (widget && widget.data && widget.data.colors) {
            this.selectColor(widgetId, widget.data.colors[0]);
        }
    }

    static newImage(widgetId) {
        const widget = dashboard.widgets.find(w => w.id == widgetId);
        if (widget) {
            dashboard.loadWidgetData(widget);
        }
    }

    static resetColoring(widgetId) {
        const canvas = document.getElementById(`coloring-canvas-${widgetId}`);
        if (canvas) {
            const colorableElements = canvas.querySelectorAll('.colorable');
            colorableElements.forEach(element => {
                element.style.fill = '';
                element.style.stroke = '';
            });
        }
    }

    static saveColoring(widgetId) {
        const canvas = document.getElementById(`coloring-canvas-${widgetId}`);
        if (canvas) {
            const svgElement = canvas.querySelector('svg');
            if (svgElement) {
                const serializer = new XMLSerializer();
                let source = serializer.serializeToString(svgElement);
                
                // Добавляем XML declaration
                if (!source.match(/^<\?xml/)) {
                    source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
                }
                
                // Преобразуем в blob
                const blob = new Blob([source], { type: 'image/svg+xml' });
                const url = URL.createObjectURL(blob);
                
                // Создаем ссылку для скачивания
                const link = document.createElement('a');
                link.href = url;
                link.download = `coloring-${widgetId}-${Date.now()}.svg`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                // Освобождаем URL
                setTimeout(() => URL.revokeObjectURL(url), 100);
            }
        }
    }

    static getSettingsHTML(widget) {
        return `
            <div class="setting-group">
                <label class="setting-label">Тип раскраски</label>
                <select class="setting-input" id="coloringType">
                    <option value="random">Случайная</option>
                    <option value="mandala">Мандалы</option>
                    <option value="animals">Животные</option>
                    <option value="nature">Природа</option>
                    <option value="geometry">Геометрия</option>
                </select>
            </div>
            <div class="setting-group">
                <label class="setting-label">Сложность</label>
                <select class="setting-input" id="coloringDifficulty">
                    <option value="simple">Простая</option>
                    <option value="medium" selected>Средняя</option>
                    <option value="complex">Сложная</option>
                </select>
            </div>
            <div class="setting-group">
                <label class="setting-label">Цветовая палитра</label>
                <select class="setting-input" id="colorPaletteType">
                    <option value="bright">Яркая</option>
                    <option value="pastel">Пастельная</option>
                    <option value="contrast">Контрастная</option>
                    <option value="natural">Натуральная</option>
                </select>
            </div>
            <div style="font-size: 0.8rem; color: #666; margin-top: 1rem;">
                🎨 Терапевтическая раскраска для релаксации
            </div>
        `;
    }
}