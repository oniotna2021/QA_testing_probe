import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

// UI
import { Typography } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

// services
import { searchElastic } from "services/_elastic";
import Loading from "../Loading/Loading";

const ElasticSearchAutocomplete = ({
  control,
  defaultValue,
  error,
  name,
  required,
  label,
  elasticIndex,
  setValue,
  multiple,
}) => {
  const { t } = useTranslation();
  const [options, setOptions] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchValue === "") {
      searchElastic(elasticIndex, {
        query: {
          match_all: {},
        },
        size: elasticIndex === 'pathological_history_all' ? 20 : 10
      }).then(({ data }) => {
        if (data && data.data) {
          setOptions(data.data.hits.hits.map((hit) => hit._source));
        } else {
          setOptions([]);
        }
      });
    } else {
      if (searchValue) {
        searchElastic(elasticIndex, {
          query: {
            bool: {
              must: [
                {
                  multi_match: {
                    query: searchValue,
                    fields: ["name"],
                    fuzziness: 5,
                  },
                },
              ],
            },
          },
        }).then(({ data }) => {
          if (data && data.data) {
            setOptions(data.data.hits.hits.map((hit) => hit._source));
          } else {
            setOptions([]);
          }
        });
      }
    }
    // eslint-disable-next-line
  }, [searchValue]);

  // defaultValue
  useEffect(() => {
    if (defaultValue) {
      setLoading(true);
      searchElastic(elasticIndex, {
        query: {
          bool: {
            must: [
              {
                multi_match: {
                  query: defaultValue,
                  fields: ["id"],
                },
              },
            ],
          },
        },
      })
        .then(({ data }) => {
          if (data && data.data) {
            if (!multiple) {
              setValue(name, data.data.hits.hits[0]?._source);
            } else {
              setValue(
                name,
                data.data.hits.hits.map((hit) => hit._source)
              );
            }
          }
        })
        .finally(() => setLoading(false));
    }
    // eslint-disable-next-line
  }, []);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Controller
          name={name}
          rules={{ required: required }}
          control={control}
          defaultValue={defaultValue}
          render={({ field: { onChange, value } }) => (
            <Autocomplete
              onChange={(_, data) => {
                if (data) {
                  onChange(data);
                }
              }}
              options={options || []}
              multiple={multiple}
              defaultValue={
                multiple ? (defaultValue ? defaultValue : []) : value
              }
              noOptionsText={t("ListPermissions.NoData")}
              getOptionLabel={(option) => option?.name}
              renderOption={(option) => (
                <React.Fragment>
                  <Typography variant="body2">{option?.name}</Typography>
                </React.Fragment>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={label}
                  error={error}
                  variant="outlined"
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              )}
            />
          )}
        />
      )}
    </>
  );
};

export default ElasticSearchAutocomplete;
