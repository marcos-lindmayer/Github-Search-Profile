import { useCallback, useState } from "react";
import { GitHubUser } from "../types";

const useGithubSearch = () => {
  const [searchResults, setSearchResults] = useState<GitHubUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const searchUsers = useCallback(async (query: string, pageNum: number) => {
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

      setHasMore(data.items.length === resultsPerPage);
    } catch (err) {
      setError(
        err instanceof Error && err.message === "HTTP error! status: 403"
          ? "API rate limit exceeded. Please try again later."
          : err instanceof Error
          ? err.message
          : "An unexpected error occurred"
      );
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    searchResults,
    setIsLoading,
    isLoading,
    error,
    setError,
    page,
    hasMore,
    searchTerm,
    setPage,
    setSearchTerm,
    searchUsers,
  };
};

export default useGithubSearch;
