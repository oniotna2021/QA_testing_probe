import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

// UI
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

// components
import FormPromotion from "./FormPromotion";
import Loading from "components/Shared/Loading/Loading";
import { CommonComponentAccordion } from "components/Shared/Accordion/Accordion";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";

// services
import { getAllPromotions } from "services/Comercial/Promotions";

// utils
import { errorToast, mapErrors } from "utils/misc";

// styles
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  boxPromoName: {
    display: "flex",
    alignItems: "center",
    width: "500px",
    marginLeft: "15px",
  },
  boxPromoItem: {
    width: "85px",
    height: "35px",
    borderRadius: "10px",
    padding: "5px",
    background: theme.themeColorSoft,
    textAlign: "center",
  },
  boxempPrice: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  emptyPriceBox: {
    border: `1px solid ${theme.themeColor}`,
    color: theme.themeColor,
    borderRadius: 10,
    padding: 8,
    display: "flex",
    width: "185px",
    justifyContent: "center",
  },
}));

const ListPromotions = ({ mb = "mb-1", marginSize = 10 }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const classes = useStyles();

  const [expanded, setExpanded] = useState(false);
  const [expand, setExpand] = useState(false);
  const [dataPromotion, setDataPromotion] = useState([]);
  const [load, setLoad] = useState(false);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [isDetail, setIsDetail] = useState(true);
  useEffect(() => {
    setLoadingFetch(true);
    getAllPromotions()
      .then(({ data }) => {
        if (data.status === "success") {
          setDataPromotion(data.data.items);
        } else {
          enqueueSnackbar(mapErrors(data), errorToast);
        }
        setLoadingFetch(false);
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
        setLoadingFetch(false);
      });
  }, [enqueueSnackbar, load]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpand(isExpanded ? panel : false);
    setIsDetail(true);
  };

  return (
    <div className="container">
      {loadingFetch && dataPromotion?.length === 0 ? (
        <Loading />
      ) : (
        <>
          <Typography variant="h4">{t("Menu.Title.Promotions")}</Typography>
          <div className="row mt-3">
            <div className="col">
              <CommonComponentAccordion
                title_no_data={t("ListPromotions.CreateNewPromotion")}
                color="primary"
                expanded={expanded}
                setExpanded={setExpanded}
                form={
                  <FormPromotion
                    promo={""}
                    load={load}
                    setLoad={setLoad}
                    setExpanded={setExpanded}
                    dataPromotion={dataPromotion}
                  />
                }
              />
            </div>
          </div>
        </>
      )}
      {dataPromotion.map((promotion) => (
        <div key={`promotion-${promotion.uuid}`} className="row">
          <div className={mb} style={{ width: "100%", margin: marginSize }}>
            <Accordion
              key={`promotion-${promotion.uuid}`}
              expanded={expand === `promotion-${promotion.uuid}`}
              onChange={handleChange(`promotion-${promotion.uuid}`)}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <div className="d-flex align-items-center">
                  <div className={classes.boxPromoItem}>{promotion.id}</div>
                </div>
                <div className={classes.boxPromoName}>
                  <Typography variant="body1">{promotion.name}</Typography>
                </div>
                {promotion.has_grid ? (
                  ""
                ) : (
                  <div className={classes.boxempPrice}>
                    <Typography
                      variant="body1"
                      className={`${classes.emptyPriceBox}`}
                    >
                      {t("Promotions.NoGrid")}
                    </Typography>
                  </div>
                )}
              </AccordionSummary>
              <AccordionDetails>
                <div style={{ width: "100%" }}>
                  <FormPromotion
                    setLoad={setLoad}
                    load={load}
                    defaultValue={promotion}
                    setIsDetail={setIsDetail}
                    isDetail={isDetail}
                    setExpand={setExpand}
                    dataPromotion={dataPromotion}
                  />
                </div>
              </AccordionDetails>
            </Accordion>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListPromotions;
