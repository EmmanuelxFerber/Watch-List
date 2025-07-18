const stored = localStorage.getItem("watchListArray");
let watchListArray = JSON.parse(stored);
const movieList = document.getElementById("movie-list");

console.log(watchListArray);

document.addEventListener("click", (e) => {
  const addBtn = e.target.closest(".add-movie-btn");
  if (addBtn && addBtn.dataset.key !== undefined) {
    console.log(addBtn.dataset.key);
    handleWatchlistBtn(addBtn.dataset.key);
    render(watchListArray);
  }
});

function handleWatchlistBtn(movieKey) {
  if (watchListArray[movieKey].clicked) {
    watchListArray[movieKey].clicked = false;
    const newWatchListArray = watchListArray.filter((movie) => movie.clicked);
    localStorage.setItem("watchListArray", JSON.stringify(newWatchListArray));
    watchListArray = newWatchListArray;
  } else {
    watchListArray[movieKey].clicked = true;
    watchListArray.push(watchListArray[movieKey]);
    localStorage.setItem("watchListArray", JSON.stringify(watchListArray));
  }
  render(watchListArray);
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
  movieList.innerHTML = getMovieListHTML(movieArray);
}

render(watchListArray);
