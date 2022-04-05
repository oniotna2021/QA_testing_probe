import React, { useState, useEffect, useMemo } from "react";
import { useSnackbar } from "notistack";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// Actions
import {
  changeBrandIdDefault,
  getProfileInformation,
  changeCountryId,
} from "modules/auth";

// UI
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";

// Services
import { getAllMarks } from "services/GeneralConfig/Marks";

// utils
import { errorToast, infoToast, mapErrors } from "utils/misc";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
  listItem: {
    border: "none!important",
    borderRadius: "15px",
    backgroundColor: "rgba(0, 0, 0, 0.04)",
    "&:hover": {
      // backgroundColor: 'rgba(0, 0, 0, 0.082)'
    },
    "&:focus": {
      backgroundColor: "rgba(0, 0, 0, 0.04)",
      outline: "none",
    },
  },
}));

const SelectedMenuBrand = ({
  changeBrandIdDefault,
  availableBrands,
  brandId,
  changeCountryId,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [dataMarks, setDataMarks] = useState([]);

  useEffect(() => {
    const fetchBrands = () => {
      getAllMarks()
        .then(({ data }) => {
          if (data.status === "success") {
            setDataMarks(data.data.items);
          } else {
            if (data.status === "error") {
              enqueueSnackbar(mapErrors(data.data), errorToast);
            }
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        });
    };

    fetchBrands();
  }, [enqueueSnackbar]);

  useEffect(() => {
    getProfileInformation((message) => {
      enqueueSnackbar(message, infoToast);
    }, true);
  }, [brandId, enqueueSnackbar]);

  useEffect(() => {
    if (brandId && dataMarks) {
      const findAvailableBrand = dataMarks.find((p) => p.id === Number(brandId));
      if (Boolean(findAvailableBrand)) {
        changeCountryId(findAvailableBrand.id_country);
      }
    }
  }, [dataMarks, brandId, changeCountryId]);

  const optionsBrands = useMemo(() => {
    const optionsToReturn = [...dataMarks];

    if (dataMarks.length > 0 && availableBrands) {
      return dataMarks.filter((brand) =>
        availableBrands.some((p) => Number(p.brand_id) === brand.id)
      );
    }

    return optionsToReturn;
  }, [dataMarks, availableBrands]);

  const handleClickListItem = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (_, value) => {
    let dataToChange = { ...value };
    const findData = availableBrands.find(
      (p) => Number(p.brand_id) === Number(value.id)
    );

    if (Boolean(findData)) {
      dataToChange = { ...dataToChange, uuid_company: findData.uuid_company };
    }

    changeBrandIdDefault(dataToChange);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.root}>
      <List component="nav" aria-label="Device settings">
        <ListItem
          className={classes.listItem}
          button
          aria-haspopup="true"
          aria-controls="lock-menu"
          aria-label="seleccionar marca"
          onClick={handleClickListItem}
        >
          {optionsBrands.length > 0 && (
            <ListItemText
              primary={`${
                optionsBrands.find((i) => i.id === Number(brandId))?.name
              }`}
            />
          )}
        </ListItem>
      </List>
      <Menu
        id="lock-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        style={{ top: 40 }}
      >
        {optionsBrands &&
          optionsBrands.map((option) => (
            <MenuItem
              key={option.id}
              selected={option.id === brandId}
              onClick={(event) => handleMenuItemClick(event, option)}
            >
              {option.name}
            </MenuItem>
          ))}
      </Menu>
    </div>
  );
};

const mapStateToProps = ({ auth }) => ({
  brandId: auth.brandId,
  availableBrands: auth.availableBrands,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      changeBrandIdDefault,
      getProfileInformation,
      changeCountryId,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(SelectedMenuBrand);
