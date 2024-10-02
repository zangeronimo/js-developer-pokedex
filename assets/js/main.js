const pokemonList = document.getElementById('pokemonList')
const pokemonName = document.getElementById('pokemonName')
const pokemonDetail = document.getElementById('pokemonDetail')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li title="View more details" class="pokemon ${pokemon.type}" onclick="document.location.href='/detail.html?id=${pokemon.number}'">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                    alt="${pokemon.name}">
            </div>
        </li>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

function getPokemonDetails(pokemonId) {
    pokeApi.getPokemonById(pokemonId).then((pokemon) => {
        pokemonName.textContent = pokemon?.name ?? ''
        pokemonDetail.innerHTML = convertPokemonToLi(pokemon)
    })
}

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const pokemonId = urlParams.get('id') ?? null;

pokemonId ? getPokemonDetails(pokemonId) : loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})