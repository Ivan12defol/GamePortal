const games = [
  {
    title: "Cyberpunk 2077",
    description: "1 099₴",
    tags: ["RPG", "Action"],
    image: "./img/Cyberpunk.png",
  },
  {
    title: "Counter-Strike 2",
    description: "Безкоштовне",
    tags: ["Безкоштовна гра", "Shooter", "Tactics"],
    image: "./img/cs.png",
  },
  {
    title: "Red Dead Redemption 2",
    description: "4 358₴",
    tags: ["Open world", "A deep plot", "Western"],
    image: "./img/Red Dead Redemption 2.png",
  },
  {
    title: "Dota 2",
    description: "Безкоштовне",
    tags: ["MOBA", "Безкоштовна гра", "Для кількох гравців"],
    image: "./img/Dota 2.png",
  },
  {
    title: "R.E.P.O.",
    description: "225₴",
    tags: ["Жахи", "Мережевий кооператив", "Фізика"],
    image: "./img/REPO..png",
  },
];

let currentGame = 0;

const gameBanner = document.querySelector(".game-banner");
const gameTitle = document.querySelector(".game-title");
const gameDescription = document.querySelector(".game-description");
const gameTags = document.querySelector(".tags");
const prevButton = document.querySelector(".prev");
const nextButton = document.querySelector(".next");
const indicatorsContainer = document.querySelector(".indicators");

function updateGame() {
  const game = games[currentGame];
  gameBanner.style.background = `url("${game.image}") center/cover no-repeat`;
  gameTitle.textContent = game.title;
  gameDescription.textContent = game.description;

  gameTags.innerHTML = "";
  game.tags.forEach((tag) => {
    const span = document.createElement("span");
    span.classList.add("tag");
    span.textContent = tag;
    gameTags.appendChild(span);
  });

  const indicators = [...indicatorsContainer.children];
  indicators.forEach((indicator, index) => {
    indicator.classList.toggle("active", index === currentGame);
  });
}

function createIndicators() {
  games.forEach((_, index) => {
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
  prevButton.addEventListener("click", () => {
    currentGame = (currentGame - 1 + games.length) % games.length;
    updateGame();
  });

  nextButton.addEventListener("click", () => {
    currentGame = (currentGame + 1) % games.length;
    updateGame();
  });

  createIndicators();
  updateGame();
}

if (prevButton && nextButton && indicatorsContainer) {
  initializeSlider();
}
