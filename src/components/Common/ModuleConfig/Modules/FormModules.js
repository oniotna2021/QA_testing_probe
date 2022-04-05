import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import Swal from "sweetalert2";
import { Controller } from "react-hook-form";
import slugify from "slugify";

//UI
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

//Components
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";

//Translate
import { useTranslation } from "react-i18next";

//Services
import {
  postModule,
  putModule,
  deleteModule,
} from "services/SuperAdmin/Modules";
import { getGroupModules } from "services/SuperAdmin/GroupModules";

// HOCS
import ActionWithPermission from "hocs/ActionWithPermission";

//utils
import { successToast, errorToast, mapErrors } from "utils/misc";

export const FormModules = ({
  type,
  defaultValue,
  setExpanded,
  load,
  setLoad,
  permissionsActions,
}) => {
  const { t } = useTranslation();
  const { handleSubmit, control, reset } = useForm();
  const { enqueueSnackbar } = useSnackbar();
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [listGroupModules, setListGroupModules] = useState([]);

  useEffect(() => {
    getGroupModules()
      .then(({ data }) => {
        if (
          data &&
          data.status === "success" &&
          data.data &&
          data.data.items.length > 0
        ) {
          setListGroupModules(data.data.items);
        } else {
          if (data.status === "error") {
            enqueueSnackbar(mapErrors(data), errorToast);
          }
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });
  }, [setListGroupModules, enqueueSnackbar]);

  const onSubmit = (value) => {
    if (type === "Nuevo" && !permissionsActions.create) {
      return;
    } else if (type !== "Nuevo" && !permissionsActions.edit) {
      return;
    }

    setLoadingFetch(true);
    const functionCall = type === "Nuevo" ? postModule : putModule;
    functionCall(value, defaultValue?.id)
      .then(({ data }) => {
        if (data && data.message && data.status === "success") {
          setExpanded(false);
          enqueueSnackbar(t("SportsHistory.SaveForms"), successToast);
          setLoad(!load);
          reset();
        } else {
          enqueueSnackbar(data.message, errorToast);
        }
        setLoadingFetch(false);
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });
  };

  const deleteForm = () => {
    Swal.fire({
      title: "¿Estas seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "¡Sí, bórralo!",
    })
      .then((result) => {
        if (result.isConfirmed) {
          deleteModule(defaultValue.id)
            .then((req) => {
              Swal.fire(
                "¡Eliminado!",
                "Su registro ha sido eliminado.",
                "success"
              );
              setLoad(!load);
            })
            .catch((err) => {
              enqueueSnackbar(mapErrors(err), errorToast);
            });
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {type !== "Nuevo" && (
        <ActionWithPermission isValid={permissionsActions.delete}>
          <div className="row justify-content-end mb-3">
            <div className="col-1">
              <IconButton
                color="primary"
                fullWidth
                variant="outlined"
                onClick={deleteForm}
              >
                <DeleteIcon />
              </IconButton>
            </div>
          </div>
        </ActionWithPermission>
      )}
      <div className="row align-items-end">
        <div className="col">
          <div className="row">
            <div className="col-4">
              <Controller
                rules={{ required: true }}
                control={control}
                name="name"
                defaultValue={defaultValue?.name}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    id={slugify("name", { lower: true })}
                    type={"text"}
                    label="Nombre del módulo"
                    variant="outlined"
                  />
                )}
              />
            </div>

            <div className="col-4">
              <Controller
                rules={{ required: true }}
                control={control}
                name="path"
                defaultValue={defaultValue?.path}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    id={slugify("path", { lower: true })}
                    type={"text"}
                    label="Ruta"
                    variant="outlined"
                  />
                )}
              />
            </div>

            <div className="col-4">
              <Controller
                rules={{ required: true }}
                control={control}
                name="module_groups_id"
                defaultValue={defaultValue?.module_groups_id}
                render={({ field }) => (
                  <FormControl variant="outlined">
                    <InputLabel>Grupo de módulos</InputLabel>
                    <Select
                      {...field}
                      fullWidth
                      label="Grupo de módulos"
                      style={{ marginTop: 0 }}
                      id={slugify("module_groups_id", { lower: true })}
                    >
                      {listGroupModules &&
                        listGroupModules.map((itemSelect) => (
                          <MenuItem value={itemSelect.id}>
                            {itemSelect.name}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                )}
              />
            </div>
          </div>
        </div>
        <ActionWithPermission
          isValid={
            type === "Nuevo"
              ? permissionsActions.create
              : permissionsActions.edit
          }
        >
          <div className="col-2">
            <ButtonSave
              style={{ marginBottom: 0 }}
              text={t("Btn.save")}
              loader={loadingFetch}
            />
          </div>
        </ActionWithPermission>
      </div>
    </form>
  );
};
