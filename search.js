document.addEventListener("DOMContentLoaded", () => {
  if (typeof games === "undefined") {
    console.error(
      "Масив games не визначений. Перевірте, чи завантажується games.js"
    );
    return;
  }

  // Функція для створення та відображення дропдауна з результатами пошуку
  function setupSearchDropdown() {
    const searchInput = document.querySelector(".search");
    const searchContainer = document.querySelector(".search-container");

    if (!searchInput || !searchContainer) {
      console.error("Поле пошуку або контейнер не знайдено");
      return;
    }

    // Створюємо контейнер для дропдауна
    const dropdown = document.createElement("div");
    dropdown.classList.add("search-dropdown");
    searchContainer.appendChild(dropdown);

    // Стилі для дропдауна (вбудовані CSS)
    const styles = `
  .search-dropdown {
    position: absolute;
    top: 100%;
    left: 1000px;
    width: 25%;
    max-height: 300px;
    overflow-y: auto;
    background-color: #1f1d23;
    border: 1px solid #333;
    border-radius: 4px;
    z-index: 1000;
    display: none;
  }

  .search-dropdown-item {
    padding: 10px;
    color: #fff;
    cursor: pointer;
    display: flex;
    gap: 10px;
    align-items: center;
    border-bottom: 1px solid #333; /* Разделитель */
    transition: background-color 0.2s;
  }

  .search-dropdown-item:hover {
    background-color: #2a2a2a;
  }

  .search-dropdown-item img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .search-dropdown-item-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .search-dropdown-item-title {
    font-size: 16px;
    font-weight: 500;
  }

  .search-dropdown-item-price {
    font-size: 14px;
    color: #aaa;
  }

  .search-dropdown-item.free {
    background-color: #3a5e2b; /* Ваш тёмно-зелёный для бесплатных */
  }

  .search-dropdown-item.free:hover {
    background-color: #4c7a36;
  }
`;

    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Функція для фільтрації та відображення результатів
    function filterAndDisplayResults(searchTerm) {
      dropdown.innerHTML = "";
      if (!searchTerm) {
        dropdown.style.display = "none";
        return;
      }

      searchTerm = searchTerm.toLowerCase();
      const filteredGames = games.filter((game) =>
        game.title.toLowerCase().includes(searchTerm)
      );

      if (filteredGames.length > 0) {
        filteredGames.forEach((game) => {
          const item = document.createElement("div");
          item.classList.add("search-dropdown-item");
          // Додаємо клас .free, якщо гра безкоштовна (наприклад, якщо ціна "Бесплатно")
          if (
            game.description &&
            game.description.toLowerCase() === "бесплатно"
          ) {
            item.classList.add("free");
          }
          item.innerHTML = `
              <img src="${game.image}" alt="${game.title}">
              <div class="search-dropdown-item-content">
                <div class="search-dropdown-item-title">${game.title}</div>
                <div class="search-dropdown-item-price">${game.description}</div>
              </div>
            `;
          item.addEventListener("click", () => {
            const gameId = game.title.toLowerCase().replace(/\s+/g, "-");
            window.location.href = `./games/${gameId}.html`;
            searchInput.value = "";
            dropdown.style.display = "none";
          });
          dropdown.appendChild(item);
        });
        dropdown.style.display = "block";
      } else {
        dropdown.style.display = "none";
      }
    }

    // Обробник події введення
    searchInput.addEventListener("input", (event) => {
      const searchTerm = event.target.value.trim();
      filterAndDisplayResults(searchTerm);
    });

    // Ховати дропдаун при кліку поза полем
    document.addEventListener("click", (event) => {
      if (!searchContainer.contains(event.target)) {
        dropdown.style.display = "none";
      }
    });
  }

  // Виклик функції
  setupSearchDropdown();
});
