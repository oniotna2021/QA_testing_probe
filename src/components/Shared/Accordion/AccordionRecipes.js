//UI
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import { Avatar } from "@material-ui/core";

//utils
import { useStyles } from "utils/useStyles";
import { casteMapNameArrayForString } from "utils/misc";

//test
import ImageTest from "assets/images/default/image-9.png";

const AccordionRecipes = ({
  data,
  expanded,
  setExpanded,
  isEdit,
  setIsEdit,
  content,
  title_no_data,
  onDelete,
  isDetail = false,
  color = "default",
}) => {
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    setIsEdit(false);
  };

  const classes = useStyles();

  return (
    <div className="mb-3">
      <Accordion
        TransitionProps={{ unmountOnExit: true }}
        key={`panel-${data?.id ? data?.id : ""}`}
        expanded={expanded === `panel-${data?.id ? data?.id : ""}`}
        onChange={handleChange(`panel-${data?.id ? data?.id : ""}`)}
      >
        <AccordionSummary
          style={{
            backgroundColor:
              !data && !isDetail
                ? "#F0F0F0"
                : expanded === `panel${data ? data.id : ""}`
                ? "#F4F4F4"
                : "",
            borderRadius: 8,
          }}
          expandIcon={
            !onDelete && (
              <IconButton color={color} variant="outlined" size="small">
                {data || isDetail ? <ExpandMoreIcon /> : <AddIcon />}
              </IconButton>
            )
          }
          id={`panel${data ? data.id : ""}`}
        >
          {!isDetail ? (
            title_no_data
          ) : (
            <div
              className="d-flex align-items-center"
              style={{ width: "100%", marginLeft: 50 }}
            >
              <div className="row gx-2">
                <div className="col-4 d-flex align-items-center">
                  <div className={classes.thumb}>
                    <div className={classes.thumbInner}>
                      <Avatar
                        src={data.urlImage || ImageTest}
                        className={classes.img}
                        alt="img"
                      />
                    </div>
                  </div>
                  <Typography
                    style={{ fontWeight: "bold", fontSize: 15, marginLeft: 40 }}
                  >
                    {data.name}
                  </Typography>
                </div>
                <div className="col-5 d-flex align-items-center flex-column">
                  <Typography
                    className={classes.fontObservation}
                  >{`Objetivo nutricional`}</Typography>
                  <Typography
                    style={{
                      width: 150,
                      textAlign: "center",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >{`${casteMapNameArrayForString(
                    data.nutrition_goals
                  )}`}</Typography>
                </div>
                <div className="col-2 d-flex align-items-center flex-column">
                  <Typography
                    className={classes.fontObservation}
                  >{`Tipo de alimentación`}</Typography>
                  <Typography
                    style={{
                      width: 150,
                      textAlign: "center",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >{`${
                    data.type_alimentations_id &&
                    casteMapNameArrayForString(data.type_alimentations_id)
                  }`}</Typography>
                </div>
              </div>
            </div>
          )}
        </AccordionSummary>
        <AccordionDetails style={{ display: "block" }}>
          {content}
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default AccordionRecipes;
