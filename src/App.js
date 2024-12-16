import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Card from './components/Card';
import Modal from './components/Modal';
import './App.css';

// API configuration
const API_KEY = '3fd2be6f0c70a2a598f084ddfb75487c';
const API_URL = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}&page=1`;
const SEARCH_API = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=`;

const App = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('movie');

  const fetchMovies = useCallback(async (term) => {
    const url = term ? `${SEARCH_API}${term}` : API_URL;
    const response = await fetch(url);
    const data = await response.json();

    if (data.results) {
      const moviesWithRatings = await Promise.all(
        data.results.map(async (movie, index) => {
          const movieDetails = await fetchMovieDetails(movie.id);
          
          return {
            ...movie,
            imdbRating: movieDetails.vote_average, // TMDb uses `vote_average`
            Poster: movieDetails.poster_path ? `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}` : 'placeholder.jpg',
          };
        })
      );
      setMovies(moviesWithRatings);
    }
  }, []);

  const fetchMovieDetails = async (id) => {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`);
    const data = await response.json();
    return data;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMovies(searchTerm);
  };

  const openModal = (movie) => {
    fetchMovieDetails(movie.id).then((data) => setSelectedMovie(data));
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  useEffect(() => {
    fetchMovies(category);
  }, [category, fetchMovies]);

  return (
    <div className="App">
      <Header setCategory={setCategory} />
      <main>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for a movie..."
          />
          <button type="submit">Search</button>
        </form>
        <div className="card-container">
          {movies &&
            movies.map((movie, index) => (
              <Card
                key={movie.id}
                movie={movie}
                openModal={openModal}
                imageWidth={150}
                imageHeight={225}
                eagerLoad={index < 3} // Eagerly load top 3 images
              />
            ))}
        </div>
      </main>
      {selectedMovie && <Modal movie={selectedMovie} closeModal={closeModal} />}
      <Footer className="footer" />
    </div>
  );
};

export default App;
