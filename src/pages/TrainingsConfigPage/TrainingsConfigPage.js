import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useHistory } from "react-router-dom";

// UI
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Pagination from "@material-ui/lab/Pagination";

// Components
import Loading from "components/Shared/Loading/Loading";
import CardItemTraining from "components/Shared/CardItemTraining/CardItemTraining";

//Hooks
import useSearchable from "hooks/useSearchable";

// HOCS
import ActionWithPermission from "hocs/ActionWithPermission";

//Services
import { getTrainingsPlansForTrainer } from "services/TrainingPlan/TrainingPlanCrud";

//Routes
import { ConfigNameRoutes } from "router/constants";

// Utils
import { errorToast, mapErrors } from "utils/misc";
import { useStyles } from "utils/useStyles";
import usePagination from "hooks/usePagination";

export const TrainingsConfigPage = ({ userId, permissionsActions }) => {
  const history = useHistory();
  const classes = useStyles();

  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const [fecthData, setFetchData] = useState(false);
  const [data, setData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const itemsPerPage = 20;
  const { currentPage, handleChangePage, pages, setPages } =
    usePagination(itemsPerPage);

  //Search
  const [term, setTerm] = useState("");
  const searchableData = useSearchable(data, term, (l) => [l.name]);

  useEffect(() => {
    setFetchData(true);
    getTrainingsPlansForTrainer(userId, itemsPerPage, currentPage)
      .then(({ data }) => {
        setFetchData(false);
        if (data.data && data.data.items) {
          setPages(data.data.total_items);
          setData(data.data.items);
        }
      })
      .catch((err) => {
        setFetchData(false);
        enqueueSnackbar(mapErrors(err), errorToast);
      });
  }, [currentPage, userId, enqueueSnackbar]);

  const editingPlan = (item) => {
    history.push(
      ConfigNameRoutes.createTraining + ("?afiliateIdRoute=" + item.user_id)
    );
  };

  return (
    <div className="container">
      {fecthData ? (
        <Loading />
      ) : (
        <div className="row gx-3">
          <div className="row">
            <div className="row">
              <div className="col-8">
                <Typography variant="h4">{t("TrainingPlan.Title")}</Typography>
                <Typography variant="body2" style={{ marginTop: 5 }}>
                  {t("TrainingPlan.description")}
                </Typography>
              </div>

              <ActionWithPermission isValid={permissionsActions?.create}>
                <div className="col-4">
                  <Button
                    component={Link}
                    to={ConfigNameRoutes.createTraining}
                    fullWidth
                    variant="contained"
                    color="primary"
                  >
                    {t("TrainingPlan.btnTitleCreate")}
                  </Button>
                </div>
              </ActionWithPermission>
            </div>
          </div>

          <div className="row mt-3">
            <div className="col">
              {searchableData.map((row) => (
                <CardItemTraining
                  key={`${row.id}`}
                  title_2={`Días de sesiones: ${row.number_sessions}`}
                  title_1={`${row.first_name} ${row.last_name}`}
                  description={`Fecha de inicio: ${row.start_date}`}
                  action={
                    <ActionWithPermission isValid={permissionsActions?.edit}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => editingPlan(row)}
                      >
                        Editar
                      </Button>
                    </ActionWithPermission>
                  }
                  setIsOpen={setIsOpen}
                  isDetail={false}
                  dataPlan={row}
                  isList={true}
                  permissionsActions={permissionsActions}
                />
              ))}
            </div>
          </div>

          {searchableData && searchableData.length > 0 && (
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

export default connect(mapStateToProps)(TrainingsConfigPage);
