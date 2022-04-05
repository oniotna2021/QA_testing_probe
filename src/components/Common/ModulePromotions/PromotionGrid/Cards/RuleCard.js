import React from "react";

// UI
import { Card } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";

// icons
import { IconEditPencil, IconClose } from "assets/icons/customize/config";

const RuleCard = ({ rule, promotionRules, setPromotionRules }) => {
  const deleteRule = () => {
    setPromotionRules(
      promotionRules.filter((promotion) => promotion.rule_id !== rule.rule_id)
    );
  };

  return (
    <Card
      style={{ boxShadow: "#e7e7e7 0px 0px 9px 3px" }}
      className="mb-2 p-1 ps-3 p3-3"
    >
      <div className="row">
        <div className="col d-flex justify-content-between align-items-center">
          <p>{rule.name}</p>
          <div className="d-flex align-items-center">
            <IconButton>
              <IconEditPencil color="gray" />
            </IconButton>
            <IconButton onClick={deleteRule}>
              <IconClose color="gray" />
            </IconButton>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RuleCard;
