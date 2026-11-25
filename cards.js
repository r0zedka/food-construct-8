// Создание карточки блюда. Используется на обеих страницах:
// на странице меню кнопка «Добавить», на странице заказа — «Удалить».

function createDishCard(dish, buttonText, isSelected) {
  const card = document.createElement('div');
  card.className = 'dish';
  card.dataset.dish = dish.keyword; // data-dish="gaspacho"
  if (isSelected) {
    card.classList.add('selected');
  }

  const image = document.createElement('img');
  image.className = 'dish-image';
  image.src = dish.image; // адрес картинки приходит с сервера
  image.alt = dish.name;

  const price = document.createElement('p');
  price.className = 'dish-price';
  price.textContent = dish.price + '₽';

  const name = document.createElement('p');
  name.className = 'dish-name';
  name.textContent = dish.name;

  const weight = document.createElement('p');
  weight.className = 'dish-weight';
  weight.textContent = dish.count;

  const button = document.createElement('button');
  button.className = 'dish-button';
  button.type = 'button';
  button.textContent = buttonText;

  card.append(image, price, name, weight, button);
  return card;
}
