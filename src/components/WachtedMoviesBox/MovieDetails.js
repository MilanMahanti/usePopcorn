import { useEffect, useState } from "react";
import StarRating from "../Reusable/StarRating/StarRating";
import Loader from "../Reusable/Loader";
import { KEY } from "../../App";

/*
function WatchedMoviesBox() {
  const [watched, setWatched] = useState(tempWatchedData);
  const [isOpen2, setIsOpen2] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen2((open) => !open)}
      >
        {isOpen2 ? "–" : "+"}
      </button>
      {isOpen2 && (
        <>
          <WatchedMoviesSummary watched={watched} />
          <WatchedMoviesList watched={watched} />
        </>
      )}
    </div>
  );
}
*/
export default function MovieDetails({
  selectedId,
  onCloseDetails,
  onAddWatched,
  watched,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  function handleAdd() {
    const newWatchedMovie = {
      title: movie.Title,
      poster: movie.Poster,
      imdbID: selectedId,
      imdbRating: Number(movie.imdbRating),
      runtime: Number(movie.Runtime.split(" ").at(0)),
      userRating: rating,
    };
    onAddWatched(newWatchedMovie);
    onCloseDetails();
  }
  useEffect(
    function () {
      function callback(e) {
        if (e.code === "Escape") {
          onCloseDetails();
        }
      }
      document.addEventListener("keydown", callback);
      return function () {
        document.removeEventListener("keydown", callback);
      };
    },
    [onCloseDetails]
  );
  useEffect(
    function () {
      async function getMoviesDetails() {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
        );
        const data = await res.json();
        setMovie(data);
        setIsLoading(false);
      }
      getMoviesDetails();
    },
    [selectedId]
  );
  useEffect(
    function () {
      if (!movie.Title) return;
      document.title = `Movie | ${movie.Title}`;

      //clean up when unmounts
      return function () {
        document.title = "usePopcorn";
      };
    },
    [movie.Title]
  );
  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <img src={movie.Poster} alt={`${movie.Title} poster`} />
            <div className="details-overview">
              <h2>{movie.Title}</h2>
              <p>
                <span>{movie.Released}</span>&bull;<span>{movie.Runtime}</span>
              </p>
              <p>{movie.Genre}</p>
              <p>
                <span>⭐</span>
                {movie.imdbRating} IMDB Rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    setUserRating={setRating}
                  />
                  {rating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add Movie to List
                    </button>
                  )}
                </>
              ) : (
                <p style={{ color: "#fcc419" }}>
                  You already rated this movie! {watchedUserRating} 🌟
                </p>
              )}
            </div>
            <p>
              <em>{movie.Plot}</em>
            </p>
            <p>
              <b>Actors :</b> {movie.Actors}
            </p>
            <p>
              <b>Director :</b> {movie.Director}
            </p>
          </section>
          <button className="btn-back" onClick={onCloseDetails}>
            &larr;
          </button>
        </>
      )}
    </div>
  );
}
