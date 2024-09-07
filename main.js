const apiKey = 'f9994295'; // Replace with your OMDb API key
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const moviesContainer = document.getElementById('movies-container');
let currentPage = 1;
const resultsPerPage = 10; // OMDb API supports 10 results per page
const totalResultsToFetch = 50; // Total results you want to fetch

// Event listener for the search button
searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim(); // Trim any whitespace
    if (query) {
        moviesContainer.innerHTML = `<p>Loading...</p>`; // Show loading text
        currentPage = 1; // Reset to page 1 for new searches
        fetchMovies(query, currentPage);
    } else {
        moviesContainer.innerHTML = `<p>Please enter a movie name to search.</p>`;
    }
});

// Function to fetch movies from the API
function fetchMovies(query, page) {
    fetch(`https://www.omdbapi.com/?s=${query}&page=${page}&apikey=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.Response === "True") {
                displayMovies(data.Search);

                // Fetch more results if available and needed
                const totalPages = Math.ceil(data.totalResults / resultsPerPage);
                if (currentPage < totalPages && resultsPerPage * currentPage < totalResultsToFetch) {
                    currentPage++;
                    fetchMovies(query, currentPage); // Fetch next page
                }
            } else {
                moviesContainer.innerHTML = `<p>No results found for "${query}".</p>`;
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            moviesContainer.innerHTML = `<p>Error loading movies. Please try again later.</p>`;
        });
}

// Function to display the movies
function displayMovies(movies) {
    if (currentPage === 1) moviesContainer.innerHTML = ''; // Clear previous results on first page
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');

        const moviePoster = movie.Poster !== "N/A" ? movie.Poster : 'image.png'; // Fallback image
        movieCard.innerHTML = `
            <a href="https://www.imdb.com/title/${movie.imdbID}" target="_blank" class="movie-link">
                <img src="${moviePoster}" alt="${movie.Title} Poster">
                <h2 class="movie-title">${movie.Title}</h2>
                <p class="movie-details">Released: ${movie.Year}</p>
            </a>
        `;

        moviesContainer.appendChild(movieCard);
    });
}

// Load trending/popular movies by default
document.addEventListener('DOMContentLoaded', () => {
    const defaultQuery = 'Avengers'; // You can change this default query
    fetchMovies(defaultQuery, currentPage);
});