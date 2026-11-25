// Страница «Собрать ланч»: фильтрация, сортировка и вывод карточек.
// Массив dishes заполняется в api.js после ответа сервера.

// Активный фильтр по категориям (null — фильтр не выбран, показываются все блюда)
const activeKind = { soup: null, main: null, salad: null, drink: null, dessert: null };

// Выводит блюда одной категории: фильтр по kind, сортировка по алфавиту, отрисовка
function displayCategory(category) {
  const container = document.querySelector('.dishes[data-category="' + category + '"]');
  container.innerHTML = '';

  dishes
    .filter(function (dish) {
      return dish.category === category &&
        (activeKind[category] === null || dish.kind === activeKind[category]);
    })
    .sort(function (a, b) {
      return a.name.localeCompare(b.name, 'ru');
    })
    .forEach(function (dish) {
      // Выбранное блюдо остаётся с рамкой, даже если фильтр его скрывал
      const isSelected = selected[category] !== null && selected[category].id === dish.id;
      container.append(createDishCard(dish, 'Добавить', isSelected));
    });
}
