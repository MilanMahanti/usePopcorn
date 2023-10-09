import SearchResult from "./SearchResult";

export default function SearchResultsList({ movies, onSelectedId }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <SearchResult
          movie={movie}
          key={movie.imdbID}
          onSelectedId={onSelectedId}
        />
      ))}
    </ul>
  );
}
