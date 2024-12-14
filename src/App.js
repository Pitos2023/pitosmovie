import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Card from './components/Card';
import Modal from './components/Modal';
import './App.css';

// Helper function to preload images
const preloadImage = (url) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = url;
  document.head.appendChild(link);
};

const App = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('movie');

  const fetchMovies = useCallback(async (term) => {
    const response = await fetch(`https://omdbapi.com/?s=${term}&page=1&apikey=fc1fef96`);
    const data = await response.json();

    if (data.Search) {
      const moviesWithRatings = await Promise.all(
        data.Search.map(async (movie, index) => {
          const movieDetails = await fetchMovieDetails(movie.imdbID);
          
          // Preload the movie poster for above-the-fold movies (e.g., top 3 movies)
          if (index < 3 && movieDetails.Poster && movieDetails.Poster !== 'N/A') {
            preloadImage(movieDetails.Poster);
          }

          return {
            ...movie,
            imdbRating: movieDetails.imdbRating,
            Poster: movieDetails.Poster,
          };
        })
      );
      setMovies(moviesWithRatings);
    }
  }, []);

  const fetchMovieDetails = async (id) => {
    const response = await fetch(`https://omdbapi.com/?i=${id}&apikey=fc1fef96`);
    const data = await response.json();
    return data;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMovies(searchTerm);
  };

  const openModal = (movie) => {
    fetchMovieDetails(movie.imdbID).then((data) => setSelectedMovie(data));
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
                key={movie.imdbID}
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
