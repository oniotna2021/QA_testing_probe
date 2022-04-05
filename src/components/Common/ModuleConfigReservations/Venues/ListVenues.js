import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { connect } from "react-redux";

// UI
import Typography from "@material-ui/core/Typography";
import { TextField } from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";

// HOCS
import ActionWithPermission from "hocs/ActionWithPermission";

// Components
import { MessageView } from "components/Shared/MessageView/MessageView";
import Loading from "components/Shared/Loading/Loading";
import ParentComponentVenue from "components/Common/ModuleConfigReservations/Venues/ParentComponentVenue";

// Service
import { getVenuesPagination } from "services/Reservations/venues";

//Hooks
import useDebounce from "hooks/useDebounce";
import usePagination from "hooks/usePagination";

//Utils
import { errorToast, mapErrors } from "utils/misc";
import { useStyles } from "utils/useStyles";

export const ListVenues = ({ brandId, permissionsActions }) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(true);

  //Search
  const [term, setTerm] = useState("");
  const debouncedSearchTerm = useDebounce(term, 500);

  const itemsPerPage = 10;
  const { currentPage, handleChangePage, pages, setPages } =
    usePagination(itemsPerPage);

  useEffect(() => {
    if (load) {
      getVenuesPagination(itemsPerPage, currentPage, debouncedSearchTerm)
        .then(({ data }) => {
          if (
            data &&
            data.status === "success" &&
            data.data &&
            data.data.items.length > 0
          ) {
            setPages(data.data.total_items);
            setData(data.data.items);
          } else {
            if (data.status === "error") {
              enqueueSnackbar(mapErrors(data.data), errorToast);
            }
          }
          setLoad(false);
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
          setLoad(false);
        });
    }
  }, [currentPage, load, enqueueSnackbar, setPages, debouncedSearchTerm]);

  useEffect(() => {
    setLoad(true);
  }, [debouncedSearchTerm, brandId]);

  return (
    <div className="container">
      {load && data.length === 0 ? (
        <Loading />
      ) : (
        <div className="row gx-3">
          <div className="col">
            <div className="row">
              <div className="col-8">
                <Typography variant="h4">
                  {t("ListVenues.Container")}
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
                      <ParentComponentVenue
                        defaultIsEdit={false}
                        expanded={expanded}
                        setExpanded={setExpanded}
                        title_no_data={t("ListVenues.CreateNewVenue")}
                        load={load}
                        setLoad={setLoad}
                        permissionsActions={permissionsActions}
                      />
                    </ActionWithPermission>
                  </div>
                </div>
                {data.length === 0 ? (
                  <MessageView label="No hay Datos" />
                ) : (
                  <div className="row mt-3">
                    <div className="col">
                      {data &&
                        data.map((row) => (
                          <ParentComponentVenue
                            defaultIsEdit={true}
                            key={`${row.id}`}
                            expanded={expanded}
                            setExpanded={setExpanded}
                            load={load}
                            setLoad={setLoad}
                            data={row}
                            idDetail={row.uuid}
                            isDetail={true}
                            permissionsActions={permissionsActions}
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
  brandId: auth.brandId,
});

export default connect(mapStateToProps)(ListVenues);
