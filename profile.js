document.addEventListener("DOMContentLoaded", function () {
  let currentUser;
  try {
    currentUser = JSON.parse(localStorage.getItem("currentUser"));
  } catch (e) {
    console.error("Помилка парсингу currentUser із localStorage:", e);
    currentUser = null;
  }

  if (currentUser && !currentUser.hasOwnProperty("wallet")) {
    currentUser.wallet = 0;
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  }

  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  let walletBalanceElement = document.getElementById("wallet-balance");
  const postTopUpLoading = document.getElementById("postTopUpLoading");

  let users;
  try {
    users = JSON.parse(localStorage.getItem("users")) || {};
  } catch (e) {
    console.error("Помилка парсингу users із localStorage:", e);
    users = {};
  }

  if (!currentUser || !isAuthenticated) {
    window.location.href = "./login.html";
    showNotification("Будь ласка, увійдіть!");
    return;
  }

  if (!users[currentUser.username]) {
    users[currentUser.username] = {
      username: currentUser.username,
      email: currentUser.email || "",
      password: currentUser.password || "",
      avatar: currentUser.avatar || "./img/avatars.png",
      wallet: Number(currentUser.wallet) || 0,
    };
    localStorage.setItem("users", JSON.stringify(users));
  }

  currentUser = users[currentUser.username];
  localStorage.setItem("currentUser", JSON.stringify(currentUser));

  const usernameElement = document.getElementById("username");
  const descriptionElement = document.getElementById("description");
  const avatarElement = document.getElementById("avatar");
  const authSection = document.getElementById("auth-section");
  const gameArea = document.getElementById("gameArea");
  const scoreElement = document.getElementById("score");
  const highScoreElement = document.getElementById("highScore");

  if (
    !usernameElement ||
    !descriptionElement ||
    !avatarElement ||
    !walletBalanceElement ||
    !authSection ||
    !gameArea ||
    !scoreElement ||
    !highScoreElement
  ) {
    console.error("Один або кілька елементів профілю не знайдені на сторінці");
    return;
  }

  usernameElement.textContent = currentUser.username || "Нік не вказано";
  descriptionElement.textContent =
    currentUser.description || "Опис профілю відсутній.";
  avatarElement.src = currentUser.avatar || "./img/avatars.png";
  walletBalanceElement.textContent = `${currentUser.wallet} грн`;

  authSection.innerHTML = `
    <a href="./profile.html" style="display: flex; align-items: center; gap: 10px;">
      <img src="${
        currentUser.avatar || "./img/avatars.png"
      }" alt="Avatar" style="width: 30px; height: 30px; border-radius: 50%;">
      <button class="signin font-medium">${currentUser.username}</button>
    </a>
  `;

  // Логіка гри
  let score = 0;
  let gameActive = true;

  // Завантажуємо рекорд із localStorage
  let highScore = localStorage.getItem("smileyGameHighScore") || 0;
  highScoreElement.textContent = highScore;

  function createSmiley() {
    if (!gameActive) return;

    const smiley = document.createElement("div");
    smiley.classList.add("smiley");

    smiley.innerHTML = `
      <svg width="50" height="50" viewBox="0 0 60 60">
        <circle cx="30" cy="30" r="25" fill="#ffd700" stroke="#8247e5" stroke-width="3"/>
        <circle cx="22" cy="25" r="4" fill="#000"/>
        <circle cx="38" cy="25" r="4" fill="#000"/>
        <path d="M 20 40 Q 30 50 40 40" fill="none" stroke="#000" stroke-width="3"/>
      </svg>
    `;

    const maxX = gameArea.clientWidth - 50;
    const maxY = gameArea.clientHeight - 50;
    const x = Math.random() * maxX;
    const y = Math.random() * maxY;

    smiley.style.left = `${x}px`;
    smiley.style.top = `${y}px`;

    smiley.addEventListener("click", (e) => {
      e.stopPropagation(); // Зупиняємо передачу події до gameArea
      if (!gameActive) return;
      score += 1;
      scoreElement.textContent = score;
      smiley.remove();
      createSmiley();

      // Оновлюємо рекорд
      if (score > highScore) {
        highScore = score;
        highScoreElement.textContent = highScore;
        localStorage.setItem("smileyGameHighScore", highScore);
      }
    });

    gameArea.appendChild(smiley);
  }

  // Обробник кліку по ігровій зоні (програш)
  gameArea.addEventListener("click", (e) => {
    if (!gameActive) return;
    if (e.target === gameArea) {
      gameActive = false;
      showNotification("Ти промахнувся! Гра закінчена! 😢", true);

      // Видаляємо всі смайлики
      const smileys = document.querySelectorAll(".smiley");
      smileys.forEach((smiley) => smiley.remove());

      // Додаємо кнопку "Спробувати ще раз"
      const retryButton = document.createElement("button");
      retryButton.textContent = "Спробувати ще раз";
      retryButton.classList.add("signin", "font-medium");
      retryButton.style.position = "absolute";
      retryButton.style.left = "50%";
      retryButton.style.top = "50%";
      retryButton.style.transform = "translate(-50%, -50%)";
      retryButton.addEventListener("click", () => {
        score = 0;
        scoreElement.textContent = score;
        gameActive = true;
        retryButton.remove();
        for (let i = 0; i < 3; i++) {
          createSmiley();
        }
      });
      gameArea.appendChild(retryButton);
    }
  });

  if (gameArea) {
    for (let i = 0; i < 3; i++) {
      createSmiley();
    }
  }

  function showNotification(message, isError = false) {
    let notification = document.getElementById("notification");
    if (!notification) {
      notification = document.createElement("div");
      notification.id = "notification";
      notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 15px;
        border-radius: 5px;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
      `;
      document.body.appendChild(notification);
    }

    notification.textContent = message;
    notification.style.backgroundColor = isError ? "#d9534f" : "#4CAF50";
    notification.style.color = "white";
    notification.style.opacity = "1";

    setTimeout(() => {
      notification.style.opacity = "0";
    }, 3000);
  }

  function updateWalletUI(newAmount) {
    users = JSON.parse(localStorage.getItem("users")) || {};
    currentUser = users[currentUser.username];
    newAmount = Number(newAmount) || 0;
    if (walletBalanceElement) {
      const oldAmount = parseFloat(walletBalanceElement.textContent) || 0;
      walletBalanceElement.textContent = `${newAmount} грн`;
      animateBalanceChange(oldAmount, newAmount);
    }
  }

  function animateBalanceChange(oldAmount, newAmount) {
    let start = oldAmount;
    const duration = 500;
    const steps = 20;
    const stepTime = duration / steps;
    let step = 0;

    const delta = (newAmount - oldAmount) / steps;
    const interval = setInterval(() => {
      step++;
      if (step <= steps) {
        start += delta;
        walletBalanceElement.textContent = `${Math.round(start)} грн`;
      } else {
        clearInterval(interval);
        walletBalanceElement.textContent = `${newAmount} грн`;
      }
    }, stepTime);
  }

  const topUpModal = document.getElementById("topUpModal");
  const topUpBtn = document.getElementById("top-up-wallet");
  const closeTopUpModal = document.getElementById("closeTopUpModal");
  const topUpForm = document.getElementById("topUpForm");
  const topUpAmountInput = document.getElementById("topUpAmount");
  const topUpMessage = document.getElementById("topUpMessage");
  const cancelTopUpBtn = document.getElementById("cancelTopUp");

  if (topUpBtn && topUpModal) {
    topUpBtn.addEventListener("click", () => {
      topUpModal.style.display = "flex";
      if (topUpMessage) topUpMessage.style.display = "none";
    });
  }

  if (closeTopUpModal && topUpModal) {
    closeTopUpModal.addEventListener("click", () => {
      topUpModal.style.display = "none";
      if (topUpForm) topUpForm.reset();
      if (topUpMessage) topUpMessage.style.display = "none";
    });
  }

  if (cancelTopUpBtn) {
    cancelTopUpBtn.addEventListener("click", () => {
      topUpModal.style.display = "none";
      if (topUpForm) topUpForm.reset();
      if (topUpMessage) topUpMessage.style.display = "none";
    });
  }

  if (topUpModal) {
    window.addEventListener("click", (event) => {
      if (event.target === topUpModal) {
        topUpModal.style.display = "none";
        if (topUpForm) topUpForm.reset();
        if (topUpMessage) topUpMessage.style.display = "none";
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && topUpModal.style.display === "flex") {
        topUpModal.style.display = "none";
        if (topUpForm) topUpForm.reset();
        if (topUpMessage) topUpMessage.style.display = "none";
      }
    });
  }

  const quickAmountButtons = document.querySelectorAll(".quick-amount");
  quickAmountButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const amount = parseFloat(button.dataset.amount);
      if (topUpAmountInput) topUpAmountInput.value = amount;
    });
  });

  if (topUpForm) {
    topUpForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const amount = parseFloat(topUpAmountInput.value);
      const maxAmount = 10000;

      if (topUpMessage) topUpMessage.style.display = "none";

      setTimeout(() => {
        if (isNaN(amount) || amount <= 0) {
          if (topUpMessage) {
            topUpMessage.textContent = "Введіть коректну суму більше 0!";
            topUpMessage.style.display = "block";
            topUpMessage.style.color = "#d9534f";
          }
          showNotification("Введіть коректну суму більше 0!", true);
        } else if (amount > maxAmount) {
          if (topUpMessage) {
            topUpMessage.textContent = `Максимальна сума поповнення: ${maxAmount} грн!`;
            topUpMessage.style.display = "block";
            topUpMessage.style.color = "#d9534f";
          }
          showNotification(
            `Максимальна сума поповнення: ${maxAmount} грн!`,
            true
          );
        } else {
          users = JSON.parse(localStorage.getItem("users")) || {};
          currentUser = users[currentUser.username];
          currentUser.wallet += amount;
          users[currentUser.username] = currentUser;
          localStorage.setItem("users", JSON.stringify(users));
          localStorage.setItem("currentUser", JSON.stringify(currentUser));
          if (postTopUpLoading) postTopUpLoading.style.display = "flex";
          setTimeout(() => {
            updateWalletUI(currentUser.wallet);
            if (topUpMessage) {
              topUpMessage.textContent = `Гаманець поповнено на ${amount} грн!`;
              topUpMessage.style.display = "block";
              topUpMessage.style.color = "#4CAF50";
            }
            showNotification(`Гаманець поповнено на ${amount} грн!`);
            if (postTopUpLoading) postTopUpLoading.style.display = "none";
            topUpModal.style.display = "none";
            if (topUpForm) topUpForm.reset();
          }, 1000);
        }
      });
    });
  }
});

function logout() {
  localStorage.removeItem("currentUser");
  localStorage.setItem("isAuthenticated", "false");
  window.location.href = "./login.html";
}
notification;
