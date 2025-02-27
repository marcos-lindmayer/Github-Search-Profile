import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StarIcon from "./StarIcon";
import { GitHubUser } from "./types";

interface UserDetailsProps {
  favoriteUsers: GitHubUser[];
  toggleFavorite: (user: GitHubUser) => void;
}

const UserDetails: React.FC<UserDetailsProps> = ({
  favoriteUsers,
  toggleFavorite,
}) => {
  const { username } = useParams<{ username: string }>();
  const [detailUser, setUser] = useState<GitHubUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `https://api.github.com/users/${username}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, [username]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!detailUser) {
    return <div>User not found</div>;
  }

  const isFavorite = favoriteUsers.some(
    (favUser) => favUser.id === detailUser.id
  );

  return (
    <div className="user-card">
      <img
        src={detailUser.avatar_url}
        alt={`${detailUser.login}'s avatar`}
        className="user-avatar"
      />
      <div className="user-details">
        <h1>{detailUser.name || detailUser.login}</h1>
        <a
          href={detailUser.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="username"
        >
          @{detailUser.login}
        </a>

        {detailUser.bio && <p className="bio">{detailUser.bio}</p>}

        <div className="stats">
          <div>
            <span className="users-count">{detailUser.followers}</span>{" "}
            <span>Followers</span>
          </div>
          <div>
            <span className="users-count">{detailUser.following}</span>{" "}
            <span>Following</span>
          </div>
          <div>
            <span className="users-count">{detailUser.public_repos}</span>{" "}
            <span>Repos</span>
          </div>
        </div>
      </div>

      <button
        className="fav-button"
        onClick={() => toggleFavorite(detailUser)}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <StarIcon filled={isFavorite} />
      </button>
    </div>
  );
};

export default UserDetails;
