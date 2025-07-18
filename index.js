// dc9eed44 api key
// Title Runtime Genre Plot Poster
// data.Search[0].imdbID

const key = "dc9eed44";
const movieList = document.getElementById("movie-list");
const searchBtn = document.getElementById("search-btn");
const searchinput = document.getElementById("search-input");
let mArray = [];

const stored = localStorage.getItem("watchListArray");
let watchListArray = JSON.parse(stored);

document.addEventListener("click", (e) => {
  const addBtn = e.target.closest(".add-movie-btn");
  if (addBtn && addBtn.dataset.key !== undefined) {
    console.log(addBtn.dataset.key);
    handleWatchlistBtn(addBtn.dataset.key);
  }
});

function handleWatchlistBtn(movieKey) {
  if (mArray[movieKey].clicked) {
    mArray[movieKey].clicked = false;
    const newWatchListArray = watchListArray.filter((movie) => movie.clicked);
    localStorage.setItem("watchListArray", JSON.stringify(newWatchListArray));
    watchListArray = newWatchListArray;
  } else {
    mArray[movieKey].clicked = true;
    watchListArray.push(mArray[movieKey]);
    localStorage.setItem("watchListArray", JSON.stringify(watchListArray));
  }

  render(mArray);
}

searchBtn.addEventListener("click", async (e) => {
  movieList.innerHTML = "<p class='loading'>Loading...</p>";
  try {
    const res = await fetch(
      `http://www.omdbapi.com/?apikey=${key}&s=${searchinput.value}`
    );
    const data = await res.json();
    const movieIDArray = getMovieIDArray(data.Search);
    mArray = await getMovieArray(movieIDArray);
    render(mArray);
  } catch (error) {
    movieList.innerHTML = `<p class='loading'>Sorry, we could not find a movie you were looking for</p>`;
    console.log(error);
  }
  searchinput.value = "";
});

function getMovieIDArray(searchOBJ) {
  const movieIDArray = searchOBJ.map((e) => e.imdbID);
  return movieIDArray;
}

async function getMovieArray(IdArray) {
  const movieArray = IdArray.map(async (movie) => {
    const res = await fetch(`http://www.omdbapi.com/?apikey=${key}&i=${movie}`);
    const data = await res.json();
    data.clicked = false;
    return data;
  });

  return Promise.all(movieArray);
}

function checkDuplicates() {
  watchListArray.map((movie) => {
    for (let e of mArray) {
      if (e.Title === movie.Title) {
        e.clicked = true;
        console.log(e, " ", e.clicked);
      }
    }
  });
}

const minusContainer = `<i class="fa-solid fa-minus"></i>`;

const plusContainer = `<i class="fa-solid fa-plus"></i>`;

function getMovieListHTML(movieArray) {
  const HTML = movieArray
    .map((movie, index) => {
      let currentBtn = plusContainer;
      if (movie.clicked === false) {
        currentBtn = plusContainer;
      } else {
        currentBtn = minusContainer;
      }
      return `
     <div class="movie-container">
            <img
              src="${movie.Poster}"
              alt=""
              id="movie-poster"
              class="movie-poster"
            />
            <div class="movie-info">
              <h2 id="movie-name">${movie.Title}</h2>
              <div class="movie-sub" id="movie-sub">
                <p id="movie-duration">${movie.Runtime}</p>
                <p id="movie-genre">${movie.Genre}</p>
                <div id="add-to-watchlist" class="add-to-watchlist">
                  <button id="add-movie-btn" class="add-movie-btn" data-key="${index}">
                    ${currentBtn}
                  </button>
                  <p>Watchlist</p>
                </div>
              </div>
              <p id="movie-plot" class="movie-plot">
               ${movie.Plot}
              </p>
            </div>
          </div>
    `;
    })
    .join("");

  return HTML;
}

function render(movieArray) {
  checkDuplicates();
  movieList.innerHTML = getMovieListHTML(movieArray);
}
