// Виджет для генерации случайных цветовых палитр
class ColorPaletteWidget {
    static async fetchData() {
        // Генерируем случайную палитру из 5 цветов
        const palette = [];
        for (let i = 0; i < 5; i++) {
            palette.push(this.generateColor());
        }
        
        return {
            palette: palette,
            paletteName: this.generatePaletteName(),
            createdAt: new Date().toISOString()
        };
    }

    static generateColor() {
        const hue = Math.floor(Math.random() * 360);
        const saturation = 70 + Math.floor(Math.random() * 30);
        const lightness = 50 + Math.floor(Math.random() * 30);
        
        return {
            hex: this.hslToHex(hue, saturation, lightness),
            hsl: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
            rgb: this.hslToRgb(hue, saturation, lightness)
        };
    }

    static hslToHex(h, s, l) {
        const rgb = this.hslToRgb(h, s, l);
        return `#${((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1)}`;
    }

    static hslToRgb(h, s, l) {
        s /= 100;
        l /= 100;
        
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = l - c / 2;
        
        let r, g, b;
        
        if (h >= 0 && h < 60) {
            [r, g, b] = [c, x, 0];
        } else if (h >= 60 && h < 120) {
            [r, g, b] = [x, c, 0];
        } else if (h >= 120 && h < 180) {
            [r, g, b] = [0, c, x];
        } else if (h >= 180 && h < 240) {
            [r, g, b] = [0, x, c];
        } else if (h >= 240 && h < 300) {
            [r, g, b] = [x, 0, c];
        } else {
            [r, g, b] = [c, 0, x];
        }
        
        return {
            r: Math.round((r + m) * 255),
            g: Math.round((g + m) * 255),
            b: Math.round((b + m) * 255)
        };
    }

    static generatePaletteName() {
        const adjectives = ['Теплая', 'Холодная', 'Яркая', 'Пастельная', 'Контрастная', 'Нежная', 'Сочная', 'Элегантная'];
        const nouns = ['Палитра', 'Гамма', 'Комбинация', 'Схема', 'Подборка'];
        const styles = ['Весны', 'Лета', 'Океана', 'Леса', 'Заката', 'Рассвета'];
        
        return `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]} ${styles[Math.floor(Math.random() * styles.length)]}`;
    }

    static getContentHTML(data) {
        return `
            <div class="color-palette-content">
                <h4 style="margin-bottom: 1rem; text-align: center;">${data.paletteName}</h4>
                <div class="palette-colors">
                    ${data.palette.map((color, index) => `
                        <div class="color-item" style="background-color: ${color.hex};" onclick="ColorPaletteWidget.copyColor('${color.hex}')">
                            <div class="color-info">
                                <div class="color-hex">${color.hex}</div>
                                <div class="color-rgb">rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="palette-actions">
                    <button class="btn-secondary" onclick="dashboard.loadWidgetData(this.closest('.widget').dataset.widgetId)">🎨 Новая палитра</button>
                    <button class="btn-secondary" onclick="ColorPaletteWidget.savePalette(${JSON.stringify(data).replace(/\"/g, '&quot;')})">💾 Сохранить</button>
                </div>
            </div>
        `;
    }

    static copyColor(color) {
        navigator.clipboard.writeText(color).then(() => {
            // Показываем временное уведомление
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--success-color);
                color: white;
                padding: 10px 20px;
                border-radius: 5px;
                z-index: 10000;
            `;
            notification.textContent = `Скопировано: ${color}`;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 2000);
        });
    }

    static savePalette(paletteData) {
        const dataStr = JSON.stringify(paletteData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `palette-${Date.now()}.json`;
        link.click();
    }

    static getSettingsHTML(widget) {
        return `
            <div class="setting-group">
                <label class="setting-label">Количество цветов</label>
                <select class="setting-input" id="colorsCount">
                    <option value="3">3 цвета</option>
                    <option value="5" selected>5 цветов</option>
                    <option value="7">7 цветов</option>
                </select>
            </div>
            <div class="setting-group">
                <label class="setting-label">Тип палитры</label>
                <select class="setting-input" id="paletteType">
                    <option value="random">Случайная</option>
                    <option value="analogous">Аналогичная</option>
                    <option value="complementary">Комплементарная</option>
                    <option value="triadic">Триада</option>
                </select>
            </div>
        `;
    }
}