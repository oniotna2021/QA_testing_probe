import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";

// UI
import Typography from "@material-ui/core/Typography";
import { TextField } from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";

// Components
import { FormChannel } from "./FormChannel";
import { MessageView } from "components/Shared/MessageView/MessageView";
import { CommonComponentAccordion } from "components/Shared/Accordion/Accordion";
import Loading from "components/Shared/Loading/Loading";

//Hooks
import useSearchable from "hooks/useSearchable";
import usePagination from "hooks/usePagination";

//IMPORTS
import { useSnackbar } from "notistack";

//UTILS
import { errorToast, mapErrors } from "utils/misc";
import { useStyles } from "utils/useStyles";

// Service
import { getPaginateChanels } from "services/Tickets/chanel";

export const ListChannel = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const classes = useStyles();

  const [expanded, setExpanded] = useState(false);
  const [fecthData, setFetchData] = useState(false);
  const [load, setLoad] = useState(false);
  const [data, setData] = useState([]);

  // Pagination
  const itemsPerPage = 30;
  const { currentPage, handleChangePage, pages, setPages } =
    usePagination(itemsPerPage);

  //Search
  const [term, setTerm] = useState("");
  const searchableData = useSearchable(data, term, (l) => [l.label]);

  useEffect(() => {
    setFetchData(true);
    getPaginateChanels(currentPage, itemsPerPage)
      .then(({ data }) => {
        setFetchData(false);
        if (
          data &&
          data.status === "success" &&
          data.data &&
          data.data.items.length > 0
        ) {
          setPages(data.data.total_items);
          setData(data.data.items);
        } else {
          enqueueSnackbar(mapErrors(data.data?.message), errorToast);
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });
  }, [currentPage, enqueueSnackbar, load, setPages]);

  return (
    <div className="container">
      <div className="row gx-3">
        <div className="col">
          <div className="row">
            <div className="col-8">
              <Typography variant="h4">Fuentes</Typography>
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
                  <CommonComponentAccordion
                    color="primary"
                    expanded={expanded}
                    setExpanded={setExpanded}
                    title_no_data="Crear nueva fuente"
                    form={
                      <FormChannel
                        load={load}
                        setLoad={setLoad}
                        type="Nuevo"
                        setExpanded={setExpanded}
                      />
                    }
                  />
                </div>
              </div>
              {fecthData ? (
                <Loading />
              ) : (
                <>
                  {data.length === 0 ? (
                    <MessageView label={t("ListPermissions.NoData")} />
                  ) : (
                    <div className="row mt-3">
                      <div className="col">
                        {searchableData.map((row) => (
                          <CommonComponentAccordion
                            expanded={expanded}
                            setExpanded={setExpanded}
                            key={`panel-${row.uuid}`}
                            data={row}
                            form={
                              <FormChannel
                                load={load}
                                setLoad={setLoad}
                                type="Editar"
                                defaultValue={row}
                                setExpanded={setExpanded}
                              />
                            }
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </>
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

export default connect(mapStateToProps)(ListChannel);
