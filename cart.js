document.addEventListener("DOMContentLoaded", function () {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartButton = document.getElementById("cartButton");
  const cartCount = document.getElementById("cartCount");
  const cartModal = document.getElementById("cartModal");
  const closeCartModal = document.getElementById("closeCartModal");
  const cartItemsContainer = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const checkoutButton = document.getElementById("checkoutButton");

  console.log("cartButton:", cartButton);
  console.log("cartModal:", cartModal);

  // Оновлення лічильника кошика
  function updateCartCount() {
    if (cartCount) {
      cartCount.textContent = cart.length;
      console.log("Оновлено лічильник кошика:", cart.length);
    } else {
      console.error("cartCount не знайдено");
    }
  }

  // Оновлення вмісту кошика
  function updateCartModal() {
    if (!cartItemsContainer || !cartTotal) {
      console.error("cartItemsContainer або cartTotal не знайдено");
      return;
    }

    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
      const cartItem = document.createElement("div");
      cartItem.classList.add("cart-item");
      cartItem.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
          <img src="${item.image}" alt="${item.name}">
          <p>${item.name} - ${item.price} грн</p>
        </div>
        <button class="remove-from-cart" data-index="${index}">Видалити</button>
      `;
      cartItemsContainer.appendChild(cartItem);
      total += item.price;
    });

    cartTotal.textContent = total.toFixed(2);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    console.log("Оновлено кошик, загальна сума:", total);
  }

  // Слухач для оновлення кошика при додаванні гри
  window.addEventListener("cartUpdated", () => {
    cart = JSON.parse(localStorage.getItem("cart")) || [];
    updateCartCount();
    console.log("Отримано подію cartUpdated, оновлено лічильник");
  });

  // Відкриття модального вікна кошика
  if (cartButton && cartModal) {
    cartButton.addEventListener("click", () => {
      cartModal.style.display = "flex";
      updateCartModal();
      console.log("Модальне вікно кошика відкрито");
    });
  } else {
    console.error("cartButton або cartModal не знайдено");
  }

  // Закриття модального вікна кошика
  if (closeCartModal) {
    closeCartModal.addEventListener("click", () => {
      if (cartModal) {
        cartModal.style.display = "none";
        console.log("Модальне вікно кошика закрито");
      }
    });
  } else {
    console.error("closeCartModal не знайдено");
  }

  // Закриття модального вікна при кліку поза ним
  window.addEventListener("click", (event) => {
    if (cartModal && event.target === cartModal) {
      cartModal.style.display = "none";
      console.log("Модальне вікно закрито кліком поза ним");
    }
  });

  // Видалення гри з кошика
  document.addEventListener("click", (event) => {
    if (event.target.classList.contains("remove-from-cart")) {
      const index = event.target.dataset.index;
      cart.splice(index, 1);
      updateCartModal();
      console.log("Гра видалена з кошика, індекс:", index);
      // Відправляємо подію для оновлення лічильника
      window.dispatchEvent(new Event("cartUpdated"));
    }
  });

  // Обробка покупки
  if (checkoutButton) {
    checkoutButton.addEventListener("click", () => {
      if (cart.length === 0) {
        window.showNotification("Кошик порожній!");
        return;
      }

      let currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};
      let users = JSON.parse(localStorage.getItem("users")) || {};

      const total = cart.reduce((sum, item) => sum + item.price, 0);

      if (!currentUser || !currentUser.wallet || currentUser.wallet < total) {
        window.showNotification(
          "Недостатньо коштів на гаманці! Поповніть баланс."
        );
        if (cartModal) cartModal.style.display = "none";
        return;
      }

      // Списуємо кошти
      currentUser.wallet -= total;
      users[currentUser.username] = currentUser;
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("currentUser", JSON.stringify(currentUser));

      // Додаємо ігри до бібліотеки
      let library = window.getUserLibrary() || [];
      cart.forEach((item) => {
        const gameId = item.name.toLowerCase().replace(/\s+/g, "-");
        if (!library.includes(gameId)) {
          library.push(gameId);
        }
      });
      window.saveUserLibrary(library);

      // Повідомлення про покупку через showNotification
      window.showNotification(`Покупка успішна! Списано ${total} грн.`);

      // Очищаємо кошик
      cart = [];
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartModal();
      if (cartModal) cartModal.style.display = "none";

      // Оновлення UI гаманця
      const walletSection = document.getElementById("wallet-section");
      if (walletSection) {
        walletSection.innerHTML = `
          <div class="wallet-container">
            <span class="balance-label"></span>
            <span id="balance-display">${currentUser.wallet} грн</span>
          </div>
        `;
        console.log("Оновлено UI гаманця:", currentUser.wallet);
      }

      // Відправляємо подію для оновлення UI (зміна кнопок і бібліотеки)
      window.dispatchEvent(new Event("cartUpdated"));
      window.dispatchEvent(new Event("libraryUpdated"));
    });
  } else {
    console.error("checkoutButton не знайдено");
  }

  // Ініціалізація кошика
  updateCartCount();
});
