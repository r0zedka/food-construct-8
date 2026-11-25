// Страница «Собрать ланч»: выбор блюд, панель перехода к оформлению, загрузка данных.

const panel = document.querySelector('#order-panel');
const panelTotal = document.querySelector('#panel-total');
const panelLink = document.querySelector('#panel-link');

// Обновляет панель: скрывает её, если ничего не выбрано, считает стоимость,
// включает ссылку, только когда состав заказа — одно из комбо
function updatePanel() {
  const hasSelection = CATEGORIES.some(function (category) {
    return selected[category] !== null;
  });

  panel.style.display = hasSelection ? 'flex' : 'none';
  panelTotal.textContent = getTotal() + '₽';

  const isCombo = getMissingMessage() === null;
  panelLink.classList.toggle('disabled', !isCombo);
  panelLink.setAttribute('aria-disabled', String(!isCombo));
  panelLink.tabIndex = isCombo ? 0 : -1;
}

// Ссылка «Перейти к оформлению» не работает, пока состав заказа не комбо
panelLink.addEventListener('click', function (event) {
  if (panelLink.classList.contains('disabled')) {
    event.preventDefault();
  }
});

// Один обработчик на все карточки: клик по кнопке «Добавить»
document.querySelectorAll('.dishes').forEach(function (container) {
  container.addEventListener('click', function (event) {
    if (!event.target.classList.contains('dish-button')) {
      return;
    }
    const card = event.target.closest('.dish');
    const dish = dishes.find(function (item) {
      return item.keyword === card.dataset.dish;
    });
    selected[dish.category] = dish;
    saveSelection();
    displayCategory(dish.category);
    updatePanel();
  });
});

panel.style.display = 'none';

// Загружаем блюда, восстанавливаем выбор из localStorage и рисуем страницу
loadDishes()
  .then(function () {
    restoreSelection();
    CATEGORIES.forEach(displayCategory);
    updatePanel();
  })
  .catch(function (error) {
    console.error(error);
    showNotification('Не удалось загрузить меню. Попробуйте обновить страницу');
  });
