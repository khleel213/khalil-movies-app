/**
 * Movie Explorer Project - Eng. Khalil
 * Robust API Implementation with Mock Fallback
 */

// 1. البيانات المحلية (Mock Data) - تعمل كخطة بديلة إذا تعطل الـ API
const fallbackMovies = [
    { title: "Inception", year: "2010", rating: "8.8", poster: "https://image.tmdb.org/t/p/w500/edv5CZvfk0KiRMvUkwpEWhvcCjs.jpg", duration: "148 min", genre: "Sci-Fi" },
    { title: "The Dark Knight", year: "2008", rating: "9.0", poster: "https://image.tmdb.org/t/p/w500/qJ2tW6Xo7pXmIZmO1N6SbrC1Sdn.jpg", duration: "152 min", genre: "Action" },
    { title: "Interstellar", year: "2014", rating: "8.7", poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E07Qv8djTsJuHTv9vA.jpg", duration: "169 min", genre: "Adventure" },
    { title: "The Matrix", year: "1999", rating: "8.7", poster: "https://image.tmdb.org/t/p/w500/f89U3Y9SJuCYFJpS9GvG3S0pS12.jpg", duration: "136 min", genre: "Sci-Fi" },
    { title: "The Godfather", year: "1972", rating: "9.2", poster: "https://image.tmdb.org/t/p/w500/3bhkrj0v9pYp68q8YvS6O77M86C.jpg", duration: "175 min", genre: "Crime" }
];

// العناصر من DOM
const moviesList = document.getElementById('movies-list');
const movieDetails = document.getElementById('movie-details');
const uiState = document.getElementById('ui-state');
const stateMessage = document.getElementById('state-message');
const bgImage = document.getElementById('bg-image');
const searchInput = document.getElementById('search-input');

let lastSelectedMovie = null;

/**
 * دالة جلب البيانات (قصة الـ API)
 */
async function fetchMovies(query = 'top') {
    showState('Loading movies...');
    
    try {
        // محاولة جلب البيانات من API حقيقي
        const targetUrl = `https://search.imdbot.workers.dev/?q=${query}`;
        // ملاحظة: البروكسي قد يفشل أحياناً بسبب قيود المتصفح للملفات المحلية
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`);
        
        if (!response.ok) throw new Error('Proxy Rejection');
        
        const rawData = await response.json();
        const data = JSON.parse(rawData.contents); // AllOrigins يعيد البيانات داخل contents

        if (data.description && data.description.length > 0) {
            const movies = data.description.slice(0, 20).map(m => ({
                title: m['#TITLE'],
                year: m['#YEAR'],
                rating: m['#RANK'] || '8.0',
                poster: m['#IMG_POSTER'],
                duration: "120 min",
                genre: "Action"
            }));
            displayData(movies);
        } else {
            throw new Error('No results');
        }

    } catch (error) {
        console.warn("Eng. Khalil: Switching to Fallback Data (CORS/Network Issue)");
        // إذا فشل الـ API، نستخدم البيانات المحلية فوراً
        displayData(fallbackMovies);
    }
}

function displayData(movies) {
    renderMovies(movies);
    selectMovie(movies[0]);
    hideState();
}

/**
 * بقية الوظائف (Render, Select, Hover)
 */
function renderMovies(movies) {
    moviesList.innerHTML = '';
    movies.forEach((movie, index) => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.style.backgroundImage = `url(${movie.poster})`;
        
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

function updateUI(movie) {
    if (!movie) return;
    document.getElementById('movie-title').innerText = movie.title;
    document.getElementById('movie-rating').innerText = `⭐ ${movie.rating}`;
    document.getElementById('movie-year').innerText = movie.year;
    document.getElementById('movie-duration').innerText = movie.duration;
    document.getElementById('movie-genre').innerText = movie.genre;
    bgImage.style.backgroundImage = `url(${movie.poster})`;
}

function selectMovie(movie) {
    lastSelectedMovie = movie;
    updateUI(movie);
}

function showState(msg) {
    uiState.classList.remove('hidden');
    stateMessage.innerText = msg;
}

function hideState() {
    uiState.classList.add('hidden');
}

// تشغيل المشروع
fetchMovies();