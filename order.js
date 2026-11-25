// Страница «Оформить заказ»: состав заказа, форма и отправка на сервер.

const form = document.querySelector('#order-form');
const composition = document.querySelector('#composition');
const emptyMessage = document.querySelector('#empty-message');
const timeInput = document.querySelector('#delivery-time');

// Рисует карточки выбранных блюд (с кнопкой «Удалить») и обновляет список в форме
function render() {
  composition.innerHTML = '';
  CATEGORIES.forEach(function (category) {
    if (selected[category]) {
      composition.append(createDishCard(selected[category], 'Удалить', false));
    }
  });

  const isEmpty = CATEGORIES.every(function (category) {
    return selected[category] === null;
  });
  emptyMessage.style.display = isEmpty ? 'block' : 'none';

  document.querySelectorAll('.order-item').forEach(function (item) {
    const dish = selected[item.dataset.category];
    const text = item.querySelector('.order-dish');
    if (dish) {
      text.textContent = dish.name + ' ' + dish.price + '₽';
    } else {
      text.textContent = item.dataset.category === 'main' ? 'Не выбрано' : 'Не выбран';
    }
  });
  document.querySelector('#order-price').textContent = getTotal() + '₽';
}

// Удаление блюда: убираем из заказа, из localStorage и со страницы
composition.addEventListener('click', function (event) {
  if (!event.target.classList.contains('dish-button')) {
    return;
  }
  const card = event.target.closest('.dish');
  CATEGORIES.forEach(function (category) {
    if (selected[category] && selected[category].keyword === card.dataset.dish) {
      selected[category] = null;
    }
  });
  saveSelection();
  render();
});

// Время доставки обязательно, только если выбрано «К указанному времени»
document.querySelectorAll('input[name="delivery_type"]').forEach(function (radio) {
  radio.addEventListener('change', function () {
    timeInput.required = radio.value === 'by_time' && radio.checked;
  });
});

// Собирает данные формы и выбранные блюда в объект для сервера
function collectOrder() {
  const deliveryType = document.querySelector('input[name="delivery_type"]:checked').value;
  const order = {
    full_name: document.querySelector('#customer-name').value.trim(),
    email: document.querySelector('#email').value.trim(),
    subscribe: document.querySelector('#subscribe').checked ? 1 : 0,
    phone: document.querySelector('#phone').value.trim(),
    delivery_address: document.querySelector('#address').value.trim(),
    delivery_type: deliveryType,
    comment: document.querySelector('#comment').value.trim()
  };

  if (deliveryType === 'by_time') {
    order.delivery_time = timeInput.value;
  }

  // Идентификаторы блюд (только выбранные)
  if (selected.soup) { order.soup_id = selected.soup.id; }
  if (selected.main) { order.main_course_id = selected.main.id; }
  if (selected.salad) { order.salad_id = selected.salad.id; }
  if (selected.drink) { order.drink_id = selected.drink.id; }
  if (selected.dessert) { order.dessert_id = selected.dessert.id; }
  return order;
}

// Проверка состава ланча. Возвращает true, если отправку нужно остановить
function checkLunch(event) {
  const message = getMissingMessage();
  if (message === null) {
    return false;
  }
  event.preventDefault();
  showNotification(message);
  return true;
}

// Клик по «Отправить» срабатывает раньше проверки полей браузером,
// поэтому уведомление о составе заказа появляется даже при пустой форме
form.querySelector('button[type="submit"]').addEventListener('click', checkLunch);

form.addEventListener('submit', async function (event) {
  event.preventDefault(); // страница не перезагружается, отправляем через fetch
  if (checkLunch(event)) {
    return;
  }

  const order = collectOrder();

  // Время доставки не должно быть раньше текущего
  if (order.delivery_type === 'by_time') {
    const now = new Date();
    const parts = order.delivery_time.split(':');
    const chosen = new Date();
    chosen.setHours(Number(parts[0]), Number(parts[1]), 0, 0);
    if (chosen < now) {
      showNotification('Время доставки не может быть раньше текущего');
      return;
    }
  }

  try {
    await sendOrder(order);
    // Успех: удаляем выбранные блюда из localStorage и очищаем страницу
    clearSelection();
    form.reset();
    render();
    showNotification('Заказ оформлен! Спасибо');
  } catch (error) {
    // Ошибка: данные в localStorage остаются
    console.error(error);
    showNotification('Не удалось оформить заказ: ' + error.message);
  }
});

// Загружаем блюда с сервера и показываем сохранённый заказ
loadDishes()
  .then(function () {
    restoreSelection();
    render();
  })
  .catch(function (error) {
    console.error(error);
    showNotification('Не удалось загрузить данные. Попробуйте обновить страницу');
  });
