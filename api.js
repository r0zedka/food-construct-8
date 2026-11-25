// Загрузка блюд с сервера (API).
// Адрес сервера для тех, кто размещает сайт на GitHub Pages или Netlify
const API_BASE = 'https://edu.std-900.ist.mospolytech.ru';
const API_URL = API_BASE + '/labs/api/dishes';

// Личный ключ для доступа к заказам. Его выдают в СДО Московского Политеха.
// Вставьте свой ключ между кавычками, например: '123e4567-e89b-12d3-a456-426655440000'
const API_KEY = '';

// Массив блюд. Он пустой, пока ответ от сервера не пришёл
let dishes = [];

// Приводит название категории с сервера к тем, что используются на странице:
// soup, main, salad, drink, dessert
function normalizeCategory(value) {
  const text = String(value).toLowerCase();
  if (text.includes('soup')) {
    return 'soup';
  }
  if (text.includes('main')) {
    return 'main';
  }
  if (text.includes('salad') || text.includes('starter')) {
    return 'salad';
  }
  if (text.includes('drink') || text.includes('beverage')) {
    return 'drink';
  }
  if (text.includes('dessert') || text.includes('desert')) {
    return 'dessert';
  }
  return text;
}

// Приводит вид блюда (kind) к значениям data-kind кнопок фильтров
function normalizeKind(value) {
  const text = String(value).toLowerCase();
  if (text.startsWith('veg')) {
    return 'veg';
  }
  if (text.startsWith('fish')) {
    return 'fish';
  }
  if (text.startsWith('meat')) {
    return 'meat';
  }
  if (text.startsWith('med') || text.startsWith('mid')) {
    return 'medium';
  }
  if (text.startsWith('small')) {
    return 'small';
  }
  if (text.startsWith('large') || text.startsWith('big')) {
    return 'large';
  }
  return text;
}

// Если сайт открыт по https, картинки тоже должны грузиться по https
function secureUrl(url) {
  if (window.location.protocol === 'https:') {
    return String(url).replace(/^http:\/\//, 'https://');
  }
  return url;
}

// Запрашивает блюда у сервера и сохраняет их в массив dishes
async function loadDishes() {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Сервер ответил с ошибкой: ' + response.status);
  }

  const data = await response.json(); // ответ приходит в формате JSON

  dishes = data.map(function (dish) {
    return {
      id: dish.id, // идентификатор блюда на сервере
      keyword: dish.keyword,
      name: dish.name,
      price: Number(dish.price),
      category: normalizeCategory(dish.category),
      count: dish.count,
      image: secureUrl(dish.image),
      kind: normalizeKind(dish.kind)
    };
  });

  return dishes;
}

// Отправляет заказ на сервер. Если сервер вернул ошибку, выбрасывает исключение
async function sendOrder(order) {
  if (!API_KEY) {
    throw new Error('Не задан API-ключ. Впишите его в файл api.js');
  }

  const response = await fetch(API_BASE + '/labs/api/orders?api_key=' + API_KEY, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order)
  });

  let data = {};
  try {
    data = await response.json();
  } catch (error) {
    data = {};
  }

  if (!response.ok) {
    throw new Error(data.error || 'Ошибка сервера: ' + response.status);
  }
  return data;
}
