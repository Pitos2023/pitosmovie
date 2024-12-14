import React from 'react';

const Card = ({ movie, openModal, imageWidth, imageHeight, eagerLoad }) => {
  return (
    <div className="card" onClick={() => openModal(movie)}>
      <img
        src={movie.Poster !== 'N/A' ? movie.Poster : 'placeholder.jpg'}
        alt={movie.Title}
        width={imageWidth}
        height={imageHeight}
        loading={eagerLoad ? 'eager' : 'lazy'}
      />
      <div className="card-info">
        <h3>{movie.Title}</h3>
        <p>{movie.Year}</p>
        {movie.imdbRating && (
          <div className="rating">
            <span>⭐ {movie.imdbRating}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
