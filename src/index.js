const section = document.getElementById("ul-container");
const div_loading = document.getElementById("loading");
const form = document.getElementById("form");
const textbox = document.getElementById("text-box");
let home_img = document.getElementById("home-img");
let url = location.href;

const getData = async (id) => {                                                                 // Trayendo la info. de la api
    const API = 'https://yts.mx/api/v2/list_movies.json';
    const DETAIL_API = 'https://yts.mx/api/v2/movie_details.json?movie_id=';
    const use_api = id? `${DETAIL_API}${id}` : API;
    
    try
    {
        const response = await fetch(use_api);
        const data = await response.json();
        return data;
    }
    catch(error)
    {
        console.error(error);
    }
};

const loading = () => {
    const view = `
        <span></span>
        <span></span>
        <span></span>
    `;
    return view;
}

const getSearch = async (search) => {
    const API = 'https://yts.mx/api/v2/list_movies.json?query_term=';
    const SEARCH_API = `${API}${search}`;

    try
    {
        const response = await fetch(SEARCH_API);
        const data = await response.json();
        return data;
    }
    catch(error)
    {
        console.error(error);
    }
}

const showSuggestions = async (id) => {
    const API = 'https://yts.mx/api/v2/movie_suggestions.json?movie_id=';
    let suggestion = `${API}${id}`;
    try
    {
        let response = await fetch(suggestion);
        let data = await response.json();
        return data;
    }
    catch (error)
    {
        console.error(error);
    }
}

const List = async (search=null) => {  
    let movies;       
    search != null? movies = await getSearch(search) : movies = await getData();                                                                   //Generar el home a partir de los datos de la api
    let view = `
        <ul class="movies-container">
            ${movies.data.movies.map(movie => `
            <li class="movie-home">
                <a onclick="clickMovie(${movie.id})">
                    <img src='${movie.medium_cover_image}' id="home-img" loading="lazy">
                </a>
                    <h4>${movie.title}</h4>
                    <h6>${movie.year}</h6>
            </>
            `)}
        </ul>
    `;

    section.innerHTML = view;
};

const clickMovie = async (id) =>                                      //Inyectar el detalle de la pelicula
{
   section.innerHTML = await showDetail(id);
}

const showDetail = async (id) => {                                      //Solciitar data y generar html
    let movie = await getData(id);
    let suggested_movies = await showSuggestions(id)
    console.log(movie);
    const view = `
    <section class="movie-detail-container">
    <div class="movie-detail">
        <img src="${movie.data.movie.large_cover_image}" alt="">
        <div class="info">
            <h1>${movie.data.movie.title}</h1>
            <h3>${movie.data.movie.year}</h3>
            <h4>${movie.data.movie.genres.join(" / ")}</h4>
            <h5>${movie.data.movie.description_intro}</h5>
        </div>
    </div>
    </section>
    <hr class="line"></hr>
    <h1>Suggested movies</h1>
    <div class="suggestions">       
        ${suggested_movies.data.movies.map(movie => `
            <div class="suggestion-items">
                <img src="${movie.medium_cover_image}" onclick="clickMovie(${movie.id})" loading="lazy"></img>
                <h2>${movie.title}</h2>
            </div>
        `).join(' ')}
    <div>
  
    `;
    window.scrollTo(0,0);
    return view;
}

const searchMovie = async (event) =>                                        //Buscar peliculas usando la barra de busqueda
{
    event.preventDefault();
    let search = textbox.value;
    List(search);
    form.reset();
}

List();
form.addEventListener("submit", searchMovie);