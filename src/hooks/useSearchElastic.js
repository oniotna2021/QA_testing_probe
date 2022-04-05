import { useEffect, useState } from "react";

// services
import { searchElastic } from "services/_elastic";

export const useSearchElastic = (indice, query, term) => {
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState();

  const searchStatic = () => {
    setIsLoading(true);
    searchElastic(indice, {
      query: {
        bool: query[0],
      },
    })
      .then(({ data }) => {
        if (data && data.data) {
          setOptions(data.data.hits.hits);
        } else {
          setOptions([]);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const searchTyping = () => {
    searchElastic(indice, {
      query: {
        bool: query[0],
      },
    })
      .then(({ data }) => {
        if (data && data.data) {
          setOptions(data.data.hits.hits);
        } else {
          setOptions([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (term) {
      searchTyping();
    } else {
      searchStatic();
    }
  }, [term]);

  return [options, isLoading];
};
