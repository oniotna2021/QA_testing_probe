import React, { useState } from "react";
import PropTypes from "prop-types";

// UI
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const ReusableAccordion = ({ id, className, BoxTitleCard, children }) => {
  const [isExpanded, setIsExpanded] = useState("");

  const handleChange = (panel) => (_, isExpanded) => {
    setIsExpanded(isExpanded ? panel : false);
  };

  return (
    <div className={className} style={{ width: "100%" }}>
      <Accordion
        style={{ borderRadius: "20px" }}
        TransitionProps={{ unmountOnExit: true }}
        key={`panel - ${id}`}
        expanded={isExpanded === `panel${id}`}
        onChange={handleChange(`panel${id}`)}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon style={{ marginRight: "12px" }} />}
        >
          {BoxTitleCard}
        </AccordionSummary>

        <AccordionDetails>
          {isExpanded && (
            <div className="pb-2" style={{ width: "100%" }}>
              {children}
            </div>
          )}
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

ReusableAccordion.propTypes = {
  id: PropTypes.string.isRequired,
  BoxTitleCard: PropTypes.element.isRequired,
  children: PropTypes.element.isRequired,
  className: PropTypes.string,
};

export default ReusableAccordion;
