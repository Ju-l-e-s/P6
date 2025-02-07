/**
 * The base URL for the API.
 * @constant {string}
 */
export const base_url = 'http://localhost:8000';

/**
 * Generates a URL for fetching movie titles based on the selected genre and sorted by IMDb score in descending order.
 *
 * @param {string} choice - The genre of movies to filter by.
 * @returns {string} The generated URL for the API request.
 */
export const category_url = (choice) =>
    `${base_url}/api/v1/titles/?genre=${choice}&sort_by=-imdb_score`;


/**
 * Fetches data from the given URL.
 *
 * @param {string} url - The URL to fetch data from.
 * @returns {Promise<Object>} The data fetched from the URL.
 * @throws {Error} If the network response is not ok.
 */


export const Fetch =(url) => {
    const promise =  fetch(url);
    return promise.then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }).catch(error => {
        console.error('Error fetching data:', error);
    })
}


