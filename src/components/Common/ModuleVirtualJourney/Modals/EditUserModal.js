import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";

//UI
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";

// components
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";

// utils
import { useStyles } from "utils/useStyles";
import { errorToast, successToast } from "utils/misc";
import { mapErrors } from "utils/misc";

// services
import { editUserInfo } from "services/VirtualJourney/EditUserInfo";

const EditUserModal = ({
  setIsOpen,
  email,
  mobile_phone,
  reloadUserInfo,
  setReloadUserInfo,
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const { user_id } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = (values) => {
    setIsLoading(true);
    editUserInfo({ user_id, payload: values })
      .then(({ data }) => {
        if (data.status === "success") {
          enqueueSnackbar("Usuario actualizado correctamente", successToast);
          setReloadUserInfo(values);
          setIsOpen(false);
        } else {
          enqueueSnackbar(mapErrors(data), errorToast);
        }
      })
      .catch((err) => enqueueSnackbar(mapErrors(err), errorToast))
      .finally(() => setIsLoading(false));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        rules={{ required: true }}
        control={control}
        name="email"
        defaultValue={reloadUserInfo.email ? reloadUserInfo.email : email}
        error={errors.email}
        render={({ field }) => (
          <FormControl variant="outlined">
            <TextField
              {...field}
              fullWidth
              error={errors.email}
              className="mb-3"
              type="text"
              label={"Email"}
              variant="outlined"
            />
          </FormControl>
        )}
      />

      <Controller
        rules={{ required: true }}
        control={control}
        name="mobile_phone"
        error={errors.phone}
        defaultValue={
          reloadUserInfo.mobile_phone
            ? reloadUserInfo.mobile_phone
            : mobile_phone
        }
        render={({ field }) => (
          <FormControl variant="outlined">
            <TextField
              {...field}
              fullWidth
              error={errors.phone}
              type="text"
              label={"Teléfono"}
              variant="outlined"
            />
          </FormControl>
        )}
      />

      <div className="d-flex justify-content-between mt-3 container row">
        <Button className={classes.buttonBack} onClick={() => setIsOpen(false)}>
          {t("Btn.Back")}
        </Button>
        <ButtonSave text="Guardar" loader={isLoading} />
      </div>
    </form>
  );
};

export default EditUserModal;
