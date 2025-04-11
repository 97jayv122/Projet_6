// Constante de l'adresse de l'API.
const url = "http://localhost:8000/api/v1/"
let urlMovieBestScore = url + "titles/?sort_by=-imdb_score&page_size=7";
const urlComedyFilm = "http://localhost:8000/api/v1/titles/?genre=Drama&sort_by=-imdb_score&page_size=6"
const urlFamilyFilm = "http://localhost:8000/api/v1/titles/?genre=Family&sort_by=-imdb_score&page_size=6"
const urlListeGenreFilm = "http://localhost:8000/api/v1/genres/?page_size=25"