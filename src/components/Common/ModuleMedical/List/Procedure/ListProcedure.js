import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";

// UI
import Typography from "@material-ui/core/Typography";
import { TextField } from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";

// Components
import { FormProcedure } from "../../Manage/Procedure/FormProcedure";
import { MessageView } from "../../../../Shared/MessageView/MessageView";
import { CommonComponentAccordion } from "../../../../Shared/Accordion/Accordion";
import Loading from "components/Shared/Loading/Loading";

// hoc
import ActionWithPermission from "hocs/ActionWithPermission";

//IMPORTS
import { useSnackbar } from "notistack";

//UTILS
import { errorToast, mapErrors } from "utils/misc";

// Service
import { searchElastic } from "services/_elastic";

//debounce
import useDebounce from "hooks/useDebounce";

//custom hooks
import usePagination from "hooks/usePagination";

//utils
import { useStyles } from "utils/useStyles";

export const ListProcedure = ({ permissionsActions }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [expanded, setExpanded] = useState(false);
  const [fecthData, setFetchData] = useState(false);
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(false);

  //Search
  const [term, setTerm] = useState("");
  const debouncedFilter = useDebounce(term, 500);

  const itemsPerPage = 10;
  const { currentPage, handleChangePage, pages, setPages } =
    usePagination(itemsPerPage);

  useEffect(() => {
    setFetchData(true);
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
      "procedure",
      !debouncedFilter
        ? {
            from: (currentPage === 1 ? 0 : currentPage) * 10,
            size: itemsPerPage,
            query: {
              match_all: {},
            },
            //"sort":{"id":"desc"}
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
          setData(data.data.hits.hits.map((x) => x._source));
        } else {
          if (data.status === "error") {
            enqueueSnackbar(mapErrors(data.data), errorToast);
          }
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });
  }, [enqueueSnackbar, debouncedFilter, currentPage, setPages]);

  return (
    <div className="container">
      <div className="row gx-3">
        <div className="col">
          <div className="row">
            <div className="col-8">
              <Typography variant="h4">
                {t("ListProcedure.TitleProcedure")}
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

          <div className="row mt-4">
            <div className="col">
              <div className="row mt-3">
                <div className="col">
                  <ActionWithPermission isValid={permissionsActions.create}>
                    <CommonComponentAccordion
                      color="primary"
                      expanded={expanded}
                      setExpanded={setExpanded}
                      title_no_data={t("ListProcedure.CreateNewProcedure")}
                      form={
                        <FormProcedure
                          type="Nuevo"
                          setExpanded={setExpanded}
                          load={load}
                          setLoad={setLoad}
                          permissionsActions={permissionsActions}
                        />
                      }
                    />
                  </ActionWithPermission>
                </div>
              </div>
              {fecthData ? (
                <Loading />
              ) : data.length === 0 ? (
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
                        isElastic={true}
                        form={
                          <FormProcedure
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
          </div>
        </div>
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

const mapStateToProps = ({ auth }) => ({
  isLoggingIn: auth.isLoggingIn,
});

export default connect(mapStateToProps)(ListProcedure);
