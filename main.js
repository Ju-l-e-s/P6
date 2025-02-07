import { category_url, base_url, Fetch } from './api.js';
import { appendMovies, user_choice, bestMovie } from './dom.js';

/**
 * Asynchronously loads categories from the API and populates all select elements with the class 'category-select'.
 * If the API does not return any data or genres, a fallback list of genres is used.
 *
 * @async
 * @function loadCategories
 * @returns {Promise<void>} A promise that resolves when the categories have been loaded and the select elements have been populated.
 */
const loadCategories = async () => {
    const genresUrl = `${base_url}/api/v1/genres`;
    let data = await Fetch(genresUrl);

    // Fallback if no data or no genres
    if (!data || !data.genres || data.genres.length === 0) {
        data = {
            genres: ["Action", "Drama", "Horror", "Romance", "Mystery", "Comedy"]
        };
    }

    // Fill all .category-select lists
    const selects = document.querySelectorAll('.category-select');
    selects.forEach(select => {
        select.innerHTML = ''; // clear the select element
        // Add a default empty option
        const emptyOption = document.createElement('option');
        emptyOption.value = '';
        emptyOption.textContent = '--- Choose a category ---';
        select.appendChild(emptyOption);

        data.genres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre;
            option.textContent = genre;
            select.appendChild(option);
        });
    });
};

// URLs for fixed categories
const mystery_url = category_url('Mystery');
const comedy_url = category_url('Comedy');

document.addEventListener('DOMContentLoaded', async () => {
    await loadCategories();

    // Display Mystery and Comedy
    appendMovies(mystery_url, document.getElementById('Mystery'));
    appendMovies(comedy_url, document.getElementById('Comedy'));

    // Initialize user choice (free categories)
    user_choice();

    // Display the best movie
    bestMovie();

    // From now on, free categories are not loaded by default,
    // the user must choose one.
});
