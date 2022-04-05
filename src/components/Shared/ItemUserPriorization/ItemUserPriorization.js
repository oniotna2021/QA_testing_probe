import React, { useState, useEffect } from "react";

//router
import { Link } from "react-router-dom";
import { useHistory } from "react-router";

// date-fns
import { format, addDays } from "date-fns";
import { es } from "date-fns/locale";

// ui
import Card from "@material-ui/core/Card";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";

//  components
import Loading from "../Loading/Loading";
import { ShardComponentModal } from "components/Shared/Modal/Modal";
import DetailTrainingPlanByAfiliate from "components/Common/ManageDetailAfiliate/DetailTrainingPlanByAfiliate";

// icons
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";

// utils
import { useStyles } from "utils/useStyles";

// services
import { getTrainingPlansByUser } from "services/affiliates";

const ItemUserPriorization = ({ data, loader }) => {
  const classes = useStyles();
  const [dataPlan, setDataPlan] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(0);
  const history = useHistory();

  useEffect(() => {
    if (selectedUserId !== 0) {
      getTrainingPlansByUser(selectedUserId).then(({ data }) => {
        if (data && data.data && data.status === "success") {
          setDataPlan(data.data[0]);
        }
      });
    }
  }, [selectedUserId]);

  useEffect(() => {
    if (Object.keys(dataPlan).length !== 0 && selectedUserId !== 0) {
      setIsOpen(true);
    }
  }, [dataPlan]);

  const handleClickPendingPlan = (documentNumber) => {
    history.push(`/create-plan-training-for-afiliate/${documentNumber}`);
  };

  return (
    <>
      <div
        className="d-flex justify-content-between align-items-center"
        style={{ padding: "0 25px", marginBottom: 10 }}
      >
        <div style={{ width: 305 }}>
          <IconButton
            className={classes.iconButton}
            edge="end"
            aria-label="add"
          >
            <KeyboardArrowDownIcon />
          </IconButton>
        </div>
        <Typography
          style={{ width: 150, fontWeight: "bold" }}
          variant="body1"
        ></Typography>
        <Typography style={{ width: 150, fontWeight: "bold" }} variant="body1">
          Inscripción
        </Typography>
        <Typography style={{ width: 150, fontWeight: "bold" }} variant="body1">
          P.E.
        </Typography>
        <Typography
          style={{ width: 50, fontWeight: "bold" }}
          variant="body1"
        ></Typography>
      </div>
      {loader ? (
        <Loading />
      ) : (
        <div>
          {data &&
            data.length > 0 &&
            data.map((user) => (
              <Card
                key={`user_${user.id}`}
                style={{
                  borderRadius: 10,
                  background:
                    user.priorization === 1 &&
                    user.has_active_training_plan === false
                      ? "#F8EBEB"
                      : "white",
                  height: 60,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0 25px",
                  marginTop: 10,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "300px",
                  }}
                >
                  {user.priorization && (
                    <div
                      style={{
                        background:
                          user.priorization === 1
                            ? "#F2B2B9"
                            : user.priorization === 2
                            ? "#FAE162"
                            : "#BFF5DA",
                        borderRadius: 10,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 20,
                        width: 32,
                        height: 32,
                      }}
                    >
                      {`P${user.priorization}`}
                    </div>
                  )}
                  <Avatar style={{ marginRight: 20 }} />
                  <Typography variant="body1">
                    {user.first_name} {user.last_name}
                  </Typography>
                </div>
                <Typography style={{ width: 150 }} variant="body1"></Typography>
                <Typography style={{ width: 150 }} variant="body1">
                  {user.assignment_date &&
                    format(
                      addDays(new Date(user.assignment_date), 1),
                      "dd LLLL yyyy",
                      {
                        locale: es,
                      }
                    )}
                </Typography>
                <div style={{ width: 150 }}>
                  {user.has_active_training_plan ? (
                    <IconButton
                      style={{ fontSize: 15, borderRadius: "none" }}
                      onClick={() => setSelectedUserId(user.id)}
                    >
                      Ver plan
                    </IconButton>
                  ) : (
                    <IconButton
                      style={{ fontSize: 15, borderRadius: "none" }}
                      onClick={() =>
                        handleClickPendingPlan(user.document_number)
                      }
                    >
                      Pendiente
                    </IconButton>
                  )}
                </div>
                <Link
                  style={{ textDecoration: "none", marginLeft: 30 }}
                  to={`/detail-afiliate/${user.id}`}
                >
                  <IconButton
                    style={{ margin: 0 }}
                    className={classes.iconButton}
                    edge="end"
                    aria-label="add"
                  >
                    <ArrowForwardIosIcon style={{ fontSize: 15 }} />
                  </IconButton>
                </Link>
              </Card>
            ))}
        </div>
      )}
      <ShardComponentModal
        body={
          <DetailTrainingPlanByAfiliate
            dataPlan={dataPlan}
            setIsOpen={setIsOpen}
            isDetailAffiliate={true}
          />
        }
        isOpen={isOpen}
      />
    </>
  );
};

export default ItemUserPriorization;
