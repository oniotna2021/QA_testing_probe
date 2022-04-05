import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { connect } from "react-redux";
import Swal from "sweetalert2";

// UI
import Typography from "@material-ui/core/Typography";
import { TextField } from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";

// Components
import FormSessions from "components/Common/ModuleSession/ManageSession/ManageSession";
import { CommonComponentAccordion } from "components/Shared/Accordion/Accordion";
import Loading from "components/Shared/Loading/Loading";
import ItemContentResumeSession from "components/Common/ModuleSession/ItemContentResumeSession/ItemContentResumeSession";
import FilterSelectionOption from "components/Shared/FilterSelectionOption/FilterSelectionOption";

//UTILS
import { errorToast, mapErrors, dataSourceGetFieldSessions } from "utils/misc";
import { useStyles } from "utils/useStyles";

//Hooks
import useDebounce from "hooks/useDebounce";

//Service
import { searchElastic } from "services/_elastic";
import usePagination from "hooks/usePagination";

// Services
import {
  deleteSessions,
  getSessionsForDailyTraining,
  getSessionsForGoalsTraining,
} from "services/TrainingPlan/Sessions";

// HOCS
import ActionWithPermission from "hocs/ActionWithPermission";

export const ListSessions = ({ userId, permissionsActions }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [expanded, setExpanded] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [expandedCreate, setExpandedCreate] = useState(false);
  const [fecthData, setFetchData] = useState(false);
  const [fecthDataFilter, setFecthDataFilter] = useState(false);
  const [fecthReloadData, setFecthReloadData] = useState(false);
  const [data, setData] = useState([]);

  /**DATA FILTER */
  const [valueFilter, setValueFilter] = useState(2);
  const [valueFilterBrands, setValueFilterBrands] = useState("1");

  const optionsSelections = [
    {
      id: 1,
      name: "Sesiones diarias",
    },
    {
      id: 3,
      name: "Sesiones por objetivos",
    },
    {
      id: 2,
      name: "Todas las sesiones",
    },
  ];

  const optionsBrands = [
    {
      id: "1",
      name: "BODYTECH 100%",
    },
    {
      id: "2",
      name: "ATHLETIC 100%",
    },
    {
      id: "3",
      name: "BODYTECH - ATHLETIC 100%",
    },
    {
      id: "4",
      name: "ATHLETIC >= 80%",
    },
    {
      id: "5",
      name: "ATHLETIC <= 80%",
    },
  ];

  //Search
  const [term, setTerm] = useState("");
  const debouncedFilter = useDebounce(term, 500);

  const itemsPerPage = 10;
  const { currentPage, handleChangePage, pages, setPages } =
    usePagination(itemsPerPage);

  useEffect(() => {
    setIsEdit(false);
  }, [expanded]);

  useEffect(() => {
    if (valueFilter === 1) {
      setFetchData(true);
      getSessionsForDailyTraining().then(({ data }) => {
        setFetchData(false);
        if (data.data && data.data.length > 0) {
          setPages(0);
          setData(data.data);
        } else {
          setPages(0);
          setData([]);
        }
      });
    } else if (valueFilter === 3) {
      setFetchData(true);
      getSessionsForGoalsTraining().then(({ data }) => {
        setFetchData(false);
        if (data.data && data.data.length > 0) {
          setPages(0);
          setData(
            data.data.map((x) => {
              return {
                ...x,
                is_plan_by_goals: true,
              };
            })
          );
        } else {
          setPages(0);
          setData([]);
        }
      });
    } else {
      fetchDataApi();
    }
  }, [valueFilter, setPages]);

  useEffect(() => {
    fetchDataApi();
  }, [
    fecthReloadData,
    debouncedFilter,
    enqueueSnackbar,
    currentPage,
    setPages,
    valueFilterBrands,
  ]);

  const fetchDataApi = () => {
    if (!debouncedFilter) {
      setFetchData(true);
    }
    if (debouncedFilter) {
      setData([]);
      setFecthDataFilter(true);
    }
    searchElastic(
      "sessions",
      !debouncedFilter
        ? {
            from: currentPage * 10 - 10,
            size: itemsPerPage,
            query: {
              bool: {
                must: [
                  {
                    multi_match: {
                      query: 0,
                      fields: ["is_personalized"],
                    },
                  },
                  {
                    multi_match: {
                      query: 0,
                      fields: ["is_plan_by_goals"],
                    },
                  },
                  {
                    multi_match: {
                      query: 0,
                      fields: ["is_daily_training"],
                    },
                  },
                  {
                    multi_match: {
                      query: valueFilterBrands,
                      fields: ["brand_videos"],
                      operator: "or",
                    },
                  },
                ],
              },
            },
            sort: [{ id: "desc" }],
            _source: dataSourceGetFieldSessions,
          }
        : {
            from: currentPage * 10 - 10,
            size: itemsPerPage,
            query: {
              bool: {
                must: [
                  {
                    multi_match: {
                      query: debouncedFilter,
                      fields: ["name"],
                      fuzziness: "2",
                    },
                  },
                  {
                    multi_match: {
                      query: 0,
                      fields: ["is_personalized"],
                    },
                  },
                  {
                    multi_match: {
                      query: 0,
                      fields: ["is_plan_by_goals"],
                    },
                  },
                  {
                    multi_match: {
                      query: 0,
                      fields: ["is_daily_training"],
                    },
                  },
                  {
                    multi_match: {
                      query: valueFilterBrands,
                      fields: ["brand_videos"],
                      operator: "or",
                    },
                  },
                ],
              },
            },
            _source: dataSourceGetFieldSessions,
          }
    )
      .then(({ data }) => {
        setFetchData(false);
        setFecthDataFilter(false);
        if (data.data) {
          setPages(data.data.hits.total.value);
          setData(data.data.hits.hits.map((x) => x._source));
        } else {
          setPages(0);
          setData([]);
        }
      })
      .catch((err) => {
        setFetchData(false);
        setFecthDataFilter(false);
        setPages(0);
        setData([]);
      });
  };

  const onDeleteSelection = (defaultValue) => {
    Swal.fire({
      title: "¿Estas seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "¡Sí, bórralo!",
    })
      .then((result) => {
        if (result.isConfirmed) {
          setFecthReloadData(false);
          deleteSessions(defaultValue.uuid)
            .then(({ data }) => {
              Swal.fire(
                data.status === "error" ? "Ups" : "¡Eliminado!",
                data.status === "error"
                  ? data.message[0].message
                  : data.message,
                data.status === "error" ? "error" : "success"
              );
              if (data.status !== "error") {
                setFecthReloadData(true);
              } else {
                enqueueSnackbar(mapErrors(data.data?.message), errorToast);
              }
            })
            .catch((err) => {
              enqueueSnackbar(mapErrors(err), errorToast);
            });
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });
  };

  return (
    <div className="container">
      {fecthData ? (
        <Loading />
      ) : (
        <div className="row gx-3">
          <div className="col">
            <div className="row">
              <Typography variant="h4" style={{ marginBottom: 10 }}>
                {t("Session.Title")}
              </Typography>
              <div className="col-4">
                <FilterSelectionOption
                  value={valueFilterBrands}
                  handleChange={(e) => setValueFilterBrands(e.target.value)}
                  options={optionsBrands}
                />
              </div>

              <div className="col-4">
                <FilterSelectionOption
                  value={valueFilter}
                  handleChange={(e) => setValueFilter(e.target.value)}
                  options={optionsSelections}
                />
              </div>

              <div className="col-4">
                <TextField
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={({ target }) => setTerm(target.value)}
                  value={term}
                  label={t("Search.Placeholder")}
                />
              </div>
            </div>
            <div className="row mt-4">
              <div className="col">
                <ActionWithPermission isValid={permissionsActions.create}>
                  <div className="row mt-3">
                    <div className="col">
                      <CommonComponentAccordion
                        color="primary"
                        expanded={expandedCreate}
                        setExpanded={setExpandedCreate}
                        title_no_data={t("Session.create")}
                        form={
                          <FormSessions
                            type="Nuevo"
                            setExpanded={setExpandedCreate}
                          />
                        }
                      />
                    </div>
                  </div>
                </ActionWithPermission>

                {fecthDataFilter && <Loading />}

                {!expandedCreate && (
                  <div className="row mt-3">
                    <div className="col">
                      {data.map((row) => (
                        <CommonComponentAccordion
                          expanded={expanded}
                          setExpanded={setExpanded}
                          key={`${row.id}`}
                          data={row}
                          isSession={true}
                          onDelete={() => onDeleteSelection(row)}
                          permissionsActions={permissionsActions}
                          form={
                            expanded === "panel" + row.id && isEdit ? (
                              <FormSessions
                                type="Nuevo"
                                defaultValue={row}
                                setExpanded={setExpandedCreate}
                              />
                            ) : (
                              <ItemContentResumeSession
                                isDetailPlan={false}
                                setIsEdit={setIsEdit}
                                isDetailAffiliate={false}
                                expanded={expanded}
                                isNoTitle={true}
                                infoResumeSession={row}
                                permissionsActions={permissionsActions}
                              />
                            )
                          }
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {!expandedCreate && !fecthDataFilter && pages > 0 && (
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
          )}
        </div>
      )}
    </div>
  );
};

const mapStateToProps = ({ auth }) => ({
  userId: auth.userId,
});

export default connect(mapStateToProps)(ListSessions);
