import React, { useState, useEffect } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import PokemonView from "./components/PokemonView";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const App = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [favoritePokemon, setFavoritePokemon] = useState(() => {
    const storedFavorites = localStorage.getItem("favoritePokemon");
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  });
  const [selectedPokemon, setSelectedPokemon] = useState();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon");
        const pokemonData = await response.json();
        setPokemonList(pokemonData.results);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (location.pathname.includes("/pokemon/")) {
      const pokemonIndex = parseInt(location.pathname.split("/pokemon/")[1]);
      async function fetchPokemonData() {
        try {
          const response = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${pokemonIndex}`
          );
          const pokemonData = await response.json();
          setSelectedPokemon({ ...pokemonData, index: pokemonIndex });
        } catch (error) {
          console.error("Error fetching Pokemon data:", error);
        }
      }
      fetchPokemonData();
    }
  }, [location.pathname]);

  useEffect(() => {
    localStorage.setItem("favoritePokemon", JSON.stringify(favoritePokemon));
  }, [favoritePokemon]);

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favoritePokemon");
    if (storedFavorites) {
      setFavoritePokemon(JSON.parse(storedFavorites));
    }
  }, []);

  const handlePokemonClick = (pokemon, index) => {
    setSelectedPokemon({ ...pokemon, index });
    navigate(`/pokemon/${index}`);
  };

  const clearSelectedPokemon = () => {
    setSelectedPokemon();
  };

  const toggleFavorite = (index) => {
    if (favoritePokemon.includes(index)) {
      setFavoritePokemon((prevFavorites) =>
        prevFavorites.filter((favIndex) => favIndex !== index)
      );
    } else {
      setFavoritePokemon((prevFavorites) => [...prevFavorites, index]);
    }
  };

  return (
    <div>
      <div className="App">
        <Routes>
          <Route
            path="/pokemon/:id"
            element={
              <PokemonView
                pokemon={selectedPokemon}
                toggleFavorite={toggleFavorite}
                isFavorite={favoritePokemon.includes(selectedPokemon?.index)}
                clearSelectedPokemon={clearSelectedPokemon}
              />
            }
          />
          <Route
            path="/"
            element={
              <nav className="nav_pokemon">
                <ul className="pokemonList">
                  {pokemonList.map((pokemon, index) => (
                    <li
                      className="pokemon_li"
                      key={index}
                      onClick={() => handlePokemonClick(pokemon, index)}
                    >
                      <div className="pokemon_info_container">
                        <div>
                          {pokemon.name.charAt(0).toUpperCase() +
                            pokemon.name.slice(1)}
                        </div>
                        <span
                          className={`favorite_star ${
                            favoritePokemon.includes(index) ? "active" : ""
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(index);
                          }}
                        >
                          <FontAwesomeIcon icon={faStar} />
                        </span>
                      </div>
                      <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
                          index + 1
                        }.png`}
                        alt={pokemon.name}
                      />
                    </li>
                  ))}
                </ul>
              </nav>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
