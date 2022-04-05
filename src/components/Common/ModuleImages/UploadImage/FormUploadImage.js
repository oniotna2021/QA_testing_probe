import React, { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import { useDropzone } from "react-dropzone";

//UI
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";

//SERVICES
import { postImageRecipe } from "services/MedicalSoftware/ImageRecipes";

import ControlledAutocompleteChip from "components/Shared/ControlledAutocompleteChip/ControlledAutocompleteChip";

// HOCS
import ActionWithPermission from "hocs/ActionWithPermission";

//UTILS
import { useStyles } from "utils/useStyles";
import { successToast, errorToast, mapErrors } from "utils/misc";

// STYLES DROPZONE
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

// STYLES PREVIEW
const thumbsContainer = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  marginTop: 16,
};

const thumb = {
  display: "inline-flex",
  borderRadius: 2,
  border: "1px solid #eaeaea",
  marginBottom: 0,
  marginRight: 0,
  padding: 4,
  boxSizing: "border-box",
};

const thumbInner = {
  display: "flex",
  minWidth: 0,
  overflow: "hidden",
};

const img = {
  display: "block",
  width: "100%",
  height: "100%",
  objectFit: "fill",
};

const FormUploadImage = ({ setIsOpen, data, isEdit, permissionsActions }) => {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const { t } = useTranslation();

  const { handleSubmit, control } = useForm();
  const [files, setFiles] = useState([]);
  const [tags, setTags] = useState([]); // TAGS PARA LAS IMAGENES

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: "image/*",
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

  const thumbs = files.map((file) => (
    <div className="mb-2" style={thumb}>
      <div style={thumbInner}>
        <img
          src={isEdit ? data?.urlImage : file.preview}
          style={img}
          alt="img-recipe"
        />
      </div>
    </div>
  ));

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );

  useEffect(
    () => () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  const handleDeleteImg = () => {
    setFiles([]);
  };

  const onSubmit = () => {
    let formdata = new FormData();
    let formatTags = tags.map((x) => {
      return { tag: x };
    });
    formdata.append("image", files[0]);
    formdata.append("tags_id", JSON.stringify(formatTags));

    postImageRecipe(formdata)
      .then(({ data }) => {
        if (data && data.status === "success") {
          enqueueSnackbar(data.message, successToast);
          setIsOpen(false);
        } else {
          enqueueSnackbar(data.message, errorToast);
        }
        console.log(data);
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center">
      <form>
        <div className="row justify-content-between align-items-center mb-4">
          <div className="col">
            <Typography variant="h5">
              {t("FormUploadImage.UploadNewImage")}
            </Typography>
          </div>
          <div className="col-1">
            <CloseIcon onClick={() => setIsOpen(false)} className="pointer" />
          </div>
        </div>

        <div className="row mb-4">
          {!isEdit && files.length === 0 ? (
            <div className="col-12 mb-3">
              <div {...getRootProps({ style })}>
                <input {...getInputProps()} />
                <p>{t("FormUploadImage.DragLoadImage")}</p>
              </div>
            </div>
          ) : (
            <div
              className="col-12 d-flex flex-column justify-content-center align-items-center mb-3"
              style={thumbsContainer}
            >
              {thumbs}
              {isEdit && (
                <div className="mb-2" style={thumb}>
                  <div style={thumbInner}>
                    <img
                      src={isEdit ? data?.urlImage : ""}
                      style={img}
                      alt="img-recipe"
                    />
                  </div>
                </div>
              )}
              <Button
                variant="contained"
                color="default"
                startIcon={<DeleteIcon />}
                onClick={() => handleDeleteImg()}
              >
                {t("Btn.Delete")}
              </Button>
            </div>
          )}

          <div className="col-12">
            <ControlledAutocompleteChip
              defaultValue={
                isEdit ? (data ? data?.tags.map((i) => i.tag) : []) : ""
              }
              control={control}
              name="tagimage"
              options={[]}
              setTags={setTags}
            />
          </div>
        </div>

        <div className="row d-flex justify-content-end">
          <div className="col-auto">
            <ActionWithPermission
              isValid={
                isEdit ? permissionsActions.edit : permissionsActions.create
              }
            >
              <form onSubmit={handleSubmit(() => onSubmit())}>
                <Button
                  className={classes.button}
                  color="white"
                  onClick={onSubmit}
                >
                  {t("Btn.save")}
                </Button>
              </form>
            </ActionWithPermission>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FormUploadImage;
