// Line 1: MovieGram - Application Scripts
const TMDB_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlMzdhMWExNmYwNTYyMWFkZmFlZjE5ZmU3YzI3MGQ4NSIsIm5iZiI6MTc4MDU5MzM3My45MjEsInN1YiI6IjZhMjFiMmRkMjVkODJhZDg0YzZlZWVhMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.wQh4fzUGog7qb_VUVbzRPu7Rz8nvemQas_2b0zyzneM";

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
        return data.results; // <--- Changed from console.log to return
    } catch (err) {
        console.error("Error fetching data:", err);
        return [];
    }
}
// Line 23 is now blank/clean! We removed the loose function call.

// Call the function to test it
fetchTrendingMovies();
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Clock
    initClock();
    
    // 2. Setup Navigation Tab-Switching
    initNavigation();
    
    // 3. Setup Action Button Toast Event Listeners
    initActions();

    // 4. Initialize Trakt Database Integration
    initTrendingMovies();
    initSearch();

    // 5. Initialize Library Dashboard sliders
    initLibraryDashboard();

    // 6. Initialize Profile Reviews dashboard
    initProfileReviews();
});

/**
 * Updates the simulated mobile status bar clock in real-time.
 */
function initClock() {
    const timeElement = document.getElementById('status-time');
    if (!timeElement) return;

    function updateTime() {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        
        // Pad with leading zero if needed
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        
        timeElement.textContent = `${hours}:${minutes}`;
    }
    
    // Run immediately and then update every 15 seconds
    updateTime();
    setInterval(updateTime, 15000);
}

/**
 * Handles switching views when clicking bottom navigation buttons.
 */
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
                
                // Reset scroll position to top when shifting views
                if (appContent) {
                    appContent.scrollTop = 0;
                }

                // Add physical-like micro haptic effect via css animation pulse
                triggerTabFeedback(item);
            }
        });
    });
}

/**
 * Performs a small bounce animation on the tab container for click feedback.
 */
function triggerTabFeedback(element) {
    element.style.transform = 'scale(0.95)';
    setTimeout(() => {
        element.style.transform = '';
    }, 100);
}

/**
 * Handles interactions for the Inbox and Notification buttons.
 */
function initActions() {
    const btnNotifications = document.getElementById('btn-notifications');
    const btnMessages = document.getElementById('btn-messages');
    
    if (btnNotifications) {
        btnNotifications.addEventListener('click', () => {
            showToast(
                '🔔 MovieGram Notification',
                'Max and 2 others liked your review on "Dune: Part Three".'
            );
        });
    }

    if (btnMessages) {
        btnMessages.addEventListener('click', () => {
            showToast(
                '💬 Inbox Messages',
                'Lucas sent: "Have you seen the new Villeneuve trailer yet?"'
            );
        });
    }

    // Initialize Reels Sidebar events
    initReelsActions();
}

/**
 * Handles Reels tab sidebar button interactions (Like, Comment, Share).
 */
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

/**
 * Populates and initialises the Library collections dashboard slider cards.
 */
function initLibraryDashboard() {
    const watchlistSlider = document.getElementById('watchlist-slider');
    const favoritesSlider = document.getElementById('favorites-slider');

    if (!watchlistSlider || !favoritesSlider) return;

    // Use simulated MOVIE_DATABASE array from data.js
    const movies = MOVIE_DATABASE;

    // Split movies: first 5 to watchlist, top-rated (>= 8.5) to favorites
    const watchlistMovies = movies.slice(0, 5);
    const favoriteMovies = movies.filter(movie => movie.rating >= 8.5);

    renderSliderMovies(watchlistMovies, watchlistSlider);
    renderSliderMovies(favoriteMovies, favoritesSlider);
}

/**
 * Utility to render list of movies as horizontal cards inside slider rows.
 */
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
        
        // Show trailer toast description on card click
        card.addEventListener('click', () => {
            showToast(`🎬 ${movie.title} (${movie.year})`, `Rating: ★${movie.rating.toFixed(1)}\nGenre: ${movie.genres.join('/')}\n\n"${movie.synopsis}"`);
        });
        
        container.appendChild(card);
    });
}

/**
 * Attaches click handlers to the Profile tab review cards.
 */
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

// Timeout holder to clear previous running notifications
let toastTimeout = null;

/**
 * Shows an elegant glassmorphic alert toast at the top of the phone screen.
 */
function showToast(title, description) {
    const toast = document.getElementById('toast-notif');
    const toastTitle = document.getElementById('toast-title');
    const toastDesc = document.getElementById('toast-desc');
    
    if (!toast || !toastTitle || !toastDesc) return;
    
    // Clear any previous running timer
    if (toastTimeout) {
        clearTimeout(toastTimeout);
        toast.classList.remove('show');
    }
    
    // Set text contents
    toastTitle.textContent = title;
    toastDesc.textContent = description;
    
    // Show toast
    // Short delay helps CSS transition reset smoothly if it was already showing
    setTimeout(() => {
        toast.classList.add('show');
    }, 50);
    
    // Auto hide after 4.5 seconds to allow reading synopsis
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 4500);
}

/* ==========================================
   🎬 TRAKT DATA AND RENDER MANAGEMENT
   ========================================== */

/**
 * Fetches and renders trending movies on the Home tab.
 */
function initTrendingMovies() {
    const grid = document.getElementById('trending-grid');
    const countBadge = document.getElementById('trending-count');
    if (!grid) return;

    // Call simulated Trakt API
   // Call the real TMDB API
    fetchTrendingMovies().then(movies => {
        grid.innerHTML = '';
        if (countBadge) {
            countBadge.textContent = `${movies.length} Films`;
        }

        // Map TMDB fields to what your createMovieCard function expects
        const formattedMovies = movies.map(m => ({
            id: m.id,
            title: m.title || m.name,
            year: m.release_date ? m.release_date.substring(0, 4) : 'N/A',
            genres: ['Movie'], 
            rating: m.vote_average,
            synopsis: m.overview,
            director: 'Unknown'
        }));

        renderMoviesIntoGrid(formattedMovies, grid);
    }).catch(err => {
        grid.innerHTML = `<div class="grid-loading">Failed to load feed. Error: ${err}</div>`;
    });

/**
 * Initialises search functionalities in the Explore tab.
 */
function initSearch() {
    const searchInput = document.getElementById('search-input');
    const clearBtn = document.getElementById('search-clear-btn');
    const resultsGrid = document.getElementById('explore-results');
    const genresContainer = document.getElementById('genres-container');
    const genreTags = document.querySelectorAll('.genre-tag');

    if (!searchInput || !resultsGrid || !genresContainer) return;

    // Input listener for real-time filtering
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        handleSearch(query, searchInput, clearBtn, resultsGrid, genresContainer);
    });

    // Clear button listener
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            // Reset active highlighted genres
            genreTags.forEach(tag => tag.classList.remove('highlighted'));
            handleSearch('', searchInput, clearBtn, resultsGrid, genresContainer);
            searchInput.focus();
        });
    }

    // Genre tags listeners
    genreTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const genre = tag.getAttribute('data-genre');
            if (!genre) return;

            const isAlreadyHighlighted = tag.classList.contains('highlighted');
            genreTags.forEach(t => t.classList.remove('highlighted'));

            if (isAlreadyHighlighted) {
                // If clicked again, reset search
                searchInput.value = '';
                handleSearch('', searchInput, clearBtn, resultsGrid, genresContainer);
            } else {
                // Highlight tag, fill search bar, trigger filtering
                tag.classList.add('highlighted');
                searchInput.value = genre;
                handleSearch(genre, searchInput, clearBtn, resultsGrid, genresContainer);
            }
        });
    });
}

/**
 * Handles the actual search execution and view toggle states.
 */
function handleSearch(query, input, clearBtn, results, genres) {
    if (clearBtn) {
        clearBtn.style.display = query ? 'flex' : 'none';
    }

    if (!query || query.trim() === '') {
        results.style.display = 'none';
        results.innerHTML = '';
        genres.style.display = 'block';
        return;
    }

    // Execute simulated Trakt query
    searchMovies(query).then(movies => {
        results.innerHTML = '';
        results.style.display = 'grid';
        genres.style.display = 'none';

        if (movies.length === 0) {
            results.innerHTML = `
                <div class="no-results">
                    <span class="no-results-icon">🔎</span>
                    <h4 class="no-results-text">No Movies Found</h4>
                    <p class="no-results-desc">We couldn't find anything matching "${escapeHtml(query)}". Try another title, genre, or director.</p>
                </div>
            `;
        } else {
            renderMoviesIntoGrid(movies, results);
        }
    });
}

/**
 * Utility function to render a list of movies into a specified grid element.
 */
function renderMoviesIntoGrid(movies, targetElement) {
    movies.forEach(movie => {
        const card = createMovieCard(movie);
        targetElement.appendChild(card);
    });
}

/**
 * Creates and constructs a DOM movie-card block.
 */
function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.setAttribute('data-id', movie.id);

    // 1. Icon Container (🎬 Centered at top half)
    const iconContainer = document.createElement('div');
    iconContainer.className = 'movie-card-icon-container';
    
    const icon = document.createElement('span');
    icon.className = 'movie-card-icon';
    icon.textContent = '🎬';
    
    iconContainer.appendChild(icon);

    // 2. Info Container (Title, Year/Genre underneath)
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

    // Append elements to card
    card.appendChild(iconContainer);
    card.appendChild(infoContainer);

    // Interactive details pop-up
    card.addEventListener('click', () => {
        showToast(
            `🎬 ${movie.title} (${movie.year})`,
            `Director: ${movie.director}\nGenres: ${movie.genres.join(', ')}\nRating: ★${movie.rating.toFixed(1)}\n\n"${movie.synopsis}"`
        );
    });

    return card;
}

/**
 * Escapes characters to prevent HTML injection in dynamic search strings.
 */
function escapeHtml(string) {
    return String(string)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
