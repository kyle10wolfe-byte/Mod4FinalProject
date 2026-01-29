const OMDB_API_KEY = "461e2031";
const OMDB_BASE_URL = "https://www.omdbapi.com/";

const cardsEl = document.getElementById("cards");
const sortSelect = document.getElementById("sortSelect");
const yearEl = document.getElementById("year");

const queryInput = document.getElementById("queryInput");
const searchBtn = document.getElementById("searchBtn");
const statusEl = document.getElementById("status");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const resultCountEl = document.getElementById("resultCount");
const pageInfoEl = document.getElementById("pageInfo");

let movies = [];
let currentQuery = "";
let currentPage = 1;
let totalResults = 0;

function setStatus(msg) {
  statusEl.textContent = msg || "";
}

function normalizePoster(p) {
  return p && p !== "N/A" ? p : "";
}

function safeYearToNumber(yearStr) {
  // OMDb can return "2017–2019" or "N/A"
  const n = parseInt(yearStr, 10);
  return Number.isFinite(n) ? n : 0;
}

function sortMovies(mode) {
  const sorted = [...movies];

  if (mode === "az") sorted.sort((a, b) => a.title.localeCompare(b.title));
  if (mode === "za") sorted.sort((a, b) => b.title.localeCompare(a.title));
  if (mode === "newest") sorted.sort((a, b) => safeYearToNumber(b.year) - safeYearToNumber(a.year));
  if (mode === "oldest") sorted.sort((a, b) => safeYearToNumber(a.year) - safeYearToNumber(b.year));

  return sorted;
}

function render(list) {
  cardsEl.innerHTML = "";

  list.forEach((m) => {
    const posterUrl = normalizePoster(m.poster);

    const card = document.createElement("article");
    card.className = "card";

    card.innerHTML = `
      <div class="poster">
        ${
          posterUrl
            ? `<img src="${posterUrl}" alt="Poster: ${m.title}" loading="lazy" />`
            : `<div style="padding:18px; text-align:center; color:rgba(11,27,58,0.65); font-weight:900;">
                 No Poster
               </div>`
        }
      </div>

      <div class="card-body">
        <div class="card-top">
          <span class="badge">${m.rated || m.type || "Movie"}</span>
          <span class="muted" style="font-size:12px;font-weight:900;">${m.year || ""}</span>
        </div>

        <h3>${m.title}</h3>
        <p>${m.plot || "No plot available."}</p>

        <div class="meta">
          <span>${m.runtime || "—"}</span>
          <span>${m.genre ? m.genre.split(",")[0] : "—"}</span>
        </div>
      </div>
    `;

    cardsEl.appendChild(card);
  });

  resultCountEl.textContent = String(totalResults || list.length);
  const totalPages = Math.max(1, Math.ceil((totalResults || list.length) / 10));
  pageInfoEl.textContent = `${currentPage} / ${totalPages}`;

  prevBtn.disabled = currentPage <= 1;
  nextBtn.disabled = currentPage >= totalPages;
}

// OMDb helper
async function omdbRequest(params) {
  const url = new URL(OMDB_BASE_URL);
  url.searchParams.set("apikey", OMDB_API_KEY);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Network error (${res.status})`);

  const data = await res.json();
  if (data.Response === "False") throw new Error(data.Error || "OMDb error");
  return data;
}

// Search by title (returns up to 10 results per page)
async function omdbSearch(query, page) {
  return omdbRequest({ s: query, type: "movie", page: String(page) });
}

// Details by IMDb ID (returns poster + plot + rated, etc.)
async function omdbDetails(imdbID) {
  const d = await omdbRequest({ i: imdbID, plot: "short" });
  return {
    imdbID: d.imdbID,
    title: d.Title,
    year: d.Year,
    type: d.Type,
    poster: d.Poster,
    plot: d.Plot,
    rated: d.Rated,
    runtime: d.Runtime,
    genre: d.Genre
  };
}

// Main fetch for one page, then details for each result
async function fetchPage(query, page) {
  const searchData = await omdbSearch(query, page);
  totalResults = parseInt(searchData.totalResults, 10) || 0;

  const items = searchData.Search || [];

  // Fetch details for each result (poster + plot)
  // Note: This is 10 requests max per page, acceptable for class projects.
  const detailed = await Promise.all(items.map((it) => omdbDetails(it.imdbID)));

  return detailed;
}

async function runSearch(query, page) {
  if (!OMDB_API_KEY || OMDB_API_KEY === "PUT_YOUR_OMDB_KEY_HERE") {
    setStatus("Add your OMDb API key in script.js first.");
    return;
  }

  try {
    setStatus("Loading…");
    searchBtn.disabled = true;
    prevBtn.disabled = true;
    nextBtn.disabled = true;

    currentQuery = query;
    currentPage = page;

    movies = await fetchPage(query, page);
    setStatus(`Showing results for “${query}”.`);

    render(sortMovies(sortSelect.value));
  } catch (err) {
    movies = [];
    totalResults = 0;
    cardsEl.innerHTML = "";
    resultCountEl.textContent = "0";
    pageInfoEl.textContent = "—";
    setStatus(`Error: ${err.message}`);
  } finally {
    searchBtn.disabled = false;
    // render() sets correct disabled state after success
  }
}

// Events
searchBtn.addEventListener("click", () => {
  const q = (queryInput.value || "").trim();
  if (!q) {
    setStatus("Type a movie title to search.");
    queryInput.focus();
    return;
  }
  runSearch(q, 1);
});

queryInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchBtn.click();
});

sortSelect.addEventListener("change", (e) => {
  render(sortMovies(e.target.value));
});

prevBtn.addEventListener("click", () => {
  if (currentPage > 1) runSearch(currentQuery, currentPage - 1);
});

nextBtn.addEventListener("click", () => {
  const totalPages = Math.max(1, Math.ceil(totalResults / 10));
  if (currentPage < totalPages) runSearch(currentQuery, currentPage + 1);
});

// Init
yearEl.textContent = new Date().getFullYear();
setStatus("Search for any movie to get started.");
