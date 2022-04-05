import React, { useState, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { useParams } from "react-router";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { useTheme } from "@material-ui/core/styles";
import { useForm, Controller } from "react-hook-form";

//ICONS
import { IconCheck } from "assets/icons/customize/config";
import CloseIcon from "@material-ui/icons/Close";

//UI
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import FormHelperText from "@material-ui/core/FormHelperText";
import TextField from "@material-ui/core/TextField";

//COMPONENTS
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import MinButtonLoader from "components/Shared/MinButtonLoader/MinButtonLoader";

//SERVICES
import { postMedicalAnnexes } from "services/MedicalSoftware/MedicalAnnexes";
import { postAppointmentAttachment } from "services/MedicalSoftware/Appointments";

//UTILS
import {
  successToast,
  errorToast,
  mapErrors,
  setFormData,
  infoToast,
} from "utils/misc";
import { useStyles } from "utils/useStyles";
import Swal from "sweetalert2";

//styles dropzone
const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "40px",
  borderWidth: 1,
  borderRadius: 8,
  borderColor: "rgb(60 60 59 / 30%)",
  borderStyle: "dashed",
  backgroundColor: "#fff",
  color: "#3C3C3B",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const activeStyle = {
  borderColor: "rgb(230 136 89)",
  borderWidth: 2,
};

const acceptStyle = {
  borderColor: "#00e676",
  backgroundColor: "rgb(0 230 118 / 20%)",
};

const rejectStyle = {
  borderColor: "#ff1744",
  backgroundColor: "rgb(255 23 68 / 20%)",
};

export default function FormAnnexes() {
  const { quote_id, appoiment_type_id } = useParams();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const theme = useTheme();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [optionSelection, setOptionSelection] = useState(1);
  const [loadingFetchAnnexes, setLoadingFetchAnnexes] = useState(false);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [files, setFiles] = useState([]);

  //drop files
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    maxFiles: 5,
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );
  const handleDeleteFile = (file) => {
    setFiles(files.filter((item) => item.path !== file.path));
  };

  const submitFiles = () => {
    setLoadingFiles(true);
    let dataSubmit = {
      appointment_id: quote_id,
      "attachment[0]": files[0],
      "attachment[1]": files[1],
      "attachment[2]": files[2],
      "attachment[3]": files[3],
      "attachment[4]": files[4],
    };

    postAppointmentAttachment(setFormData(dataSubmit))
      .then(({ data }) => {
        if (data && data.data && data.status === "success") {
          Swal.fire({
            title: t("Message.SavedSuccess"),
            icon: "success",
          });
        } else {
          Swal.fire({
            title: mapErrors(data),
            icon: "error",
          });
        }
        setLoadingFiles(false);
      })
      .catch((err) => {
        Swal.fire({
          title: mapErrors(err),
          icon: "error",
        });
        setLoadingFiles(false);
      });
  };

  const onSubmitMedicalAnnexes = (value) => {
    setLoadingFetchAnnexes(true);
    let dataSubmit = {
      medical_prescription:
        optionSelection === 1
          ? value.medical_exmans
          : optionSelection === 2
          ? value.medical_prescription
          : value.medical_certificate,
      quotes_id: quote_id,
      type_of_annex_id: optionSelection,
    };
    postMedicalAnnexes(dataSubmit)
      .then((blob) => {
        const file = new Blob([blob.data], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);
        window.open(encodeURI(fileURL));
        setLoadingFetchAnnexes(false);
      })
      .catch(({ err }) => {
        enqueueSnackbar(mapErrors(err), errorToast);
        setLoadingFetchAnnexes(false);
      });
  };

  return (
    <div>
      <div className="d-flex justify-content-start align-items-center">
        {appoiment_type_id === "1" ||
        appoiment_type_id === "2" ||
        appoiment_type_id === "4" ? (
          <>
            <Button
              className={
                optionSelection === 1
                  ? classes.miniBoxAnnexesSelected
                  : classes.miniBoxAnnexes
              }
              endIcon={
                optionSelection === 1 ? (
                  <IconCheck color={theme.palette.black.main} />
                ) : null
              }
              onClick={() => setOptionSelection(1)}
            >
              <Typography
                display="block"
                component={"span"}
                variant="body2"
                style={{ fontSize: "12px" }}
              >
                {t("DetailClinicHistory.MedicalExam")}
              </Typography>
            </Button>
            <Button
              className={
                optionSelection === 2
                  ? classes.miniBoxAnnexesSelected
                  : classes.miniBoxAnnexes
              }
              endIcon={
                optionSelection === 2 ? (
                  <IconCheck color={theme.palette.black.main} />
                ) : null
              }
              onClick={() => setOptionSelection(2)}
            >
              <Typography
                display="block"
                component={"span"}
                variant="body2"
                style={{ fontSize: "12px" }}
              >
                {t("DetailClinicHistory.MedicalPrescription")}
              </Typography>
            </Button>
          </>
        ) : null}
        <Button
          className={
            optionSelection === 3
              ? classes.miniBoxAnnexesSelected
              : classes.miniBoxAnnexes
          }
          endIcon={
            optionSelection === 3 ? (
              <IconCheck color={theme.palette.black.main} />
            ) : null
          }
          onClick={() => setOptionSelection(3)}
        >
          <Typography
            display="block"
            component={"span"}
            variant="body2"
            style={{ fontSize: "12px" }}
          >
            {t("DetailClinicHistory.MedicalCertificate")}
          </Typography>
        </Button>
        <Button
          className={
            optionSelection === 4
              ? classes.miniBoxAnnexesSelected
              : classes.miniBoxAnnexes
          }
          endIcon={
            optionSelection === 4 ? (
              <IconCheck color={theme.palette.black.main} />
            ) : null
          }
          onClick={() => setOptionSelection(4)}
        >
          <Typography
            display="block"
            component={"span"}
            variant="body2"
            style={{ fontSize: "12px" }}
          >
            {t("DetailClinicHistory.TitleAddFiles")}
          </Typography>
        </Button>
      </div>
      <div className="mt-3">
        {optionSelection === 1 ? (
          <React.Fragment>
            <div className="mt-1">
              <Controller
                name="medical_exmans"
                control={control}
                rules={{ required: true }}
                error={errors.medical_exmans ? true : false}
                render={({ field }) => (
                  <TextField
                    {...field}
                    multiline
                    variant="outlined"
                    rows={5}
                    error={errors.medical_exmans}
                    label={t("DetailClinicHistory.CreateMedicalExam")}
                  />
                )}
              />
              {errors.medical_exmans && (
                <FormHelperText error>{t("Field.required")}</FormHelperText>
              )}
            </div>
            <div className="d-flex justify-content-end mt-3">
              <form onSubmit={handleSubmit(onSubmitMedicalAnnexes)}>
                <MinButtonLoader
                  text={t("DetailClinicHistory.CreatePDF")}
                  loader={loadingFetchAnnexes}
                />
              </form>
            </div>
          </React.Fragment>
        ) : null}
        {optionSelection === 2 && (
          <React.Fragment>
            <div className="mt-1">
              <Controller
                name="medical_prescription"
                control={control}
                error={errors.medical_prescription}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    multiline
                    variant="outlined"
                    rows={5}
                    error={errors.medical_prescription}
                    label={t("DetailClinicHistory.CreateMedicalPrescription")}
                  />
                )}
              />
            </div>
            {errors.medical_prescription && (
              <FormHelperText error>{t("Field.required")}</FormHelperText>
            )}
            <div className="d-flex justify-content-end my-3">
              <form onSubmit={handleSubmit(onSubmitMedicalAnnexes)}>
                <MinButtonLoader
                  text={t("DetailClinicHistory.CreatePDF")}
                  loader={loadingFetchAnnexes}
                />
              </form>
            </div>
          </React.Fragment>
        )}
        {optionSelection === 3 && (
          <React.Fragment>
            <div className="mt-1">
              <Controller
                name="medical_certificate"
                control={control}
                rules={{ required: true }}
                error={errors.medical_certificate}
                render={({ field }) => (
                  <TextField
                    {...field}
                    multiline
                    variant="outlined"
                    error={errors.medical_certificate}
                    rows={5}
                    label={t("DetailClinicHistory.CreateMedicalCertificate")}
                  />
                )}
              />
              {errors.medical_certificate && (
                <FormHelperText error>{t("Field.required")}</FormHelperText>
              )}
            </div>
            <div className="d-flex justify-content-end my-3">
              <form onSubmit={handleSubmit(onSubmitMedicalAnnexes)}>
                <MinButtonLoader
                  text={t("DetailClinicHistory.CreatePDF")}
                  loader={loadingFetchAnnexes}
                />
              </form>
            </div>
          </React.Fragment>
        )}
        {optionSelection === 4 && (
          <React.Fragment>
            <div className="col-12 mb-3">
              <div {...getRootProps({ style })}>
                <input {...getInputProps()} />
                <p>{t("DetailClinicHistory.AddFiles")}</p>
              </div>
            </div>
            <div className="col-12 d-flex flex-column justify-content-start align-items-start mb-3">
              {files.map((item, idx) => (
                <p key={`item-${idx}`}>
                  {item.name}
                  <IconButton>
                    <CloseIcon
                      onClick={() => {
                        handleDeleteFile(item);
                      }}
                    />
                  </IconButton>
                </p>
              ))}
            </div>
            <form onSubmit={handleSubmit(submitFiles)}>
              <div className="d-flex justify-content-end">
                <ButtonSave text={t("Btn.save")} loader={loadingFiles} />
              </div>
            </form>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}
