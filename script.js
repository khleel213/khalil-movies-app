// 🎬 Advanced Movie Explorer - Eng. Khalil
// Using TMDB API (Professional Version)

const API_KEY = "a3826361b184ad1f7a515a7f4c60de81";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";
const BG_URL = "https://image.tmdb.org/t/p/original";

// DOM Elements
const moviesList = document.getElementById('movies-list');
const movieDetails = document.getElementById('movie-details');
const uiState = document.getElementById('ui-state');
const stateMessage = document.getElementById('state-message');
const bgImage = document.getElementById('bg-image');
const searchInput = document.getElementById('search-input');

const btnLeft = document.getElementById('btn-left');
const btnRight = document.getElementById('btn-right');

let currentMovies = [];
let lastSelectedMovie = null;

// 🎯 Fetch Popular Movies (Default)
async function fetchPopular() {
    showState('Loading popular movies...');
    try {
        const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
        const data = await res.json();
        handleMovies(data.results);
    } catch (err) {
        showState('Error loading movies ❌');
    }
}

// 🔍 Search Movies
async function searchMovies(query) {
    showState('Searching...');
    try {
        const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`);
        const data = await res.json();

        if (!data.results || data.results.length === 0) {
            showState('No movies found 😢');
            moviesList.innerHTML = '';
            return;
        }

        handleMovies(data.results);
    } catch (err) {
        showState('Search failed ❌');
    }
}

// 🎬 Handle Data
function handleMovies(movies) {
    currentMovies = movies;
    renderMovies(movies);
    selectMovie(movies[0]);
    hideState();
}

// 🧩 Render Movies
function renderMovies(movies) {
    moviesList.innerHTML = '';

    movies.forEach((movie, index) => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.style.backgroundImage = `url(${IMG_URL + movie.poster_path})`;

        // Title overlay
        const title = document.createElement('div');
        title.className = 'movie-title';
        title.innerText = movie.title;
        card.appendChild(title);

        card.onclick = () => {
            selectMovie(movie);
            document.querySelectorAll('.movie-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
        };

        card.onmouseenter = () => updateUI(movie);
        card.onmouseleave = () => updateUI(lastSelectedMovie);

        moviesList.appendChild(card);
        if (index === 0) card.classList.add('active');
    });
}

// 🎥 Update UI
function updateUI(movie) {
    if (!movie) return;

    document.getElementById('movie-title').innerText = movie.title;
    document.getElementById('movie-rating').innerText = `⭐ ${movie.vote_average?.toFixed(1)}`;
    document.getElementById('movie-year').innerText = movie.release_date?.split('-')[0];
    document.getElementById('movie-duration').innerText = 'N/A';
    document.getElementById('movie-genre').innerText = 'Movie';

    bgImage.style.backgroundImage = `url(${BG_URL + movie.backdrop_path})`;
}

// 🎯 Select Movie
function selectMovie(movie) {
    lastSelectedMovie = movie;
    updateUI(movie);
    movieDetails.classList.remove('hidden');
}

// 📢 UI States
function showState(msg) {
    uiState.classList.remove('hidden');
    stateMessage.innerText = msg;
}

function hideState() {
    uiState.classList.add('hidden');
}

// 🎮 Carousel Controls
btnLeft.onclick = () => {
    moviesList.scrollBy({ left: -400, behavior: 'smooth' });
};

btnRight.onclick = () => {
    moviesList.scrollBy({ left: 400, behavior: 'smooth' });
};

// 🔍 Search Events (Debounce)
let timeout;
searchInput.addEventListener('input', () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        const query = searchInput.value.trim();
        if (query) {
            searchMovies(query);
        } else {
            fetchPopular();
        }
    }, 500);
});

// 🚀 Init
fetchPopular();
