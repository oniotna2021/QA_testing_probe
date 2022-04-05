import { useEffect, useState } from "react";

// services
import { searchElastic } from "services/_elastic";

// hooks
import useDebounce from "hooks/useDebounce";

export const useSearchElasticCollaboratorsNutrition = (value) => {
  const [term, setTerm] = useState("");
  const debouncedFilter = useDebounce(term, 500);
  const [options, setOptions] = useState([]);
  const [searchLoader, setIsLoading] = useState(false);
  const [searchAll, setSearchAll] = useState(false);
  const [defaultNutri, setDefaultNutri] = useState({});

  const searchElasticAll = () => {
    searchElastic("users_collaborator_all", {
      query: {
        bool: {
          must: [
            {
              multi_match: {
                query: debouncedFilter,
                fields: ["first_name", "last_name"],
                fuzziness: "4",
              },
            },
            { match: { user_profiles_id: 10 } },
          ],
        },
      },
    })
      .then(({ data }) => {
        if (data && data.data) {
          setOptions(data.data.hits.hits);
        } else {
          setOptions([]);
        }
      })
      .catch((err) => {});
  };

  useEffect(() => {
    setOptions([]);
    setSearchAll(true);

    searchElastic("users_collaborator_all", {
      query: {
        bool: {
          must: [
            {
              fuzzy: {
                id: {
                  value: value,
                  fuzziness: "3",
                },
              },
            },
            { match: { user_profiles_id: 10 } },
          ],
        },
      },
    })
      .then(({ data }) => {
        if (data && data.data) {
          setDefaultNutri(data.data.hits.hits[0]);
        } else {
          setDefaultNutri({});
        }
      })

      .catch((err) => {})
      .finally(() => {
        setSearchAll(false);
      });

    searchElastic("users_collaborator_all", {
      query: {
        bool: {
          must: [
            {
              fuzzy: {
                user_profiles_id: {
                  value: "10",
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
          setIsLoading(false);
          setOptions(data.data.hits.hits);
        } else {
          setOptions([]);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        setOptions([]);
      });
  }, [value]);

  return [
    setTerm,
    options,
    searchLoader,
    searchElasticAll,
    defaultNutri,
    searchAll,
  ];
};
