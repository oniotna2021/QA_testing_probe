import { useEffect, useState } from "react";

// services
import { searchElastic } from "services/_elastic";

// hooks
import useDebounce from "hooks/useDebounce";

export const useSearchElasticProducts = () => {
  const [term, setTerm] = useState("");
  const debouncedFilter = useDebounce(term, 500);
  const [options, setOptions] = useState([]);
  const [searchLoader, setIsLoading] = useState(false);

  const setFilterValue = (value) => {
    setOptions([]);
    setIsLoading(true);
    if (value) {
      searchElastic("products", {
        query: {
          bool: {
            must: [
              {
                fuzzy: {
                  name: {
                    value: value,
                    fuzziness: "3",
                  },
                },
              },
            ],
          },
        },
      })
        .then(({ data }) => {
          setIsLoading(false);
          if (data && data.data) {
            setOptions(data.data.hits.hits);
          } else {
            setOptions([]);
          }
        })
        .catch((err) => {
          setIsLoading(false);
          setOptions([]);
        });
    } else {
      setIsLoading(false);
      setOptions([]);
    }
  };

  useEffect(() => {
    if (debouncedFilter) {
      setFilterValue(debouncedFilter);
    }
  }, [debouncedFilter]);

  return [setTerm, options, searchLoader];
};
