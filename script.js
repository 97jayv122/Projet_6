document.addEventListener('DOMContentLoaded', () => {
    // Constantes d'API
    const url = "http://localhost:8000/api/v1/";
    const urlMovieBestScore = url + "titles/?sort_by=-imdb_score,-votes&page_size=6";
    const urlActionFilm = url + "titles/?genre=Action&ssort_by=-imdb_score,-votes&page_size=6"
    const urlDramaFilm = url + "titles/?genre=Drama&sort_by=-imdb_score,-votes&page_size=6";
    const urlFamilyFilm = url + "titles/?genre=Family&sort_by=-imdb_score,-votes&page_size=6";
    const urlListeGenreFilm = url + "genres/?page_size=25";
  
    // Affichage du meilleur film
    fetch(urlMovieBestScore)
      .then(response => response.json())    
      .then(data => {
        if (data.results && data.results.length > 0) {
          const bestMovie = data.results[0];
          const bestMovieUrl = bestMovie.url;
          document.getElementById('best-movie-img').src = bestMovie.image_url;
          document.getElementById('best-movie-title').innerText = bestMovie.title;
          document.getElementById("detail").setAttribute('data-movie-id', bestMovie.id)
          fetch(bestMovieUrl)
            .then(response => response.json())    
            .then(data => {
              document.getElementById('best-movie-summary').innerText = data.description;
            })
        }
      })
      .catch(error => console.error('Erreur fetch meilleur film:', error));
  
    // Fonction générique pour afficher une liste de films avec pagination optionnelle
    function afficherFilms(apiUrl, containerId) {
      fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          const container = document.getElementById(containerId);
          container.innerHTML = ''; // Réinitialiser le conteneur
  
          data.results.forEach(movie => {
            const filmDiv = document.createElement('div');
            // Utilisation des classes Bootstrap : col-12 (mobile), col-md-6 (tablette), col-lg-4 (desktop)
            filmDiv.className = "col-12 col-md-6 col-lg-4 film-thumbnail ";
            filmDiv.innerHTML = `
              <img src="${movie.image_url}" alt="${movie.title}" class="img-fluid mx-auto d-block w-75" data-movie-id="${movie.id}" data-bs-toggle="modal" data-bs-target="#filmModal">
              <div class="overlay">
                <p class="movie-title">${movie.title}</p>
              </div>
            `;
            container.appendChild(filmDiv);
          });
        })
        .catch(error => console.error('Erreur fetch films:', error));
    }
  
    // Affichage des films pour les catégories Drama et Family
    afficherFilms(urlActionFilm, 'action-films');
    afficherFilms(urlDramaFilm, 'drama-films');
    afficherFilms(urlFamilyFilm, 'family-films');
  
    // Remplissage du menu déroulant des genres
    fetch(urlListeGenreFilm)
      .then(response => response.json())
      .then(data => {
        const selectGenre = document.getElementById('selectCategory');
        data.results.forEach(genre => {
          const option = document.createElement('option');
          option.value = genre.name;
          option.text = genre.name;
          selectGenre.appendChild(option);
        });
      })
      .catch(error => console.error('Erreur fetch genres:', error));
  
    // Gestion de la sélection d'un genre dans le menu déroulant
    document.getElementById('selectCategory').addEventListener('change', function() {
      const selectedGenre = this.value;
      if (selectedGenre) {
        const urlByGenre = url + "titles/?genre=" + encodeURIComponent(selectedGenre) + "&sort_by=-imdb_score,-votes&page_size=6";
        afficherFilms(urlByGenre, 'selected-category-films', 'selected-pagination');
      }
    });
  
    // Affichage des détails d'un film dans la modale (événement de délégation)
    document.body.addEventListener('click', function(e) {
      if (e.target && e.target.dataset.movieId) {
        const movieId = e.target.dataset.movieId;
        const urlMovieDetail = url + "titles/" + movieId;
        fetch(urlMovieDetail)
          .then(response => response.json())
          .then(movie => {
            document.getElementById('filmModalLabel').innerText = movie.title;
            document.getElementById('modal-movie-img').src = movie.image_url;
            document.getElementById('filmModalBody').innerHTML = `
              <p><strong>Genre :</strong> ${movie.genres.join(', ')}</p>
              <p><strong>Date de sortie :</strong> ${movie.date_published}</p>
              <p><strong>Classification :</strong> ${movie.classification}</p>
              <p><strong>Score IMDB :</strong> ${movie.imdb_score}</p>
              <p><strong>Réalisateur :</strong> ${movie.directors.join(', ')}</p>
              <p><strong>Acteurs :</strong> ${movie.actors.join(', ')}</p>
              <p><strong>Durée :</strong> ${movie.duration} min</p>
              <p><strong>Pays d'origine :</strong> ${movie.countries}</p>
              <p><strong>Recettes au box-office :</strong> ${movie.worldwide_gross_income} $</p>
              <p><strong>Résumé :</strong> ${movie.long_description}</p>
            `;
          })
          .catch(error => console.error('Erreur fetch détail film:', error));
      }
    });
  });
