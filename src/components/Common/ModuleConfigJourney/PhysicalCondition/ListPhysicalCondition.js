import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";

// ui
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Pagination from "@material-ui/lab/Pagination";

// components
import { MessageView } from "components/Shared/MessageView/MessageView";
import { CommonComponentAccordion } from "components/Shared/Accordion/Accordion";
import Loading from "components/Shared/Loading/Loading";

// hooks
import usePagination from "hooks/usePagination";
import useSearchable from "hooks/useSearchable";

// srvices
import { getAllCondition } from "services/JourneyModule/PhysicalCondition";

// hocs
import ActionWithPermission from "hocs/ActionWithPermission";

// utils
import { errorToast, mapErrors } from "utils/misc";
import { useStyles } from "utils/useStyles";
import FromPhysicalCondition from "./FromPhysicalCondition";

export const ListPhysicalCondition = ({ permissionsActions }) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [fecthData, setFetchData] = useState(false);
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(false);

  //Search
  const [term, setTerm] = useState("");
  const searchableData = useSearchable(data, term, (l) => [l.name]);

  const itemsPerPage = 20;
  const { currentPage, handleChangePage, pages, setPages } =
    usePagination(itemsPerPage);

  useEffect(() => {
    setFetchData(true);
    getAllCondition()
      .then(({ data }) => {
        setFetchData(false);
        if (
          data &&
          data.status === "success" &&
          data.data &&
          data.data.length > 0
        ) {
          setPages(data.data);
          setData(data.data);
        } else {
          if (data.status === "error") {
            enqueueSnackbar(mapErrors(data), errorToast);
          }
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });
  }, [load, enqueueSnackbar, setPages, currentPage]);

  return (
    <div className="container">
      {fecthData ? (
        <Loading />
      ) : (
        <div className="row gx-3">
          <div className="col">
            <div className="row">
              <div className="col-8">
                <Typography variant="h4">
                  {t("ListPhysicalCOndition.title")}
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
                <ActionWithPermission isValid={permissionsActions.create}>
                  <div className="row mt-3">
                    <div className="col">
                      <CommonComponentAccordion
                        color="primary"
                        expanded={expanded}
                        setExpanded={setExpanded}
                        title_no_data={t("ListPhysicalCOndition.description")}
                        form={
                          <FromPhysicalCondition
                            type="Nuevo"
                            setExpanded={setExpanded}
                            load={load}
                            setLoad={setLoad}
                            permissionsActions={permissionsActions}
                          />
                        }
                      />
                    </div>
                  </div>
                </ActionWithPermission>

                {data.length === 0 ? (
                  <MessageView label={t("ListPermissions.NoData")} />
                ) : (
                  <div className="row mt-3">
                    <div className="col">
                      {searchableData.map((row) => (
                        <CommonComponentAccordion
                          expanded={expanded}
                          setExpanded={setExpanded}
                          key={`${row.id}`}
                          data={row}
                          form={
                            <FromPhysicalCondition
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
      )}

      <div className="d-flex justify-content-end">
        <div className={classes.paginationStyle}>
          <Pagination
            shape="rounded"
            count={pages}
            page={currentPage}
            onChange={(e, p) => {
              handleChangePage(e, p);
              setLoad(true);
            }}
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

export default connect(mapStateToProps)(ListPhysicalCondition);
