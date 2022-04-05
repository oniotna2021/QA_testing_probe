import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

//UI
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Pagination from "@material-ui/lab/Pagination";

//COMPONENTS
import AccordionNutrition from "./AccordionNutrition";
import FormFirstStepNutritionTemplate from "./FormFirstStepNutritionTemplate";
import DetailNutritionTemplate from "./DetailNutritionTemplate";
import Loading from "components/Shared/Loading/Loading";

//services
import { searchElastic } from "services/_elastic";

// HOCS
import ActionWithPermission from "hocs/ActionWithPermission";

//custom hooks
import useDebounce from "hooks/useDebounce";
import usePagination from "hooks/usePagination";

//utils
import { useStyles } from "utils/useStyles";

const ListNutritionTemplates = ({ permissionsActions }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [data, setData] = useState([]);
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
            fuzziness: 2,
          },
        },
      ];

      searchElastic(
        "nutritional_plan",
        !debouncedFilter
          ? {
              from: (currentPage === 1 ? 0 : currentPage) * 5,
              size: itemsPerPage,
              query: {
                match_all: {},
              },
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
  }, [debouncedFilter, currentPage, setPages]);

  return (
    <div className="container">
      <div className="d-flex justify-content-between">
        <Typography variant="h4">{t("Menu.Title.Nutrition")}</Typography>
        <TextField
          style={{ width: 400 }}
          variant="outlined"
          onChange={({ target }) => setTerm(target.value)}
          value={term}
          label={t("Search.Placeholder")}
        />
      </div>
      <div className="row m-0 mt-3">
        <ActionWithPermission isValid={permissionsActions.create}>
          <AccordionNutrition
            key={"Accordion-form"}
            data={""}
            isDetail={false}
            expanded={expanded}
            setExpanded={setExpanded}
            setIsEdit={setIsEdit}
            title_no_data={t("ModuleNutrition.CreatePlan")}
            content={<FormFirstStepNutritionTemplate />}
          />
        </ActionWithPermission>
        {loadFetch ? (
          <Loading />
        ) : (
          data &&
          data.map((item, idx) => (
            <AccordionNutrition
              key={`item-${idx}`}
              data={item}
              isDetail={true}
              expanded={expanded}
              setExpanded={setExpanded}
              setIsEdit={setIsEdit}
              content={
                <DetailNutritionTemplate
                  setIsEdit={setIsEdit}
                  isEdit={isEdit}
                  data={item}
                  permissionsActions={permissionsActions}
                />
              }
            />
          ))
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

export default ListNutritionTemplates;
