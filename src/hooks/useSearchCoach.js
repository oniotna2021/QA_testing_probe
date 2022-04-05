import { useEffect, useState } from "react";

// services
import { searchElastic } from "services/_elastic";

// hooks
import useDebounce from "hooks/useDebounce";

export const useSearchCoach = ({ typePlan, brandId }) => {
  const [term, setTerm] = useState("");
  const debouncedFilter = useDebounce(term, 500);
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState();

  //type User ID
  const [userId, setUserId] = useState(0);

  const handleChangeUserId = () => {
    setUserId(0);
    if (typePlan === "mycoach") {
      setUserId(29);
    } else {
      setUserId(30);
    }
  };

  useEffect(() => {
    searchAll();
  }, [debouncedFilter]);

  const searchAll = () => {
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
            {
              multi_match: {
                query: 1,
                fields: ["is_active"],
              },
            },
            {
              multi_match: {
                query:
                  typePlan === "mycoach"
                    ? 29
                    : typePlan === "nutricion"
                    ? 30
                    : "",
                fields: ["user_profiles_id"],
              },
            },
          ],
          // filter: {
          //   terms: {
          //     brands: [brandId]
          //   }
          // }
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
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    setIsLoading(true);
    handleChangeUserId();
    searchElastic("users_collaborator_all", {
      query: {
        bool: {
          must: [
            {
              multi_match: {
                query: 1,
                fields: ["is_active"],
              },
            },
            {
              multi_match: {
                query:
                  typePlan === "mycoach"
                    ? 29
                    : typePlan === "nutricion"
                    ? 30
                    : "",
                fields: ["user_profiles_id"],
              },
            },
          ],
          // filter: {
          //   terms: {
          //     brands: [brandId]
          //   }
          // }
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
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [userId]);

  return [setTerm, options, searchAll, isLoading];
};
