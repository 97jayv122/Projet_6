// Fonction de récupération des données via fetch
function getData(apiUrl) {
  return fetch(apiUrl).then((response) => response.json());
}

// Fonction pour remplir un container film-grid avec des films
function fillFilmGrid(containerId, data) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  data.results.forEach((film) => {
    // Création de l'élément film
    const filmDiv = document.createElement("div");
    filmDiv.className = "film";
    filmDiv.dataset.url = film.url; // stocker l'URL de détail

    const img = document.createElement("img");
    img.src = film.image_url;
    img.alt = film.title;
    filmDiv.appendChild(img);

    // Ajout d'un bouton de détails
    const detailBtn = document.createElement("button");
    detailBtn.className = "details-film-grid";
    detailBtn.textContent = "Détails";
    filmDiv.appendChild(detailBtn);

    const filmCover = document.createElement("div");
    filmCover.className = "film-hover";
    filmCover.textContent = film.title;
    filmDiv.appendChild(filmCover);

    // Événement pour ouvrir la modale
    detailBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      openFilmModal(film.url);
    });
    // Permettre aussi le clic sur l'image d'ouvrir la modale
    filmDiv.addEventListener("click", () => {
      openFilmModal(film.url);
    });

    container.appendChild(filmDiv);
  });
  applyVisibility(containerId);
}

// Afficher le modal avec les détails du film
function openFilmModal(filmUrl) {
  getData(filmUrl).then((film) => {
    document.getElementById("modal_image").src = film.image_url;
    document.getElementById("modal_title").textContent = film.title;
    document.getElementById("modal_genres").textContent = "Genres: " + film.genres.join(", ");
    document.getElementById("modal_date").textContent = "Date de sortie: " + film.date_published;
    document.getElementById("modal_rated").textContent = "Classification: " + film.rated;
    document.getElementById("modal_imdb_score").textContent = "Score IMDB: " + film.imdb_score;
    document.getElementById("modal_director").textContent = "Réalisateur: " + film.director;
    document.getElementById("modal_actors").textContent = "Acteurs: " + film.actors;
    document.getElementById("modal_duration").textContent = "Durée: " + film.duration + " min";
    document.getElementById("modal_countries").textContent = "Pays: " + film.countries.join(", ");
    document.getElementById("modal_gross").textContent = "Recettes: " + (film.worldwide_gross_income || "N/A");
    document.getElementById("modal_description").textContent = film.description;
    document.getElementById("modal").style.display = "flex";
  });
}

// Fermer la modale
document.getElementById("modal_close").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("modal").style.display = "none";
});

// Charger le meilleur film
getData(urlMovieBestScore)
  .then((data) => {
    // Remplir la section "Films les mieux notés"
    fillFilmGrid("bestRatedSection", data);

    // Charger le détail du meilleur film (premier film)
    const bestFilmUrl = data.results[0].url;
    return getData(bestFilmUrl);
  })
  .then((detailFilm) => {
    document.getElementById("imageMeilleurFilm").src = detailFilm.image_url;
    document.getElementById("imageMeilleurFilm").alt = detailFilm.title;
    document.querySelector(".meilleurFilmTitle").textContent = detailFilm.title;
    document.querySelector(".meilleurFilmDesc").textContent = detailFilm.description;

    // Ajouter événement sur le bouton du meilleur film
    document.getElementById("bestFilmDetailsBtn").addEventListener("click", () => {
      openFilmModal(detailFilm.url);
    });
  });

// Charger les films pour les comédies
getData(urlComedyFilm).then((dataComedy) => {
  fillFilmGrid("comedySection", dataComedy);
});

// Charger les films pour les familles
getData(urlFamilyFilm).then((dataFamily) => {
  fillFilmGrid("familySection", dataFamily);
});

// Fonction pour appliquer la visibilité des films selon la taille d'écran
function applyVisibility(containerId) {
  const container = document.getElementById(containerId);
  const films = container.querySelectorAll(".film");
  let visibleCount = 6; // par défaut desktop

  if (window.innerWidth < 768) {
    visibleCount = 2;
  } else if (window.innerWidth >= 768 && window.innerWidth < 992) {
    visibleCount = 4;
  }

  films.forEach((film, index) => {
    if (index < visibleCount) {
      film.style.display = "block";
    } else {
      film.style.display = "none";
    }
  });

  // Toggle boutons "Voir plus" / "Voir moins"
  const voirPlusBtn = document.querySelector(`.voir-plus[data-section="${containerId}"]`);
  const voirMoinsBtn = document.querySelector(`.voir-moins[data-section="${containerId}"]`);
  if (films.length > visibleCount) {
    voirPlusBtn.style.display = "block";
    voirMoinsBtn.style.display = "none";
  } else {
    voirPlusBtn.style.display = "none";
    voirMoinsBtn.style.display = "none";
  }
}

// Gestion des boutons "Voir plus" et "Voir moins"
document.querySelectorAll(".voir-plus").forEach((btn) => {
  btn.addEventListener("click", () => {
    const sectionId = btn.getAttribute("data-section");
    const container = document.getElementById(sectionId);
    container.querySelectorAll(".film").forEach((film) => {
      film.style.display = "block";
    });
    btn.style.display = "none";
    const voirMoinsBtn = document.querySelector(`.voir-moins[data-section="${sectionId}"]`);
    voirMoinsBtn.style.display = "block";
  });
});

document.querySelectorAll(".voir-moins").forEach((btn) => {
  btn.addEventListener("click", () => {
    const sectionId = btn.getAttribute("data-section");
    applyVisibility(sectionId);
  });
});

// Recalculer la visibilité au redimensionnement de la fenêtre
window.addEventListener("resize", () => {
  ["bestRatedSection", "comedySection", "familySection", "otherSection"].forEach(applyVisibility);
});

// Charger et remplir le dropdown avec les genres disponibles
getData(urlListeGenreFilm).then((dataGenres) => {
  const dropdown = document.getElementById("genreDropdown");
  dataGenres.results.forEach((genre) => {
    const a = document.createElement("a");
    a.href = "#";
    a.textContent = genre.name;
    a.addEventListener("click", (e) => {
      e.preventDefault();
      // Construire l'URL pour le genre sélectionné
      const urlOther = url + "titles/?genre=" + genre.name + "&sort_by=-imdb_score,-votes&page_size=6";
      getData(urlOther).then((dataOther) => {
        fillFilmGrid("otherSection", dataOther);
      });
    });
    dropdown.appendChild(a);
  });
});
