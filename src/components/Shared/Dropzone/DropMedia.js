import React, { useMemo } from "react";

// imports
import { useDropzone } from "react-dropzone";

// utils
import { ButtonBase, Typography } from "@material-ui/core";

// icons
import { IconPlusFiles } from "assets/icons/customize/config";

// styles dropzone

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

// styles preview
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
  position: "relative",
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

const DropMedia = ({
  files,
  setFiles,
  type,
  legend,
  isColaboratorSignature = false,
}) => {
  const baseStyle = !isColaboratorSignature
    ? {
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
      }
    : {
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
        width: "500px",
        height: "200px",
        marginTop: 20,
      };
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: `${type}/*`,
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles);
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

  return (
    <div className="d-flex justify-content-center align-items-center">
      <form>
        <div className="row mb-4">
          {files.length === 0 ? (
            <div className="col-12 mb-3">
              <div {...getRootProps({ style })}>
                <input {...getInputProps()} />
                <p style={{ textAlign: "center" }}>{legend}</p>
                <div>
                  <div className="d-flex justify-content-center">
                    <IconPlusFiles width={40} height={40} />
                  </div>
                  <p style={{ marginTop: "0px", color: "#787878" }}>
                    Aquí puede arrastrar y soltar archivos para añadirlos
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="col-12 d-flex flex-column justify-content-center align-items-center mb-3"
              style={thumbsContainer}
            >
              {files.map((file) => (
                <div className="mb-2" style={thumb}>
                  <div style={thumbInner}>
                    {type === "image" && (
                      <div
                        style={{
                          position: "absolute",
                          right: 20,
                          top: 10,
                          cursor: "pointer",
                        }}
                        onClick={() => setFiles([])}
                      >
                        <Typography variant="body 1">X</Typography>
                      </div>
                    )}

                    {type === "video" ? (
                      <>
                        <div style={{ textAlign: "center", padding: 20 }}>
                          {file.path}
                        </div>
                        <ButtonBase
                          className="p-4"
                          onClick={() => setFiles([])}
                        >
                          X
                        </ButtonBase>
                      </>
                    ) : (
                      <img
                        src={URL.createObjectURL(file)}
                        style={img}
                        alt="img-preview"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default DropMedia;
