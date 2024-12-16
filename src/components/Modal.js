import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';

const Modal = ({ movie, closeModal }) => {
  const [trailerUrl, setTrailerUrl] = useState('');

  useEffect(() => {
    const fetchTrailer = async () => {
      const response = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=3fd2be6f0c70a2a598f084ddfb75487c`);
      const data = await response.json();
      const trailer = data.results.find(video => video.type === 'Trailer');
      if (trailer) {
        setTrailerUrl(`https://www.youtube.com/watch?v=${trailer.key}`);
      }
    };

    if (movie) {
      fetchTrailer();
    }
  }, [movie]);

  if (!movie) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={closeModal}>&times;</span>
        <h2>{movie.title}</h2>
        {trailerUrl ? (
          <ReactPlayer url={trailerUrl} controls={true} width="100%" height="400px" />
        ) : (
          <p>Trailer not available</p>
        )}
        <p><strong>Release Date:</strong> {movie.release_date}</p>
        <p><strong>Genres:</strong> {movie.genres.map(genre => genre.name).join(', ')}</p>
        <p><strong>Vote Average:</strong> {movie.vote_average}</p>
      </div>
    </div>
  );
};

export default Modal;
