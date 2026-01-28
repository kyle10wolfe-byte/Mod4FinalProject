// IMPORTANT: Put poster images in /assets/posters/ with the filenames below.
// This avoids broken links and makes your project reliable for grading.

const movies = [
  {
    title: "The Fast and the Furious",
    year: 2001,
    released: "2001-06-22",
    tagline: "An undercover cop infiltrates the street racing scene.",
    genre: "Action",
    poster: "assets/posters/fast1-2001.jpg"
  },
  {
    title: "2 Fast 2 Furious",
    year: 2003,
    released: "2003-06-06",
    tagline: "Miami. Fast cars. Bigger stakes.",
    genre: "Action",
    poster: "assets/posters/fast2-2003.jpg"
  },
  {
    title: "The Fast and the Furious: Tokyo Drift",
    year: 2006,
    released: "2006-06-16",
    tagline: "A new world of drifting in Tokyo.",
    genre: "Action",
    poster: "assets/posters/fast3-2006.jpg"
  },
  {
    title: "Fast & Furious",
    year: 2009,
    released: "2009-04-03",
    tagline: "Back to LA. Back to the crew.",
    genre: "Action",
    poster: "assets/posters/fast4-2009.jpg"
  },
  {
    title: "Fast Five",
    year: 2011,
    released: "2011-04-29",
    tagline: "The crew pulls a massive heist in Rio.",
    genre: "Action",
    poster: "assets/posters/fast5-2011.jpg"
  },
  {
    title: "Fast & Furious 6",
    year: 2013,
    released: "2013-05-24",
    tagline: "A global mission brings the team back together.",
    genre: "Action",
    poster: "assets/posters/fast6-2013.jpg"
  },
  {
    title: "Furious 7",
    year: 2015,
    released: "2015-04-03",
    tagline: "One last ride against a dangerous new threat.",
    genre: "Action",
    poster: "assets/posters/fast7-2015.jpg"
  },
  {
    title: "The Fate of the Furious",
    year: 2017,
    released: "2017-04-14",
    tagline: "Loyalty is tested when Dom goes rogue.",
    genre: "Action",
    poster: "assets/posters/fast8-2017.jpg"
  },
  {
    title: "Fast & Furious Presents: Hobbs & Shaw",
    year: 2019,
    released: "2019-08-02",
    tagline: "Two rivals team up to stop a global threat.",
    genre: "Action",
    poster: "assets/posters/hobbs-shaw-2019.jpg"
  },
  {
    title: "F9: The Fast Saga",
    year: 2021,
    released: "2021-06-25",
    tagline: "Family faces the past — and a new enemy.",
    genre: "Action",
    poster: "assets/posters/f9-2021.jpg"
  },
  {
    title: "Fast X",
    year: 2023,
    released: "2023-05-19",
    tagline: "A new villain targets the family’s legacy.",
    genre: "Action",
    poster: "assets/posters/fastx-2023.jpg"
  }
];

const cardsEl = document.getElementById("cards");
const sortSelect = document.getElementById("sortSelect");
const movieCountEl = document.getElementById("movieCount");
const yearEl = document.getElementById("year");

function formatDate(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function render(list) {
  cardsEl.innerHTML = "";

  list.forEach((m) => {
    const card = document.createElement("article");
    card.className = "card";

    card.innerHTML = `
      <div class="poster">
        <img src="${m.poster}" alt="Poster: ${m.title}" loading="lazy" />
      </div>
      <div class="card-body">
        <div class="card-top">
          <span class="badge">${m.genre}</span>
          <span class="muted" style="font-size:12px;font-weight:900;">${m.year}</span>
        </div>

        <h3>${m.title}</h3>
        <p>${m.tagline}</p>

        <div class="meta">
          <span>Released</span>
          <span>${formatDate(m.released)}</span>
        </div>
      </div>
    `;

    cardsEl.appendChild(card);
  });

  movieCountEl.textContent = String(list.length);
}

function sortMovies(mode) {
  const sorted = [...movies];

  if (mode === "az") {
    sorted.sort((a, b) => a.title.localeCompare(b.title));
  } else if (mode === "za") {
    sorted.sort((a, b) => b.title.localeCompare(a.title));
  } else if (mode === "newest") {
    sorted.sort((a, b) => new Date(b.released) - new Date(a.released));
  } else if (mode === "oldest") {
    sorted.sort((a, b) => new Date(a.released) - new Date(b.released));
  }

  return sorted;
}

// Init
yearEl.textContent = new Date().getFullYear();
render(sortMovies(sortSelect.value));

// Sorting filter (required feature)
sortSelect.addEventListener("change", (e) => {
  render(sortMovies(e.target.value));
});
