const useQuery = (key) => {
  const getQuery = () => {
    return new URLSearchParams(window.location.search);
  };

  const getQueryStringVal = (key) => {
    return getQuery().get(key);
  };

  return getQueryStringVal(key);
};

export default useQuery;
