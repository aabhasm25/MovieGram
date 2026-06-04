// MovieGram - Simulated Trakt API Database Layer

const MOVIE_DATABASE = [
    {
        id: "the-dark-knight-2008",
        title: "The Dark Knight",
        year: 2008,
        genres: ["Action", "Crime", "Drama"],
        rating: 9.0,
        director: "Christopher Nolan",
        synopsis: "When the menace known as the Joker wreaks havoc and chaos on Gotham, Batman must accept one of the greatest psychological and physical tests."
    },
    {
        id: "inception-2010",
        title: "Inception",
        year: 2010,
        genres: ["Action", "Sci-Fi", "Adventure"],
        rating: 8.8,
        director: "Christopher Nolan",
        synopsis: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O."
    },
    {
        id: "interstellar-2014",
        title: "Interstellar",
        year: 2014,
        genres: ["Sci-Fi", "Drama", "Adventure"],
        rating: 8.6,
        director: "Christopher Nolan",
        synopsis: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival on a new home."
    },
    {
        id: "avatar-2009",
        title: "Avatar",
        year: 2009,
        genres: ["Action", "Adventure", "Sci-Fi"],
        rating: 7.9,
        director: "James Cameron",
        synopsis: "A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home."
    },
    {
        id: "titanic-1997",
        title: "Titanic",
        year: 1997,
        genres: ["Drama", "Romance"],
        rating: 7.9,
        director: "James Cameron",
        synopsis: "A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic."
    },
    {
        id: "pulp-fiction-1994",
        title: "Pulp Fiction",
        year: 1994,
        genres: ["Crime", "Drama"],
        rating: 8.9,
        director: "Quentin Tarantino",
        synopsis: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption."
    },
    {
        id: "gladiator-2000",
        title: "Gladiator",
        year: 2000,
        genres: ["Action", "Adventure", "Drama"],
        rating: 8.5,
        director: "Ridley Scott",
        synopsis: "A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery."
    },
    {
        id: "dune-part-two-2024",
        title: "Dune: Part Two",
        year: 2024,
        genres: ["Sci-Fi", "Adventure", "Drama"],
        rating: 8.8,
        director: "Denis Villeneuve",
        synopsis: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family."
    },
    {
        id: "oppenheimer-2023",
        title: "Oppenheimer",
        year: 2023,
        genres: ["Biography", "Drama", "History"],
        rating: 8.9,
        director: "Christopher Nolan",
        synopsis: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb."
    },
    {
        id: "everything-everywhere-all-at-once-2022",
        title: "Everything Everywhere All at Once",
        year: 2022,
        genres: ["Action", "Comedy", "Sci-Fi"],
        rating: 8.5,
        director: "Daniel Kwan, Daniel Scheinert",
        synopsis: "A middle-aged Chinese immigrant is swept up into an insane adventure in which she alone can save existence by exploring other universes."
    }
];

/**
 * Simulates fetching trending movies from Trakt API.
 * Returns a Promise that resolves with the list of trending movies.
 */
function fetchTrendingMovies() {
    return new Promise((resolve) => {
        // Simulate a small network delay of 300ms
        setTimeout(() => {
            resolve(MOVIE_DATABASE);
        }, 300);
    });
}

/**
 * Simulates searching movies from the Trakt database.
 * Returns a Promise that resolves with matching movies.
 */
function searchMovies(query) {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (!query || query.trim() === "") {
                resolve([]);
                return;
            }
            const cleanQuery = query.toLowerCase().trim();
            const results = MOVIE_DATABASE.filter(movie => 
                movie.title.toLowerCase().includes(cleanQuery) ||
                movie.genres.some(genre => genre.toLowerCase().includes(cleanQuery)) ||
                movie.director.toLowerCase().includes(cleanQuery)
            );
            resolve(results);
        }, 150);
    });
}
