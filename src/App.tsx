import { useCallback, useEffect, useRef } from "react";
import "./App.css";
import SearchBar from "./components/SearchBar";
import SearchResults from "./components/SearchResults";
import FavoritesList from "./components/FavoritesList";
import { Route, Routes } from "react-router-dom";
import UserDetails from "./components/UserDetails";
import useGithubSearch from "./hooks/useGithubSearch";
import useFavorites from "./hooks/useFavorites";

const App: React.FC = () => {
  const {
    searchResults,
    isLoading,
    error,
    page,
    hasMore,
    searchTerm,
    setPage,
    setSearchTerm,
    searchUsers,
    setIsLoading,
    setError,
  } = useGithubSearch();

  const { favoriteUsers, toggleFavorite } = useFavorites();
  const observer = useRef<IntersectionObserver | null>(null);

  const lastUserElementRef = useCallback(
    (node: HTMLLIElement) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage: number) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, setPage]
  );

  useEffect(() => {
    if (searchTerm) {
      searchUsers(searchTerm, page);
    }
  }, [searchTerm, page, searchUsers]);

  const handleSearch = useCallback(
    (query: string) => {
      setSearchTerm(query);
      setPage(1);
    },
    [setSearchTerm, setPage]
  );

  return (
    <div className="App">
      <header className="App-header">
        <SearchBar
          onSearch={handleSearch}
          setIsLoading={setIsLoading}
          setError={setError}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </header>
      <main className="App-main">
        <Routes>
          <Route
            path="/"
            element={
              <SearchResults
                error={error}
                searchResults={searchResults}
                isLoading={isLoading}
                lastUserElementRef={lastUserElementRef}
                toggleFavorite={toggleFavorite}
                favoriteUsers={favoriteUsers}
              />
            }
          />
          <Route
            path="/favorites"
            element={
              <FavoritesList
                favoriteUsers={favoriteUsers}
                toggleFavorite={toggleFavorite}
              />
            }
          />
          <Route
            path="/user/:username"
            element={
              <UserDetails
                toggleFavorite={toggleFavorite}
                favoriteUsers={favoriteUsers}
              />
            }
          />
        </Routes>
      </main>
    </div>
  );
};

export default App;
