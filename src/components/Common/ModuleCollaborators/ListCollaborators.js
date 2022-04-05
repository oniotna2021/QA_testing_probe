import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

// COMPONENTS
import { MessageView } from "components/Shared/MessageView/MessageView";
import TextField from "@material-ui/core/TextField";

// UI
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Pagination from "@material-ui/lab/Pagination";
import Avatar from "@material-ui/core/Avatar";
import { Skeleton } from "@material-ui/lab";

// Services
import { useGetEmployeesByVenue } from "hooks/CachedServices/employees";

// Hooks
import useSearchable from "hooks/useSearchable";
import usePagination from "hooks/usePagination";

// Utils
import { useStyles } from "utils/useStyles";

const ListCollaborators = ({ idVenue, userType }) => {
  const classes = useStyles();
  const history = useHistory();
  const { t } = useTranslation();
  const isRolTower = userType === 39 || userType === 37 ? true : false;

  const itemsPerPage = 10;
  const { currentPage, handleChangePage, pages, setPages } =
    usePagination(itemsPerPage);

  // swr
  const { swrData, isLoading, refreshData } = useGetEmployeesByVenue(
    idVenue,
    isRolTower
  );

  //Search
  const [term, setTerm] = useState("");
  const searchableData = useSearchable(swrData, term, (l) => [l.first_name]);

  const handleClickDetail = (user_id) => {
    history.push(`/collaborator/detail/${user_id}`);
  };

  return (
    <>
      <div className="container">
        <div className="row my-4">
          <div className="col-8">
            <Typography variant="h5">
              {t("Menu.Title.Collaborators")}
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
            {isLoading ? (
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
                      onClick={() => handleClickDetail(row.id)}
                      className={`row mt-3 ${classes.cardCollaboratorList}`}
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
                        <IconButton
                          color="default"
                          variant="outlined"
                          size="small"
                        >
                          {<ExpandMoreIcon />}
                        </IconButton>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}
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
              refreshData();
            }}
            size="large"
          />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ auth }) => ({
  idVenue: auth.venueIdDefaultProfile,
  userType: auth.userType,
});

export default connect(mapStateToProps)(ListCollaborators);
