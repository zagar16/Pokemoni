import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./PokemonView.css";

const PokemonView = ({
  pokemon,
  toggleFavorite,
  isFavorite,
  clearSelectedPokemon,
}) => {
  const [pokemonViewData, setPokemonViewData] = useState();

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  useEffect(() => {
    if (pokemon && pokemon.url) {
      async function fetchData() {
        try {
          const response = await fetch(pokemon.url);
          const data = await response.json();
          setPokemonViewData(data);
        } catch (error) {
          console.error("Error fetching Pokémon data:", error);
        }
      }
      fetchData();
    }
  }, [pokemon]);

  //  ce je pokemon undefined
  if (!pokemon || !pokemon.name) {
    return <div>No data available</div>;
  }
  return (
    <>
      <div className="main_container">
        <div className="left_content">
          <p className="pokemon_name">{pokemon.name.toUpperCase()}</p>

          <p className="pokemon_types">
            {pokemonViewData?.["types"]?.map((types, index) => (
              <span key={index}>
                {index > 0 ? "/" : ""}
                {capitalizeFirstLetter(types?.["type"]?.["name"])}
              </span>
            ))}
          </p>
          <p className="pokemon_description">
            Abilities:
            {pokemonViewData?.["abilities"]?.map((ability, index) => (
              <li key={index}>
                {capitalizeFirstLetter(ability?.["ability"]?.["name"])}
              </li>
            ))}
            <br />
            Height: {pokemonViewData?.["height"]}
            <br />
            Weight: {pokemonViewData?.["weight"]}
          </p>
        </div>
        <div className="right_content">
          <img
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${
              pokemon.index + 1
            }.png`}
            alt={pokemon.name}
          />
        </div>
        <button
          className="favorite_button"
          onClick={() => toggleFavorite(pokemon.index)}
        >
          {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
        </button>
        <div className="bottom_button_container">
          <button>
            <Link to={`/`} onClick={clearSelectedPokemon}>
              Pokemon List
            </Link>
          </button>
        </div>
      </div>
    </>
  );
};

export default PokemonView;