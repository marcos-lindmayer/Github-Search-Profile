import { GitHubUser } from "../types";
import SearchResultUser from "./SearchResultUser";

interface SearchResultsProps {
  error: string | null;
  searchResults: GitHubUser[];
  isLoading: boolean;
  lastUserElementRef: (node: HTMLLIElement) => void;
  toggleFavorite: (user: GitHubUser) => void;
  favoriteUsers: GitHubUser[];
}

const SearchResults: React.FC<SearchResultsProps> = ({
  error,
  searchResults,
  isLoading,
  lastUserElementRef,
  toggleFavorite,
  favoriteUsers,
}) => (
  <>
    {error && <div className="info-text">{error}</div>}
    {!error && searchResults.length === 0 && !isLoading && (
      <div className="info-text">No search results...</div>
    )}
    <ul>
      {searchResults.map((user, index) => (
        <li
          ref={
            index === searchResults.length - 1 ? lastUserElementRef : undefined
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
    {isLoading && <div className="info-text">Loading more users...</div>}
  </>
);

export default SearchResults;
