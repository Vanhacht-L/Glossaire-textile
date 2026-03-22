async function loadHeader() {
  const headerContainer = document.getElementById("site-header");
  if (!headerContainer) return;

  try {
    const response = await fetch("header.html");
    const headerHtml = await response.text();
    headerContainer.innerHTML = headerHtml;
    setActiveNavLink();
  } catch (error) {
    console.error("Erreur lors du chargement du header :", error);
  }
}

async function loadFooter() {
  const footerContainer = document.getElementById("site-footer");
  if (!footerContainer) return;

  try {
    const response = await fetch("footer.html");
    const footerHtml = await response.text();
    footerContainer.innerHTML = footerHtml;
  } catch (error) {
    console.error("Erreur lors du chargement du footer :", error);
  }
}

function setActiveNavLink() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".nav-link[data-page]");

  navLinks.forEach((link) => {
    const linkPage = link.getAttribute("data-page");

    if (linkPage === currentPage) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    } else {
      link.classList.remove("active");
      link.removeAttribute("aria-current");
    }
  });
}

/* =========================
   DONNÉES GLOBALES
========================= */
const textilesData = [
  {
    id: "Kanoko-zome",
    title: "Kanoko-zome ou meyui",
    subtitle: "かのこぞめ・鹿の子染め",
    category: "teinture",
    badgeLabel: "Teinture & décors",
    badgeColor: "#E0E7FF",
    description:
      "Réalisée à partir du shibori zome, une technique de teinture nouée importée d'Inde. Elle évoluera au Japon afin de rendre des motifs plus précis et plus fins. À partir de chevillettes pointues, on tire des parties du tissu en forme de petits cônes qui sont ensuite enroulées de fils enduits de cire ou de colle. Cette technique, utilisée sur un kimono, pouvait ainsi contenir 300 000 points noués, donnant un résultat similaire au pelage d’un jeune daim, d'où le terme kanoko.",
    image: "images/Meyui.webp",
    keywords: ["Kanoko-zome", "かのこぞめ", "鹿の子染め", "daim", "inde", "meyui"]
  },
  {
    id: "Tsuzure-ori",
    title: "Tsuzure-ori",
    subtitle: "つづれおり・綴織",
    category: "tissages",
    badgeLabel: "Tissage",
    badgeColor: "#FEF3C6",
    description:
      "Brocarts de haute lisse, très résistants, dont le fil de trame est placé à la main uniquement sur la partie correspondant au motif avant d'être mis en place avec un peigne adapté. Il est souvent utilisé pour les obi haut de gamme, les sacs et les tapisseries décoratives en soie, fils d'or et d'argent.",
    image: "images/Tsuzure-ori.webp",
    keywords: ["tsuzure-ori", "つづれおり", "綴織", "trame", "tissage", "brocart"]
  },
  {
    id: "Sashiko",
    title: "Sashiko",
    subtitle: "さしこ・刺し子",
    category: "teinture",
    badgeLabel: "Teinture & décors",
    badgeColor: "#E0E7FF",
    description:
      "Technique de broderie originellement utilisée en combinaison avec le boro, une technique de rapiéçage traditionnelle japonaise réalisée par les classes sociales inférieures. Le sashiko se distingue par ses motifs simples réalisés avec des lignes discontinues, à l’origine en fil blanc sur tissu bleu indigo.",
    image: "images/Sashiko.webp",
    keywords: ["sashiko", "さしこ", "刺し子", "paysan", "broderie", "boro"]
  },
  {
    id: "Asanoha",
    title: "Asanoha",
    subtitle: "あさのは・麻の葉",
    category: "motifs",
    badgeLabel: "Motifs",
    badgeColor: "#D0FAE5",
    description:
      "Motif de feuilles de chanvre disposées en étoiles à six branches, associé à la santé et à la croissance. Il était particulièrement apprécié pour les vêtements d’enfants et a retrouvé une forte popularité avec Demon Slayer.",
    image: "images/Asanoha.webp",
    keywords: ["asanoha", "あさのは", "麻の葉", "nezuko", "chanvre", "étoiles"]
  },
  {
    id: "Hakata-ori",
    title: "Hakata-ori",
    subtitle: "はかたおり・博多織",
    category: "tissages",
    badgeLabel: "Tissage",
    badgeColor: "#FEF3C6",
    description:
      "Basé sur la technique du kara-ori importé de Chine au XIIIe siècle, il fut amélioré au XVIe siècle avec des motifs de rayures en relief connus sous les noms de fusenmon et ryūjō.",
    image: "images/Hakata-ori.webp",
    keywords: ["Hakata-ori", "はかたおり", "博多織", "hakata", "chine", "fukuoka"]
  }
];

/* =========================
   OUTILS
========================= */
function katakanaToHiragana(text) {
  return text.replace(/[\u30a1-\u30f6]/g, (char) =>
    String.fromCharCode(char.charCodeAt(0) - 0x60)
  );
}

function normalizeText(text) {
  return katakanaToHiragana(
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
  );
}

function truncateText(text, maxLength = 40) {
  return text.length <= maxLength ? text : `${text.slice(0, maxLength).trim()}...`;
}

function getTextileById(id) {
  return textilesData.find((item) => item.id === id);
}

function createResultCard(item) {
  return `
    <a href="fiche.html?id=${encodeURIComponent(item.id)}" class="result-card-link">
      <article class="result-card">
        <div class="result-card-image">
          <img src="${item.image}" alt="${item.title}" loading="lazy" decoding="async">
        </div>
        <div class="result-card-content">
          <span class="result-badge" style="background-color: ${item.badgeColor};">
            ${item.badgeLabel}
          </span>
          <div class="result-text-content">
            <h2>${item.title}</h2>
            <h3>${item.subtitle}</h3>
            <p>${truncateText(item.description, 40)}</p>
          </div>
        </div>
      </article>
    </a>
  `;
}

/* =========================
   PAGE FICHE
========================= */
function loadFichePage() {
  const ficheTitle = document.getElementById("ficheTitle");
  if (!ficheTitle) return;

  const params = new URLSearchParams(window.location.search);
  const textileId = params.get("id");

  if (!textileId) return;

  const textile = getTextileById(textileId);
  if (!textile) {
  ficheTitle.textContent = "Fiche introuvable";
  return;
}

  document.title = `${textile.title} | L'art des textiles japonais`;

  const ficheSubtitle = document.getElementById("ficheSubtitle");
  const ficheCategoryText = document.getElementById("ficheCategoryText");
  const ficheDescription = document.getElementById("ficheDescription");
  const ficheImage = document.getElementById("ficheImage");
  const ficheBadge = document.getElementById("ficheBadge");
  const ficheHero = document.getElementById("ficheHero");

  ficheTitle.textContent = textile.title;

  if (ficheSubtitle) {
    ficheSubtitle.textContent = textile.subtitle;
  }

  if (ficheCategoryText) {
    ficheCategoryText.textContent = textile.badgeLabel;
  }

  if (ficheDescription) {
    ficheDescription.textContent = textile.description;
  }

  if (ficheImage) {
    ficheImage.src = textile.image;
    ficheImage.alt = textile.title;
  }

  if (ficheBadge) {
    ficheBadge.textContent = textile.badgeLabel;
    ficheBadge.style.backgroundColor = textile.badgeColor;
  }

  if (ficheHero) {
    ficheHero.classList.remove(
      "hero-section-textile",
      "hero-section-motifs",
      "hero-section-teinture",
      "hero-section-tissage"
    );

    if (textile.category === "motifs") {
      ficheHero.classList.add("hero-section-motifs");
    } else if (textile.category === "teinture") {
      ficheHero.classList.add("hero-section-teinture");
    } else if (textile.category === "tissages") {
      ficheHero.classList.add("hero-section-tissage");
    } else {
      ficheHero.classList.add("hero-section-textile");
    }
  }
}

/* =========================
   MOTEUR DE RECHERCHE
========================= */
function initSearch() {
  const searchInput = document.getElementById("searchInput");
  const categoryButtons = document.querySelectorAll(".category-filter");
  const resultsContainer = document.getElementById("resultsContainer");
  const resultsInfo = document.getElementById("resultsInfo");

  if (!searchInput || !resultsContainer || !resultsInfo) return;

  const currentPath = window.location.pathname;
  const isTeinturePage = currentPath.includes("teinture-decoration");
  const isMotifsPage = currentPath.includes("motifs");
  const isTissagePage = currentPath.includes("tissage");

  let selectedCategory = null;

  if (isTeinturePage) selectedCategory = "teinture";
  if (isMotifsPage) selectedCategory = "motifs";
  if (isTissagePage) selectedCategory = "tissages";

  function clearResults() {
    resultsInfo.textContent = "";
    resultsContainer.innerHTML = "";
  }

  function renderResults(results) {
    resultsContainer.innerHTML = "";

    resultsInfo.textContent =
      results.length === 0
        ? "0 terme trouvé"
        : results.length === 1
        ? "1 terme trouvé"
        : `${results.length} termes trouvés`;

    resultsContainer.innerHTML = results.map(createResultCard).join("");
  } 
  

  function filterResults() {
    const query = searchInput.value.trim();
    const hasQuery = query !== "";
    const hasCategory = selectedCategory !== null;

    if (!hasQuery && !hasCategory) {
      clearResults();
      return;
    }

    const normalizedQuery = normalizeText(query);

    const filteredResults = textilesData.filter((item) => {
      const matchesCategory =
        !hasCategory ||
        selectedCategory === "tous" ||
        item.category === selectedCategory;

      const searchableFields = [
        item.title,
        item.subtitle,
        item.description,
        item.badgeLabel,
        item.category,
        ...(item.keywords || [])
      ];

      const searchableContent = normalizeText(searchableFields.join(" "));
      const matchesQuery = !hasQuery || searchableContent.includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });

    renderResults(filteredResults);
  }

  if (categoryButtons.length > 0) {
    categoryButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const clickedCategory = button.dataset.category;

        if (selectedCategory === clickedCategory) {
          selectedCategory = null;
          button.classList.remove("active");
        } else {
          categoryButtons.forEach((btn) => btn.classList.remove("active"));
          selectedCategory = clickedCategory;
          button.classList.add("active");
        }

        filterResults();
      });
    });
  }

  searchInput.addEventListener("input", filterResults);

  if (isTeinturePage || isMotifsPage || isTissagePage) {
    filterResults();
  } else {
    clearResults();
  }

  categoryButtons.forEach((btn) => btn.classList.remove("active"));
}

/* =========================
   INITIALISATION
========================= */
document.addEventListener("DOMContentLoaded", async () => {
  await Promise.all([loadHeader(), loadFooter()]);
  loadFichePage();
  initSearch();
});