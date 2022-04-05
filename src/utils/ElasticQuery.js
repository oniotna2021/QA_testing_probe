export const handleSearchCoachProfile = (value) => {
  const queryConsult = [];

  if (value) {
    queryConsult.push({
      must: [
        {
          multi_match: {
            query: value,
            fields: ["first_name", "last_name"],
            fuzziness: "4",
          },
        },
      ],
      filter: {
        terms: {
          user_profiles_id: ["29", "30"],
        },
      },
    });
  } else {
    queryConsult.push({
      filter: {
        terms: {
          user_profiles_id: ["29", "30"],
        },
      },
    });
  }
  return queryConsult;
};
