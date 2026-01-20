// Сервис для работы с API
class ApiService {
    static async fetchQuote() {
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

    static async fetchWeather(city) {
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
                description: ApiService.getWeatherDescription(weatherData.current_weather.weathercode),
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

    static getWeatherDescription(code) {
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

    static async fetchCurrency() {
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

    static async fetchJoke() {
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

    static async fetchWidgetData(widgetType, config = {}) {
        switch (widgetType) {
            case 'quote':
                return await ApiService.fetchQuote();
            case 'weather':
                return await ApiService.fetchWeather(config.city || 'Москва');
            case 'currency':
                return await ApiService.fetchCurrency();
            case 'joke':
                return await ApiService.fetchJoke();
            case 'inspiration':
                return await InspirationWidget.fetchData();
            case 'colorpalette':
                return await ColorPaletteWidget.fetchData();
            case 'threedmodels':
                return await ThreeDModelsWidget.fetchData();
            case 'tarot':
                return await TarotWidget.fetchData();
            case 'memes':
                return await MemesWidget.fetchData();
            case 'coloring':
                return await ColoringWidget.fetchData();
            case 'snake':
                return await SnakeWidget.fetchData();
            default:
                throw new Error(`Неизвестный тип виджета: ${widgetType}`);
        }
    }
}