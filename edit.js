document.addEventListener("DOMContentLoaded", function () {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    alert("Будь ласка, увійдіть");
    window.location.href = "./login.html";
    return;
  }

  const profileForm = document.getElementById("edit-profile-form");
  const avatarForm = document.getElementById("edit-avatar-form");
  const infoForm = document.getElementById("edit-info-form");
  const usernameInput = document.getElementById("username");
  const avatarInput = document.getElementById("avatar");
  const descriptionInput = document.getElementById("description");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const passwordInput = document.getElementById("password");

  const usernameError = document.getElementById("username-error");
  const emailError = document.getElementById("email-error");
  const phoneError = document.getElementById("phone-error");
  const passwordError = document.getElementById("password-error");

  // Лічильник символів для description
  const descriptionCounter = document.getElementById("description-counter");
  const maxDescriptionLength = descriptionInput.getAttribute("maxlength");

  // Ініціалізація значень полів
  usernameInput.value = currentUser.username || "";
  descriptionInput.value = currentUser.description || "";
  emailInput.value = currentUser.email || "";
  phoneInput.value = currentUser.phone || "";
  passwordInput.value = "";

  // Ініціалізація аватара
  const avatarPreview = document.getElementById("avatar-preview");
  avatarInput.value =
    currentUser.avatar || "https://via.placeholder.com/100?text=Avatar";
  avatarPreview.src = avatarInput.value;

  // Ініціалізація счётчика символов
  descriptionCounter.textContent = `${
    maxDescriptionLength - descriptionInput.value.length
  } символів залишилось`;

  // Оновлення лічильника під час введення тексту
  descriptionInput.addEventListener("input", () => {
    const remaining = maxDescriptionLength - descriptionInput.value.length;
    descriptionCounter.textContent = `${remaining} символів залишилось`;
    if (remaining < 10) {
      descriptionCounter.classList.add("warning");
    } else {
      descriptionCounter.classList.remove("warning");
    }
  });

  // Логіка перемикання вкладок
  const tabLinks = document.querySelectorAll(".tab-link");
  const tabContents = document.querySelectorAll(".tab-content");

  tabLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      tabLinks.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");

      const tabId = link.getAttribute("data-tab");
      tabContents.forEach((content) => {
        content.style.display = content.id === tabId ? "block" : "none";
      });
    });
  });

  // Вибір аватара
  const avatarOptions = document.querySelectorAll(".avatar-option");
  const avatarUpload = document.getElementById("avatar-upload");
  const avatarDropdownBtn = document.querySelector(".avatar-dropdown-btn");
  const avatarDropdown = document.querySelector(".avatar-dropdown");

  // Показ/приховування списку, що випадає
  avatarDropdownBtn.addEventListener("click", () => {
    avatarDropdown.style.display =
      avatarDropdown.style.display === "none" ? "block" : "none";
  });

  // Закриття списку, що випадає, при кліку поза ним
  document.addEventListener("click", (e) => {
    if (
      !avatarDropdown.contains(e.target) &&
      !avatarDropdownBtn.contains(e.target)
    ) {
      avatarDropdown.style.display = "none";
    }
  });

  // Обробка вибору аватара
  avatarOptions.forEach((option) => {
    if (option.dataset.url === currentUser.avatar) {
      option.classList.add("selected");
    }
    option.addEventListener("click", () => {
      avatarOptions.forEach((opt) => opt.classList.remove("selected"));
      option.classList.add("selected");
      avatarInput.value = option.dataset.url;
      avatarPreview.src = avatarInput.value;
      avatarDropdown.style.display = "none";
    });
  });

  // Обробка завантаження файлу та редактор фото
  const cropperModal = document.getElementById("cropper-modal");
  const cropperImage = document.getElementById("cropper-image");
  const cropperCanvas = document.getElementById("cropper-canvas");
  const cropperZoomIn = document.getElementById("cropper-zoom-in");
  const cropperZoomOut = document.getElementById("cropper-zoom-out");
  const cropperRotateLeft = document.getElementById("cropper-rotate-left");
  const cropperRotateRight = document.getElementById("cropper-rotate-right");
  const cropperCrop = document.getElementById("cropper-crop");
  const cropperCancel = document.getElementById("cropper-cancel");

  let scale = 1;
  let rotation = 0;
  let originalImage = new Image();

  avatarUpload.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        originalImage.src = e.target.result;
        cropperImage.src = e.target.result;
        cropperModal.style.display = "flex";
        scale = 1;
        rotation = 0;
        updateImageTransform();
      };
      reader.readAsDataURL(file);
    }
  });

  // Оновлення трансформації зображення
  function updateImageTransform() {
    cropperImage.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
  }

  // Управління редактором фото
  cropperZoomIn.addEventListener("click", () => {
    scale += 0.1;
    updateImageTransform();
  });

  cropperZoomOut.addEventListener("click", () => {
    scale = Math.max(0.1, scale - 0.1);
    updateImageTransform();
  });

  cropperRotateLeft.addEventListener("click", () => {
    rotation -= 90;
    updateImageTransform();
  });

  cropperRotateRight.addEventListener("click", () => {
    rotation += 90;
    updateImageTransform();
  });

  cropperCrop.addEventListener("click", () => {
    const canvas = cropperCanvas;
    const ctx = canvas.getContext("2d");

    // Встановлюємо розмір canvas рівним розміру області обрізки (100x100)
    canvas.width = 100;
    canvas.height = 100;

    const imgWidth = originalImage.width * scale;
    const imgHeight = originalImage.height * scale;

    const centerX = imgWidth / 2;
    const centerY = imgHeight / 2;

    ctx.save();
    ctx.translate(50, 50);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.drawImage(originalImage, -centerX, -centerY, imgWidth, imgHeight);
    ctx.restore();

    const croppedImage = canvas.toDataURL("image/png");
    avatarInput.value = croppedImage;
    avatarPreview.src = croppedImage;
    avatarOptions.forEach((opt) => opt.classList.remove("selected"));
    cropperModal.style.display = "none";
  });

  cropperCancel.addEventListener("click", () => {
    cropperModal.style.display = "none";
    avatarUpload.value = ""; // Очистка поля загрузки
  });

  // Функція для оновлення імені та аватара на всіх сторінках
  function updateUserAcrossPages(updatedUser) {
    const authSections = document.querySelectorAll("#auth-section");
    authSections.forEach((section) => {
      section.innerHTML = `
              <a href="./profile.html" style="display: flex; align-items: center; gap: 10px;">
                  <img src="${updatedUser.avatar}" alt="Avatar" style="width: 30px; height: 30px; border-radius: 50%;">
                  <button class="signin font-medium">${updatedUser.username}</button>
              </a>
          `;
    });
  }

  // Валідація форми "Основне"
  function checkProfileForm() {
    let isValid = true;
    usernameError.classList.remove("visible");

    const usernameValue = usernameInput.value.trim();
    if (!usernameValue) {
      usernameError.classList.add("visible");
      isValid = false;
    }

    return isValid;
  }

  // Валідація форми "Аватар"
  function checkAvatarForm() {
    let isValid = true;
    return isValid;
  }

  // Валідація форми "Приватність"
  function checkInfoForm() {
    let isValid = true;
    emailError.classList.remove("visible");
    phoneError.classList.remove("visible");
    passwordError.classList.remove("visible");

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailInput.value)) {
      emailError.classList.add("visible");
      isValid = false;
    }

    const phoneValue = phoneInput.value.trim();
    if (phoneValue && !phoneValue.match(/^\+?[0-9]{10,15}$/)) {
      phoneError.classList.add("visible");
      isValid = false;
    }

    const passwordValue = passwordInput.value.trim();
    if (passwordValue && passwordValue.length < 6) {
      passwordError.classList.add("visible");
      isValid = false;
    }

    return isValid;
  }

  // Обробка форми "Основне"
  profileForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (checkProfileForm()) {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const userExists = users.some(
        (user) =>
          (user.email === currentUser.email &&
            user.username !== currentUser.username &&
            user.username === usernameInput.value) ||
          (user.email !== currentUser.email && user.email === emailInput.value)
      );

      if (userExists) {
        alert("Користувач з таким ім'ям або email вже існує!");
        return;
      }

      const updatedUser = {
        ...currentUser,
        username: usernameInput.value,
        description: descriptionInput.value.trim(),
      };

      const updatedUsers = users.map((user) =>
        user.email === currentUser.email ? updatedUser : user
      );

      localStorage.setItem("users", JSON.stringify(updatedUsers));
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      updateUserAcrossPages(updatedUser);
      alert("Профіль оновлено!");
      window.location.href = "./profile.html";
    }
  });

  // Обробка форми "Аватар"
  avatarForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (checkAvatarForm()) {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const updatedUser = {
        ...currentUser,
        avatar:
          avatarInput.value.trim() ||
          "https://via.placeholder.com/100?text=Avatar",
      };

      const updatedUsers = users.map((user) =>
        user.email === currentUser.email ? updatedUser : user
      );

      localStorage.setItem("users", JSON.stringify(updatedUsers));
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      updateUserAcrossPages(updatedUser);
      alert("Аватар оновлено!");
      window.location.href = "./profile.html";
    }
  });

  // Обробка форми "Приватність"
  infoForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (checkInfoForm()) {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const userExists = users.some(
        (user) =>
          user.email !== currentUser.email && user.email === emailInput.value
      );

      if (userExists) {
        alert("Користувач з таким email вже існує!");
        return;
      }

      const updatedUser = {
        ...currentUser,
        email: emailInput.value,
        phone: phoneInput.value.trim(),
        password: passwordInput.value.trim() || currentUser.password,
      };

      const updatedUsers = users.map((user) =>
        user.email === currentUser.email ? updatedUser : user
      );

      localStorage.setItem("users", JSON.stringify(updatedUsers));
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      updateUserAcrossPages(updatedUser);
      alert("Інформація оновлена!");
      window.location.href = "./profile.html";
    }
  });
});
