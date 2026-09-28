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
    const response = await fetch("articles.json");
    if (!response.ok) throw new Error("Could not load articles.");
    const data = await response.json();

    const [latest, ...older] = data.weeks;
    document.querySelector("#week-title").textContent = latest.label;
    document.querySelector("#week-note").textContent = `${latest.articles.length} picks`;
    current.innerHTML = latest.articles.map(articleHTML).join("");

    archive.innerHTML = older.map(week => `
      <details class="archive-week">
        <summary>
          <span class="archive-date">${week.label}</span>
          <span class="archive-count">${week.articles.length} articles +</span>
        </summary>
        ${week.articles.map(articleHTML).join("")}
      </details>
    `).join("");
  } catch (error) {
    current.innerHTML = `<p class="error">Articles could not be loaded. If you opened index.html directly from your computer, run it through a local server or publish it with GitHub Pages.</p>`;
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
