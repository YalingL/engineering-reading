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
    document.querySelector("#week-note").textContent = "";
    current.innerHTML = latest.articles.map(articleHTML).join("");

    archive.innerHTML = older.length
      ? older.map((week) => `
          <a class="archive-link" href="?week=${encodeURIComponent(week.id)}">
            ${week.label}
            <span class="archive-count">${week.articles.length} articles</span>
          </a>
        `).join("")
      : '<span class="archive-link">No previous weeks yet</span>';

    const params = new URLSearchParams(window.location.search);
    const weekId = params.get("week");
    const selected = weekId ? data.weeks.find((week) => week.id === weekId) : null;
    if (selected) {
      document.querySelector("#week-eyebrow").textContent = "ARCHIVE";
      document.querySelector("#week-title").textContent = selected.label;
      document.querySelector("#week-note").textContent = "";
      current.innerHTML = selected.articles.map(articleHTML).join("");
      document.querySelector("#back-to-current").hidden = false;
    }
  } catch (error) {
    current.innerHTML = '<p class="error">Articles could not be loaded.</p>';
  }
}

loadArticles();
