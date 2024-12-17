import React from 'react';

const Modal = ({ movie, closeModal }) => {
  if (!movie) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={closeModal}>&times;</span>
        <h2>{movie.title}</h2>
        {movie.Poster && (
          <img 
            src={movie.Poster ? `https://image.tmdb.org/t/p/w500${movie.Poster}` : 'placeholder.jpg'} 
            alt={`${movie.title} poster`} 
          />
        )}
        <p><strong>Description:</strong> {movie.overview}</p>
        <p><strong>Release Date:</strong> {movie.release_date}</p>
        <p><strong>Genres:</strong> {movie.genres.map(genre => genre.name).join(', ')}</p>
        <p><strong>Vote Average:</strong> {movie.vote_average}</p>
      </div>
    </div>
  );
};

export default Modal;
