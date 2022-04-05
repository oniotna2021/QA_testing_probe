import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// UI
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

// Actions Redux
import { changeCheckIsVirtualUser } from "modules/auth";

const CheckIsVirtualUser = ({
  isVirtual,
  shouldIsVirtual,
  changeCheckIsVirtualUser,
}) => {
  if (!shouldIsVirtual) return null;
  return (
    <div
      className="d-flex justify-content-between align-items-center me-4"
      style={{ width: "150px" }}
    >
      <FormControlLabel
        control={
          <Checkbox
            name="checked_is_virtual"
            color="primary"
            checked={isVirtual === 1}
            onChange={(e) => changeCheckIsVirtualUser(e.target.checked)}
          />
        }
        label="Portal virtual"
        labelPlacement="start"
      />
    </div>
  );
};

const mapStateToProps = ({ auth }) => ({
  isVirtual: auth.isVirtual,
  shouldIsVirtual: auth.shouldIsVirtual,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      changeCheckIsVirtualUser,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(CheckIsVirtualUser);
