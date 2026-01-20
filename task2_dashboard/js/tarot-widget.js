// Виджет для случайных раскладов карт Таро
class TarotWidget {
    static async fetchData() {
        try {
            // Используем API для карт Таро
            const response = await fetch('https://rws-cards-api.herokuapp.com/api/v1/cards/random?n=3');
            
            if (!response.ok) {
                throw new Error('Таро API не доступен');
            }
            
            const data = await response.json();
            return {
                cards: data.cards,
                spreadName: this.getSpreadName(),
                reading: this.generateReading(data.cards),
                date: new Date().toLocaleDateString('ru-RU')
            };
        } catch (error) {
            console.error('Ошибка загрузки карт Таро:', error);
            return this.getFallbackCards();
        }
    }

    static getSpreadName() {
        const spreads = [
            'Расклад "Три карты судьбы"',
            'Расклад "Прошлое-Настоящее-Будущее"',
            'Расклад "Силы-Слабости-Возможности"',
            'Расклад "Путь к успеху"'
        ];
        return spreads[Math.floor(Math.random() * spreads.length)];
    }

    static generateReading(cards) {
        const positions = ['Прошлое', 'Настоящее', 'Будущее'];
        return cards.map((card, index) => ({
            position: positions[index],
            card: card,
            interpretation: this.getInterpretation(card)
        }));
    }

    static getInterpretation(card) {
        // База интерпретаций для карт
        const interpretations = {
            'past': [
                'Этот опыт помог вам стать сильнее',
                'Прошлые уроки формируют ваше настоящее',
                'Воспоминания, которые стоит переосмыслить'
            ],
            'present': [
                'Сосредоточьтесь на текущем моменте',
                'Возможности вокруг вас - используйте их',
                'Ваши действия сейчас определяют будущее'
            ],
            'future': [
                'Новые горизонты ждут вас',
                'Будьте готовы к изменениям',
                'Ваши мечты начинают сбываться'
            ]
        };
        
        const type = card.type === 'major' ? 'major' : 'minor';
        const randomInt = Math.floor(Math.random() * 3);
        
        return interpretations.past[randomInt]; // Упрощенная версия
    }

    static getFallbackCards() {
        const fallbackCards = [
            {
                name: 'Шут',
                name_short: 'ar00',
                value: '0',
                meaning_up: 'Новые начинания, невинность, спонтанность',
                type: 'major'
            },
            {
                name: 'Волшебник',
                name_short: 'ar01',
                value: 'I',
                meaning_up: 'Мастерство, сила воли, проявление',
                type: 'major'
            },
            {
                name: 'Верховная Жрица',
                name_short: 'ar02',
                value: 'II',
                meaning_up: 'Интуиция, тайны, высшее знание',
                type: 'major'
            }
        ];
        
        return {
            cards: fallbackCards,
            spreadName: 'Расклад "Три карты судьбы"',
            reading: [
                {
                    position: 'Прошлое',
                    card: fallbackCards[0],
                    interpretation: 'Период невинности и новых начинаний'
                },
                {
                    position: 'Настоящее',
                    card: fallbackCards[1],
                    interpretation: 'Время проявлять свою волю и мастерство'
                },
                {
                    position: 'Будущее',
                    card: fallbackCards[2],
                    interpretation: 'Глубинная мудрость откроется вам'
                }
            ],
            date: new Date().toLocaleDateString('ru-RU')
        };
    }

    static getContentHTML(data) {
        return `
            <div class="tarot-content">
                <div class="tarot-header">
                    <h4>${data.spreadName}</h4>
                    <div class="tarot-date">🔮 ${data.date}</div>
                </div>
                
                <div class="tarot-cards">
                    ${data.reading.map(item => `
                        <div class="tarot-card-item">
                            <div class="card-position">${item.position}</div>
                            <div class="card-name">${item.card.name}</div>
                            <div class="card-meaning">${item.card.meaning_up}</div>
                            <div class="card-interpretation">${item.interpretation}</div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="tarot-actions">
                    <button class="btn-secondary" onclick="dashboard.loadWidgetData(this.closest('.widget').dataset.widgetId)">🔄 Новый расклад</button>
                    <button class="btn-secondary" onclick="TarotWidget.saveReading(${JSON.stringify(data).replace(/\"/g, '&quot;')})">📝 Сохранить</button>
                </div>
            </div>
        `;
    }

    static saveReading(readingData) {
        const dataStr = JSON.stringify(readingData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `tarot-reading-${Date.now()}.json`;
        link.click();
    }

    static getSettingsHTML(widget) {
        return `
            <div class="setting-group">
                <label class="setting-label">Тип расклада</label>
                <select class="setting-input" id="spreadType">
                    <option value="three-cards">Три карты</option>
                    <option value="celtic-cross">Кельтский крест</option>
                    <option value="relationship">Отношения</option>
                    <option value="career">Карьера</option>
                </select>
            </div>
            <div class="setting-group">
                <label class="setting-label">Уровень детализации</label>
                <select class="setting-input" id="detailLevel">
                    <option value="basic">Базовый</option>
                    <option value="detailed" selected>Подробный</option>
                    <option value="advanced">Расширенный</option>
                </select>
            </div>
            <div style="font-size: 0.8rem; color: #666; margin-top: 1rem;">
                Источник: Tarot API
            </div>
        `;
    }
}