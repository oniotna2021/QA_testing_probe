import { useState, useEffect } from "react";

import { searchElastic } from "services/_elastic";
import { customFieldsUser } from "utils/queryElasticCustomFields";

const useSearchUserById = (userId) => {
  const [loader, setLoader] = useState(false);
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    if (userId !== undefined && userId !== null) {
      setLoader(true);
      searchElastic("users_all", {
        query: {
          bool: {
            must: [
              {
                multi_match: {
                  query: userId,
                  fields: ["user_id"],
                },
              },
            ],
          },
        },
        _source: customFieldsUser,
      })
        .then(({ data }) => {
          if (data && data.data) {
            setUserInfo(data.data.hits.hits[0]._source);
          } else {
            setUserInfo([]);
          }
          setLoader(false);
        })
        .catch((err) => {
          setUserInfo([]);
          setLoader(false);
        });
    }
  }, [userId]);
  return [userInfo, loader];
};

export default useSearchUserById;
