document.addEventListener("DOMContentLoaded", () => {
  // Перевірка на наявність window.games
  if (typeof window.games === "undefined") {
    console.error(
      "Масив window.games не визначений. Перевірте завантаження games.js"
    );
    return;
  }

  // Логіка авторизації
  const authSection = document.getElementById("auth-section");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  if (authSection) {
    if (isAuthenticated && currentUser) {
      const avatarSrc = currentUser.avatar || "./img/avatars.png";
      authSection.innerHTML = `
        <a href="./profile.html" style="display: flex; align-items: center; gap: 10px;">
          <img src="${avatarSrc}" alt="Avatar" style="width: 30px; height: 30px; border-radius: 50%;">
          <button class="signin font-medium">${currentUser.username}</button>
        </a>
      `;
    } else {
      authSection.innerHTML = `
        <a href="./login.html">
          <button class="signin font-medium">Sign In</button>
        </a>
      `;
    }
  }

  // Якщо користувач не авторизований, перенаправляємо на login.html
  if (!isAuthenticated || !currentUser) {
    console.log("Користувач не авторизований, перенаправлення на login.html");
    window.location.href = "./login.html";
    return;
  }

  // Додаємо логіку підсвічування активного пункту меню
  function highlightActiveMenuItem() {
    const menuLinks = document.querySelectorAll(".menu a");
    const currentPath = window.location.pathname;

    menuLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (currentPath.includes(href) && href !== "#") {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }

      if (
        href === "./index.html" &&
        (currentPath === "/" || currentPath.includes("index.html"))
      ) {
        link.classList.add("active");
      }
    });
  }

  highlightActiveMenuItem();

  // Список доступних тегів
  const availableTags = [
    "Фермерський симулятор",
    "Автосимулятор",
    "Бій",
    "Кулінарія",
    "Динамічна",
    "Футбол",
    "Клікер",
    "JRPG",
    "LEGO",
    "Локальний кооператив",
    "MMORPG",
    "MOBA",
    "Онлайн кооператив",
    "Виживання у відкритому світі",
    "Вечіркова гра",
    "Групова RPG",
    "Фізика",
    "Процедурна генерація",
    "PvE",
    "PvP",
    "RPG",
    "RTS",
    "Пісочниця",
    "Від третьої особи",
    "VR",
    "Warhammer 40K",
    "Кіберспорт",
    "Історична",
    "Автоматизація",
    "Аніме",
    "Аркада",
    "Атмосферна",
    "Баскетбол",
    "Безкоштовно",
    "Будівництво",
    "Вампіри",
    "Виживання",
    "Водіння",
    "Від першої особи",
    "Війна",
    "Військова",
    "Глобальна стратегія",
    "Головоломка",
    "Гольф",
    "Гонки",
    "Детектив",
    "Дизайн та ілюстрація",
    "Дослідження",
    "Друга світова війна",
    "Економіка",
    "Екшен",
    "Жахи",
    "Злочин",
    "Зомбі",
    "Казуальна",
    "Карткова гра",
    "Картковий бій",
    "Керування ресурсами",
    "Класика",
    "Командна",
    "Комедія",
    "Кооператив",
    "Королівська битва",
    "Космос",
    "Крафт",
    "Кульовий пекло",
    "Кілька кінцівок",
    "Лавкрафтівська",
    "Лут",
    "Меми",
    "Метроїдванія",
    "Модифікована",
    "Морський бій",
    "Мультиплеєр",
    "Налаштування персонажа",
    "Настільна гра",
    "Наукова фантастика",
    "Одиночна гра",
    "Паркур",
    "Платформер",
    "Покрокова",
    "Полювання",
    "Політ",
    "Пригоди",
    "Природа",
    "Ранній доступ",
    "Реалістична",
    "Роботи",
    "Рогалик",
    "Рогалик-колодобудування",
    "Рогаліт",
    "Розділений екран",
    "Розслаблююча",
    "Розслідування",
    "Романтика",
    "Середньовічна",
    "Симулятор життя",
    "Симулятор побачень",
    "Симулятор хобі",
    "Симулятор ходьби",
    "Симуляція",
    "Складна",
    "Смішна",
    "Спорт",
    "Стелс",
    "Стратегія",
    "Супергерої",
    "Сучасна",
    "Тактична",
    "Тактична RPG",
    "Танки",
    "Таємниця",
    "Торгівельна карткова гра",
    "Транспорт",
    "Фехтування",
    "Чудовий саундтрек",
    "Шутер",
  ];

  // Функція для створення картки гри
  function createGameCard(gameData, gameId) {
    const card = document.createElement("div");
    card.classList.add("game-card");
    card.dataset.genres = gameData.tags
      .map((tag) => tag.toLowerCase())
      .join(" ");

    const discount = gameData.discount
      ? `<span class="discount">${gameData.discount}</span>`
      : "";
    const originalPrice = gameData.originalPrice || gameData.description;
    const discountedPrice = gameData.discount ? gameData.description : "";

    const installButtonText = "Грати";

    card.innerHTML = `
      <div class="game-card-link">
        <div class="game-card-image">
          <img src="${gameData.image}" />
          ${discount}
        </div>
        <div class="game-card-content">
          <h3>${gameData.title}</h3>
          <div class="genres">${gameData.tags.join(", ")}</div>
          <div class="developer">Створено користувачем</div>
          <div class="buttons" data-game="${gameId}">
            <button class="install font-medium">${installButtonText}</button>
            <button class="remove font-medium">Видалити</button>
          </div>
        </div>
      </div>
    `;
    return card;
  }

  // Функція для отримання створених користувачем ігор
  function getUserGames() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      return [];
    }
    const key = `userGames_${currentUser.username}`;
    return JSON.parse(localStorage.getItem(key)) || [];
  }

  // Функція для збереження створених користувачем ігор
  function saveUserGames(userGames) {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      console.warn("Користувач не авторизований, ігри не збережені");
      return;
    }
    const key = `userGames_${currentUser.username}`;
    localStorage.setItem(key, JSON.stringify(userGames));
    console.log(
      `Створені ігри збережені для користувача ${currentUser.username}:`,
      userGames
    );
  }

  // Функція для отримання бібліотеки користувача
  function getUserLibrary() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      console.warn("Користувач не авторизований");
      return [];
    }
    const key = `library_${currentUser.username}`;
    return JSON.parse(localStorage.getItem(key)) || [];
  }

  // Функція для збереження бібліотеки користувача
  function saveUserLibrary(library) {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      console.warn("Користувач не авторизований, бібліотека не збережена");
      return;
    }
    const key = `library_${currentUser.username}`;
    localStorage.setItem(key, JSON.stringify(library));
    console.log(
      `Бібліотека збережена для користувача ${currentUser.username}:`,
      library
    );
  }

  // Ініціалізація модального вікна для створення гри
  const createGameModal = document.getElementById("createGameModal");
  const createGameBtn = document.getElementById("create-game-btn");
  const closeCreateGameModal = document.getElementById("closeCreateGameModal");
  const createGameForm = document.getElementById("createGameForm");
  const gameTagsSelect = document.getElementById("gameTags");
  const gameIconInput = document.getElementById("gameIcon");
  const gameScreenshotsInput = document.getElementById("gameScreenshots");
  const iconPreview = document.getElementById("iconPreview");
  const screenshotsPreview = document.getElementById("screenshotsPreview");

  // Модальне вікно для помилки балансу
  const insufficientFundsModal = document.getElementById(
    "insufficientFundsModal"
  );
  const closeInsufficientFundsModal = document.getElementById(
    "closeInsufficientFundsModal"
  );

  if (createGameBtn && createGameModal) {
    createGameBtn.addEventListener("click", () => {
      if (currentUser.wallet < 100) {
        insufficientFundsModal.style.display = "flex";
        return;
      }
      createGameModal.style.display = "flex";
    });
  }

  if (closeCreateGameModal && createGameModal) {
    closeCreateGameModal.addEventListener("click", () => {
      createGameModal.style.display = "none";
      createGameForm.reset();
      if (iconPreview) iconPreview.style.display = "none";
      if (screenshotsPreview) screenshotsPreview.innerHTML = "";
    });
  }

  if (createGameModal) {
    window.addEventListener("click", (event) => {
      if (event.target === createGameModal) {
        createGameModal.style.display = "none";
        createGameForm.reset();
        if (iconPreview) iconPreview.style.display = "none";
        if (screenshotsPreview) screenshotsPreview.innerHTML = "";
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && createGameModal.style.display === "flex") {
        createGameModal.style.display = "none";
        createGameForm.reset();
        if (iconPreview) iconPreview.style.display = "none";
        if (screenshotsPreview) screenshotsPreview.innerHTML = "";
      }
    });
  }

  if (closeInsufficientFundsModal && insufficientFundsModal) {
    closeInsufficientFundsModal.addEventListener("click", () => {
      insufficientFundsModal.style.display = "none";
    });
  }

  if (insufficientFundsModal) {
    window.addEventListener("click", (event) => {
      if (event.target === insufficientFundsModal) {
        insufficientFundsModal.style.display = "none";
      }
    });

    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        insufficientFundsModal.style.display === "flex"
      ) {
        insufficientFundsModal.style.display = "none";
      }
    });
  }

  // Наповнення select тегами
  if (gameTagsSelect) {
    availableTags.forEach((tag) => {
      const option = document.createElement("option");
      option.value = tag;
      option.textContent = tag;
      gameTagsSelect.appendChild(option);
    });
  }

  // Попередній перегляд іконки
  if (gameIconInput && iconPreview) {
    gameIconInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          iconPreview.src = e.target.result;
          iconPreview.style.display = "block";
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Попередній перегляд скріншотів
  if (gameScreenshotsInput && screenshotsPreview) {
    gameScreenshotsInput.addEventListener("change", (event) => {
      screenshotsPreview.innerHTML = "";
      const files = event.target.files;
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = document.createElement("img");
          img.src = e.target.result;
          img.style.maxWidth = "100px";
          img.style.margin = "5px";
          screenshotsPreview.appendChild(img);
        };
        reader.readAsDataURL(file);
      });
    });
  }

  // Обробка створення гри
  if (createGameForm) {
    createGameForm.addEventListener("submit", (event) => {
      event.preventDefault();

      // Перевірка балансу
      if (currentUser.wallet < 100) {
        insufficientFundsModal.style.display = "flex";
        createGameModal.style.display = "none";
        return;
      }

      const title = document.getElementById("gameTitle").value;
      const fullDescription = document.getElementById("gameDescription").value;
      const price = document.getElementById("gamePrice").value;
      const tags = Array.from(
        document.getElementById("gameTags").selectedOptions
      ).map((option) => option.value);
      const iconFile = document.getElementById("gameIcon").files[0];
      const screenshotFiles = document.getElementById("gameScreenshots").files;

      if (!iconFile) {
        alert("Будь ласка, завантажте іконку гри.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const iconDataUrl = e.target.result;
        const gameId = title.toLowerCase().replace(/\s+/g, "-");
        const priceFormatted = price ? `${price}₴` : "Безкоштовне";

        // Обробка скріншотів
        const screenshotReaders = Array.from(screenshotFiles).map((file) => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
          });
        });

        Promise.all(screenshotReaders).then((screenshots) => {
          const newGame = {
            title,
            description: priceFormatted,
            fullDescription,
            tags,
            image: iconDataUrl,
            screenshots,
            section: "popular",
            inSlider: false,
            downloadLinks: [{ platform: "Створено користувачем", url: "#" }],
            isUserCreated: true,
          };

          // Знімаємо 100 грн з гаманця
          currentUser.wallet -= 100;
          localStorage.setItem("currentUser", JSON.stringify(currentUser));

          // Додаємо гру до window.games
          window.games.push(newGame);

          // Зберігаємо гру в userGames
          let userGames = getUserGames();
          userGames.push(newGame);
          saveUserGames(userGames);

          // Додаємо гру до бібліотеки
          let library = getUserLibrary();
          if (!library.includes(gameId)) {
            library.push(gameId);
            saveUserLibrary(library);
          }

          // Оновлюємо index.html (припускаємо, що є функція renderGames)
          if (typeof window.renderGames === "function") {
            window.renderGames();
          }

          alert("Гра успішно створена! Знято 100 грн з гаманця.");
          createGameModal.style.display = "none";
          createGameForm.reset();
          if (iconPreview) iconPreview.style.display = "none";
          if (screenshotsPreview) screenshotsPreview.innerHTML = "";

          renderUserGames();
        });
      };
      reader.readAsDataURL(iconFile);
    });
  }

  // Модальне вікно для помилки
  const modal = document.getElementById("downloadModal");
  const closeModal = document.getElementById("closeModal");
  const okButton = document.getElementById("okButton");

  if (closeModal && modal) {
    closeModal.onclick = () => {
      modal.style.display = "none";
    };
  }

  if (okButton && modal) {
    okButton.onclick = () => {
      modal.style.display = "none";
      location.reload();
    };
  }

  if (modal) {
    window.onclick = (event) => {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    };

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && modal.style.display === "flex") {
        modal.style.display = "none";
      }
    });
  }

  // Функція для рендерингу створених ігор
  function renderUserGames() {
    const container = document.getElementById("my-games-grid");
    const emptyMessage = document.getElementById("my-games-empty");
    if (!container) {
      console.warn("Контейнер my-games-grid не знайдено");
      return;
    }

    container.innerHTML = "";
    emptyMessage.style.display = "none";

    const userGames = getUserGames();
    if (userGames.length === 0) {
      emptyMessage.style.display = "block";
      console.log(
        "Створені ігри відсутні для користувача",
        currentUser.username
      );
      return;
    }

    userGames.forEach((game) => {
      const gameId = game.title.toLowerCase().replace(/\s+/g, "-");
      const card = createGameCard(game, gameId);
      container.appendChild(card);
    });

    // Додаємо обробники подій для кнопок "Грати" та "Видалити"
    document
      .querySelectorAll("#my-games-grid .buttons")
      .forEach((buttonContainer) => {
        const gameId = buttonContainer.dataset.game;
        const installButton = buttonContainer.querySelector(".install");
        const removeButton = buttonContainer.querySelector(".remove");

        if (installButton) {
          installButton.dataset.game = gameId;
          installButton.addEventListener("click", (event) => {
            event.preventDefault();
            console.log("Кнопка 'Грати' натиснута для гри:", gameId);

            const modal = document.getElementById("downloadModal");
            if (modal) {
              modal.style.display = "flex";
              console.log(
                "Модальне вікно з помилкою відкрито для гри:",
                gameId
              );
            } else {
              console.error("Модальне вікно (downloadModal) не знайдено");
            }
          });
        }

        if (removeButton) {
          removeButton.dataset.game = gameId;
          removeButton.addEventListener("click", (event) => {
            event.preventDefault();
            const gameId = event.target.closest(".buttons").dataset.game;

            // Видаляємо гру з userGames
            let userGames = getUserGames();
            userGames = userGames.filter(
              (game) => game.title.toLowerCase().replace(/\s+/g, "-") !== gameId
            );
            saveUserGames(userGames);

            // Видаляємо гру з бібліотеки
            let library = getUserLibrary();
            if (library.includes(gameId)) {
              library = library.filter((id) => id !== gameId);
              saveUserLibrary(library);
            }

            // Видаляємо гру з window.games
            window.games = window.games.filter(
              (game) => game.title.toLowerCase().replace(/\s+/g, "-") !== gameId
            );

            // Оновлюємо index.html (припускаємо, що є функція renderGames)
            if (typeof window.renderGames === "function") {
              window.renderGames();
            }

            console.log("Гра видалена:", gameId);
            renderUserGames();
          });
        }
      });
  }

  renderUserGames();
});
