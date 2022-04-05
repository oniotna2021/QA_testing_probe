import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

//components
import PaternItemRecipe from "./PaternItemRecipe";
import Loading from "components/Shared/Loading/Loading";

//UI
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Pagination from "@material-ui/lab/Pagination";

//services
import { searchElastic } from "services/_elastic";

//custom hooks
import useDebounce from "hooks/useDebounce";
import usePagination from "hooks/usePagination";

// HOCS
import ActionWithPermission from "hocs/ActionWithPermission";

//utils
import { useStyles } from "utils/useStyles";

const ListRecipes = ({ permissionsActions }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const [data, setData] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [load, setLoad] = useState(false);
  const [loadFetch, setLoadFetch] = useState(false);

  //Search
  const [term, setTerm] = useState("");
  const debouncedFilter = useDebounce(term, 500);

  const itemsPerPage = 10;
  const { currentPage, handleChangePage, pages, setPages } =
    usePagination(itemsPerPage);

  useEffect(() => {
    setLoadFetch(true);

    setTimeout(() => {
      let queryMatch = [
        {
          multi_match: {
            query: debouncedFilter,
            fields: "name",
            fuzziness: 4,
          },
        },
      ];

      searchElastic(
        "recipes",
        !debouncedFilter
          ? {
              from: (currentPage === 1 ? 0 : currentPage) * 10,
              size: itemsPerPage,
              query: {
                match_all: {},
              },
              sort: { id: "desc" },
            }
          : {
              from: (currentPage === 1 ? 0 : currentPage) * 10,
              size: itemsPerPage,
              query: {
                bool: {
                  must: queryMatch,
                },
              },
            }
      )
        .then(({ data }) => {
          if (data && data.data) {
            setPages(data.data.hits.total.value);
            setData(data.data.hits.hits.map((x) => x._source));
          } else {
            setData([]);
          }
          setLoadFetch(false);
        })
        .catch((err) => {
          setData([]);
          setLoadFetch(false);
        });
    }, 1000);
  }, [load, debouncedFilter, currentPage, setPages]);

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between">
        <Typography variant="h4">{t("Menu.Title.Recipes")}</Typography>
        <TextField
          style={{ width: 400 }}
          variant="outlined"
          onChange={({ target }) => setTerm(target.value)}
          value={term}
          label={t("Search.Placeholder")}
        />
      </div>
      <div className="row" style={{ margin: "40px 10px" }}>
        <ActionWithPermission isValid={permissionsActions.create}>
          <div className="col-12">
            <PaternItemRecipe
              title_no_data={t("Menu.Title.CreateRecipes")}
              defaultIsEdit={false}
              isEdit={false}
              expanded={expanded}
              setExpanded={setExpanded}
              key={"FormRecipe"}
              load={load}
              setLoad={setLoad}
            />
          </div>
        </ActionWithPermission>
        {loadFetch ? (
          <Loading />
        ) : (
          <div className="col-12 mt-3">
            {data &&
              data.map((recipe, idx) => (
                <PaternItemRecipe
                  data={recipe}
                  defaultIsEdit={true}
                  expanded={expanded}
                  setExpanded={setExpanded}
                  load={load}
                  setLoad={setLoad}
                  isDetail={true}
                  key={`recipe-${idx}`}
                  permissionsActions={permissionsActions}
                />
              ))}
          </div>
        )}
      </div>
      <div className="d-flex justify-content-end">
        <div className={classes.paginationStyle}>
          <Pagination
            shape="rounded"
            count={pages}
            page={currentPage}
            onChange={handleChangePage}
            size="large"
          />
        </div>
      </div>
    </div>
  );
};

export default ListRecipes;
