document.addEventListener("DOMContentLoaded", () => {
  // Перевіряємо, чи ми на сторінці бібліотеки
  const isLibraryPage = window.location.pathname.includes("library.html");
  if (!isLibraryPage) return;

  // Отримуємо користувача з атрибута data-user
  const user = document.body.getAttribute("data-user");
  console.log("Поточний користувач:", user);

  // Переконуємося, що основний js.js завантажений
  if (
    !window.getUserLibrary ||
    !window.saveUserLibrary ||
    !window.createGameCard
  ) {
    console.error("Необхідні функції з js.js не знайдені");
    return;
  }

  const gameList = document.querySelector(".game-list");
  const libraryGamesContainer = document.getElementById("library-games");
  const libraryEmptyMessage = document.getElementById("library-empty");

  // Функція для отримання бібліотеки для конкретного користувача
  function getCustomUserLibrary() {
    const libraryKey = `library_${user}`;
    const library = JSON.parse(localStorage.getItem(libraryKey)) || [];
    console.log("Бібліотека для користувача", user, ":", library);
    return library;
  }

  // Заповнення лівої панелі лише завантаженими іграми
  function populateGameList() {
    if (!gameList) return;
    gameList.innerHTML = "<li class='game-item active'>Всі ігри</li>";
    const library = getCustomUserLibrary();
    if (library && library.length > 0) {
      library.forEach((gameId) => {
        const gameData = games.find(
          (game) => game.title.toLowerCase().replace(/\s+/g, "-") === gameId
        );
        if (gameData) {
          const li = document.createElement("li");
          li.classList.add("game-item");
          li.textContent = gameData.title;
          li.addEventListener("click", () => {
            document
              .querySelectorAll(".game-item")
              .forEach((item) => item.classList.remove("active"));
            li.classList.add("active");
            renderLibraryPage([gameId]);
          });
          gameList.appendChild(li);
        } else {
          console.warn("Гра з ID", gameId, "не знайдена в games");
        }
      });
    } else {
      console.log("Бібліотека порожня для користувача", user);
    }
  }

  // Функція для рендерингу сторінки бібліотеки з лише завантаженими іграми
  function renderLibraryPage(library) {
    if (!libraryGamesContainer || !libraryEmptyMessage) {
      console.warn("Контейнери library-games або library-empty не знайдені");
      return;
    }

    libraryGamesContainer.innerHTML = "";
    if (!library || library.length === 0) {
      libraryEmptyMessage.style.display = "block";
      libraryGamesContainer.style.display = "none";
    } else {
      libraryEmptyMessage.style.display = "none";
      libraryGamesContainer.style.display = "grid";
      library.forEach((gameId) => {
        const gameData = games.find(
          (game) => game.title.toLowerCase().replace(/\s+/g, "-") === gameId
        );
        if (gameData) {
          const card = window.createGameCard(gameData, gameId);
          libraryGamesContainer.appendChild(card);
        }
      });
    }

    // Прив’язка обробника до кнопки "Видалити"
    document
      .querySelectorAll("#library-games .buttons .remove")
      .forEach((removeButton) => {
        removeButton.addEventListener("click", handleRemoveButtonClick);
      });
  }

  // Обробник для кнопки "Видалити" (з бібліотеки)
  function handleRemoveButtonClick(event) {
    event.preventDefault();
    console.log(
      "Кнопка 'Видалити' натиснута на сторінці:",
      window.location.pathname
    );
    const button = event.target;
    const gameId = button.closest(".buttons").dataset.game;
    console.log("gameId для 'Видалити':", gameId);

    let library = getCustomUserLibrary();
    library = library.filter((id) => id !== gameId);
    const libraryKey = `library_${user}`;
    localStorage.setItem(libraryKey, JSON.stringify(library));
    console.log("Гра видалена з бібліотеки:", gameId);

    // Оновлюємо сторінку бібліотеки та список
    populateGameList();
    renderLibraryPage(library);
  }

  // Ініціалізація бібліотеки при завантаженні з лише завантаженими іграми
  let library = getCustomUserLibrary();
  populateGameList();
  renderLibraryPage(library);
});
