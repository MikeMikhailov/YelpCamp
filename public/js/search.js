const searchField = document.querySelector('#searchInput');
const cards = document.querySelectorAll('.card-title');
searchField.addEventListener('input', () => {
  const searchString = searchField.value;
  cards.forEach(cardHeader => {
    cardHeader.parentNode.parentNode.parentNode.classList.remove('d-none');
    if (searchString !== '') {
      const searchRegex = new RegExp(searchString, 'gi');
      if (!cardHeader.textContent.match(searchRegex)) {
        cardHeader.parentNode.parentNode.parentNode.classList.add('d-none');
      }
    }
  });
});
