// Фильтры блюд: кнопки с data-kind в каждой категории.

document.querySelectorAll('.filters').forEach(function (block) {
  const category = block.dataset.category;

  block.addEventListener('click', function (event) {
    const button = event.target.closest('.filter-button');
    if (!button) {
      return;
    }

    if (button.classList.contains('active')) {
      // Повторный клик по выбранному фильтру снимает его — показываются все блюда
      button.classList.remove('active');
      activeKind[category] = null;
    } else {
      // Выбираем новый фильтр, у остальных кнопок убираем active
      block.querySelectorAll('.filter-button').forEach(function (other) {
        other.classList.remove('active');
      });
      button.classList.add('active');
      activeKind[category] = button.dataset.kind;
    }

    displayCategory(category);
  });
});
