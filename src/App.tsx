import { useEffect, useState, useRef, useCallback } from "react";
import "./App.css";
import SearchBar from "./SearchBar";
import SearchResultUser from "./SearchResultUser";
import UserDetails from "./UserDetails";
import { GitHubUser } from "./types";
import { Routes, Route } from "react-router-dom";

const App: React.FC = () => {
  const [searchResults, setSearchResults] = useState<GitHubUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [favoriteUsers, setFavoriteUsers] = useState<GitHubUser[]>(() => {
    const storedFavorites = localStorage.getItem("favoriteUsersList");
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  });

  const observer = useRef<IntersectionObserver>(null);
  const lastUserElementRef = useCallback(
    (node: HTMLLIElement) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  // Effect to handle search
  useEffect(() => {
    const searchUsers = async (query: string, pageNum: number) => {
      if (query.length <= 2) return;

      const resultsPerPage = 30;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://api.github.com/search/users?q=${query}&page=${pageNum}&per_page=${resultsPerPage}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        setSearchResults((prevResults) =>
          pageNum === 1 ? data.items : [...prevResults, ...data.items]
        );

        setHasMore(() => {
          const shouldHaveMore = data.items.length === resultsPerPage;
          return shouldHaveMore;
        });
      } catch (err) {
        setError(
          err instanceof Error && err.message === "HTTP error! status: 403"
            ? "API rate limit exceeded. Please try again later."
            : err instanceof Error
            ? err.message
            : "An unexpected error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    };
    if (searchTerm) {
      searchUsers(searchTerm, page);
    }
  }, [searchTerm, page, hasMore]);

  const handleSearch = (query: string) => {
    setSearchTerm(query);
    setPage(1);
    setSearchResults([]);
    setHasMore(true);
  };

  const toggleFavorite = (user: GitHubUser) => {
    setFavoriteUsers((prevFavorites: GitHubUser[]) => {
      const isFavorite = prevFavorites.some(
        (favUser) => favUser.id === user.id
      );
      if (isFavorite) {
        return prevFavorites.filter((favUser) => favUser.id !== user.id);
      } else {
        return [...prevFavorites, user];
      }
    });
  };

  useEffect(() => {
    localStorage.setItem("favoriteUsersList", JSON.stringify(favoriteUsers));
  }, [favoriteUsers]);

  return (
    <div className="App">
      <header className="App-header">
        <SearchBar
          onSearch={handleSearch}
          setIsLoading={setIsLoading}
          setError={setError}
        />
      </header>
      <main className="App-main">
        <Routes>
          <Route
            path="/"
            element={
              <>
                {error && <div className="no-results">{error}</div>}
                {!error && searchResults.length === 0 && !isLoading && (
                  <div className="no-results">No search results...</div>
                )}
                <ul>
                  {searchResults.map((user, index) => (
                    <li
                      ref={
                        index === searchResults.length - 1
                          ? lastUserElementRef
                          : undefined
                      }
                      key={user.id}
                    >
                      <SearchResultUser
                        toggleFavorite={toggleFavorite}
                        favoriteUsers={favoriteUsers}
                        user={user}
                      />
                    </li>
                  ))}
                </ul>
                {isLoading && (
                  <div className="no-results">Loading more users...</div>
                )}
              </>
            }
          />
          <Route
            path="/favorites"
            element={
              <>
                {favoriteUsers.length === 0 ? (
                  <div className="no-results">You have no favorites :(</div>
                ) : (
                  <ul>
                    {favoriteUsers.map((user) => (
                      <li key={user.id}>
                        <SearchResultUser
                          toggleFavorite={toggleFavorite}
                          favoriteUsers={favoriteUsers}
                          user={user}
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </>
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
