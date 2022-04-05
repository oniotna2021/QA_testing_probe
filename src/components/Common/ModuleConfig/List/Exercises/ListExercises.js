import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";

// Components
import { FormExercises } from "components/Common/ModuleConfig/Manage/Exercises/FormExercises";
import { MessageView } from "components/Shared/MessageView/MessageView";
import { ShardComponentModal } from "components/Shared/Modal/Modal";
import VideoPlayer from "components/Shared/VideoPlayer/VideoPlayer";
import Loading from "components/Shared/Loading/Loading";
import DetailExercises from "./DetailExercises";
import { CommonComponentAccordion } from "components/Shared/Accordion/Accordion";
import FilterSelectionOption from "components/Shared/FilterSelectionOption/FilterSelectionOption";

// UI
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Pagination from "@material-ui/lab/Pagination";

//Imports
import { useSnackbar } from "notistack";

// Hooks
import useDebounce from "hooks/useDebounce";
import usePagination from "hooks/usePagination";

//Service
import { searchElastic } from "services/_elastic";

// HOCS
import ActionWithPermission from "hocs/ActionWithPermission";

//Utils
import { errorToast, mapErrors } from "utils/misc";
import { useStyles } from "utils/useStyles";

export const ListExercises = ({ userId, userType, permissionsActions }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [state, setState] = useState(false);
  const [typeForm, setTypeForm] = useState("");
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState();
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [expandedCreate, setExpandedCreate] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [openPlayer, setOpenPlayer] = useState(false);
  const [infoExerciceDetail, setInfoExerciceDetail] = useState({});

  //Search
  const [term, setTerm] = useState("");
  const debouncedFilter = useDebounce(term, 500);

  const itemsPerPage = 10;
  const { currentPage, handleChangePage, pages, setPages } =
    usePagination(itemsPerPage);

  /**DATA FILTER */
  const [valueFilter, setValueFilter] = useState(3);
  const [valueFilterBrand, setValueFilterBrand] = useState("1");

  const optionsSelections = [
    {
      id: 2,
      name: "Pendientes por aprobar",
    },
    {
      id: 1,
      name: "Aprobados",
    },
    {
      id: 3,
      name: "Todos los ejercicios",
    },
  ];

  const optionsBrands = [
    {
      id: "1",
      name: "BODYTECH",
    },
    {
      id: "2",
      name: "ATHLETIC",
    },
    {
      id: "3",
      name: "BODYTECH - ATHLETIC",
    },
  ];

  useEffect(() => {
    setLoading(true);
    let fieldsQuery = [
      {
        multi_match: {
          query: debouncedFilter,
          fields: ["name"],
          fuzziness: "2",
        },
      },
    ];

    if (valueFilter && valueFilter !== 3 && debouncedFilter) {
      fieldsQuery = [
        {
          multi_match: {
            query: debouncedFilter,
            fields: ["name"],
            fuzziness: "2",
          },
        },
        {
          multi_match: {
            query: valueFilter,
            fields: "status",
          },
        },
        {
          multi_match: {
            query: valueFilterBrand.toString(),
            fields: "brand_videos",
            operator: "or",
          },
        },
      ];
    } else if (
      valueFilter &&
      valueFilter !== 3 &&
      debouncedFilter &&
      valueFilterBrand &&
      valueFilterBrand === "2"
    ) {
      fieldsQuery = [
        {
          multi_match: {
            query: debouncedFilter,
            fields: ["name"],
            fuzziness: "2",
          },
        },
        {
          multi_match: {
            query: valueFilter,
            fields: "status",
          },
        },
        {
          multi_match: {
            query: valueFilterBrand.toString(),
            fields: "brand_videos",
          },
        },
        {
          multi_match: {
            query: "3",
            fields: "brand_videos",
          },
        },
      ];
    } else if (
      valueFilter &&
      valueFilter !== 3 &&
      !debouncedFilter &&
      valueFilterBrand &&
      valueFilterBrand === "2"
    ) {
      fieldsQuery = [
        {
          multi_match: {
            query: valueFilter,
            fields: "status",
          },
        },
        {
          multi_match: {
            query: valueFilterBrand.toString(),
            fields: "brand_videos",
          },
        },
        {
          multi_match: {
            query: "3",
            fields: "brand_videos",
          },
        },
      ];
    } else if (valueFilter && valueFilter !== 3 && !debouncedFilter) {
      fieldsQuery = [
        {
          multi_match: {
            query: valueFilter,
            fields: "status",
          },
        },
        {
          multi_match: {
            query: valueFilterBrand.toString(),
            fields: "brand_videos",
          },
        },
      ];
    }

    searchElastic(
      "exercises",
      !debouncedFilter && (!valueFilter || valueFilter === 3)
        ? {
            from: currentPage * 10 - 10,
            size: itemsPerPage,
            query: {
              match_all: {},
            },
            sort: [{ id: "desc" }],
          }
        : {
            from: currentPage * 10 - 10,
            size: itemsPerPage,
            query: {
              bool: {
                must: fieldsQuery,
              },
            },
          }
    )
      .then(({ data }) => {
        if (data.data) {
          setPages(data.data.hits.total.value);
          setData(data.data.hits.hits.map((x) => x._source));
        } else {
          setPages(0);
          setData([]);
        }
        setLoading(false);
        setReload(false);
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });
  }, [
    debouncedFilter,
    enqueueSnackbar,
    currentPage,
    reload,
    setPages,
    valueFilter,
    valueFilterBrand,
  ]);

  useEffect(() => {
    if (selected) {
      setState((state) => !state);
      setTypeForm("Editar");
    }
  }, [selected]);

  return (
    <div className="container">
      <ShardComponentModal
        title={infoExerciceDetail?.name}
        fullWidth={true}
        width={"sm"}
        handleClose={() => setOpenPlayer(false)}
        body={
          <VideoPlayer
            src={
              process.env.REACT_APP_VIDEOS_EXERCICES +
              "Verticales/" +
              infoExerciceDetail.video_url
            }
          />
        }
        isOpen={openPlayer}
      />

      <div className="row gx-3">
        <div className="col">
          <div className="row">
            <Typography className="mb-3" variant="h4">
              {t("ListExercises.Container")}
            </Typography>

            <div className="col-4">
              <FilterSelectionOption
                value={valueFilter}
                handleChange={(e) => setValueFilter(e.target.value)}
                options={optionsSelections}
              />
            </div>
            <div className="col-4">
              <FilterSelectionOption
                value={valueFilterBrand}
                handleChange={(e) => setValueFilterBrand(e.target.value)}
                options={optionsBrands}
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
                      expanded={expandedCreate}
                      setExpanded={setExpandedCreate}
                      title_no_data={t("ListExercises.Container.TitleNoData")}
                      form={
                        <FormExercises
                          userId={userId}
                          isOpen={state}
                          setState={setState}
                          type={typeForm}
                          defaultValue={selected}
                          reload={reload}
                          setReload={setReload}
                          setExpanded={setExpandedCreate}
                        />
                      }
                    />
                  </div>
                </div>
              </ActionWithPermission>

              {!expandedCreate && (
                <div className="row mt-3">
                  {loading ? (
                    <Loading />
                  ) : (
                    <div className="col">
                      {data.length === 0 ? (
                        <MessageView label={t("Message.EmptyDataRecords")} />
                      ) : (
                        <div className="col">
                          {data.map((row) => (
                            <CommonComponentAccordion
                              isExercise={true}
                              expanded={expanded}
                              setExpanded={setExpanded}
                              key={`${row.id}`}
                              data={row}
                              form={
                                <DetailExercises
                                  onViewVideo={() => {
                                    setInfoExerciceDetail(row);
                                    setOpenPlayer(true);
                                  }}
                                  data={row}
                                  userType={userType}
                                  setExpanded={setExpanded}
                                  reload={reload}
                                  setReload={setReload}
                                  permissionsActions={permissionsActions}
                                />
                              }
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {!expandedCreate && !loading && (
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
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ auth }) => ({
  userId: auth.userId,
  userType: auth.userType,
  isLoggingIn: auth.isLoggingIn,
});

export default connect(mapStateToProps)(ListExercises);
