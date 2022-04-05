import React, { useEffect, useState } from "react";

// UI
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import { IconArrowRightMin } from "assets/icons/customize/config";
import IconButton from "@material-ui/core/IconButton";
import { useTheme } from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";

// styles
import { useStyles } from "utils/useStyles";

// services
import { getCategoryById } from "services/GeneralConfig/Categories";
import { getCommpanyByuuid } from "services/GeneralConfig/Company";

const PriceCard = ({ productInfo, setAddPriceModal, item }) => {
  const [currentCategory, setCurrentCategory] = useState("");
  const [currentCompany, setCurrentCompany] = useState("");

  const classes = useStyles();
  const theme = useTheme();

  useEffect(() => {
    getCommpanyByuuid(item.company).then(({ data }) =>
      setCurrentCompany(data.data.name)
    );
    getCategoryById(item.category_id).then(({ data }) =>
      setCurrentCategory(data.data)
    );
  }, []);

  return (
    <Card
      onClick={() => setAddPriceModal(true)}
      className={classes.cardRecipes}
    >
      <Typography variant="p">{productInfo.name}</Typography>

      {!currentCategory.name ? (
        <Skeleton animation="wave" height={50} width={150} />
      ) : (
        <div
          className={classes.defaultBoxCenteredContainer}
          style={{ width: 200 }}
        >
          <Typography variant="p">
            <strong>{currentCategory?.name}</strong>
          </Typography>
        </div>
      )}

      {!currentCompany ? (
        <Skeleton animation="wave" height={50} width={150} />
      ) : (
        <div className={classes.defaultBoxCenteredContainer}>
          <Typography variant="p">
            <strong>{currentCompany}</strong>
          </Typography>
        </div>
      )}

      <IconButton className={classes.iconButtonArrow}>
        <IconArrowRightMin color={theme.palette.black.main}></IconArrowRightMin>
      </IconButton>
    </Card>
  );
};

export default PriceCard;
