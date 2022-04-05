import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { connect } from "react-redux";

// UI
import { makeStyles } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

export const Menu = styled.input`
  padding: 25px 10px;
  border: none;
  background-color: rgba(0, 0, 0, 0.04);
  border-radius: 15px;
  width: 120px;
  height: 20px;
  font-size: 15px;
  font-weight: 400;
  color: #0f2930;

  &:focus {
    border: none;
    outline: none;
  }
`;

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
  listItem: {
    // width: '120px',
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

const SelectedMenu = ({
  options,
  value,
  defaultValue,
  handleChangeVenue,
  isVirtual,
}) => {
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [viewAutoComplete, setViewAutocomplete] = useState(false);
  const [objectValue, setObjectValue] = useState(null);

  useEffect(() => {
    if (options.length > 0) {
      const findObject = options.find(
        (i) => Number(i.id) === Number(defaultValue)
      );

      if (Boolean(findObject)) {
        setObjectValue(
          options.find((i) => Number(i.id) === Number(defaultValue))
        );
        return;
      }

      setObjectValue(null);
    }
  }, [defaultValue, options]);

  if (isVirtual) return null;

  return (
    <>
      {viewAutoComplete ? (
        <Autocomplete
          open={open}
          className={classes.listItem}
          value={objectValue}
          onChange={(_, newValue) => {
            handleChangeVenue(newValue);
          }}
          onOpen={setOpen}
          onClose={() => {
            setViewAutocomplete(false);
          }}
          autoSelect={true}
          disableClearable={true}
          getOptionLabel={(option) => `${option.name}`}
          getOptionSelected={(option, value) => Number(value) === option.id}
          aria-label="seleccionar sede"
          id="controllable-select-venue"
          options={options}
          renderInput={(params) => (
            <div ref={params.InputProps.ref}>
              <Menu type="text" {...params.inputProps} />
            </div>
          )}
        />
      ) : (
        <List component="nav" aria-label="Device settings">
          <ListItem
            className={classes.listItem}
            button
            aria-haspopup="true"
            aria-controls="lock-menu"
            aria-label="seleccionar sede"
            onClick={() => {
              setViewAutocomplete(true);
              setOpen(true);
            }}
          >
            <ListItemText
              primary={`${options.find((i) => i.id === value)?.name}`}
            />
          </ListItem>
        </List>
      )}
    </>
  );
};

const mapStateToProps = ({ auth }) => ({
  isVirtual: auth.isVirtual,
});

export default connect(mapStateToProps)(SelectedMenu);
