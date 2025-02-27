import { useCallback, useRef } from "react";
import { Link, useLocation, useMatch } from "react-router-dom";
import StarIcon from "../icons/StarIcon";
import ArrowIcon from "../icons/ArrowIcon";
import SearchIcon from "../icons/SearchIcon";

interface SearchBarProps {
  onSearch: (query: string) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const location = useLocation();
  const match = useMatch("/user/:username");
  const username = match?.params?.username;
  const isOnFavoritesPage = location.pathname === "/favorites";
  const isHomePage = location.pathname === "/";
  const isUserPage = location.pathname.startsWith("/user/");
  const debouncedSearch = useCallback(
    (searchTerm: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        onSearch(searchTerm);
      }, 300);
    },
    [onSearch]
  );

  return (
    <div className="search-container">
      {isHomePage ? (
        <div className="search-icon">
          <SearchIcon />
        </div>
      ) : (
        <Link to="/?searchTerm" className="home-link">
          <div className="back-icon">
            <ArrowIcon />
          </div>
        </Link>
      )}

      {isUserPage ? (
        <div className="username-display">{username}</div>
      ) : (
        <input
          type="text"
          placeholder="Search for GitHub users..."
          className="search-input"
          onChange={(e) => debouncedSearch(e.target.value)}
        />
      )}

      <Link to="/favorites" className="favorites-link">
        <StarIcon filled={isOnFavoritesPage} />
      </Link>
    </div>
  );
};

export default SearchBar;
