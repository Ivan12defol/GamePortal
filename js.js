let currentGame = 0;
let sliderGames = [];
let balanceDisplayElement = null; // Зберігаємо посилання на елемент балансу
let currentUser = JSON.parse(localStorage.getItem("currentUser")); // Глобальна змінна

document.addEventListener("DOMContentLoaded", () => {
  if (typeof window.games === "undefined") {
    console.error(
      "Масив window.games не визначений. Перевірте, чи завантажується games.js"
    );
    return;
  }
  console.log("DOM завантажено, ігор у window.games:", window.games.length);

  // Логіка слайдера
  sliderGames = window.games.filter((game) => game.inSlider === true);
  console.log("Ігор у слайдері:", sliderGames.length);

  const gameBanner = document.querySelector(".game-banner");
  const gameTitle = document.querySelector(".game-title");
  const gameDescription = document.querySelector(".game-description");
  const gameTags = document.querySelector(".tags");
  const prevButton = document.querySelector(".prev");
  const nextButton = document.querySelector(".next");
  const indicatorsContainer = document.querySelector(".indicators");
  const installButtonSlider = document.querySelector(".game-slider .install");
  const learnButton = document.querySelector(".game-slider .learn");

  function updateGame() {
    if (sliderGames.length === 0) {
      console.warn("Немає ігор для слайдера (inSlider: true)");
      return;
    }

    const game = sliderGames[currentGame];
    if (gameBanner) {
      gameBanner.style.background = `url("${game.image}") center/cover no-repeat`;
    }
    if (gameTitle) gameTitle.textContent = game.title;
    if (gameDescription) gameDescription.textContent = game.description;

    if (gameTags) {
      gameTags.innerHTML = "";
      game.tags.forEach((tag) => {
        const span = document.createElement("span");
        span.classList.add("tag");
        span.textContent = tag;
        gameTags.appendChild(span);
      });
    }

    const gameId = game.title.toLowerCase().replace(/\s+/g, "-");
    const gamePageUrl = `./games/${gameId}.html`;

    if (installButtonSlider) {
      installButtonSlider.dataset.game = gameId;
      installButtonSlider.removeEventListener("click", handleInstallClick);
      installButtonSlider.addEventListener("click", handleInstallClick);
    }

    if (learnButton) {
      learnButton.dataset.game = gameId;
      learnButton.onclick = (event) => {
        event.preventDefault();
        window.location.href = gamePageUrl;
      };
    }

    if (indicatorsContainer) {
      const indicators = [...indicatorsContainer.children];
      indicators.forEach((indicator, index) => {
        indicator.classList.toggle("active", index === currentGame);
      });
    }
  }

  function createIndicators() {
    if (!indicatorsContainer) return;
    indicatorsContainer.innerHTML = "";
    sliderGames.forEach((_, index) => {
      const dot = document.createElement("span");
      dot.classList.add("indicator");
      dot.addEventListener("click", () => {
        currentGame = index;
        updateGame();
      });
      indicatorsContainer.appendChild(dot);
    });
  }

  function initializeSlider() {
    if (sliderGames.length === 0) return;

    if (prevButton) {
      prevButton.addEventListener("click", () => {
        currentGame =
          (currentGame - 1 + sliderGames.length) % sliderGames.length;
        updateGame();
      });
    }

    if (nextButton) {
      nextButton.addEventListener("click", () => {
        currentGame = (currentGame + 1) % sliderGames.length;
        updateGame();
      });
    }

    createIndicators();
    updateGame();
  }

  if (prevButton && nextButton && indicatorsContainer) {
    initializeSlider();
  }

  // Логіка авторизації
  const authSection = document.getElementById("auth-section");
  const walletSection = document.getElementById("wallet-section");
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  if (authSection) {
    if (isAuthenticated && currentUser) {
      authSection.innerHTML = `
        <a href="./profile.html" style="display: flex; align-items: center; gap: 10px;">
          <img src="${
            currentUser.avatar || "./img/avatars.png"
          }" style="width: 30px; height: 30px; border-radius: 50%;">
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

  // Ініціалізація гаманця, якщо не існує
  if (isAuthenticated && currentUser) {
    if (currentUser.wallet === undefined || currentUser.wallet === null) {
      currentUser.wallet = 0;
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    }
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
        top: 80px;
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

  // Функція для створення картки гри
  window.createGameCard = function (gameData, gameId) {
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

    const gamePageUrl = `./games/${gameId}.html`;
    const isLibraryPage = window.location.pathname.includes("library.html");
    const installButtonText = isLibraryPage ? "Грати" : "Завантажити";

    card.innerHTML = `
      <a href="${gamePageUrl}" class="game-card-link">
        <div class="game-card-image">
          <img src="${gameData.image}" />
          ${discount}
        </div>
        <div class="game-card-content">
          <h3>${gameData.title}</h3>
          <div class="genres">${gameData.tags.join(", ")}</div>
          <div class="developer">${
            gameData.isUserCreated ? "Створено користувачем" : "Developer"
          }</div>
          <div class="price">
            ${
              discount
                ? `<span class="original-price">${originalPrice}</span>`
                : ""
            }
            <span>${discountedPrice || originalPrice}</span>
          </div>
          <div class="buttons" data-game="${gameId}">
            <button class="install">${installButtonText}</button>
            ${
              !isLibraryPage
                ? '<button class="wishlist">♡</button>'
                : '<button class="remove">Видалити</button>'
            }
          </div>
        </div>
      </a>
    `;
    return card;
  };

  // Функція для отримання бібліотеки користувача
  window.getUserLibrary = function () {
    const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {
      username: document.body.getAttribute("data-user") || "miniagusha2",
    };
    if (!currentUser) return [];
    const key = `library_${currentUser.username}`;
    return JSON.parse(localStorage.getItem(key)) || [];
  };

  // Функція для збереження бібліотеки користувача
  window.saveUserLibrary = function (library) {
    const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {
      username: document.body.getAttribute("data-user") || "miniagusha2",
    };
    if (!currentUser) return;
    const key = `library_${currentUser.username}`;
    localStorage.setItem(key, JSON.stringify(library));
  };

  // Функція для рендерингу ігор
  window.renderGames = function () {
    const newReleasesContainer = document.getElementById("new-releases");
    const popularGamesContainer = document.getElementById("popular-games");

    if (!newReleasesContainer || !popularGamesContainer) {
      console.error("Контейнери new-releases або popular-games не знайдено");
      return;
    }

    newReleasesContainer.innerHTML = "";
    popularGamesContainer.innerHTML = "";

    if (!window.games || window.games.length === 0) {
      console.warn("Масив window.games порожній");
      newReleasesContainer.innerHTML = "<p>Ігри відсутні.</p>";
      popularGamesContainer.innerHTML = "<p>Ігри відсутні.</p>";
      return;
    }

    window.games.forEach((game) => {
      const gameId = game.title.toLowerCase().replace(/\s+/g, "-");
      if (game.isUserCreated && !localStorage.getItem(`gamePage_${gameId}`)) {
        console.warn(`Сторінка гри ${gameId} не існує, пропускаємо`);
        return;
      }
      const card = window.createGameCard(game, gameId);
      if (game.section === "new") {
        newReleasesContainer.appendChild(card);
      } else if (game.section === "popular") {
        popularGamesContainer.appendChild(card);
      }
    });

    sliderGames = window.games.filter((game) => game.inSlider === true);
    currentGame = 0;
    createIndicators();
    updateGame();

    document
      .querySelectorAll(".game-card .buttons")
      .forEach((buttonContainer) => {
        const gameId = buttonContainer.dataset.game;
        const installButton = buttonContainer.querySelector(".install");
        const wishlistButton = buttonContainer.querySelector(".wishlist");

        if (installButton) {
          installButton.dataset.game = gameId;
          installButton.removeEventListener("click", handleInstallClick);
          installButton.addEventListener("click", handleInstallClick);
        }

        if (wishlistButton) {
          wishlistButton.dataset.game = gameId;
          wishlistButton.removeEventListener(
            "click",
            handleWishlistButtonClick
          );
          wishlistButton.addEventListener("click", handleWishlistButtonClick);
        }
      });
  };

  // Функція для оновлення UI списку бажань
  function updateWishlistUI(wishlist) {
    const wishlistCount = document.getElementById("wishlistCount");
    if (wishlistCount) {
      wishlistCount.textContent = wishlist.length;
    }

    document.querySelectorAll(".game-card .wishlist").forEach((button) => {
      const gameId = button.parentElement.dataset.game;
      button.textContent = wishlist.includes(gameId) ? "♥" : "♡";
    });
  }

  // Функція для показу модального вікна з повідомленням про помилку
  function showErrorModal(message) {
    let errorModal = document.getElementById("errorModal");
    if (!errorModal) {
      errorModal = document.createElement("div");
      errorModal.id = "errorModal";
      errorModal.style.cssText = `
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 1000;
        justify-content: center;
        align-items: center;
      `;
      errorModal.innerHTML = `
        <div style="
          background: #252525;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          color: #fff;
          max-width: 400px;
        ">
          <p id="errorMessage"></p>
          <button id="closeErrorModal" style="
            padding: 10px 20px;
            background: #8247e5;
            color: #fff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          ">Закрити</button>
        </div>
      `;
      document.body.appendChild(errorModal);
    }

    const errorMessage = document.getElementById("errorMessage");
    const closeErrorModal = document.getElementById("closeErrorModal");

    errorMessage.textContent = message;
    errorModal.style.display = "flex";

    closeErrorModal.onclick = () => {
      errorModal.style.display = "none";
    };

    window.onclick = (event) => {
      if (event.target === errorModal) {
        errorModal.style.display = "none";
      }
    };

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && errorModal.style.display === "flex") {
        errorModal.style.display = "none";
      }
    });
  }

  // Обробник для кнопки "Завантажити"
  function handleInstallClick(event) {
    event.preventDefault();
    console.log(
      "Кнопка 'Завантажити' натиснута на сторінці:",
      window.location.pathname
    );
    const gameId =
      event.target.dataset.game ||
      event.target.closest(".buttons").dataset.game;
    console.log("gameId для 'Завантажити':", gameId);

    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (!isAuthenticated) {
      console.log("Користувач не авторизований, перенаправлення на login.html");
      window.location.href = "./login.html";
      return;
    }

    const game = window.games.find(
      (g) => g.title.toLowerCase().replace(/\s+/g, "-") === gameId
    );
    if (!game) {
      console.warn("Гру не знайдено:", gameId);
      return;
    }

    const modal = document.getElementById("downloadModal");
    const downloadLinksContainer = document.getElementById("downloadLinks");
    const closeModal = document.getElementById("closeModal");

    if (!modal) {
      console.error("Модальне вікно (downloadModal) не знайдено");
      return;
    }
    modal.style.display = "flex";
    console.log("Модальне вікно відкрито для гри:", gameId);

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
          "<p>Посилання для завантаження відсутні.</p>";
      }

      // Додаємо кнопку "Завантажити з сайту"
      const siteDownloadButton = document.createElement("a");
      siteDownloadButton.href = "#";
      siteDownloadButton.textContent = "Завантажити з сайту";
      siteDownloadButton.addEventListener("click", (e) => {
        e.preventDefault();

        let currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!currentUser) {
          console.log("Користувач не знайдений у localStorage");
          return;
        }

        let userWallet = currentUser.wallet || 0;
        // Витягуємо ціну гри з description
        let priceSource = game.description || "0₴";
        let gamePrice = 0;

        // Обробляємо ціну гри, видаляючи пробіли та символ ₴
        if (priceSource.toLowerCase() === "безкоштовно") {
          gamePrice = 0;
        } else {
          gamePrice = parseFloat(priceSource.replace(/[\s₴]/g, "")) || 0;
        }

        console.log(`Ціна гри ${game.title}: ${gamePrice} грн`);

        if (userWallet >= gamePrice) {
          // Знімаємо ціну з гаманця
          userWallet -= gamePrice;
          currentUser.wallet = userWallet;
          localStorage.setItem("currentUser", JSON.stringify(currentUser));
          console.log("Баланс оновлено в localStorage:", currentUser.wallet);
          updateWalletUI(); // Динамічно оновлюємо UI гаманця

          let library = window.getUserLibrary();
          if (!library.includes(gameId)) {
            library.push(gameId);
            window.saveUserLibrary(library);
            console.log("Гра додана до бібліотеки після покупки:", gameId);
            showNotification(
              `Гра придбана за ${gamePrice} грн та додана до бібліотеки!`
            );
            renderWishlistOrLibrary(); // Оновлюємо список бажань або бібліотеку
            window.renderGames(); // Оновлюємо список ігор на головній сторінці
          } else {
            showNotification("Гра вже є у вашій бібліотеці!");
          }
          modal.style.display = "none";
        } else {
          showErrorModal(
            `Недостатньо коштів. Ціна гри: ${gamePrice} грн. У вас: ${userWallet} грн. Будь ласка, поповніть гаманець у вашому профілі.`
          );
        }
      });
      downloadLinksContainer.appendChild(siteDownloadButton);

      console.log("Посилання додані у модальне вікно:", game.downloadLinks);
    } else {
      console.error("Контейнер downloadLinks не знайдено");
    }

    if (closeModal) {
      closeModal.onclick = () => {
        console.log("Закриття модального вікна через хрестик");
        modal.style.display = "none";
      };
    } else {
      console.error("Елемент closeModal не знайдено");
    }

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

  // Обробник для кнопки "Додати до списку бажань"
  function handleWishlistButtonClick(event) {
    event.preventDefault();
    console.log(
      "Кнопка 'Додати до списку бажань' натиснута на сторінці:",
      window.location.pathname
    );
    const button = event.target;
    const gameId = button.closest(".buttons").dataset.game;
    console.log("gameId для 'Додати до списку бажань':", gameId);

    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (!isAuthenticated) {
      console.log("Користувач не авторизований, перенаправлення на login.html");
      window.location.href = "./login.html";
      return;
    }

    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const isInWishlist = wishlist.includes(gameId);

    if (isInWishlist) {
      wishlist = wishlist.filter((id) => id !== gameId);
      button.textContent = "♡";
      console.log("Гра видалена зі списку бажань:", gameId);
    } else {
      wishlist.push(gameId);
      button.textContent = "♥";
      console.log("Гра додана до списку бажань:", gameId);
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    updateWishlistUI(wishlist);
    renderWishlistOrLibrary();
  }

  // Функція для налаштування глобального фільтра
  function setupGlobalFilters(containers, toggleButton, filtersGrid) {
    if (toggleButton && filtersGrid) {
      toggleButton.addEventListener("click", (event) => {
        event.stopPropagation();
        filtersGrid.classList.toggle("active");
        toggleButton.textContent = filtersGrid.classList.contains("active")
          ? "Приховати фільтри"
          : "Фільтр";
      });

      document.addEventListener("click", (event) => {
        if (
          !filtersGrid.contains(event.target) &&
          !toggleButton.contains(event.target)
        ) {
          filtersGrid.classList.remove("active");
          toggleButton.textContent = "Фільтр";
        }
      });

      const filterButtons = filtersGrid.querySelectorAll("button");
      filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const filter = button.textContent.toLowerCase();

          containers.forEach((container) => {
            const cards = container.querySelectorAll(".game-card");
            cards.forEach((card) => {
              const genres = card.dataset.genres.toLowerCase().split(" ");
              if (filter === "all games") {
                card.style.display = "block";
              } else {
                card.style.display = genres.includes(filter) ? "block" : "none";
              }
            });
          });

          toggleButton.textContent = button.textContent;
          filtersGrid.classList.remove("active");
        });
      });

      const defaultButton = filtersGrid.querySelector("button:first-child");
      if (defaultButton) {
        defaultButton.click();
      }
    }
  }

  // Функція для рендерингу списку бажань або бібліотеки
  function renderWishlistOrLibrary() {
    const isWishlistPage = window.location.pathname.includes("wishlist.html");
    const isLibraryPage = window.location.pathname.includes("library.html");
    const container = isWishlistPage
      ? document.getElementById("wishlist-games")
      : isLibraryPage
      ? document.getElementById("library-games")
      : null;

    if (!container) {
      console.warn("Контейнер для wishlist або library не знайдено");
      return;
    }

    container.innerHTML = "";

    let gameIds = [];
    if (isWishlistPage) {
      gameIds = JSON.parse(localStorage.getItem("wishlist")) || [];
      console.log("Список бажань:", gameIds);
    } else if (isLibraryPage) {
      const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {
        username: "miniagusha2",
      };
      gameIds = window.getUserLibrary() || [];
      console.log("Бібліотека:", gameIds);
    }

    if (gameIds.length === 0) {
      container.innerHTML = "<p>Список порожній.</p>";
      return;
    }

    gameIds.forEach((gameId) => {
      const game = window.games.find(
        (g) => g.title.toLowerCase().replace(/\s+/g, "-") === gameId
      );
      if (game) {
        if (game.isUserCreated && !localStorage.getItem(`gamePage_${gameId}`)) {
          console.warn(`Сторінка гри ${gameId} не існує, пропускаємо`);
          return;
        }
        const card = window.createGameCard(game, gameId);
        container.appendChild(card);
      } else {
        console.warn(`Гра з ID ${gameId} не знайдена в масиві window.games`);
      }
    });

    document
      .querySelectorAll("#" + container.id + " .buttons")
      .forEach((buttonContainer) => {
        const gameId = buttonContainer.dataset.game;
        const installButton = buttonContainer.querySelector(".install");
        const wishlistButton = buttonContainer.querySelector(".wishlist");
        const removeButton = buttonContainer.querySelector(".remove");

        if (installButton) {
          installButton.dataset.game = gameId;
          installButton.removeEventListener("click", handleInstallClick);
          installButton.addEventListener("click", handleInstallClick);
        }

        if (wishlistButton) {
          wishlistButton.dataset.game = gameId;
          wishlistButton.removeEventListener(
            "click",
            handleWishlistButtonClick
          );
          wishlistButton.addEventListener("click", handleWishlistButtonClick);
        }

        if (removeButton) {
          removeButton.dataset.game = gameId;
          removeButton.addEventListener("click", (event) => {
            event.preventDefault();
            const gameId = event.target.closest(".buttons").dataset.game;
            let library = window.getUserLibrary();
            if (library.includes(gameId)) {
              library = library.filter((id) => id !== gameId);
              window.saveUserLibrary(library);
              console.log("Гра видалена з бібліотеки:", gameId);
              renderWishlistOrLibrary();
              window.renderGames();
            }
          });
        }
      });
  }

  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  updateWishlistUI(wishlist);

  const isWishlistPage = window.location.pathname.includes("wishlist.html");
  const isLibraryPage = window.location.pathname.includes("library.html");

  if (!isWishlistPage && !isLibraryPage) {
    const newReleasesContainer = document.getElementById("new-releases");
    const popularGamesContainer = document.getElementById("popular-games");

    if (!newReleasesContainer || !popularGamesContainer) {
      console.error("Контейнери new-releases або popular-games не знайдено");
      return;
    }

    const allGameContainers = [
      document.getElementById("new-releases"),
      document.getElementById("popular-games"),
    ];

    const toggleButton = document.querySelector(".toggle-section-filters");
    const filtersGrid = document.querySelector(".section-filters-grid");

    setupGlobalFilters(allGameContainers, toggleButton, filtersGrid);

    window.renderGames();
  } else {
    renderWishlistOrLibrary();
  }
});
