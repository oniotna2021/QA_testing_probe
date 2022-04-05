import React, { useState, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { connect } from "react-redux";

//UI
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import { useTheme } from "@material-ui/core/styles";
import { useStyles } from "utils/useStyles";

//icons
import CloseIcon from "@material-ui/icons/Close";

//components
import { ShardComponentModal } from "../Modal/Modal";
import ButtonSave from "../ButtonSave/ButtonSave";

//services
import { postFileAssignationUsersToTrainers } from "services/affiliates";

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

const FormAddFileUsersToTrainers = ({ venueIdDefaultProfile }) => {
  const [openModalInformative, setOpenModalInformative] = useState(false);
  const [files, setFiles] = useState([]);
  const classes = useStyles();

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

  const sendFile = () => {
    let dataSubmit = new FormData();
    dataSubmit.append("venue_id", venueIdDefaultProfile);
    dataSubmit.append("file", files[0]);

    postFileAssignationUsersToTrainers(dataSubmit).then(({ data }) => {
      console.log(data);
    });
  };

  return (
    <div>
      <Button
        component="a"
        href="/"
        onClick={() => setOpenModalInformative(true)}
        className={classes.boxButton}
        style={{ width: "100%", marginBottom: 10 }}
        download="https://app.docusign.com/static/Sample-Bulk-Recipient.csv"
      >
        <Typography variant="body2">Descargar plantilla</Typography>
      </Button>
      <div className="col-12 mb-3">
        <div {...getRootProps({ style })}>
          <input {...getInputProps()} />
          <p>Adjunta tus archivos aqui</p>
        </div>
      </div>
      <div className="col-12 d-flex flex-column justify-content-start align-items-start mb-3">
        {files.map((item, idx) => (
          <p key={`item-${idx}`}>
            {item.name}
            <IconButton
              onClick={() => {
                handleDeleteFile(item);
              }}
            >
              <CloseIcon />
            </IconButton>
          </p>
        ))}
      </div>
      <div className="d-flex justify-content-between">
        <ButtonSave text="Enviar" />
      </div>
      <ShardComponentModal
        handleClose={() => setOpenModalInformative(false)}
        isOpen={openModalInformative}
        fullWidth={true}
        title="Debes tener en cuenta.."
        width="sm"
        body={
          <div>
            <Typography variant="body2">
              El id del tipo de documento debe tener las siguientes reglas:
            </Typography>
            <ul>
              <li>La cedula de ciudadanía corresponde al id 10</li>
              <li>La cedula de extrangería corresponde al id 20</li>
              <li>El pasaporte corresponde al id 30</li>
              <li>La tarjeta de identidad corresponde al id 50</li>
            </ul>
          </div>
        }
      />
    </div>
  );
};

const mapStateToProps = ({ auth }) => ({
  venueIdDefaultProfile: auth.venueIdDefaultProfile,
});

export default connect(mapStateToProps)(FormAddFileUsersToTrainers);
