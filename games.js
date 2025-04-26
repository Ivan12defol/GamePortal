const games = [
  {
    title: "Cyberpunk 2077",
    description: "1 099₴",
    tags: ["RPG", "Action"],
    image: "./img/Cyberpunk.png",
    section: "popular",
    discount: "-25%",
    originalPrice: "1 999₴",
    inSlider: true,
    downloadLinks: [
      { platform: "Steam", url: "https://store.steampowered.com/app/1091500/Cyberpunk_2077/" },
      { platform: "Epic Games", url: "https://store.epicgames.com/en-US/p/cyberpunk-2077" },
      { platform: "Official Site", url: "https://www.cyberpunk.net/" }
    ]
  },
  {
    title: "Counter-Strike 2",
    description: "Безкоштовне",
    tags: ["Shooter", "Tactics", "Онлайн"],
    image: "./img/cs.png",
    section: "popular",
    inSlider: true,
    downloadLinks: [
      { platform: "Steam", url: "https://store.steampowered.com/app/730/CounterStrike_2/" }
    ]
  },
  {
    title: "Red Dead Redemption 2",
    description: "4 358₴",
    tags: ["Adventure", "Open world", "Western"],
    image: "./img/Red Dead Redemption 2.png",
    section: "popular",
    inSlider: false,
    downloadLinks: [
      { platform: "Steam", url: "https://store.steampowered.com/app/1174180/Red_Dead_Redemption_2/" },
      { platform: "Epic Games", url: "https://store.epicgames.com/en-US/p/red-dead-redemption-2" },
      { platform: "Rockstar Store", url: "https://store.rockstargames.com/game/buy-red-dead-redemption-2" }
    ]
  },
  {
    title: "Dota 2",
    description: "Безкоштовне",
    tags: ["MOBA", "Multiplayer", "Онлайн"],
    image: "./img/Dota 2.png",
    section: "popular",
    inSlider: false,
    downloadLinks: [
      { platform: "Steam", url: "https://store.steampowered.com/app/570/Dota_2/" },
      { platform: "Official Site", url: "https://www.dota2.com/" }
    ]
  },
  {
    title: "R.E.P.O.",
    description: "225₴",
    tags: ["Adventure", "Horror", "Онлайн"],
    image: "./img/REPO.png",
    section: "popular",
    inSlider: false,
    downloadLinks: [
      { platform: "Steam", url: "https://store.steampowered.com/app/2969730/REPO/" }
    ]
  },
  {
    title: "inZOI",
    description: "1 199₴",
    tags: ["Simulation", "Early Access"],
    image: "./img/inZOI.png",
    section: "new",
    inSlider: false,
    downloadLinks: [
      { platform: "Steam", url: "https://store.steampowered.com/app/2456740/inZOI/" },
      { platform: "Official Site", url: "https://inzoi.krafton.com/" }
    ]
  },
  {
    title: "Synergy",
    description: "391₴",
    tags: ["Strategy", "Simulation"],
    image: "./img/Synergy.png",
    section: "new",
    discount: "-24%",
    originalPrice: "515₴",
    inSlider: false,
    downloadLinks: [
      { platform: "Steam", url: "https://store.steampowered.com/app/1989070/Synergy"}
    ]
  },
  {
    title: "DRIVE Rally",
    description: "209₴",
    tags: ["Simulation", "Racing"],
    image: "./img/DRIVE Rally.png",
    section: "new",
    inSlider: false,
    downloadLinks: [
      { platform: "Steam", url: "https://store.steampowered.com/app/2494780/DRIVE_Rally/" }
    ]
  },
  {
    title: "The Witcher 3: Wild Hunt",
    description: "799₴",
    tags: ["RPG", "Adventure"],
    image: "./img/witcher3.png",
    section: "popular",
    inSlider: true,
    downloadLinks: [
      { platform: "Steam", url: "https://store.steampowered.com/app/292030/The_Witcher_3_Wild_Hunt/" },
      { platform: "Epic Games", url: "https://store.epicgames.com/en-US/p/the-witcher-3-wild-hunt" },
      { platform: "GOG", url: "https://www.gog.com/game/the_witcher_3_wild_hunt" }
    ]
  },
  {
    title: "Grand Theft Auto V",
    description: "999₴",
    tags: ["Action", "Adventure"],
    image: "./img/gta5.png",
    section: "popular",
    inSlider: false,
    downloadLinks: [
      { platform: "Steam", url: "https://store.steampowered.com/app/271590/Grand_Theft_Auto_V/" },
      { platform: "Epic Games", url: "https://store.epicgames.com/en-US/p/grand-theft-auto-v" },
      { platform: "Rockstar Store", url: "https://store.rockstargames.com/game/buy-grand-theft-auto-v" }
    ]
  },
  {
    title: "Among Us",
    description: "99₴",
    tags: ["Multiplayer", "Онлайн"],
    image: "./img/amongus.png",
    section: "popular",
    inSlider: false,
    downloadLinks: [
      { platform: "Steam", url: "https://store.steampowered.com/app/945360/Among_Us/" },
      { platform: "Epic Games", url: "https://store.epicgames.com/en-US/p/among-us" }
    ]
  },
  {
    title: "Apex Legends",
    description: "Безкоштовне",
    tags: ["Shooter", "Онлайн"],
    image: "./img/apexlegends.png",
    section: "popular",
    inSlider: false,
    downloadLinks: [
      { platform: "Steam", url: "https://store.steampowered.com/app/1172470/Apex_Legends/" },
      { platform: "EA", url: "https://www.ea.com/games/apex-legends" }
    ]
  },
  {
    title: "Minecraft",
    description: "499₴",
    tags: ["Simulation", "Adventure"],
    image: "./img/minecraft.png",
    section: "popular",
    inSlider: false,
    downloadLinks: [
      { platform: "Official Site", url: "https://www.minecraft.net/" },
      { platform: "Microsoft Store", url: "https://www.microsoft.com/en-us/p/minecraft-for-windows/9nblggh2jhxj" }
    ]
  }
];