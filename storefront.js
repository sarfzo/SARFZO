// Homepage collection filters. Product links remain usable without JavaScript.
document.querySelectorAll('.collection-filters button').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.collection-filters button').forEach(filter => {
      const active = filter === button;
      filter.classList.toggle('selected', active);
      filter.setAttribute('aria-pressed', String(active));
    });
    let count = 0;
    document.querySelectorAll('[data-product-category]').forEach(card => {
      card.hidden = button.dataset.category !== 'all' && card.dataset.productCategory !== button.dataset.category;
      if (!card.hidden) count++;
    });
    document.getElementById('product-count').textContent = String(count).padStart(2, '0') + (count === 1 ? ' product' : ' products');
  });
});
