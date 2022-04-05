import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import slugify from "slugify";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";

//UI
import Checkbox from "@material-ui/core/Checkbox";
import { FormatColorResetRounded } from "@material-ui/icons";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";

//Components
import { CommonComponentSimpleSelect } from "components/Shared/SimpleSelect/SimpleSelect";
import { SelectModule } from "config/Forms/AdminForms";
import MinButtonLoader from "components/Shared/MinButtonLoader/MinButtonLoader";

//Services
import { getModulesByGroup } from "services/SuperAdmin/Modules";
import { getGroupModules } from "services/SuperAdmin/GroupModules";
import { postPermissions } from "services/SuperAdmin/Permissions";

//Swal
import { successToast, errorToast, mapErrors } from "utils/misc";

export const FormPermissions = ({
  type,
  defaultValue,
  setExpanded,
  role_id,
  reload,
  setReload,
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const [groupModuleId, setGroupModuleId] = useState(0);
  const [dataModules, setDataModules] = useState([]);
  const [dataGroupModules, setDataGroupModules] = useState([]);
  const [loadingFetch, setLoadingFetch] = useState(false);

  const [read, setRead] = useState(false);
  const [Delete, setDelete] = useState(false);
  const [create, setCreate] = useState(false);
  const [update, setUpdate] = useState(false);

  const { handleSubmit, control } = useForm();

  useEffect(() => {
    (() => {
      getGroupModules()
        .then(({ data }) => {
          if (data && data.status === "success" && data.data.items.length > 0) {
            setDataGroupModules(data.data.items);
          } else {
            if (data.status === "error") {
              enqueueSnackbar(mapErrors(data.data), errorToast);
            }
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        });
    })();
  }, [enqueueSnackbar]);

  useEffect(() => {
    if (groupModuleId) {
      getModulesByGroup(groupModuleId)
        .then(({ data }) => {
          if (data && data.status === "success" && data?.data?.length > 0) {
            setDataModules(data.data);
          } else {
            if (data.status === "error") {
              enqueueSnackbar(mapErrors(data.data), errorToast);
            }
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        });
    }
  }, [enqueueSnackbar, groupModuleId]);

  const handleChangeRead = (e) => {
    setRead(e.target.checked);
  };
  const handleChangeCreate = (e) => {
    setCreate(e.target.checked);
  };
  const handleChangeUpdate = (e) => {
    setUpdate(e.target.checked);
  };
  const handleChangeDelete = (e) => {
    setDelete(e.target.checked);
  };

  const onSubmit = (value) => {
    setLoadingFetch(true);
    let dataSubmit = {
      role_id: role_id,
      module_groups_id: value.module_groups_id,
      module_id: value.module_id,
      read: read === true ? 1 : 0,
      create: create === true ? 1 : 0,
      edit: update === true ? 1 : 0,
      delete: Delete === true ? 1 : 0,
    };

    postPermissions(dataSubmit)
      .then(({ data }) => {
        if (data && data.status === "success") {
          enqueueSnackbar(t("SportsHistory.SaveForms"), successToast);
          setExpanded(false);
          setReload(!reload);
        } else {
          enqueueSnackbar(data.message, errorToast);
        }
        setLoadingFetch(FormatColorResetRounded);
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row mt-3">
        <div className="col-3">
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
                  onChange={(e) => {
                    setGroupModuleId(e.target.value);
                    field.onChange(e.target.value);
                  }}
                >
                  {dataGroupModules &&
                    dataGroupModules.map((itemSelect) => (
                      <MenuItem value={itemSelect.id}>
                        {itemSelect.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            )}
          />
          {/* <CommonComponentSimpleSelect form={SelectGroupModule} control={control} option={dataGroupModules} /> */}
        </div>
        <div className="col-3">
          <CommonComponentSimpleSelect
            form={SelectModule}
            control={control}
            option={dataModules}
          />
        </div>
        <div className="col-6">
          <div className="d-flex justify-content-between align-items-center">
            <Checkbox
              color="primary"
              size="medium"
              checked={read}
              onChange={handleChangeRead}
            />
            <Checkbox
              color="primary"
              size="medium"
              checked={create}
              onChange={handleChangeCreate}
            />
            <Checkbox
              color="primary"
              size="medium"
              checked={update}
              onChange={handleChangeUpdate}
            />
            <Checkbox
              color="primary"
              size="medium"
              checked={Delete}
              onChange={handleChangeDelete}
            />
          </div>
        </div>
        <div className="col-2">
          <MinButtonLoader text="Agregar" loader={loadingFetch} />
        </div>
      </div>
    </form>
  );
};
