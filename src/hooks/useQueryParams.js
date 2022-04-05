import { useState } from "react";

const getQuery = () => {
  return new URLSearchParams(window.location.search);
};

const getQueryStringVal = (key) => {
  return getQuery().get(key);
};

const useQueryParams = (key, defaultVal, history) => {
  const [query, setQuery] = useState(getQueryStringVal(key) || defaultVal);

  const updateUrl = (newVal) => {
    setQuery(newVal);

    const query = getQuery();

    if (newVal.trim() !== "") {
      query.set(key, newVal);
    } else {
      query.delete(key);
    }

    if (history) {
      history.replace({ search: query.toString() });
    }
  };

  return [query, updateUrl];
};

export default useQueryParams;
