const apiKey = 'ba443bb90dabe8b129bf0376d9cf1752';  // Sua chave da API TMDb

function recommendMovies() {
    console.log('Função recommendMovies chamada!');

    const type = document.getElementById('type').value;  // Tipo (filme ou série)
    const genre = document.getElementById('genre').value;  // Gênero
    const subgenre = document.getElementById('subgenre').value;  // Subgênero
    const mood = document.getElementById('mood').value;  // Humor
    const year = document.getElementById('year').value;  // Ano
    const quality = document.getElementById('quality').value;  // Qualidade

    console.log(`Valores capturados: tipo: ${type}, gênero: ${genre}, subgênero: ${subgenre}, humor: ${mood}, ano: ${year}, qualidade: ${quality}`);

    // Mapeamento de gêneros para os IDs da TMDb
    const genreMapping = {
        comedia: 35, // Comédia
        acao: 28, // Ação
        drama: 18, // Drama
        romance: 10749, // Romance
        terror: 27, // Terror
        ficcao: 878 // Ficção científica
    };

    // Variável para armazenar a query
    let searchQuery = '';

    // Adiciona o gênero à query se fornecido
    if (genre !== "nao-sei") {
        searchQuery += `&with_genres=${genreMapping[genre] || ''}`;
    }

    // Adiciona o tipo de conteúdo (filme ou série)
    if (type) {
        searchQuery += `&media_type=${type === 'filme' ? 'movie' : 'tv'}`;
    }

    // Se o ano for fornecido, adiciona à query
    if (year) {
        searchQuery += `&year=${year}`;
    }

    // Monta a URL para a requisição com idioma em português
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=pt-BR${searchQuery}`;

    console.log('URL gerada para requisição:', url);

    // Requisição à API
    fetch(url)
        .then(response => response.json())
        .then(data => displayRecommendations(data))
        .catch(error => {
            console.error('Erro ao buscar dados da API:', error);
            alert('Houve um erro ao buscar recomendações.');
        });
}

// Função para exibir as recomendações no modal
function displayRecommendations(data) {
    console.log('Dados recebidos da API:', data);

    const modal = document.getElementById('recommendation-modal');
    const moviesList = document.getElementById('movies-list');
    moviesList.innerHTML = '';  // Limpar as recomendações anteriores

    if (data.results && data.results.length > 0) {
        const movies = data.results;

        movies.forEach(movie => {
            const movieDiv = document.createElement('div');
            movieDiv.classList.add('movie');
            movieDiv.innerHTML = `
                <h3>${movie.title} (${movie.release_date ? movie.release_date.split('-')[0] : 'N/A'})</h3>
                <p><strong>Tipo:</strong> ${movie.media_type === 'movie' ? 'Filme' : 'Série'}</p>
                <p><strong>Ano:</strong> ${movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}</p>
                <p><strong>Gênero:</strong> ${translateGenres(movie.genre_ids)}</p>
                <p><strong>Descrição:</strong> ${movie.overview || 'Não disponível'}</p>
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
            `;
            moviesList.appendChild(movieDiv);
        });

        modal.style.display = "block";  // Mostrar o modal
    } else {
        moviesList.innerHTML = `<p>Desculpe, não encontramos filmes ou séries que atendem às suas preferências.</p>`;
        modal.style.display = "block";  // Mostrar o modal
    }
}

// Função para traduzir os gêneros numéricos para nomes em português
function translateGenres(genreIds) {
    const genreNames = {
        28: "Ação",
        35: "Comédia",
        18: "Drama",
        10749: "Romance",
        27: "Terror",
        878: "Ficção Científica",
        53: "Suspense",
        80: "Crime",
        12: "Aventura",
        14: "Fantasia",
        10752: "Guerra",
        9648: "Mistério",
        37: "Faroeste"
    };

    return genreIds.map(id => genreNames[id] || "Desconhecido").join(', ');
}

// Fechar o modal quando o usuário clicar no "x"
document.getElementById('close-modal').onclick = function() {
    document.getElementById('recommendation-modal').style.display = "none";
}

// Fechar o modal quando o usuário clicar fora do conteúdo
window.onclick = function(event) {
    const modal = document.getElementById('recommendation-modal');
    if (event.target === modal) {
        modal.style.display = "none";
    }
}
