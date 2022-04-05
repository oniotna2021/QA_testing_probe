import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import slugify from "slugify";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";

//UI
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";

//Components
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";

// Hooks
import useFetch from "hooks/useFetch";

// HOCS
import ActionWithPermission from "hocs/ActionWithPermission";

//Services
import { postMark, putMark, deleteMark } from "services/GeneralConfig/Marks";
import { getAllCompanies } from "services/GeneralConfig/Company";

//utils
import { successToast, errorToast, mapErrors } from "utils/misc";

const FormMark = ({
  isEdit = false,
  defaultValue,
  idItem,
  setExpanded,
  getList,
  permissionsActions,
}) => {
  const { t } = useTranslation();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const { enqueueSnackbar } = useSnackbar();
  const [loadingFetch, setLoadingFetch] = useState(false);

  const [companies] = useFetch(getAllCompanies);

  const onSubmit = (value) => {
    if (!isEdit && !permissionsActions.create) {
      return;
    } else if (isEdit && !permissionsActions.edit) {
      return;
    }

    setLoadingFetch(true);
    const functionCall = isEdit ? putMark : postMark;
    functionCall(value, idItem)
      .then(({ data }) => {
        if (data && data.message && data.status === "success") {
          setExpanded(false);
          enqueueSnackbar(t("SportsHistory.SaveForms"), successToast);
          getList();
        } else {
          enqueueSnackbar(mapErrors(data), errorToast);
        }
        setLoadingFetch(false);
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });
  };

  const deleteForm = () => {
    Swal.fire({
      title: t("Message.AreYouSure"),
      text: t("Message.DontRevertThis"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("Message.YesDeleteIt"),
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMark(idItem)
          .then((req) => {
            Swal.fire(
              t("Message.Eliminated"),
              t("Message.EliminatedSuccess"),
              "success"
            );
            getList();
          })
          .catch((err) => {
            Swal.fire(t("Message.ErrorOcurred"), mapErrors(err), "error");
          });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {isEdit && (
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
        <div className="row align-items-center align-content-center">
          <div className="col-6">
            <Controller
              rules={{ required: true }}
              control={control}
              name="company_id"
              defaultValue={defaultValue?.company_id}
              render={({ field }) => (
                <FormControl variant="outlined">
                  <InputLabel id="company_id">
                    {t("EditPriceForm.Company")}
                  </InputLabel>
                  <Select
                    {...field}
                    labelId="company_id"
                    label={t("EditPriceForm.Company")}
                  >
                    {companies &&
                      companies.map((res) => (
                        <MenuItem key={res.id} value={res.id}>
                          {res.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              )}
            />
            {errors.company_id && (
              <FormHelperText error>Campo requerido</FormHelperText>
            )}
          </div>

          <div className="col-6">
            <Controller
              rules={{ required: true }}
              control={control}
              defaultValue={defaultValue?.name}
              name="name"
              render={({ field }) => (
                <FormControl variant="outlined">
                  <TextField
                    {...field}
                    fullWidth
                    id={slugify("name", { lower: true })}
                    type="text"
                    label={t("ListMarks.InputName")}
                    rows={1}
                    variant="outlined"
                  />
                  {errors.name && (
                    <FormHelperText error>Campo requerido</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </div>
        </div>

        <ActionWithPermission
          isValid={isEdit ? permissionsActions.edit : permissionsActions.create}
        >
          <div className="d-flex justify-content-end mt-3">
            <ButtonSave text={t("Btn.save")} loader={loadingFetch} />
          </div>
        </ActionWithPermission>
      </div>
    </form>
  );
};

export default FormMark;
