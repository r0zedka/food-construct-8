// Выбранные блюда и их сохранение в localStorage.
// В localStorage хранятся только идентификаторы (id) блюд, например:
// {"soup":3,"main":null,"salad":12,"drink":20,"dessert":null}

const STORAGE_KEY = 'foodConstructOrder';
const CATEGORIES = ['soup', 'main', 'salad', 'drink', 'dessert'];

// Выбранные блюда по категориям (объекты блюд, null — ничего не выбрано)
const selected = { soup: null, main: null, salad: null, drink: null, dessert: null };

// Сохраняет id выбранных блюд в localStorage
function saveSelection() {
  const ids = {};
  CATEGORIES.forEach(function (category) {
    ids[category] = selected[category] ? selected[category].id : null;
  });
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch (error) {
    console.error('Не удалось сохранить заказ', error);
  }
}

// Читает id из localStorage и находит блюда в загруженном массиве dishes
function restoreSelection() {
  let ids = {};
  try {
    ids = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch (error) {
    ids = {};
  }

  CATEGORIES.forEach(function (category) {
    const found = dishes.find(function (dish) {
      return dish.id === ids[category] && dish.category === category;
    });
    selected[category] = found || null;
  });
}

// Очищает выбор и удаляет данные из localStorage
function clearSelection() {
  CATEGORIES.forEach(function (category) {
    selected[category] = null;
  });
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error(error);
  }
}

// Суммарная стоимость выбранных блюд
function getTotal() {
  let total = 0;
  CATEGORIES.forEach(function (category) {
    if (selected[category]) {
      total += selected[category].price;
    }
  });
  return total;
}
