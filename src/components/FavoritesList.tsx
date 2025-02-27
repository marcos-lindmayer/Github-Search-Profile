import { GitHubUser } from "../types";
import SearchResultUser from "./SearchResultUser";

interface FavoritesListProps {
  toggleFavorite: (user: GitHubUser) => void;
  favoriteUsers: GitHubUser[];
}

const FavoritesList: React.FC<FavoritesListProps> = ({
  toggleFavorite,
  favoriteUsers,
}) => (
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
);

export default FavoritesList;
