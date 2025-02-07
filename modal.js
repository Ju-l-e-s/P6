import { Fetch } from './api.js';

/**
 * Handles the display of the modal with movie details.
 * @param {Object} movie - The movie object or an object containing the URL to fetch movie details.
 */
export const handleModal = async (movie) => {
    // Fetch movie details if a URL is provided, otherwise use the provided movie object.
    const movieDetails = movie.url ? await Fetch(movie.url) : movie;
    console.log("movieDetails",movieDetails)
    // If no movie details are available, log an error and return.
    if (!movieDetails) {
        console.error('No movie details available');
        return;
    }

    // Get modal elements by their IDs or selectors.
    // const modalTitle = document.getElementById('movieModalLabel');
    // const modalImage = document.querySelector('#movieModal .modal-body img');
    const modalBody = document.querySelector('#movieModal .modal-body');

    // Set the modal title, image source, and alt text.
    // modalTitle.textContent = movieDetails.title;
    // modalImage.src = movieDetails.image_url;
    // modalImage.alt = movieDetails.title;
    // Populate the modal body with movie details.
    modalBody.innerHTML = `
  <div class="row">
    <!-- Texte du film -->
    <div class="col-12 col-md-8 order-1 order-md-1">
      <h2 class="fw-bold mb-2">${movieDetails.title || 'N/A'}</h2>
      <p class="mb-0"><strong>${movieDetails.date_published.substring(0, 4) || 'N/A'} - ${movieDetails.genres ? movieDetails.genres.join(', ') : 'N/A'}</strong></p>
      <p class="mb-0"><strong>${movieDetails.rated !== "Not rated or unknown rating" ? movieDetails.rated + " - " : ''} ${movieDetails.duration ? movieDetails.duration + ' minutes' : 'N/A'} (${movieDetails.countries ? movieDetails.countries.join(', ') : 'N/A'})</strong></p>
      <p class="mb-4"><strong>IMDB score:</strong> ${movieDetails.imdb_score ? movieDetails.imdb_score + "/10" : 'N/A'}</p>
      <p class="mb-0"><strong>Réaliser par:</strong> ${movieDetails.directors ? movieDetails.directors.join(', ') : 'N/A'}</p>
      <p class="mb-3">${movieDetails.description || 'Aucune description disponible.'}</p>
    </div>

    <!-- Image -->
    <div class="col-12 col-md-4 text-center order-2 order-md-2">
      <img src="${movieDetails.image_url}" alt="${movieDetails.title}" class="img-fluid mb-2" />
    </div>

    <!-- Acteurs (mobile et tablette : sous l'image) -->
    <div class="col-12 order-3 text-left text-md-start">
       <p><strong>Avec:</strong></p>     
      <p class="mb-2"> ${movieDetails.actors ? movieDetails.actors.join(', ') : 'N/A'}</p>
    </div>
  </div>
  <div class="text-center mt-3">
    <button type="button" style="background-color: #FA0B0B;" class="btn btn-danger px-4 py-2 rounded" data-bs-dismiss="modal">Fermer</button>
  </div>
`;




    // Show the modal using Bootstrap's modal component.
    const modal = new bootstrap.Modal(document.getElementById('movieModal'));
    modal.show();
};

/**
 * Attaches a click event listener to an element to trigger the modal display.
 * @param {HTMLElement} element - The HTML element to attach the listener to.
 * @param {Object} movie - The movie object to pass to the modal handler.
 */
export const attachModalListener = (element, movie) => {
    element.addEventListener('click', () => handleModal(movie));
};
