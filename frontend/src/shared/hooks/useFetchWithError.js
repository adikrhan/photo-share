const useFetchWithError = () => {
  const fetchWithError = async (url, options) => {
    const response = await fetch(url, options);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(`${result.message}`);
    }

    return result;
  };

  return fetchWithError;
};

export default useFetchWithError;
