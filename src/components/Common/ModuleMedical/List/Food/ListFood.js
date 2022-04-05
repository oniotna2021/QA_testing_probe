import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";

// UI
import Typography from "@material-ui/core/Typography";
import { TextField } from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";

// Components
import { FormFood } from "components/Common/ModuleMedical/Manage/Food/FormFood";
import { MessageView } from "components/Shared/MessageView/MessageView";
import { CommonComponentAccordion } from "components/Shared/Accordion/Accordion";
import Loading from "components/Shared/Loading/Loading";

//custom hooks
import useDebounce from "hooks/useDebounce";
import usePagination from "hooks/usePagination";

//IMPORTS
import { useSnackbar } from "notistack";

//UTILS
import { errorToast, mapErrors } from "utils/misc";
import { useStyles } from "utils/useStyles";

// HOCS
import ActionWithPermission from "hocs/ActionWithPermission";

// Service
import { searchElastic } from "services/_elastic";

export const ListFood = ({ permissionsActions }) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();

  const [expanded, setExpanded] = useState(false);
  const [fecthData, setFetchData] = useState(false);
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(false);

  //const searchableData = useSearchable(data, term, (l) => [l.name]);

  //Search
  const [term, setTerm] = useState("");
  const debouncedFilter = useDebounce(term, 500);

  const itemsPerPage = 10;
  const { currentPage, handleChangePage, pages, setPages } =
    usePagination(itemsPerPage);

  useEffect(() => {
    setFetchData(true);
    setTimeout(() => {
      let queryMatch = [
        {
          multi_match: {
            query: debouncedFilter,
            fields: ["name", "external_code"],
            fuzziness: 2,
          },
        },
      ];
      searchElastic(
        "food",
        !debouncedFilter
          ? {
              from: (currentPage === 1 ? 0 : currentPage) * 10,
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
          setFetchData(false);
          if (data && data.data) {
            setPages(data.data.hits.total.value);
            setData(data.data.hits.hits.map((x) => x._source).reverse());
          } else {
            if (data.status === "error") {
              enqueueSnackbar(mapErrors(data.data), errorToast);
            }
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        });
    }, 1000);
  }, [enqueueSnackbar, debouncedFilter, currentPage, setPages, load]);

  return (
    <div className="container">
      <div className="row gx-3">
        <div className="col">
          <div className="row">
            <div className="col-8">
              <Typography variant="h4">
                {t("ListFood.TitleListFood")}
              </Typography>
            </div>
            <div className="col d-flex justify-content-end">
              <TextField
                variant="outlined"
                onChange={({ target }) => setTerm(target.value)}
                value={term}
                label={t("Search.Placeholder")}
              />
            </div>
          </div>
          {fecthData ? (
            <Loading />
          ) : (
            <div className="row mt-4">
              <div className="col">
                <div className="row mt-3">
                  <ActionWithPermission isValid={permissionsActions.create}>
                    <div className="col">
                      <CommonComponentAccordion
                        color="primary"
                        expanded={expanded}
                        setExpanded={setExpanded}
                        title_no_data={t("ListFood.CreateNewListFood")}
                        form={
                          <FormFood
                            type="Nuevo"
                            setExpanded={setExpanded}
                            load={load}
                            setLoad={setLoad}
                          />
                        }
                      />
                    </div>
                  </ActionWithPermission>
                </div>
                {data.length === 0 ? (
                  <MessageView label={t("ListPermissions.NoData")} />
                ) : (
                  <div className="row mt-3">
                    <div className="col">
                      {data.map((row) => (
                        <CommonComponentAccordion
                          expanded={expanded}
                          setExpanded={setExpanded}
                          key={`${row.id}`}
                          data={row}
                          form={
                            <FormFood
                              type="Editar"
                              defaultValue={row}
                              setExpanded={setExpanded}
                              load={load}
                              setLoad={setLoad}
                              permissionsActions={permissionsActions}
                            />
                          }
                        />
                      ))}
                    </div>
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
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ auth }) => ({
  isLoggingIn: auth.isLoggingIn,
});

export default connect(mapStateToProps)(ListFood);
