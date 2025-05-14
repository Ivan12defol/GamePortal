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

  const descriptionCounter = document.getElementById("description-counter");
  const maxDescriptionLength = descriptionInput.getAttribute("maxlength");

  // Ініціалізація значень
  usernameInput.value = currentUser.username || "";
  descriptionInput.value = currentUser.description || "";
  emailInput.value = currentUser.email || "";
  phoneInput.value = currentUser.phone || "";
  passwordInput.value = "";
  avatarInput.value =
    currentUser.avatar || "https://via.placeholder.com/100?text=Avatar";
  const avatarPreview = document.getElementById("avatar-preview");
  avatarPreview.src = avatarInput.value;

  descriptionCounter.textContent = `${
    maxDescriptionLength - descriptionInput.value.length
  } символів залишилось`;

  // Оновлення лічильника символів
  descriptionInput.addEventListener("input", () => {
    const remaining = maxDescriptionLength - descriptionInput.value.length;
    descriptionCounter.textContent = `${remaining} символів залишилось`;
    if (remaining < 10) {
      descriptionCounter.classList.add("warning");
    } else {
      descriptionCounter.classList.remove("warning");
    }
  });

  // Перемикання вкладок
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

  // Обробка вибору аватара
  const avatarOptions = document.querySelectorAll(".avatar-option");
  const avatarUpload = document.getElementById("avatar-upload");
  const avatarDropdownBtn = document.querySelector(".avatar-dropdown-btn");
  const avatarDropdown = document.querySelector(".avatar-dropdown");

  avatarDropdownBtn.addEventListener("click", () => {
    avatarDropdown.style.display =
      avatarDropdown.style.display === "none" ? "block" : "none";
  });

  document.addEventListener("click", (e) => {
    if (
      !avatarDropdown.contains(e.target) &&
      !avatarDropdownBtn.contains(e.target)
    ) {
      avatarDropdown.style.display = "none";
    }
  });

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

  // Обробка редагування фото
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

  function updateImageTransform() {
    cropperImage.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
  }

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
    avatarUpload.value = "";
  });

  // Функція оновлення користувача на всіх сторінках
  function updateUserAcrossPages(updatedUser) {
    const authSections = document.querySelectorAll("#auth-section");
    authSections.forEach((section) => {
      section.innerHTML = `
        <a href="./profile.html" style="display: flex; align-items: center; gap: 10px;">
          <img src="${
            updatedUser.avatar || "./img/avatars.png"
          }" alt="Avatar" style="width: 30px; height: 30px; border-radius: 50%;">
          <button class="signin font-medium">${updatedUser.username}</button>
        </a>
      `;
    });
  }

  // Перевірка форм
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

  function checkAvatarForm() {
    let isValid = true;
    return isValid;
  }

  function checkInfoForm() {
    let isValid = true;
    emailError.classList.remove("visible");
    phoneError.classList.remove("visible");
    passwordError.classList.remove("visible");

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailInput.value.trim())) {
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

  // Обробка подання форм
  if (profileForm) {
    profileForm.addEventListener("submit", function (event) {
      event.preventDefault();
      if (checkProfileForm()) {
        let users = JSON.parse(localStorage.getItem("users")) || {};
        users = Object.values(users); // Перетворюємо об’єкт у масив

        const userExists =
          users.some(
            (user) =>
              user.email === currentUser.email &&
              user.username !== currentUser.username &&
              user.username === usernameInput.value.trim()
          ) ||
          users.some(
            (user) =>
              user.email !== currentUser.email &&
              user.email === emailInput.value.trim()
          );

        if (userExists) {
          alert("Користувач з таким ім'ям або email вже існує!");
          return;
        }

        const updatedUser = {
          ...currentUser,
          username: usernameInput.value.trim(),
          description: descriptionInput.value.trim(),
        };

        users = users.map((user) =>
          user.email === currentUser.email ? updatedUser : user
        );
        // Перетворюємо масив назад у об’єкт для збереження
        const updatedUsersObj = {};
        users.forEach((user) => {
          updatedUsersObj[user.email] = user;
        });

        localStorage.setItem("users", JSON.stringify(updatedUsersObj));
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
        updateUserAcrossPages(updatedUser);
        alert("Профіль оновлено!");
        window.location.href = "./profile.html";
      }
    });
  }

  if (avatarForm) {
    avatarForm.addEventListener("submit", function (event) {
      event.preventDefault();
      if (checkAvatarForm()) {
        let users = JSON.parse(localStorage.getItem("users")) || {};
        users = Object.values(users);

        const updatedUser = {
          ...currentUser,
          avatar:
            avatarInput.value.trim() ||
            "https://via.placeholder.com/100?text=Avatar",
        };

        users = users.map((user) =>
          user.email === currentUser.email ? updatedUser : user
        );
        const updatedUsersObj = {};
        users.forEach((user) => {
          updatedUsersObj[user.email] = user;
        });

        localStorage.setItem("users", JSON.stringify(updatedUsersObj));
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
        updateUserAcrossPages(updatedUser);
        alert("Аватар оновлено!");
        window.location.href = "./profile.html";
      }
    });
  }

  if (infoForm) {
    infoForm.addEventListener("submit", function (event) {
      event.preventDefault();
      if (checkInfoForm()) {
        let users = JSON.parse(localStorage.getItem("users")) || {};
        users = Object.values(users);

        const userExists = users.some(
          (user) =>
            user.email !== currentUser.email &&
            user.email === emailInput.value.trim()
        );

        if (userExists) {
          alert("Користувач з таким email вже існує!");
          return;
        }

        const updatedUser = {
          ...currentUser,
          email: emailInput.value.trim(),
          phone: phoneInput.value.trim(),
          password: passwordInput.value.trim() || currentUser.password,
        };

        users = users.map((user) =>
          user.email === currentUser.email ? updatedUser : user
        );
        const updatedUsersObj = {};
        users.forEach((user) => {
          updatedUsersObj[user.email] = user;
        });

        localStorage.setItem("users", JSON.stringify(updatedUsersObj));
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
        updateUserAcrossPages(updatedUser);
        alert("Інформація оновлена!");
        window.location.href = "./profile.html";
      }
    });
  }
});
