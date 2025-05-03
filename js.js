let currentGame = 0;
let sliderGames = [];

document.addEventListener("DOMContentLoaded", () => {
  if (typeof games === "undefined") {
    console.error(
      "Масив games не визначений. Перевірте, чи завантажується games.js"
    );
    return;
  }
  console.log("DOM завантажено, ігор у games:", games.length);

  // Логіка слайдера
  sliderGames = games.filter((game) => game.inSlider === true);
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
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
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
          <div class="developer">Developer</div>
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

    const game = games.find(
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
      }

      // Додаємо кнопку "Завантажити з сайту"
      const siteDownloadButton = document.createElement("a");
      siteDownloadButton.href = "#";
      siteDownloadButton.textContent = "Завантажити з сайту";
      siteDownloadButton.addEventListener("click", (e) => {
        e.preventDefault();
        let library = window.getUserLibrary();
        if (!library.includes(gameId)) {
          library.push(gameId);
          window.saveUserLibrary(library);
          console.log("Гра додана до бібліотеки після завантаження:", gameId);
          alert("Гра завантажена!");
        }
        modal.style.display = "none";
      });
      downloadLinksContainer.appendChild(siteDownloadButton);

      console.log("Посилання додані у модальне вікно:", game.downloadLinks);
    } else {
      downloadLinksContainer.innerHTML =
        "<p>Посилання для завантаження відсутні.</p>";
      console.warn("Посилання для завантаження не знайдено для гри:", gameId);
    }

    if (closeModal) {
      closeModal.onclick = () => {
        console.log("Закриття модального вікна через хрестик");
        modal.style.display = "none";
      };
    } else {
      console.error("Елемент closeModal не знайдено");
    }
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

    container.innerHTML = ""; // Очищаємо контейнер перед рендерингом

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
      const game = games.find(
        (g) => g.title.toLowerCase().replace(/\s+/g, "-") === gameId
      );
      if (game) {
        const card = window.createGameCard(game, gameId);
        container.appendChild(card);
      } else {
        console.warn(`Гра з ID ${gameId} не знайдена в масиві games`);
      }
    });

    // Прив’язка обробників до нових кнопок
    document
      .querySelectorAll("#" + container.id + " .buttons")
      .forEach((buttonContainer) => {
        const gameId = buttonContainer.dataset.game;
        const installButton = buttonContainer.querySelector(".install");
        const wishlistButton = buttonContainer.querySelector(".wishlist");
        const removeButton = buttonContainer.querySelector(".remove");

        if (installButton) {
          installButton.dataset.game = gameId;
          installButton.addEventListener("click", handleInstallClick);
        }

        if (wishlistButton) {
          wishlistButton.dataset.game = gameId;
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
              renderWishlistOrLibrary(); // Перерендеринг після видалення
            }
          });
        }
      });
  }

  // Ініціалізація списку бажань при завантаженні
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  updateWishlistUI(wishlist);

  // Логіка для головної сторінки
  const isWishlistPage = window.location.pathname.includes("wishlist.html");
  const isLibraryPage = window.location.pathname.includes("library.html");

  if (!isWishlistPage && !isLibraryPage) {
    const newReleasesContainer = document.getElementById("new-releases");
    const popularGamesContainer = document.getElementById("popular-games");

    if (!newReleasesContainer || !popularGamesContainer) {
      console.error("Контейнери new-releases або popular-games не знайдено");
      return;
    }

    if (!games || games.length === 0) {
      console.error("Масив games порожній або не визначений");
      return;
    }

    console.log("Заповнення секцій ігор...");
    games.forEach((game) => {
      const gameId = game.title.toLowerCase().replace(/\s+/g, "-");
      const card = window.createGameCard(game, gameId);
      if (game.section === "new") {
        newReleasesContainer.appendChild(card);
      } else if (game.section === "popular") {
        popularGamesContainer.appendChild(card);
      }
    });

    const gameCards = document.querySelectorAll(".game-card");
    console.log("Знайдено карточок ігор:", gameCards.length);

    // Налаштування єдиного глобального фільтра
    const allGameContainers = [
      document.getElementById("new-releases"),
      document.getElementById("popular-games"),
    ];

    const toggleButton = document.querySelector(".toggle-section-filters");
    const filtersGrid = document.querySelector(".section-filters-grid");

    setupGlobalFilters(allGameContainers, toggleButton, filtersGrid);
  } else {
    renderWishlistOrLibrary();
  }

  // Прив’язка обробників до кнопок "Завантажити" і "Додати до списку бажань"
  document
    .querySelectorAll(".game-card .buttons")
    .forEach((buttonContainer) => {
      const gameId = buttonContainer.dataset.game;
      const installButton = buttonContainer.querySelector(".install");
      const wishlistButton = buttonContainer.querySelector(".wishlist");

      if (installButton) {
        installButton.dataset.game = gameId;
        installButton.addEventListener("click", handleInstallClick);
      }

      if (wishlistButton) {
        wishlistButton.dataset.game = gameId;
        wishlistButton.addEventListener("click", handleWishlistButtonClick);
      }
    });
});
