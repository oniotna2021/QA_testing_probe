import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import Swal from "sweetalert2";
import { addDays } from "date-fns";

// UI
import Typography from "@material-ui/core/Typography";
import Skeleton from "@material-ui/lab/Skeleton";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Pagination from "@material-ui/lab/Pagination";
import ClearIcon from "@material-ui/icons/Clear";
import TextField from "@material-ui/core/TextField";

// Components
import { MessageView } from "components/Shared/MessageView/MessageView";

// Services
import {
  getAffiliatesReservationById,
  deleteReservationByUser,
} from "services/Reservations/reservationUser";

// Hooks
import useSearchable from "hooks/useSearchable";
import usePagination from "hooks/usePagination";
import useQuery from "hooks/useQuery";

// Utils
import { useStyles } from "utils/useStyles";
import { errorToast, formatToHHMM, mapErrors } from "utils/misc";

const option = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

const DetailActivityReservation = () => {
  const classes = useStyles();

  const date = useQuery("date");
  const nameActivity = useQuery("nameActivity");
  const startTime = useQuery("startTime");
  const endTime = useQuery("endTime");

  const { activity_id } = useParams();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const [reload, setReload] = useState(true);
  const [loading, setLoading] = useState(false);
  const [dataUsers, setDataUsers] = useState([]);

  // Pagination
  const itemsPerPage = 30;
  const { currentPage, handleChangePage, pages, setPages } =
    usePagination(itemsPerPage);

  //Search
  const [term, setTerm] = useState("");
  const searchableData = useSearchable(dataUsers, term, (l) => [l.first_name]);

  const dateText = addDays(new Date(date), 1).toLocaleDateString(
    "es-ES",
    option
  );

  useEffect(() => {
    if (activity_id && reload) {
      setLoading(true);
      getAffiliatesReservationById(activity_id, currentPage, itemsPerPage)
        .then(({ data }) => {
          if (data.status === "success" && data.data) {
            setPages(data.data.total_items);
            setDataUsers(data.data.items);
          } else {
            if (data.status === "error") {
              enqueueSnackbar(mapErrors(data.data), errorToast);
            }
          }
          setLoading(false);
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        })
        .finally(() => {
          setReload(false);
        });
    }
  }, [enqueueSnackbar, currentPage, reload, activity_id, setPages]);

  const deleteReservation = (uuid) => {
    Swal.fire({
      title: t("Message.AreYouSureCancelReserve"),
      text: t("Message.DontRevertThis"),
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("Message.YesDeleteIt"),
    }).then((result) => {
      if (result.isConfirmed) {
        deleteReservationByUser(uuid)
          .then(({ data }) => {
            if (data.status === "error") {
              Swal.fire(t("Message.ErrorOcurred"), mapErrors(data), "error");
            } else {
              Swal.fire(
                t("Message.Eliminated"),
                t("Message.EliminatedSuccess"),
                "success"
              );
              setReload(true);
            }
          })
          .catch((err) => {
            Swal.fire(t("Message.ErrorOcurred"), mapErrors(err), "error");
          });
      }
    });
  };

  return (
    <>
      <div className="row mb-5">
        <div className="col-8 d-flex">
          <Typography variant="h4" className="mx-3">
            {t("ListLocation.Capacity")} - {nameActivity}
          </Typography>
          <Typography variant="p" className="mt-3">
            {dateText} - {formatToHHMM(startTime)} / {formatToHHMM(endTime)}
          </Typography>
          <div
            className="col d-flex justify-content-end"
            style={{ marginRight: "12px" }}
          ></div>
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

      <div>
        {loading ? (
          <div className="mt-4">
            <Skeleton animation="wave" width="100%" height={100} />
            <Skeleton animation="wave" width="100%" height={100} />
            <Skeleton animation="wave" width="100%" height={100} />
            <Skeleton animation="wave" width="100%" height={100} />
            <Skeleton animation="wave" width="100%" height={100} />
          </div>
        ) : (
          <>
            {searchableData.length === 0 ? (
              <MessageView label="No hay Datos" />
            ) : (
              searchableData &&
              searchableData.map((row) => (
                <div
                  className={`row mt-3 ${classes.cardCollaboratorList}`}
                  key={row.id}
                >
                  <div className="col-2 d-flex justify-content-center align-items-center">
                    <Avatar className="me-2" src={row.photo}></Avatar>
                  </div>

                  <div
                    className={
                      "col-4 d-flex justify-content-start align-items-center"
                    }
                  >
                    <Typography
                      className={`${classes.boldText}`}
                    >{`${row.first_name} ${row.last_name}`}</Typography>
                  </div>

                  <div className="col-4 d-flex justify-content-center align-items-center">
                    <Typography className={`${classes.boldText}`}>
                      {row?.profile_name}
                    </Typography>
                  </div>

                  <div className="col-2 d-flex justify-content-center align-items-center">
                    <IconButton color="default" variant="outlined" size="small">
                      {
                        <ClearIcon
                          onClick={() =>
                            deleteReservation(row.reservation_uuid)
                          }
                        />
                      }
                    </IconButton>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>

      <div className="d-flex justify-content-end">
        <div className={classes.paginationStyle}>
          <Pagination
            shape="rounded"
            count={pages}
            page={currentPage}
            onChange={(e, p) => {
              handleChangePage(e, p);
              setReload(true);
            }}
            size="large"
          />
        </div>
      </div>
    </>
  );
};

export default DetailActivityReservation;
