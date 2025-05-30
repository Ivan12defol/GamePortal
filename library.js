document.addEventListener("DOMContentLoaded", () => {
  // Перевірка на наявність window.games
  if (typeof window.games === "undefined") {
    console.error(
      "Масив window.games не визначений. Перевірте завантаження games.js"
    );
    return;
  }
  console.log("DOM завантажено, ігор у window.games:", window.games.length);

  // Логіка авторизації
  const authSection = document.getElementById("auth-section");
  const walletSection = document.getElementById("wallet-section");
  let currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  let balanceDisplayElement = null; // Зберігаємо посилання на елемент балансу

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

  // Ініціалізація UI гаманця
  function initializeWalletUI() {
    if (!walletSection) {
      console.warn("walletSection не знайдено в DOM");
      return;
    }

    if (isAuthenticated && currentUser) {
      walletSection.innerHTML = `
        <div class="wallet-container">
          <span class="balance-label"></span>
          <span id="balance-display">${currentUser.wallet} грн</span>
        </div>
      `;
      balanceDisplayElement = document.getElementById("balance-display");
      console.log(
        "UI гаманця ініціалізовано, balanceDisplayElement:",
        balanceDisplayElement
      );
    } else {
      walletSection.innerHTML = "";
      balanceDisplayElement = null;
    }
  }

  // Оновлення UI гаманця динамічно
  function updateWalletUI() {
    // Синхронізуємо currentUser з localStorage перед оновленням UI
    currentUser = JSON.parse(localStorage.getItem("currentUser"));
    console.log("Оновлення UI гаманця викликано, currentUser:", currentUser);

    if (!walletSection) {
      console.warn("walletSection не знайдено під час оновлення");
      return;
    }

    if (isAuthenticated && currentUser) {
      // Якщо balanceDisplayElement не ініціалізований, повторно ініціалізуємо UI
      if (!balanceDisplayElement) {
        console.log(
          "balanceDisplayElement не ініціалізований, викликаємо ініціалізацію"
        );
        initializeWalletUI();
      }

      // Перевіряємо, чи елемент існує після ініціалізації
      if (balanceDisplayElement) {
        balanceDisplayElement.textContent = `${currentUser.wallet} грн`;
        console.log("Баланс оновлено в UI:", balanceDisplayElement.textContent);
      } else {
        console.error(
          "Не вдалося знайти balanceDisplayElement після ініціалізації"
        );
      }
    }
  }

  // Ініціалізація UI гаманця при завантаженні сторінки
  initializeWalletUI();

  // Функція для показу тимчасового повідомлення
  function showNotification(message) {
    let notification = document.getElementById("notification");
    if (!notification) {
      notification = document.createElement("div");
      notification.id = "notification";
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px;
        border-radius: 5px;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
      `;
      document.body.appendChild(notification);
    }

    notification.textContent = message;
    notification.style.opacity = "1";

    setTimeout(() => {
      notification.style.opacity = "0";
    }, 3000); // Повідомлення зникає через 3 секунди
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
    const gamePageUrl = `./games/${gameId}.html`; // Посилання на сторінку гри

    card.innerHTML = `
    <a href="${gamePageUrl}" class="game-card-link">
      <div class="game-card-image">
        <img src="${gameData.image}" />
      </div>
      <div class="game-card-content">
        <h3>${gameData.title}</h3>
        <div class="genres">${gameData.tags.join(", ")}</div>
        <div class="developer">Developer</div>
        <div class="buttons" data-game="${gameId}">
          <button class="install font-medium">${installButtonText}</button>
          <button class="remove font-medium">Видалити</button>
        </div>
      </div>
    </a>
  `;
    return card;
  }

  // Функція для отримання бібліотеки користувача
  function getUserLibrary() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      console.warn("Користувач не авторизований");
      return [];
    }
    const key = `library_${currentUser.username}`;
    console.log(
      `Бібліотека для користувача ${currentUser.username}:`,
      localStorage.getItem(key)
    );
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

  // Ініціалізація модального вікна для створення гри
  const createGameModal = document.getElementById("createGameModal");
  const createGameBtn = document.getElementById("create-game-btn");
  const closeCreateGameModal = document.getElementById("closeCreateGameModal");
  const createGameForm = document.getElementById("createGameForm");
  const gameTagsSelect = document.getElementById("gameTags");
  const gameImageInput = document.getElementById("gameImage");
  const imagePreview = document.getElementById("imagePreview");

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
      if (imagePreview) imagePreview.style.display = "none";
    });
  }

  if (createGameModal) {
    window.addEventListener("click", (event) => {
      if (event.target === createGameModal) {
        createGameModal.style.display = "none";
        createGameForm.reset();
        if (imagePreview) imagePreview.style.display = "none";
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && createGameModal.style.display === "flex") {
        createGameModal.style.display = "none";
        createGameForm.reset();
        if (imagePreview) imagePreview.style.display = "none";
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

  // Попередній перегляд зображення
  if (gameImageInput && imagePreview) {
    gameImageInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          imagePreview.src = e.target.result;
          imagePreview.style.display = "block";
        };
        reader.readAsDataURL(file);
      }
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
      const description = document.getElementById("gameDescription").value;
      const price = document.getElementById("gamePrice").value;
      const tags = Array.from(
        document.getElementById("gameTags").selectedOptions
      ).map((option) => option.value);
      const imageFile = document.getElementById("gameImage").files[0];

      if (!imageFile) {
        showNotification("Будь ласка, завантажте обкладинку гри.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target.result;
        const gameId = title.toLowerCase().replace(/\s+/g, "-");
        const priceFormatted = price ? `${price}₴` : "Безкоштовне";

        const newGame = {
          title,
          description: priceFormatted,
          tags,
          image: imageDataUrl,
          section: "popular",
          inSlider: false,
          downloadLinks: [{ platform: "Створено користувачем", url: "#" }],
          isUserCreated: true,
        };

        // Знімаємо 100 грн з гаманця
        currentUser.wallet -= 100;
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        updateWalletUI(); // Оновлюємо UI гаманця

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

        showNotification("Гра успішно створена! Знято 100 грн з гаманця.");
        createGameModal.style.display = "none";
        createGameForm.reset();
        if (imagePreview) imagePreview.style.display = "none";

        // Оновлюємо бібліотеку
        renderLibrary();
      };
      reader.readAsDataURL(imageFile);
    });
  }

  // Модальне вікно для помилки
  const modal = document.getElementById("downloadModal");
  const closeModal = document.getElementById("closeModal");

  if (closeModal && modal) {
    closeModal.onclick = () => {
      modal.style.display = "none";
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

  // Функція для рендерингу бібліотеки
  function renderLibrary() {
    const container = document.getElementById("library-games");
    const emptyMessage = document.getElementById("library-empty");
    if (!container) {
      console.warn("Контейнер library-games не знайдено");
      return;
    }

    container.innerHTML = "";
    emptyMessage.style.display = "none";

    const gameIds = getUserLibrary();
    if (gameIds.length === 0) {
      emptyMessage.style.display = "block";
      console.log("Бібліотека порожня для користувача", currentUser.username);
      return;
    }

    gameIds.forEach((gameId) => {
      const game = window.games.find(
        (g) => g.title.toLowerCase().replace(/\s+/g, "-") === gameId
      );
      if (game) {
        const card = createGameCard(game, gameId);
        container.appendChild(card);
      } else {
        console.warn(`Гра з ID ${gameId} не знайдена в масиві games`);
      }
    });

    document
      .querySelectorAll("#library-games .buttons")
      .forEach((buttonContainer) => {
        const gameId = buttonContainer.dataset.game;
        const installButton = buttonContainer.querySelector(".install");
        const removeButton = buttonContainer.querySelector(".remove");

        if (installButton) {
          installButton.dataset.game = gameId;
          installButton.addEventListener("click", (event) => {
            event.preventDefault();
            console.log("Кнопка 'Грати' натиснута для гри:", gameId);

            const game = window.games.find(
              (g) => g.title.toLowerCase().replace(/\s+/g, "-") === gameId
            );
            if (!game) {
              console.warn("Гру не знайдено:", gameId);
              return;
            }

            const modal = document.getElementById("downloadModal");
            const downloadLinksContainer =
              document.getElementById("downloadLinks");

            if (modal) {
              modal.style.display = "flex";
              console.log("Модальне вікно відкрито для гри:", gameId);
            } else {
              console.error("Модальне вікно (downloadModal) не знайдено");
              return;
            }

            if (downloadLinksContainer) {
              downloadLinksContainer.innerHTML = "";
              if (game.downloadLinks && game.downloadLinks.length > 0) {
                game.downloadLinks.forEach((link) => {
                  const a = document.createElement("a");
                  a.href = link.url;
                  a.textContent = link.platform;
                  a.target = "_blank";
                  a.addEventListener("click", () => {
                    modal.style.display = "none";
                  });
                  downloadLinksContainer.appendChild(a);
                });
              } else {
                downloadLinksContainer.innerHTML =
                  "<p>Посилання для запуску відсутні.</p>";
              }
            } else {
              console.error("Контейнер downloadLinks не знайдено");
            }
          });
        }

        if (removeButton) {
          removeButton.dataset.game = gameId;
          removeButton.addEventListener("click", (event) => {
            event.preventDefault();
            const gameId = event.target.closest(".buttons").dataset.game;
            let library = getUserLibrary();
            if (library.includes(gameId)) {
              library = library.filter((id) => id !== gameId);
              saveUserLibrary(library);
              console.log("Гра видалена з бібліотеки:", gameId);
              renderLibrary();
            }
          });
        }
      });
  }

  renderLibrary();
});
