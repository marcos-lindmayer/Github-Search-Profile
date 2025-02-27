import { useCallback, useState } from "react";
import { GitHubUser } from "../types";

const useFavorites = () => {
  const [favoriteUsers, setFavoriteUsers] = useState<GitHubUser[]>(() => {
    const storedFavorites = localStorage.getItem("favoriteUsersList");
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  });

  const toggleFavorite = useCallback((user: GitHubUser) => {
    setFavoriteUsers((prevFavorites: GitHubUser[]) => {
      const isFavorite = prevFavorites.some(
        (favUser) => favUser.id === user.id
      );
      const newFavorites = isFavorite
        ? prevFavorites.filter((favUser) => favUser.id !== user.id)
        : [...prevFavorites, user];

      localStorage.setItem("favoriteUsersList", JSON.stringify(newFavorites));
      return newFavorites;
    });
  }, []);

  return { favoriteUsers, toggleFavorite };
};

export default useFavorites;
