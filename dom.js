import { Fetch, category_url, base_url } from './api.js';
import { attachModalListener } from './modal.js';

const maxFilms = 6;

/**
 * Retrieves the list of movies from the given URL.
 * @param {string} url - The API URL.
 * @returns {Array} - List of retrieved movies.
 */
export const movieList = async (url) => {
  const films = await Fetch(url + `&page_size=${maxFilms}`);
  return films?.results || [];
};

/**
 * Dynamically updates the displayed movies based on the screen size.
 * @param {HTMLElement} container - The container holding the movies.
 */
const updateVisibleMovies = (container) => {
  const allMovies = container.querySelectorAll('.movie-item');
  let defaultCount;

  // Determine the number of visible movies based on screen size
  if (window.innerWidth >= 992) {
    defaultCount = 6; // Desktop
  } else if (window.innerWidth >= 768) {
    defaultCount = 4; // Tablet
  } else {
    defaultCount = 2; // Mobile
  }

  // Update classes to show or hide movies
  allMovies.forEach((movie, index) => {
    if (index < defaultCount) {
      movie.classList.remove('d-none');
    } else {
      movie.classList.add('d-none');
    }
  });
};

/**
 * Dynamically displays movies in a given HTML section with a responsive design.
 * @param {string} url - The API URL to fetch movies.
 * @param {HTMLElement} section - The HTML section to display movies.
 */
export const appendMovies = async (url, section) => {
  const movies = await movieList(url);
  let container = section.querySelector('.movie-container');

  if (!container) {
    container = document.createElement('div');
    container.classList.add('movie-container justify-content-center align-items-center');
    section.appendChild(container);
  }

  container.innerHTML = '';

  movies.forEach((movie, index) => {
    const div = document.createElement('div');
    div.classList.add(
        'col-4',
        'col-sm-6',
        'col-lg-4',
        'movie-item',
        'mb-4',
        'p-0',
        'mx-3',
        'position-relative',
        'overflow-hidden',
        'rounded',
        'card-size'
    );

    const img = document.createElement('img');
    img.src = movie.image_url;
    img.classList.add('img-fluid', 'clickable-image', 'w-100', 'h-100', 'object-fit-cover');

    const overlay = document.createElement('div');
    overlay.classList.add(
        'd-flex',
        'flex-column', // Alignement vertical
        'justify-content-center', // Centrage vertical
        'align-items-center', // Centrage horizontal
        'position-absolute',
        'bottom-0',
        'start-0',
        'w-100',
        'h-100',
        'bg-dark',
        'bg-opacity-75',
        'text-white',
        'opacity-0',
        'hover-overlay'
    );

    // Titre du film
    const title = document.createElement('h5');
    title.textContent = movie.title;
    title.classList.add('fw-bold', 'mb-3', 'fs-5'); // Utilisation des classes Bootstrap pour le titre

    // Bouton "Détails"
    const button = document.createElement('button');
    button.textContent = 'Détails';
    button.classList.add('btn', 'btn-secondary', 'rounded-pill', 'px-3', 'py-2'); // Bouton Bootstrap avec arrondi
    button.onclick = () => {
      import('./modal.js').then(module => {
        module.handleModal(movie);
      });
    };

    // Ajout des éléments dans l'overlay
    overlay.appendChild(title); // Titre en premier
    overlay.appendChild(button); // Bouton ensuite

    // Assemblage des éléments
    div.appendChild(img);
    div.appendChild(overlay);
    container.appendChild(div);

    // Gestion du hover
    div.addEventListener('mouseenter', () => overlay.classList.remove('opacity-0'));
    div.addEventListener('mouseleave', () => overlay.classList.add('opacity-0'));
  });

  // Listen to resize event to dynamically adjust visible movies
  window.addEventListener('resize', () => updateVisibleMovies(container));
};

/**
 * Handles dynamic category selection by the user.
 */
export const user_choice = () => {
  document.querySelectorAll('.category-select').forEach(select => {
    select.addEventListener('change', (event) => {
      const selectedCategory = event.target.value;
      const section = event.target.closest('section');
      if (selectedCategory) {
        const selectedUrl = category_url(selectedCategory);
        appendMovies(selectedUrl, section);
      } else {
        // If no category is selected, clear the section
        const container = section.querySelector('.movie-container');
        if (container) {
          container.innerHTML = '';
        }
      }
    });
  });
};

/**
 * Displays the best movie in the dedicated section.
 */


export const bestMovie = async () => {
  const bestMovieUrl = `${base_url}/api/v1/titles/?sort_by=-imdb_score&page_size=1`;
  const films = await Fetch(bestMovieUrl);

  if (films?.results?.length > 0) {
    const bestFilm = films.results[0];
    const filmDetails = await Fetch(bestFilm.url);

    const section = document.getElementById('meilleur-film');
    let container = section.querySelector('.movie-container');

    if (!container) {
      container = document.createElement('div');
      container.classList.add('movie-container');
      section.appendChild(container);
    }

    container.innerHTML = '';

    const div = document.createElement('div');
    div.classList.add('d-flex', 'align-items-start', 'flex-column', 'flex-md-row');

    // Image
    const img = document.createElement('img');
    img.src = filmDetails.image_url;
    img.classList.add('img-fluid', 'me-md-3', 'mb-3', 'mb-md-0');

    // Text Container
    const textContainer = document.createElement('div');
    textContainer.classList.add('d-flex', 'flex-column', 'w-100',"h-100");

    const title = document.createElement('h3');
    title.textContent = filmDetails.title;
    textContainer.appendChild(title);

    const description = document.createElement('p');
    description.textContent = filmDetails.description;
    textContainer.appendChild(description);

    // Button Container
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('mt-auto', 'd-flex', 'justify-content-end');

    const button = document.createElement('button');
    button.textContent = 'Détails';
    button.classList.add('btn', 'btn-danger', 'rounded-pill'); // Classes Bootstrap
    button.style.backgroundColor = '#FA0B0B';
    button.style.color = '#fff';
    button.style.lineHeight = '1'; // Centrage vertical
    button.style.border = 'none'; // Supprime la bordure
    button.onclick = () => {
      import('./modal.js').then(module => {
        module.handleModal(filmDetails);
      });
    };

    buttonContainer.appendChild(button);
    textContainer.appendChild(buttonContainer);

    // Combine image and text
    div.appendChild(img);
    div.appendChild(textContainer);
    container.appendChild(div);
  }
};
