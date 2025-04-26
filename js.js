// Слайдер
let currentGame = 0;
let sliderGames = [];

document.addEventListener("DOMContentLoaded", () => {
  if (typeof games === "undefined") {
    console.error("Масив games не визначений. Перевірте, чи завантажується games.js");
    return;
  }
  console.log("DOM завантажено, ігор у games:", games.length);

  sliderGames = games.filter((game) => game.inSlider === true);
  console.log("Ігор у слайдері:", sliderGames.length);

  const gameBanner = document.querySelector(".game-banner");
  const gameTitle = document.querySelector(".game-title");
  const gameDescription = document.querySelector(".game-description");
  const gameTags = document.querySelector(".tags");
  const prevButton = document.querySelector(".prev");
  const nextButton = document.querySelector(".next");
  const indicatorsContainer = document.querySelector(".indicators");
  const installButton = document.querySelector(".game-slider .install");
  const learnButton = document.querySelector(".game-slider .learn");

  // Діагностика: перевіряємо, чи знайдено кнопки
  console.log("installButton:", installButton);
  console.log("learnButton:", learnButton);

  function updateGame() {
    if (sliderGames.length === 0) {
      console.warn("Немає ігор для слайдера (inSlider: true)");
      return;
    }

    // Ініціалізація модального вікна
    const modal = document.getElementById("downloadModal");
    const closeModal = document.getElementById("closeModal");
    const downloadLinksContainer = document.getElementById("downloadLinks");

    console.log("modal:", modal);
    console.log("closeModal:", closeModal);
    console.log("downloadLinksContainer:", downloadLinksContainer);

    // Закриття модального вікна
    if (closeModal && modal) {
      closeModal.onclick = () => {
        modal.style.display = "none";
        console.log("Модальне вікно закрито через кнопку закриття");
      };
    }

    // Закриття модального вікна при кліку поза ним
    if (modal) {
      window.onclick = (event) => {
        if (event.target === modal) {
          modal.style.display = "none";
          console.log("Модальне вікно закрито через клік поза вікном");
        }
      };
    } else {
      console.error("Модальне вікно не знайдено, перевірте ID 'downloadModal'");
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

    if (installButton) {
      installButton.dataset.game = gameId;
      installButton.removeEventListener("click", handleInstallClick);
      installButton.addEventListener("click", handleInstallClick);
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

  // Функція обробника для кнопки "Завантажити"
  function handleInstallClick(event) {
    event.preventDefault();
    console.log("Кнопка 'Завантажити' натиснута");
    const gameId = event.target.dataset.game;
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (!isAuthenticated) {
      console.log("Користувач не авторизований, перенаправлення на login.html");
      window.location.href = "./login.html";
      return;
    }

    // Знаходимо гру за gameId
    const game = games.find(
      (g) => g.title.toLowerCase().replace(/\s+/g, "-") === gameId
    );
    if (!game) {
      console.warn("Гру не знайдено:", gameId);
      return;
    }

    // Повторно знаходимо модальне вікно
    const modal = document.getElementById("downloadModal");
    const downloadLinksContainer = document.getElementById("downloadLinks");

    // Відкриваємо модальне вікно
    if (modal) {
      modal.style.display = "flex";
      console.log("Модальне вікно відкрито для гри:", gameId);
    } else {
      console.error("Модальне вікно не знайдено під час спроби відкрити");
      return;
    }

    // Додаємо посилання у модальне вікно
    if (downloadLinksContainer) {
      downloadLinksContainer.innerHTML = "";
      if (game.downloadLinks && game.downloadLinks.length > 0) {
        game.downloadLinks.forEach((link) => {
          const a = document.createElement("a");
          a.href = link.url;
          a.textContent = link.platform;
          a.target = "_blank";
          downloadLinksContainer.appendChild(a);
        });
        console.log("Посилання додані у модальне вікно:", game.downloadLinks);
      } else {
        downloadLinksContainer.innerHTML = "<p>Посилання для завантаження відсутні.</p>";
        console.warn("Посилання для завантаження не знайдено для гри:", gameId);
      }
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
        currentGame = (currentGame - 1 + sliderGames.length) % sliderGames.length;
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

  const authSection = document.getElementById("auth-section");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (authSection) {
    if (currentUser) {
      authSection.innerHTML = `
        <a href="./profile.html" style="display: flex; align-items: center; gap: 10px;">
            <img src="${currentUser.avatar || "./img/avatars.png"}" alt="Avatar" style="width: 30px; height: 30px; border-radius: 50%;">
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

  function createGameCard(gameData, gameId) {
    const gameCard = document.createElement("div");
    gameCard.classList.add("game-card");
    gameCard.dataset.genres = gameData.tags.map((tag) => tag.toLowerCase()).join(" ");

    const discount = gameData.discount ? `<span class="discount">${gameData.discount}</span>` : "";
    const originalPrice = gameData.originalPrice || gameData.description;
    const discountedPrice = gameData.discount ? gameData.description : "";

    const gamePageUrl = `./games/${gameId}.html`;

    gameCard.innerHTML = `
      <a href="${gamePageUrl}" class="game-card-link">
        <div class="game-card-image">
          <img src="${gameData.image}" alt="${gameData.title}" />
          ${discount}
        </div>
        <div class="game-card-content">
          <h3>${gameData.title}</h3>
          <div class="genres">${gameData.tags.join(", ")}</div>
          <div class="developer">Developer</div>
          <div class="price">
            ${discount ? `<span class="original-price">${originalPrice}</span>` : ""}
            <span>${discountedPrice || originalPrice}</span>
          </div>
          <div class="buttons" data-game="${gameId}">
            <button class="install">Завантажити</button>
            <button class="wishlist">♡</button>
          </div>
        </div>
      </a>
    `;
    return gameCard;
  }

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

  function handleWishlistButtonClick(event) {
    event.preventDefault();
    const button = event.target;
    const gameId = button.parentElement.dataset.game;

    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (!isAuthenticated) {
      window.location.href = "./login.html";
      return;
    }

    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const isInWishlist = wishlist.includes(gameId);

    if (isInWishlist) {
      wishlist = wishlist.filter((id) => id !== gameId);
      button.textContent = "♡";
    } else {
      wishlist.push(gameId);
      button.textContent = "♥";
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    updateWishlistUI(wishlist);
  }

  function renderWishlistPage(wishlist) {
    const wishlistGamesContainer = document.getElementById("wishlist-games");
    const wishlistEmptyMessage = document.getElementById("wishlist-empty");

    if (!wishlistGamesContainer || !wishlistEmptyMessage) {
      console.warn("Контейнери wishlist-games або wishlist-empty не знайдено");
      return;
    }

    wishlistGamesContainer.innerHTML = "";
    if (wishlist.length === 0) {
      wishlistEmptyMessage.style.display = "block";
      wishlistGamesContainer.style.display = "none";
    } else {
      wishlistEmptyMessage.style.display = "none";
      wishlistGamesContainer.style.display = "flex";
      wishlist.forEach((gameId) => {
        const gameData = games.find(
          (game) => game.title.toLowerCase().replace(/\s+/g, "-") === gameId
        );
        if (gameData) {
          const card = createGameCard(gameData, gameId);
          wishlistGamesContainer.appendChild(card);
        }
      });
    }

    updateWishlistUI(wishlist);
  }

  const isWishlistPage = window.location.pathname.includes("wishlist.html");
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  if (!isWishlistPage) {
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
      const card = createGameCard(game, gameId);
      if (game.section === "new") {
        newReleasesContainer.appendChild(card);
      } else if (game.section === "popular") {
        popularGamesContainer.appendChild(card);
      }
    });

    const gameCards = document.querySelectorAll(".game-card");
    console.log("Знайдено карточок ігор:", gameCards.length);
    const filterButtons = document.querySelectorAll(".filters button");

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        const filter = button.textContent.toLowerCase();
        gameCards.forEach((card) => {
          const genres = card.dataset.genres.toLowerCase().split(" ");
          if (filter === "all games") {
            card.style.display = "block";
          } else {
            card.style.display = genres.includes(filter) ? "block" : "none";
          }
        });
      });
    });

    if (filterButtons.length > 0) {
      document.querySelector(".filters button:first-child").classList.add("active");
    }

    updateWishlistUI(wishlist);
  }

  if (isWishlistPage) {
    renderWishlistPage(wishlist);
  }

  document.querySelectorAll(".game-card .buttons").forEach((buttonContainer) => {
    const gameId = buttonContainer.dataset.game;
    const installButton = buttonContainer.querySelector(".install");
    const wishlistButton = buttonContainer.querySelector(".wishlist");

    if (installButton) {
      installButton.dataset.game = gameId;
      installButton.addEventListener("click", handleInstallClick);
    }

    if (wishlistButton) {
      wishlistButton.addEventListener("click", handleWishlistButtonClick);
    }
  });
});