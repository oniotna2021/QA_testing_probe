import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

//UI
import { TextField, Typography } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

//Components
import { CommonComponentSimpleForm } from "components/Shared/SimpleForm/SimpleForm";
import { reasonBlockForm } from "config/Forms/ReservationForms";
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";

// HOCS
import ActionWithPermission from "hocs/ActionWithPermission";

//Services
import {
  postReasonBlock,
  putReasonBlock,
  deleteReasonBlock,
} from "services/Reservations/reasonBlock";

//Swal
import Swal from "sweetalert2";

//utils
import { successToast, errorToast, mapErrors } from "utils/misc";
import { Autocomplete } from "@material-ui/lab";

const newsTypeNames = [
  {
    name: "Temporal",
    value: "temp",
  },
  {
    name: "Definitivo",
    value: "definitive",
  },
  {
    name: "Recurrente",
    value: "recurrent",
  },
];

export const FormReasonBlock = ({
  type,
  defaultValue,
  setExpanded,
  load,
  setLoad,
  permissionsActions,
}) => {
  const { t } = useTranslation();
  const { handleSubmit, control } = useForm();
  const { enqueueSnackbar } = useSnackbar();
  const [loadingFetch, setLoadingFetch] = useState(false);

  const onSubmit = (value) => {
    value.news_type = value.news_type?.map((type) => {
      return { news_type_name: type.value };
    });
    setLoadingFetch(true);
    const functionCall = type === "Nuevo" ? postReasonBlock : putReasonBlock;
    functionCall(value, defaultValue?.id)
      .then(({ data }) => {
        if (data && data.message && data.status === "success") {
          setExpanded(false);
          enqueueSnackbar(t("SportsHistory.SaveForms"), successToast);
          setLoad(!load);
        } else {
          enqueueSnackbar(data.message, errorToast);
        }
        setLoadingFetch(false);
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
        setLoadingFetch(false);
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
        deleteReasonBlock(defaultValue?.id)
          .then((req) => {
            Swal.fire(
              t("Message.Eliminated"),
              t("Message.EliminatedSuccess"),
              "success"
            );
            setLoad(true);
          })
          .catch((err) => {
            Swal.fire(t("Message.ErrorOcurred"), mapErrors(err), "error");
          });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {type !== "Nuevo" && (
        <div className="row justify-content-end mb-3">
          <div className="col-1">
            <ActionWithPermission isValid={permissionsActions.delete}>
              <IconButton
                color="primary"
                fullWidth
                variant="outlined"
                onClick={deleteForm}
              >
                <DeleteIcon />
              </IconButton>
            </ActionWithPermission>
          </div>
        </div>
      )}
      <div className="row">
        <div className="col">
          <CommonComponentSimpleForm
            form={reasonBlockForm}
            control={control}
            defaultValue={defaultValue}
          />
        </div>

        <div className="col">
          <Controller
            name="news_type"
            control={control}
            defaultValue={defaultValue?.news_type_name?.map((type) => {
              return {
                name: newsTypeNames.find((newsType) => newsType.value === type)
                  ?.name,
                value: type,
              };
            })}
            render={({ field: { onChange } }) => (
              <Autocomplete
                onChange={(_, data) => {
                  onChange(data);
                }}
                options={newsTypeNames}
                multiple={true}
                defaultValue={defaultValue?.news_type_name?.map((type) => {
                  return {
                    name: newsTypeNames.find(
                      (newsType) => newsType.value === type
                    )?.name,
                    value: type,
                  };
                })}
                noOptionsText={t("ListPermissions.NoData")}
                getOptionLabel={(option) => option?.name}
                renderOption={(option) => (
                  <React.Fragment>
                    <Typography variant="body2">{option?.name}</Typography>
                  </React.Fragment>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t("FormReasonBlock.BlockType")}
                    variant="outlined"
                  />
                )}
              />
            )}
          />
        </div>
        <div className="row d-flex justify-content-end mt-3">
          <ActionWithPermission
            isValid={
              type === "Nuevo"
                ? permissionsActions.create
                : permissionsActions.edit
            }
          >
            <ButtonSave text={t("Btn.save")} loader={loadingFetch} />
          </ActionWithPermission>
        </div>
      </div>
    </form>
  );
};
