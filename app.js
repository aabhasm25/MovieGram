// ==========================================
// MOVIEGRAM - FULL APPLICATION SCRIPTS
// ==========================================

// 1. API CONFIGURATION
const TMDB_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlMzdhMWExNmYwNTYyMWFkZmFlZjE5ZmU3YzI3MGQ4NSIsIm5iZiI6MTc4MDU5MzM3My45MjEsInN1YiI6IjZhMjFiMmRkMjVkODJhZDg0YzZlZWVhMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.wQh4fzUGog7qb_VUVbzRPu7Rz8nvemQas_2b0zyzneM";

// ==========================================
// 2. MAIN INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Start UI systems first so the app is instantly usable
    initClock();
    initNavigation();
    initActions();
    initLibraryDashboard();
    initProfileReviews();

    // Start data fetching in the background (will not freeze UI)
    initTrendingMovies();
    initSearch();
});

// ==========================================
// 3. UI & NAVIGATION SYSTEMS
// ==========================================

function initClock() {
    const timeElement = document.getElementById('status-time');
    if (!timeElement) return;

    function updateTime() {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        
        timeElement.textContent = `${hours}:${minutes}`;
    }
    
    updateTime();
    setInterval(updateTime, 15000);
}

function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const tabViews = document.querySelectorAll('.tab-view');
    const appContent = document.querySelector('.app-content');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetTab = item.getAttribute('data-tab');
            if (!targetTab) return;

            // Remove active classes
            navItems.forEach(nav => nav.classList.remove('active'));
            tabViews.forEach(view => view.classList.remove('active'));

            // Set active states
            item.classList.add('active');
            const activeView = document.getElementById(`view-${targetTab}`);
            if (activeView) {
                activeView.classList.add('active');
                
                // Reset scroll
                if (appContent) appContent.scrollTop = 0;

                // Micro haptic feedback
                triggerTabFeedback(item);
            }
        });
    });
}

function triggerTabFeedback(element) {
    element.style.transform = 'scale(0.95)';
    setTimeout(() => {
        element.style.transform = '';
    }, 100);
}

function initActions() {
    const btnNotifications = document.getElementById('btn-notifications');
    const btnMessages = document.getElementById('btn-messages');
    
    if (btnNotifications) {
        btnNotifications.addEventListener('click', () => {
            showToast('🔔 MovieGram Notification', 'Max and 2 others liked your review on "Dune: Part Three".');
        });
    }

    if (btnMessages) {
        btnMessages.addEventListener('click', () => {
            showToast('💬 Inbox Messages', 'Lucas sent: "Have you seen the new Villeneuve trailer yet?"');
        });
    }

    initReelsActions();
}

function initReelsActions() {
    const reelsSidebar = document.querySelector('.reel-sidebar');
    if (!reelsSidebar) return;

    const likeBtn = reelsSidebar.querySelector('.like-btn');
    const commentBtn = reelsSidebar.querySelector('.comment-btn');
    const shareBtn = reelsSidebar.querySelector('.share-btn');

    if (likeBtn) {
        likeBtn.addEventListener('click', () => {
            const isLiked = likeBtn.classList.toggle('active');
            const countLabel = likeBtn.querySelector('.sidebar-label');
            if (isLiked) {
                likeBtn.style.color = '#ff2a5f';
                if (countLabel) countLabel.textContent = '2.5k';
                showToast('❤️ Added to Liked Reels', 'You liked Interstellar (10-Year Anniversary Teaser).');
            } else {
                likeBtn.style.color = '';
                if (countLabel) countLabel.textContent = '2.4k';
            }
        });
    }

    if (commentBtn) {
        commentBtn.addEventListener('click', () => {
            showToast('💬 Comments Section', 'Opening trailer discussion feed...');
        });
    }

    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            showToast('🔗 Link Copied', 'Trailer link has been saved to clipboard.');
        });
    }
}

function initLibraryDashboard() {
    const watchlistSlider = document.getElementById('watchlist-slider');
    const favoritesSlider = document.getElementById('favorites-slider');

    if (!watchlistSlider || !favoritesSlider) return;

    // Safety fallback array in case MOVIE_DATABASE from data.js isn't linked properly
    const fallbackData = [
        { title: "Inception", year: 2010, rating: 8.8, genres: ["Sci-Fi", "Action"], synopsis: "A thief who steals corporate secrets through the use of dream-sharing technology..." },
        { title: "Interstellar", year: 2014, rating: 8.6, genres: ["Sci-Fi", "Drama"], synopsis: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival." },
        { title: "The Dark Knight", year: 2008, rating: 9.0, genres: ["Action", "Crime"], synopsis: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham..." },
        { title: "Avatar", year: 2009, rating: 7.9, genres: ["Action", "Sci-Fi"], synopsis: "A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home." }
    ];

    const movies = typeof MOVIE_DATABASE !== 'undefined' ? MOVIE_DATABASE : fallbackData;

    const watchlistMovies = movies.slice(0, 5);
    const favoriteMovies = movies.filter(movie => movie.rating >= 8.0);

    renderSliderMovies(watchlistMovies, watchlistSlider);
    renderSliderMovies(favoriteMovies, favoritesSlider);
}

function renderSliderMovies(movies, container) {
    container.innerHTML = '';
    movies.forEach(movie => {
        const card = document.createElement('div');
        card.className = 'slider-card';
        card.innerHTML = `
            <div class="slider-card-icon">🎬</div>
            <div class="slider-card-details">
                <h4 class="slider-card-title">${movie.title}</h4>
                <p class="slider-card-meta">${movie.year} • ★${movie.rating.toFixed(1)}</p>
            </div>
        `;
        
        card.addEventListener('click', () => {
            showToast(`🎬 ${movie.title} (${movie.year})`, `Rating: ★${movie.rating.toFixed(1)}\nGenre: ${movie.genres.join('/')}\n\n"${movie.synopsis}"`);
        });
        
        container.appendChild(card);
    });
}

function initProfileReviews() {
    const reviewBlocks = document.querySelectorAll('.review-block');
    reviewBlocks.forEach(block => {
        block.addEventListener('click', () => {
            const movieTitle = block.querySelector('.review-movie-title').textContent;
            const rating = block.querySelector('.review-rating').textContent;
            const fullReview = block.getAttribute('data-full-review');
            
            showToast(`📝 Review: ${movieTitle} (${rating})`, fullReview);
        });
    });
}

// ==========================================
// 4. TOAST NOTIFICATION SYSTEM
// ==========================================
let toastTimeout = null;

function showToast(title, description) {
    const toast = document.getElementById('toast-notif');
    const toastTitle = document.getElementById('toast-title');
    const toastDesc = document.getElementById('toast-desc');
    
    if (!toast || !toastTitle || !toastDesc) return;
    
    if (toastTimeout) {
        clearTimeout(toastTimeout);
        toast.classList.remove('show');
    }
    
    toastTitle.textContent = title;
    toastDesc.textContent = description;
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 50);
    
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 4500);
}

// ==========================================
// 5. TMDB API DATA FETCHING
// ==========================================

async function fetchTrendingMovies() {
    const url = 'https://api.themoviedb.org/3/trending/movie/day';
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${TMDB_TOKEN}`
        }
    };
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return data.results || [];
    } catch (err) {
        console.error("Error fetching trending data:", err);
        return [];
    }
}

async function searchTMDBMovies(query) {
    const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${TMDB_TOKEN}`
        }
    };
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return data.results || [];
    } catch (err) {
        console.error("Error fetching search data:", err);
        return [];
    }
}

// ==========================================
// 6. DYNAMIC UI RENDERING
// ==========================================

async function initTrendingMovies() {
    const grid = document.getElementById('trending-grid');
    const countBadge = document.getElementById('trending-count');
    if (!grid) return;

    // Show loading text immediately without blocking other scripts
    grid.innerHTML = '<div class="grid-loading" style="grid-column: 1/-1; text-align: center; opacity: 0.7;">Loading live TMDB feed...</div>';
    
    // Fetch data asynchronously 
    const movies = await fetchTrendingMovies();
    
    grid.innerHTML = '';
    
    if (movies.length === 0) {
        grid.innerHTML = `<div class="grid-loading" style="grid-column: 1/-1; text-align: center; color: #ff2a5f;">Failed to load live feed. Please check your API token.</div>`;
        return;
    }

    if (countBadge) {
        countBadge.textContent = `${movies.length} Films`;
    }

    // Map TMDB format to Card format
    const formattedMovies = movies.map(m => ({
        id: m.id,
        title: m.title || m.name,
        year: m.release_date ? m.release_date.substring(0, 4) : 'N/A',
        genres: ['Movie'],
        rating: m.vote_average || 0,
        synopsis: m.overview || 'No synopsis available.'
    }));

    renderMoviesIntoGrid(formattedMovies, grid);
}

function initSearch() {
    const searchInput = document.getElementById('search-input');
    const clearBtn = document.getElementById('search-clear-btn');
    const resultsGrid = document.getElementById('explore-results');
    const genresContainer = document.getElementById('genres-container');
    const genreTags = document.querySelectorAll('.genre-tag');

    if (!searchInput || !resultsGrid || !genresContainer) return;

    // Timer to prevent API spam while typing (Debouncing)
    let searchTimer;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => {
            handleSearch(query, searchInput, clearBtn, resultsGrid, genresContainer);
        }, 600); // Waits 600ms after user stops typing to call API
    });

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            genreTags.forEach(tag => tag.classList.remove('highlighted'));
            handleSearch('', searchInput, clearBtn, resultsGrid, genresContainer);
            searchInput.focus();
        });
    }

    genreTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const genre = tag.getAttribute('data-genre');
            if (!genre) return;

            const isAlreadyHighlighted = tag.classList.contains('highlighted');
            genreTags.forEach(t => t.classList.remove('highlighted'));

            if (isAlreadyHighlighted) {
                searchInput.value = '';
                handleSearch('', searchInput, clearBtn, resultsGrid, genresContainer);
            } else {
                tag.classList.add('highlighted');
                searchInput.value = genre;
                handleSearch(genre, searchInput, clearBtn, resultsGrid, genresContainer);
            }
        });
    });
}

async function handleSearch(query, input, clearBtn, results, genres) {
    if (clearBtn) {
        clearBtn.style.display = query ? 'flex' : 'none';
    }

    if (!query || query.trim() === '') {
        results.style.display = 'none';
        results.innerHTML = '';
        genres.style.display = 'block';
        return;
    }

    // Toggle UI state to loading
    results.style.display = 'grid';
    genres.style.display = 'none';
    results.innerHTML = '<div style="grid-column: 1/-1; text-align: center; opacity: 0.7;">Searching TMDB...</div>';

    // Fetch live search results
    const movies = await searchTMDBMovies(query);
    results.innerHTML = '';

    if (movies.length === 0) {
        results.innerHTML = `
            <div class="no-results" style="grid-column: 1/-1; text-align: center;">
                <span class="no-results-icon" style="font-size: 2rem;">🔎</span>
                <h4 class="no-results-text">No Movies Found</h4>
                <p class="no-results-desc">We couldn't find anything matching "${escapeHtml(query)}". Try another title.</p>
            </div>
        `;
    } else {
        const formattedMovies = movies.map(m => ({
            id: m.id,
            title: m.title || m.name,
            year: m.release_date ? m.release_date.substring(0, 4) : 'N/A',
            genres: ['Movie'],
            rating: m.vote_average || 0,
            synopsis: m.overview || 'No synopsis available.'
        }));
        renderMoviesIntoGrid(formattedMovies, results);
    }
}

function renderMoviesIntoGrid(movies, targetElement) {
    movies.forEach(movie => {
        targetElement.appendChild(createMovieCard(movie));
    });
}

function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.setAttribute('data-id', movie.id);

    const iconContainer = document.createElement('div');
    iconContainer.className = 'movie-card-icon-container';
    
    const icon = document.createElement('span');
    icon.className = 'movie-card-icon';
    icon.textContent = '🎬';
    iconContainer.appendChild(icon);

    const infoContainer = document.createElement('div');
    infoContainer.className = 'movie-card-info-container';

    const title = document.createElement('h4');
    title.className = 'movie-card-title-text';
    title.textContent = movie.title;

    const metaRow = document.createElement('div');
    metaRow.className = 'movie-card-meta-row';
    
    const yearGenre = document.createElement('span');
    yearGenre.className = 'movie-card-year-genre';
    yearGenre.textContent = `${movie.year} • ${movie.genres.slice(0, 2).join('/')}`;

    const rating = document.createElement('span');
    rating.className = 'movie-card-rating-text';
    rating.innerHTML = `★ ${movie.rating.toFixed(1)}`;

    metaRow.appendChild(yearGenre);
    metaRow.appendChild(rating);

    infoContainer.appendChild(title);
    infoContainer.appendChild(metaRow);

    card.appendChild(iconContainer);
    card.appendChild(infoContainer);

    card.addEventListener('click', () => {
        showToast(
            `🎬 ${movie.title} (${movie.year})`,
            `Rating: ★${movie.rating.toFixed(1)}\n\n"${movie.synopsis}"`
        );
    });

    return card;
}

function escapeHtml(string) {
    return String(string)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
