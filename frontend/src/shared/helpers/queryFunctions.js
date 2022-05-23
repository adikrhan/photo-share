import useFetchWithError from "../hooks/useFetchWithError";

const fetchWithError = useFetchWithError;

export const fetchPhotos = ({ signal, queryKey }) => {
  const { searchTerm } = queryKey;
  const searchString = searchTerm ? `search/${searchTerm}` : "";

  return fetchWithError(`http://localhost:3001/api/photos/${searchString}`, {
    signal,
  });
};
