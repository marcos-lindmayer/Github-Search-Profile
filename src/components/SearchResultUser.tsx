import { GitHubUser } from "../types";
import StarIcon from "../icons/StarIcon";
import { Link } from "react-router-dom";

interface SearchResultUserProps {
  user: GitHubUser;
  favoriteUsers: GitHubUser[];
  toggleFavorite: (user: GitHubUser) => void;
}

const SearchResultUser: React.FC<SearchResultUserProps> = ({
  user,
  favoriteUsers,
  toggleFavorite,
}) => {
  const isFavorite = favoriteUsers.some((favUser) => favUser.id === user.id);

  return (
    <div className="user-item">
      <Link to={`/user/${user.login}`} className="user-link">
        <img src={user.avatar_url} alt={`${user.login}'s avatar`} width="50" />
        <div className="username">@{user.login}</div>
      </Link>
      <button
        className="fav-button"
        onClick={() => toggleFavorite(user)}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <StarIcon filled={isFavorite} />
      </button>
    </div>
  );
};

export default SearchResultUser;
