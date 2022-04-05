import React, { useState } from "react";
import { useSnackbar } from "notistack";

// UI
import { withStyles } from "@material-ui/core/styles";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

// Update
import {
  putPermissions,
  deletePermission,
} from "services/SuperAdmin/Permissions";

// HOCS
import ActionWithPermission from "hocs/ActionWithPermission";

// Utils
import { errorToast, successToast, mapErrors } from "utils/misc";
import { IconButton } from "@material-ui/core";
import Delete from "@material-ui/icons/Delete";

const SwitchCustom = withStyles((theme) => ({
  root: {
    width: 42,
    height: 26,
    padding: 0,
    margin: theme.spacing(1),
    marginRight: "25px!important",
  },
  switchBase: {
    padding: 1,
    "&$checked": {
      transform: "translateX(16px)",
      color: theme.palette.common.white,
      "& + $track": {
        backgroundColor: theme.palette.primary.main,
        opacity: 1,
        border: "none",
      },
    },
    "&$focusVisible $thumb": {
      color: theme.palette.text.secondary,
      border: "6px solid #fff",
    },
  },
  thumb: {
    width: 24,
    height: 24,
  },
  track: {
    borderRadius: 26 / 2,
    border: `1px solid ${theme.palette.text.disabled}`,
    backgroundColor: theme.palette.text.disabled,
    opacity: 1,
    transition: theme.transitions.create(["background-color", "border"]),
  },
  checked: {},
  focusVisible: {},
}))(({ classes, ...props }) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
});

const Permissions = ({
  roleId,
  module,
  setReload,
  permissionsActions,
  setData,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const handleglobalChange = (e, error) => {
    setData((data) =>
      data.map((permission) => {
        if (permission.role_id === roleId) {
          return {
            ...permission,
            module_groups: permission.module_groups.map((moduleGroup) => {
              if (moduleGroup.module_groups_id === module.group_module_id) {
                return {
                  ...moduleGroup,
                  permissions: moduleGroup.permissions.map((itemPermission) => {
                    console.log(
                      itemPermission.permission_id === module.permission_id
                    );
                    if (itemPermission.permission_id === module.permission_id) {
                      return {
                        ...itemPermission,
                        [e.target.name]: !error
                          ? e.target.checked
                          : !e.target.checked,
                      };
                    }

                    return itemPermission;
                  }),
                };
              }

              return moduleGroup;
            }),
          };
        }

        return permission;
      })
    );
  };

  const handleChange = (e) => {
    setLoading(true);
    const isChecked = e.target.checked === true ? 1 : 0;
    const dataToUpdate = {
      ...module,
      [e.target.name]: isChecked,
      role_id: roleId,
      module_id: module.module_id,
    };

    handleglobalChange(e);

    putPermissions(dataToUpdate, module.permission_id)
      .then(({ data }) => {
        if (data.status !== "success") {
          enqueueSnackbar(mapErrors(data), errorToast);
          handleglobalChange(e, true);
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
        handleglobalChange(e, true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleClickDelete = () => {
    deletePermission(module.permission_id)
      .then(({ data }) => {
        enqueueSnackbar(data.message, successToast);
        setReload(true);
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });
  };

  return (
    <>
      <div className="row gx-0">
        <div className="d-flex align-items-center">
          <IconButton
            color="primary"
            fullWidth
            variant="outlined"
            className="me-2"
            onClick={handleClickDelete}
          >
            <Delete />
          </IconButton>
        </div>

        <div className="d-flex flex-column">
          <FormControlLabel
            control={
              <ActionWithPermission isValid={permissionsActions.edit}>
                <SwitchCustom
                  checked={module.read}
                  name="read"
                  onChange={handleChange}
                  disabled={loading}
                />
              </ActionWithPermission>
            }
            label="Listar"
            classes={{
              label: {
                marginLeft: 10,
              },
            }}
          />

          <FormControlLabel
            control={
              <ActionWithPermission isValid={permissionsActions.edit}>
                <SwitchCustom
                  checked={module.create}
                  name="create"
                  onChange={handleChange}
                  disabled={loading}
                />
              </ActionWithPermission>
            }
            label="Crear"
            classes={{
              label: {
                marginLeft: 10,
              },
            }}
          />

          <FormControlLabel
            control={
              <ActionWithPermission isValid={permissionsActions.edit}>
                <SwitchCustom
                  checked={module.edit}
                  name="edit"
                  onChange={handleChange}
                  disabled={loading}
                />
              </ActionWithPermission>
            }
            label="Editar"
            classes={{
              label: {
                marginLeft: 10,
              },
            }}
          />

          <FormControlLabel
            control={
              <ActionWithPermission isValid={permissionsActions.edit}>
                <SwitchCustom
                  checked={module.delete}
                  name="delete"
                  onChange={handleChange}
                  disabled={loading}
                />
              </ActionWithPermission>
            }
            label="Eliminar"
            classes={{
              label: {
                marginLeft: 10,
              },
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Permissions;
