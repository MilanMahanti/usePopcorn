import { useState } from "react";
import { useMovies } from "./customHooks/useMovies";
import { useLocalStorage } from "./customHooks/useLocalStorage";

import Navbar from "./components/Nav/Navbar";
import Search from "./components/Nav/Search";
import NumResults from "./components/Nav/NumResults";
import Main from "./components/Main/Main";
import SearchResultsList from "./components/SearchResultBox/SearchResultsList";
import MovieDetails from "./components/WachtedMoviesBox/MovieDetails";
import WatchedMoviesList from "./components/WachtedMoviesBox/WatchedMoviesList";
import WatchedMoviesSummary from "./components/WachtedMoviesBox/WatchedMoviesSummary";
import ErrorMessage from "./components/Reusable/ErrorMessage";
import Loader from "./components/Reusable/Loader";
import ResultsBox from "./components/Reusable/ResultsBox";

export const KEY = "76258509";
const LOCAL_STORAGE_KEY = "Movies";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const [watched, setWatched] = useLocalStorage(LOCAL_STORAGE_KEY);

  const { movies, error, isLoading } = useMovies(query);

  function handelSelectedId(id) {
    setSelectedId((selectedId) => (selectedId === id ? null : id));
  }

  function handelCloseDetails() {
    setSelectedId(null);
  }

  function handelAddWatchedList(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handelRemoveWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  return (
    <>
      <Navbar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </Navbar>
      <Main>
        <ResultsBox>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <SearchResultsList
              movies={movies}
              onSelectedId={handelSelectedId}
            />
          )}
          {error && <ErrorMessage message={error} />}
        </ResultsBox>
        <ResultsBox>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseDetails={handelCloseDetails}
              onAddWatched={handelAddWatchedList}
              onRemoveWatched={handelRemoveWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedMoviesSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onRemoveWatched={handelRemoveWatched}
              />
            </>
          )}
        </ResultsBox>
      </Main>
    </>
  );
}
