import React, { useState, useEffect } from "react";

//hooks
import { useTranslation } from "react-i18next";

//UI
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import Skeleton from "@material-ui/lab/Skeleton";

//components
import ItemUserWithoutPlan from "./ItemUserWithoutPlan";

//utils
import { useStyles } from "utils/useStyles";

//services
import { getNewAfiliatesWithoutPlan } from "services/affiliates";

const ListUsersWithoutPlan = ({ venueIdDefaultProfile, reload, setReload }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const [dataAfiliates, setDataAfiliates] = useState([]);
  const [loadData, setLoadData] = useState(false);

  useEffect(() => {
    setLoadData(true);
    getNewAfiliatesWithoutPlan(venueIdDefaultProfile).then(({ data }) => {
      if (data && data.data && data.status === "success") {
        setDataAfiliates(data.data);
      } else {
        setDataAfiliates([]);
      }
      setLoadData(false);
    });
  }, [venueIdDefaultProfile, reload]);

  return (
    <Card
      className={`p-3 ${classes.cardScrollable}`}
      style={{ borderRadius: 20 }}
    >
      <div className="row m-0">
        <Typography
          style={{ fontWeight: "bold", marginBottom: 20, marginTop: 10 }}
        >
          {t("HomeTrainingPlans.UsersWithoutPlan")}
        </Typography>
      </div>
      {loadData ? (
        <>
          <Skeleton animation="wave" width="100%" height={50} />
          <Skeleton animation="wave" width="100%" height={50} />
          <Skeleton animation="wave" width="100%" height={50} />
          <Skeleton animation="wave" width="100%" height={50} />
        </>
      ) : (
        <>
          {dataAfiliates &&
            dataAfiliates.map((item) => (
              <ItemUserWithoutPlan
                key={item.id}
                isDanger={item.trainer !== null ? true : false}
                dataUser={item}
                reload={reload}
                setReload={setReload} 
              />
            ))}
        </>
      )}
    </Card>
  );
};

export default ListUsersWithoutPlan;
