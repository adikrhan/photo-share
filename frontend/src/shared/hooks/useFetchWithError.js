const useFetchWithError = () => {
  const fetchWithError = async (url, options) => {
    const response = await fetch(url, options);

    let errorMessage = "";
    if (response.status === 200) {
      const result = await response.json();
      if (result.error) {
        throw new Error(result.error);
      }

      return result;
    }

    throw new Error(`Error ${response.status}: ${response.statusText}`);
  };

  return fetchWithError;
};

export default useFetchWithError;