const articleHTML = (article) => `
  <article class="article">
    <div class="meta">
      <span>${article.company}</span>
      <span>${article.readingTime}</span>
    </div>
    <h3><a href="${article.url}" target="_blank" rel="noopener">${article.title}</a></h3>
    <p class="summary">${article.summary}</p>
    <p class="why"><strong>WHY READ IT</strong><br>${article.whyRead}</p>
    <div class="tags">${article.tags.map(tag => `<span>#${tag}</span>`).join("")}</div>
    <a class="read-link" href="${article.url}" target="_blank" rel="noopener">Read original →</a>
  </article>
`;

async function loadArticles() {
  const current = document.querySelector("#current-articles");
  const archive = document.querySelector("#archive-list");

  try {
    const response = await fetch(`/engineering-reading/articles.json?v=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) throw new Error("Could not load articles.");
    const data = await response.json();

    const [latest, ...older] = data.weeks;
    document.querySelector("#week-title").textContent = latest.label;
    document.querySelector("#week-note").textContent = `${latest.articles.length} picks`;
    current.innerHTML = latest.articles.map(articleHTML).join("");

    archive.innerHTML = `
      <a class="archive-link archive-current" href="./">
        This week
        <span class="archive-count">${latest.label} · ${latest.articles.length} articles</span>
      </a>
      ${older.length
        ? older.map((week) => `
            <a class="archive-link" href="?week=${encodeURIComponent(week.id)}">
              ${week.label}
              <span class="archive-count">${week.articles.length} articles</span>
            </a>
          `).join("")
        : ""}
    `;

    const params = new URLSearchParams(window.location.search);
    const weekId = params.get("week");
    const selected = weekId ? data.weeks.find((week) => week.id === weekId) : null;
    if (selected) {
      document.querySelector("#week-title").textContent = selected.label;
      document.querySelector("#week-note").textContent = `${selected.articles.length} picks`;
      current.innerHTML = selected.articles.map(articleHTML).join("");
    }
  } catch (error) {
    current.innerHTML = '<p class="error">Articles could not be loaded.</p>';
  }
}

const toggle = document.querySelector("#theme-toggle");
const savedTheme = localStorage.getItem("theme");
if (savedTheme) document.documentElement.dataset.theme = savedTheme;

toggle.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  localStorage.setItem("theme", next);
});

loadArticles();