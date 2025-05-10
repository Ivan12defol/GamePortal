document.addEventListener("DOMContentLoaded", () => {
  // Перевірка на наявність window.games
  if (typeof window.games === "undefined") {
    console.error(
      "Масив window.games не визначений. Перевірте завантаження games.js"
    );
    return;
  }
  console.log("DOM завантажено, ігор у window.games:", window.games.length);

  // Функція виходу (залишаємо на випадок використання в інших місцях)
  function logout() {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("currentUser");
    window.location.href = "../login.html";
  }

  // Логіка авторизації
  const authSection = document.getElementById("auth-section");
  const walletSection = document.getElementById("wallet-section");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  if (authSection) {
    if (isAuthenticated && currentUser) {
      let avatarSrc = currentUser.avatar || "../img/avatars.png";
      if (
        avatarSrc &&
        !avatarSrc.startsWith("http") &&
        !avatarSrc.startsWith("/")
      ) {
        avatarSrc = `../${avatarSrc}`;
      }
      console.log("Avatar Src:", avatarSrc);
      authSection.innerHTML = `
        <div>
          <a href="../profile.html" style="display: flex; align-items: center; gap: 10px;">
            <img src="${avatarSrc}" alt="Avatar" style="width: 30px; height: 30px; border-radius: 50%;">
            <button class="signin font-medium">${currentUser.username}</button>
          </a>
        </div>
      `;
    } else {
      authSection.innerHTML = `
        <a href="../login.html">
          <button class="signin font-medium">Sign In</button>
        </a>
      `;
    }
  }

  // Логіка гаманця
  if (walletSection) {
    if (isAuthenticated && currentUser) {
      // Ініціалізація гаманця, якщо не існує
      if (!currentUser.wallet) {
        currentUser.wallet = 0;
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
      }
      walletSection.innerHTML = `
        <div class="wallet-container">
          <span class="balance-label"></span>
          <span id="balance-display">${currentUser.wallet} грн</span>
        </div>
      `;
    } else {
      walletSection.innerHTML = "";
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
        href === "../index.html" &&
        (currentPath === "/" || currentPath.includes("index.html"))
      ) {
        link.classList.add("active");
      }
    });
  }

  highlightActiveMenuItem();

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
    console.log("Бібліотека збережено:", library);
  }

  // Ініціалізація модального вікна
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
  }

  // Логіка для кнопок "Завантажити" і "Додати до списку бажань"
  document.querySelectorAll(".buttons").forEach((buttonContainer) => {
    const gameId = buttonContainer.dataset.game;
    const installButton = buttonContainer.querySelector(".install");
    const wishlistButton = buttonContainer.querySelector(".wishlist");

    // Перевірка стану кнопки "Завантажити" при завантаженні
    if (installButton) {
      const library = getUserLibrary();
      if (library.includes(gameId)) {
        installButton.textContent = "Перейти в бібліотеку";
        installButton.classList.add("library-link");
        if (wishlistButton) {
          wishlistButton.remove();
          console.log(
            "Кнопка 'Додати до списку бажань' видалена, бо гра в бібліотеці:",
            gameId
          );
        }
      }

      installButton.dataset.game = gameId;
      installButton.addEventListener("click", (event) => {
        event.preventDefault();
        console.log("Кнопка 'Завантажити' натиснута для гри:", gameId);

        // Якщо кнопка вже "Перейти в бібліотеку", перенаправляємо
        if (installButton.textContent === "Перейти в бібліотеку") {
          console.log("Перенаправлення на library.html");
          window.location.href = "../library.html";
          return;
        }

        const isAuthenticated =
          localStorage.getItem("isAuthenticated") === "true";
        if (!isAuthenticated) {
          console.log(
            "Користувач не авторизований, перенаправлення на login.html"
          );
          window.location.href = "../login.html";
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
              "<p>Посилання для завантаження відсутні.</p>";
          }

          // Додаємо кнопку "Завантажити з сайту"
          const siteDownloadButton = document.createElement("a");
          siteDownloadButton.href = "#";
          siteDownloadButton.textContent = "Завантажити з сайту";
          siteDownloadButton.addEventListener("click", (e) => {
            e.preventDefault();
            let library = getUserLibrary();
            if (!library.includes(gameId)) {
              library.push(gameId);
              saveUserLibrary(library);
              console.log("Гра додана до бібліотеки:", library);
              alert("Гра завантажена!");

              installButton.textContent = "Перейти в бібліотеку";
              installButton.classList.add("library-link");
              if (wishlistButton) {
                wishlistButton.remove();
                console.log(
                  "Кнопка 'Додати до списку бажань' видалена:",
                  gameId
                );
              }
            }
            modal.style.display = "none";
          });
          downloadLinksContainer.appendChild(siteDownloadButton);
        } else {
          console.error("Контейнер downloadLinks не знайдено");
        }
      });
    }

    if (wishlistButton) {
      let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      wishlistButton.textContent = wishlist.includes(gameId)
        ? "♥ Додати до списку бажань"
        : "♡ Додати до списку бажань";

      wishlistButton.addEventListener("click", (event) => {
        event.preventDefault();
        console.log(
          "Кнопка 'Додати до списку бажань' натиснута для гри:",
          gameId
        );
        const isAuthenticated =
          localStorage.getItem("isAuthenticated") === "true";
        if (!isAuthenticated) {
          console.log(
            "Користувач не авторизований, перенаправлення на login.html"
          );
          window.location.href = "../login.html";
          return;
        }

        let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        const isInWishlist = wishlist.includes(gameId);

        if (isInWishlist) {
          wishlist = wishlist.filter((id) => id !== gameId);
          wishlistButton.textContent = "♡ Додати до списку бажань";
          console.log("Гра видалена зі списку бажань:", gameId);
        } else {
          wishlist.push(gameId);
          wishlistButton.textContent = "♥ Додати до списку бажань";
          console.log("Гра додана до списку бажань:", gameId);
        }

        localStorage.setItem("wishlist", JSON.stringify(wishlist));
      });
    }
  });
});
