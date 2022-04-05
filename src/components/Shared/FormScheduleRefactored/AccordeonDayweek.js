import React from "react";
import PropTypes from "prop-types";

// UI
import Checkbox from "@material-ui/core/Checkbox";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const AccordeonDayweek = ({
  id,
  expanded,
  setExpanded,
  selectedDays,
  handleChangeCheckByDay,
  children,
  name,
  available,
  setOpenedDayWeek = () => null,
}) => {
  const handleChange = (panel) => (_, isExpanded) => {
    setExpanded(isExpanded ? panel : "");
  };

  return (
    <div style={{ width: "100%", marginBottom: 10 }}>
      <Accordion
        TransitionProps={{ unmountOnExit: true }}
        id={`panel-${id}`}
        aria-controls={`panel-${id}`}
        expanded={expanded === `panel-${id}`}
        onClick={() => setOpenedDayWeek(id)}
        onChange={handleChange(`panel-${id}`)}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          id={`panel${id}`}
          style={{
            backgroundColor: id && available ? "#CCC" : "#F3F3F3",
            borderRadius: 10,
          }}
        >
          <div className="d-flex align-items-center">
            <Checkbox
              readOnly
              color="primary"
              // onClick={(event) => {
              //   event.stopPropagation();
              //   handleChangeCheckByDay(id);
              // }}
              className="me-3"
              checked={available}
            />

            <div>
              <b>{name}</b>
            </div>
          </div>
        </AccordionSummary>
        <AccordionDetails>{expanded && <div>{children}</div>}</AccordionDetails>
      </Accordion>
    </div>
  );
};

AccordeonDayweek.propTypes = {
  id: PropTypes.string.isRequired,
  expanded: PropTypes.string.isRequired,
  setExpanded: PropTypes.func.isRequired,
  selectedDays: PropTypes.array.isRequired,
  handleChangeCheckByDay: PropTypes.func.isRequired,
  children: PropTypes.element.isRequired,
  name: PropTypes.string.isRequired,
};

export default AccordeonDayweek;
