// Проверка состава ланча (5 комбо) и уведомления. Используется на обеих страницах.
// Десерт можно добавить в любой вариант ланча.

// Возвращает текст уведомления о недостающих блюдах или null, если набор — одно из комбо
function getMissingMessage() {
  const hasSoup = selected.soup !== null;
  const hasMain = selected.main !== null;
  const hasSalad = selected.salad !== null;
  const hasDrink = selected.drink !== null;
  const hasDessert = selected.dessert !== null;

  if (!hasSoup && !hasMain && !hasSalad && !hasDrink && !hasDessert) {
    return 'Ничего не выбрано. Выберите блюда для заказа';
  }
  if (hasSoup && !hasMain && !hasSalad) {
    return 'Выберите главное блюдо/салат/стартер';
  }
  if (hasSalad && !hasSoup && !hasMain) {
    return 'Выберите суп или главное блюдо';
  }
  if (!hasSoup && !hasMain && !hasSalad) {
    return 'Выберите главное блюдо';
  }
  if (!hasDrink) {
    return 'Выберите напиток';
  }
  if (hasMain || (hasSoup && hasSalad)) {
    return null;
  }
  return 'Выберите главное блюдо';
}

// Создаёт уведомление и добавляет его на страницу
function showNotification(text) {
  closeNotification();

  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.setAttribute('role', 'alert');

  const message = document.createElement('p');
  message.className = 'notification-text';
  message.textContent = text;

  const button = document.createElement('button');
  button.className = 'notification-button';
  button.type = 'button';
  button.textContent = 'Окей 👌';
  button.addEventListener('click', closeNotification);

  notification.append(message, button);
  document.body.append(notification);
}

// Убирает уведомление со страницы
function closeNotification() {
  const existing = document.querySelector('.notification');
  if (existing) {
    existing.remove();
  }
}
