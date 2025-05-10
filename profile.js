document.addEventListener("DOMContentLoaded", function () {
  let currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  let walletBalanceElement = document.getElementById("wallet-balance");

  // Перевіряємо, чи користувач авторизований
  if (!currentUser || !isAuthenticated) {
    window.location.href = "./login.html";
    showNotification("Будь ласка, увійдіть!");
    return;
  }

  // Ініціалізація гаманця, якщо не існує
  if (currentUser.wallet === undefined || currentUser.wallet === null) {
    currentUser.wallet = 0;
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  }

  const usernameElement = document.getElementById("username");
  const descriptionElement = document.getElementById("description");
  const avatarElement = document.getElementById("avatar");
  const authSection = document.getElementById("auth-section");

  // Перевіряємо наявність елементів
  if (
    !usernameElement ||
    !descriptionElement ||
    !avatarElement ||
    !walletBalanceElement ||
    !authSection
  ) {
    console.error("Один або кілька елементів профілю не знайдені на сторінці");
    return;
  }

  // Заповнюємо профіль
  usernameElement.textContent = currentUser.username || "Нік не вказано";
  descriptionElement.textContent =
    currentUser.description || "Опис профілю відсутній.";
  avatarElement.src = currentUser.avatar || "./img/avatars.png";
  walletBalanceElement.textContent = `${currentUser.wallet} грн`;

  // Оновлюємо секцію авторизації
  authSection.innerHTML = `
    <a href="./profile.html" style="display: flex; align-items: center; gap: 10px;">
      <img src="${
        currentUser.avatar || "./img/avatars.png"
      }" alt="Avatar" style="width: 30px; height: 30px; border-radius: 50%;">
      <button class="signin font-medium">${currentUser.username}</button>
    </a>
  `;

  // Функція для показу тимчасового повідомлення
  function showNotification(message, isError = false) {
    let notification = document.getElementById("notification");
    if (!notification) {
      notification = document.createElement("div");
      notification.id = "notification";
      notification.style.cssText = `
        position: fixed;
        top: 20px;
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

  // Оновлення UI гаманця з анімацією
  function updateWalletUI(newAmount) {
    currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (walletBalanceElement) {
      const oldAmount = parseFloat(walletBalanceElement.textContent);
      walletBalanceElement.textContent = `${newAmount} грн`;
      animateBalanceChange(oldAmount, newAmount);
    }
  }

  // Анімація зміни балансу
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

  // Модальне вікно для поповнення гаманця
  const topUpModal = document.getElementById("topUpModal");
  const topUpBtn = document.getElementById("top-up-wallet");
  const closeTopUpModal = document.getElementById("closeTopUpModal");
  const topUpForm = document.getElementById("topUpForm");
  const topUpAmountInput = document.getElementById("topUpAmount");
  const topUpMessage = document.getElementById("topUpMessage");
  const topUpLoading = document.getElementById("topUpLoading");
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
      if (topUpLoading) topUpLoading.style.display = "none";
    });
  }

  if (cancelTopUpBtn) {
    cancelTopUpBtn.addEventListener("click", () => {
      topUpModal.style.display = "none";
      if (topUpForm) topUpForm.reset();
      if (topUpMessage) topUpMessage.style.display = "none";
      if (topUpLoading) topUpLoading.style.display = "none";
    });
  }

  if (topUpModal) {
    window.addEventListener("click", (event) => {
      if (event.target === topUpModal) {
        topUpModal.style.display = "none";
        if (topUpForm) topUpForm.reset();
        if (topUpMessage) topUpMessage.style.display = "none";
        if (topUpLoading) topUpLoading.style.display = "none";
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && topUpModal.style.display === "flex") {
        topUpModal.style.display = "none";
        if (topUpForm) topUpForm.reset();
        if (topUpMessage) topUpMessage.style.display = "none";
        if (topUpLoading) topUpLoading.style.display = "none";
      }
    });
  }

  // Додаємо обробники для кнопок швидкого вибору суми
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

      if (topUpLoading) topUpLoading.style.display = "block";
      if (topUpMessage) topUpMessage.style.display = "none";

      setTimeout(() => {
        if (isNaN(amount) || amount <= 0) {
          if (topUpMessage) {
            topUpMessage.textContent = "Введіть коректну суму більше 0!";
            topUpMessage.style.display = "block";
            topUpMessage.style.color = "#d9534f";
          }
          showNotification("Введіть коректну суму більше 0!", true);
          if (topUpLoading) topUpLoading.style.display = "none";
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
          if (topUpLoading) topUpLoading.style.display = "none";
        } else {
          setTimeout(() => {
            currentUser.wallet += amount;
            localStorage.setItem("currentUser", JSON.stringify(currentUser));
            updateWalletUI(currentUser.wallet);
            if (topUpMessage) {
              topUpMessage.textContent = `Гаманець поповнено на ${amount} грн!`;
              topUpMessage.style.display = "block";
              topUpMessage.style.color = "#4CAF50";
            }
            showNotification(`Гаманець поповнено на ${amount} грн!`);
            if (topUpLoading) topUpLoading.style.display = "none";
            topUpModal.style.display = "none";
            if (topUpForm) topUpForm.reset();
          }, 1000); // Додаткова затримка для успіху
        }
      }, 500); // Початкова затримка для спінера
    });
  }
});

function logout() {
  localStorage.removeItem("currentUser");
  localStorage.setItem("isAuthenticated", "false");
  window.location.href = "./login.html";
}
